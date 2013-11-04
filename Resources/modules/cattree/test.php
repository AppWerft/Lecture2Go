<?php
session_start();

echo ' <link href="css/layout.css" rel="stylesheet">';
echo '<style type="text/css">

table.sample {
	border-width: 1px;
	border-spacing: 2px;
	border-style: none;
	border-color: gray;
	border-collapse: separate;
	background-color: white;
        vertical-align:top;
        margin-top:50px; 
        margin-left:auto; 
        margin-right:auto;
        margin-bottom:50px; 
}
table.sample th {
	border-width: 1px;
	padding: 4px;
	border-style: outset;
	border-color: white;
	background-color: rgb(250, 250, 250);
	-moz-border-radius: ;
}
table.sample td {
	border-width: 1px;
	padding: 4px;
	border-style: outset;
	border-color: white;
	background-color: rgb(250, 250, 250);
	-moz-border-radius: ;
        text-align:center; 
    vertical-align:middle;
}
</style>';
$db_host = "localhost";
$db_username = "videoadmin";
$db_pass = "qwertz";
$db_name = "videoadmin";

$accounts = mysql_connect ("$db_host","$db_username","$db_pass") or die ("Could Not Connect to MySQL");
mysql_select_db($db_name,$accounts);

$sql = "SELECT * FROM lectureid ";
$output = mysql_query($sql,$accounts);

$imSrcExp = 'images/export.png'; 
$imSrcUl = 'images/upload.png'; 
$imSrcBu = 'images/backup.png'; 
$imSrcRpr = 'images/repair.png';
$imSrcRec = 'images/recorded.png';
$imSrcnRec = 'images/notRecorded.png';
$imSrctRec = 'images/toRecord.png';

echo "<table class=sample>
<tr>
<th>Lecture Code</th>
<th>Lecture Name</th>
<th>Lecture Date</th>
<th>Lecture Number</th>
<th>Hard Disk</th>
<th>Task</th>
</tr>";
while($row = mysql_fetch_array($output)){
    
     $lecture_id= $row['lecture_id'];
   $lecture_name = $row['lecture_name'];  
   $lecture_code = $row['lecture_code'];
   $semester = $row['semester'];
    $lecture_code1 = str_replace('.', '', $lecture_code);
    $tablename = "lecture" . $lecture_code1;
    
    $eachTable = "SELECT * FROM $tablename ";
$output1 = mysql_query($eachTable,$accounts);

while($row = mysql_fetch_array($output1)){
     
   $lecture_number = $row['lecture_number'];
   $lecture_date = $row['lecture_date'];
   $lecture_status = $row['lecture_status'];
  
   
   $lecture_hardDisk = $row['lecture_hardDisk'];
   $professor_name = $row['professor_name'];
   $comment_flag = $row['comment_status'];
   
   
   if($lecture_status=="1"){
    echo "<tr>";
     echo "<td>" .$lecture_code . " </td>". " <td>" . $lecture_name . " </td>". " <td>" . $lecture_date . " </td>"." <td>" . $lecture_number . " </td>"." <td>" . $lecture_hardDisk . " </td>";
     echo "<td>".'<img style="border:none;;height:40px;" src="'. $imSrcExp .'" />'." </td>";
     echo "</tr>";
   }
   
    elseif($lecture_status=="2"){
    echo "<tr>";
     echo "<td>" .$lecture_code . " </td>". " <td>" . $lecture_name . " </td>". " <td>" . $lecture_date . " </td>"." <td>" . $lecture_number . " </td>"." <td>" . $lecture_hardDisk . " </td>";
     echo "<td>".'<img style="border:none;;height:40px;" src="'. $imSrcUl .'" />'." </td>";
     echo "</tr>";
   }
   
    elseif($lecture_status=="3"){
    echo "<tr>";
     echo "<td>" .$lecture_code . " </td>". " <td>" . $lecture_name . " </td>". " <td>" . $lecture_date . " </td>"." <td>" . $lecture_number . " </td>"." <td>" . $lecture_hardDisk . " </td>";
     echo "<td>".'<img style="border:none;;height:40px;" src="'. $imSrcBu .'" />'." </td>";
     echo "</tr>";
   }
    elseif($lecture_status=="5"){
    echo "<tr>";
     echo "<td>" .$lecture_code . " </td>". " <td>" . $lecture_name . " </td>". " <td>" . $lecture_date . " </td>"." <td>" . $lecture_number . " </td>"." <td>" . $lecture_hardDisk . " </td>";
     echo "<td>".'<img style="border:none;;height:40px;" src="'. $imSrcRpr .'" />'." </td>";
     echo "</tr>";
   }
   
}
}
echo "</table>";



?>