<?php
/* Please here modify account datas for mysql-database : */
/* best praactice is using of special user, who permissions are limited to reading */
$link = mysql_connect ('localhost','l2g	','qwertz');
/* here path where this script create sqlite-database and tree.js, must be vissible by
   webserver and writable by this script */
$basepath =  dirname(__FILE__) . '/';    //  or  absolute path
/*   and of configuration */



/* Start of code */
$TREENAME = $basepath . 'tree.json';

$DBNAME   = 'lecture2go.sql';

//header('Content-type: application/json');
if (!$link) {
    die('Verbindung nicht möglich : ' . mysql_error());
}
$tree = array('uhh'=>array(),'events'=>array(),'others'=>array());
$db_selected = mysql_select_db('lportal',$link);


$res = mysql_query('SELECT name,id FROM einrichtung WHERE level=1 AND typ="tree2"');
while ($row1 = mysql_fetch_object($res)) { 
	$name = $row1->name;
	$subs = array();
	$res2 = mysql_query('SELECT name,id FROM einrichtung WHERE level=2 AND typ="tree2" AND parentId = ' . $row1->id . " ORDER BY sort");
	while ($row2 = mysql_fetch_object($res2)) {
		array_push($subs,array($row2->id => utf8_encode($row2->name)));
	}
	array_push($tree['events'],array('name' => utf8_encode($name),'subs'=> $subs));
}

// Get all uni stuff:
$res1 = mysql_query('SELECT name,id FROM einrichtung WHERE level=1 AND name LIKE "F.%" AND typ="tree1"');
while ($row1 = mysql_fetch_object($res1)) {
	$subs = array();
	$res2 = mysql_query('SELECT name,id FROM einrichtung WHERE level=2 AND typ="tree1" AND parentId = ' . $row1->id);
	while ($row2 = mysql_fetch_object($res2)) {
		array_push($subs,array($row2->id => utf8_encode($row2->name)));
	}
	array_push($tree['uhh'],array('name' => $row1->name,'subs'=> $subs));
}
// GET OTHER:  
$res1 = mysql_query('SELECT name,id FROM einrichtung WHERE level=1 AND name NOT LIKE "F.%" AND typ="tree1"');
while ($row1 = mysql_fetch_object($res1)) {
	$subs = array();
	$res2 = mysql_query('SELECT name,id FROM einrichtung WHERE level=2 AND typ="tree1" AND parentId = ' . $row1->id);
	while ($row2 = mysql_fetch_object($res2)) {
		array_push($subs,array($row2->id => utf8_encode($row2->name)));
	}
	array_push($tree['others'],array('name' => utf8_encode($row1->name),'subs'=> $subs));
}

// Get all event stuff:
//echo json_encode($tree);
file_put_contents($TREENAME,json_encode($tree));


@unlink($DBNAME);

$db = new SQLite3($DBNAME);


// Channels:
$db->exec('CREATE TABLE IF NOT EXISTS channels (name TEXT, instructors TEXT,id NUMERIC,lang TEXT,nr TEXT);');
$res = mysql_query('SELECT c.id AS id,c.course_name AS name, c.course_number AS nr, c.instructors_string AS instructor,c.course_language  AS lang 
FROM coursedata AS c, video as v WHERE  c.id = v.veranstaltungid AND v.openAccess =1 GROUP BY c.id');
$db->exec('BEGIN TRANSACTION');
while ($row = mysql_fetch_object($res)) {
	$q = "\n".'INSERT INTO channels VALUES("'.utf8_encode($row->name).'","'.utf8_encode($row->instructor).'","'.$row->id.'","'.$row->lang.'","'.$row->nr.'");';
	$db->exec($q); 
}
$db->exec('COMMIT');

// Videos:
$db->exec('CREATE TABLE IF NOT EXISTS videos (id NUMERIC,author TEXT, publisher TEXT, title TEXT, channelid NUMERIC, filename TEXT, dimension TEXT, duration TEXT, filesize TEXT, cdate TEXT, openaccess NUMERIC, opendownload NUMERIC, metaid NUMERIC, hits NUMERIC,treeid NUMERIC);');
$res = mysql_query('SELECT video.*,metadata.creator AS author,metadata.publisher AS publisher FROM video,metadata WHERE video.metadataId = metadata.id');
$db->exec('BEGIN TRANSACTION');
while ($row = mysql_fetch_object($res)) {
	$q = 'INSERT INTO videos VALUES(
		"'.$row->id.'",
		"'.addslashes(utf8_encode($row->author)).'",
		"'.addslashes(utf8_encode($row->publisher)).'",
		"'.addslashes(utf8_encode($row->titel)).'",
		"'.$row->veranstaltungId.'",
		"'.$row->filename.'",
		"'.$row->aufloesung.'",
		"'.$row->dauer.'",
		"'.$row->dateigroesse.'",
		"'.$row->generationDate.'",
		"'.$row->openAccess.'",
		"'.$row->downloadLink.'",
		"'.$row->metadataId.'",
		"'.$row->hits . '",
		"'.$row->einrichtungId.'"
		);';
	$db->exec($q);  
	
	echo $q . '<br>';
}
$db->exec('COMMIT');


// channel <=> tree:
$db->exec('CREATE TABLE IF NOT EXISTS channel_tree (channelid NUMERIC, treeid NUMERIC);');
$res = mysql_query('SELECT * FROM  coursedata_einrichtung');
$db->exec('BEGIN TRANSACTION');
while ($row = mysql_fetch_object($res)) {
	$q = 'INSERT INTO channel_tree VALUES(
		"'.$row->coursedataId.'",
		"'.$row->einrichtungId.'"
		);';
	$db->exec($q); 
}
$db->exec('COMMIT');



$db->close();
mysql_close($link);
system('gzip -9 l2g.db');