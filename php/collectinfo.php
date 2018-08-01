<?php
	$username = $_POST["username"]; 
 	$servername = "localhost";
	$sqlusername = "root";
	$sqlpassword = "cao3967370";
	$dbname = "guitartabs";
	 
	// 创建连接
	$conn = new mysqli($servername, $sqlusername, $sqlpassword, $dbname);

	if ($conn->connect_error) {
	    die("连接失败: " . $conn->connect_error);
	} 
	mysqli_query($conn,'set names utf8');
	$sql = "SELECT tabs.address,tabs.name,tabs.singer FROM collect,tabs where collect.username = '$username' AND collect.tabaddress = tabs.address";

	$result = $conn->query($sql);
	$num_results = $result->num_rows;

	if ($result->num_rows > 0) {

	    $backresults=array();
	    for($i=0;$i<$num_results;$i++){
	        $row = $result->fetch_assoc();
	        array_push($backresults,array("name"=>$row['name'],"singer"=>$row['singer'],"address"=>$row['address']));
	    };
	    header('Content-type: application/json');
	    echo(json_encode($backresults));
	}
	$conn->close();
?>