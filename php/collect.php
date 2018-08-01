<?php
	$username = $_POST["username"]; 
 	$tabaddress = $_POST["tabaddress"]; 
 	$action = $_POST["action"]; 
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
	$sql_insert = "INSERT INTO collect (username,tabaddress) values ('$username','$tabaddress')";
	$sql_delete = "DELETE FROM collect WHERE username= '$username' AND tabaddress = '$tabaddress'";
	
	if($action==="true"){ 
		echo(json_encode($sql_insert));

		$res_insert = $conn->query($sql_insert);
		echo(json_encode($res_insert));
		if($res_insert){
			echo "收藏成功";
		}else{
			echo "收藏失败";
		}
	} else{ 
		$res_delete = $conn->query($sql_delete);
		if($res_delete){
			echo "取消收藏成功";
		}else{
			echo "取消收藏失败";
		}
	} 

	$conn->close();
   	
?>