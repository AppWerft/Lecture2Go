<?php

// old link:
//$db = file_get_contents('http://lecture2go2.rrz.uni-hamburg.de:81/appdb/lecture2go.sql');

error_reporting(E_ALL);
/* Please here modify account datas for mysql-database : */
$options = json_decode(file_get_contents( dirname(__FILE__) . '/../config.json'));
if (!$options) {
	echo 'Config is missing or JSON invalide!';
	exit();
}
   
$BASEPATH =  $options->cachepath;   
$DBNAME   =  $BASEPATH .'/lecture2go.db';
error_log($DBNAME);
$DBURL    =  $options->cacheurl . '/lecture2go.db'; // or something else


/*   and of configuration */


/* Start of code, do not edit */
$time_start = microtime(true);
$link = mysql_connect($options->database->host,$options->database->user,$options->database->password);

if (!$link) {
    die('Verbindung nicht moeglich : ' . mysql_error());
}

$departments =0;
$tree = array('uhh'=>array(),'events'=>array(),'others'=>array());
$db_selected = mysql_select_db($options->database->dbname,$link);
mysql_query("SET NAMES 'utf8'");

$res = mysql_query('SELECT name,id FROM facility WHERE level=1 AND typ="tree2"');
while ($row1 = mysql_fetch_object($res)) { 
	$departments++;
	$name = $row1->name;
	$subs = array();
	$res2 = mysql_query('SELECT name,id FROM facility WHERE level=2 AND typ="tree2" AND parentId = ' . $row1->id . " ORDER BY sort");
	while ($row2 = mysql_fetch_object($res2)) {
		array_push($subs,array($row2->id => $row2->name));
	}
	array_push($tree['events'],array('name' => $name,'subs'=> $subs));
}

// Get all uni stuff:
$res1 = mysql_query('SELECT name,id FROM facility WHERE level=1 AND name LIKE "F.%" AND typ="tree1"');
while ($row1 = mysql_fetch_object($res1)) {
	$departments++;
	$subs = array();
	$res2 = mysql_query('SELECT name,id FROM facility WHERE level=2 AND typ="tree1" AND parentId = ' . $row1->id);
	while ($row2 = mysql_fetch_object($res2)) {
		array_push($subs,array($row2->id => $row2->name));
	}
	array_push($tree['uhh'],array('name' => $row1->name,'subs'=> $subs));
}
// GET OTHER:  
$res1 = mysql_query('SELECT name,id FROM facility WHERE level=1 AND name NOT LIKE "F.%" AND typ="tree1"');
while ($row1 = mysql_fetch_object($res1)) {
	$departments++;
	$subs = array();
	$res2 = mysql_query('SELECT name,id FROM facility WHERE level=2 AND typ="tree1" AND parentId = ' . $row1->id);
	while ($row2 = mysql_fetch_object($res2)) {
		array_push($subs,array($row2->id => $row2->name));
	}
	array_push($tree['others'],array('name' => $row1->name,'subs'=> $subs));
}

// Get all event stuff:


@unlink($DBNAME);
$db = new SQLite3($DBNAME);

// LectureSeries:
$db->exec('CREATE TABLE IF NOT EXISTS lectureseries (id NUMERIC, name TEXT, instructors TEXT, lang TEXT, nr TEXT);');
$res = mysql_query('SELECT lectureseries.id id, lectureseries.name name, lectureseries.number nr, lectureseries.instructorsString instructor, lectureseries.language lang 
FROM lectureseries, video WHERE lectureseries.id = video.lectureseriesId GROUP BY lectureseries.id');
$lectureseries_total = mysql_num_rows($res);
$db->exec('BEGIN TRANSACTION');
while ($row = mysql_fetch_object($res)) {
	$q = "INSERT INTO lectureseries VALUES ('".
		$row->id."','".
		$db->escapeString($row->name)."','".
		$db->escapeString($row->instructor)."','".
		$row->lang."','".
		$row->nr."');";
	if (!$db->exec($q)) error_log('SQLITE-Error: '.$q); 
}
$db->exec('COMMIT');

///////////////////////////////////////////////////////
// Videos:
///////////////////////////////////////////////////////
$db->exec('CREATE TABLE IF NOT EXISTS videos (
	id NUMERIC,
	author TEXT, 
	publisher TEXT, 
	title TEXT, 
	lectureseriesId NUMERIC, 
	filename TEXT, 
	resolution TEXT, 
	duration TEXT, 
	generationDate TEXT, 
	downloadLink NUMERIC, 
	hits NUMERIC, 
	pathpart TEXT,
	description TEXT);');

$res = mysql_query('SELECT video.id,video.title,video.lectureseriesId,video.filename,video.resolution,video.duration,video.generationDate,video.downloadLink,video.hits,metadata.creator AS author,metadata.publisher AS publisher, CONCAT(video.facilityId,"l2g",producer.idNum) pathpart, metadata.description AS description 
	FROM 
	video,metadata,producer 
	WHERE 
		video.openAccess = 1 AND
		video.producerid= producer.id AND 
		video.metadataid=metadata.id');

$fields = 'id,author,publisher,title,lectureseriesId,filename,resolution,duration,generationDate,downloadLink,hits,pathpart,description';

$insert_statement = $db->prepare($prepstring = "INSERT INTO videos (" . $fields . ") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)");

$row = array();

$db->exec('BEGIN TRANSACTION');
while ($row = mysql_fetch_assoc($res)) {
	$ndx = 1;
	foreach (explode(',',$fields) AS $field) {
		$insert_statement->bindValue($ndx++, $row[$field]);
	}
	$insert_statement->execute();
}
$db->exec('COMMIT');

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// channel <=> tree:
$db->exec('CREATE TABLE IF NOT EXISTS lectureseries_tree (lectureseriesId NUMERIC, treeid NUMERIC);');
$res = mysql_query('SELECT * FROM  lectureseries_facility');
$db->exec('BEGIN TRANSACTION');
while ($row = mysql_fetch_object($res)) {
	$q = 'INSERT INTO lectureseries_tree VALUES(
		"'.$row->lectureseriesId.'",
		"'.$row->facilityId.'"
		);';
	$db->exec($q); 
}
$db->exec('COMMIT');


$db->exec('CREATE TABLE IF NOT EXISTS tree (json TEXT);');
$stmt = $db->prepare("INSERT INTO tree (json) VALUES (:json)");
$stmt->bindValue(':json',json_encode($tree));
$stmt->execute();

$db->close();
//
	
$res = mysql_query('SELECT MAX(uploadDate) AS mtime, COUNT(*) as total FROM video WHERE openAccess=1');
$row = mysql_fetch_object($res); 
$lastmodified = $row->mtime;
$videos_total = $row->total;




mysql_close($link);
file_put_contents($DBNAME . '.gz',gzencode(file_get_contents($DBNAME)));

$time_end = microtime(true);
$time = $time_end - $time_start;
header('Content-type: application/json');
echo '{
 "success" : true,
 "runtime" : "'. round($time*1000) . '",
 "md5" : "'. md5_file($DBNAME).'",
 "mtime" : "'.$lastmodified.'",
 "videos_total" : "'.$videos_total.'",
 "lectureseries_total" : "'.$lectureseries_total.'",
 "departments_total" : "'.$departments .'",
 "sqlite" : {"url":"'. $DBURL .'","filesize":'.filesize($DBNAME).',"ctime":'.filemtime($DBNAME).'},
 "sqlite_compressed": {"url":"'. $DBURL .'.gz","filesize":'.filesize($DBNAME. '.gz').',"ctime":'.filemtime($DBNAME. '.gz').'}}';	
