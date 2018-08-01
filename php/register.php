<?php
	$username = $_POST["username"]; 
 	$password = $_POST["password"]; 
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
	$sql = "SELECT username FROM users where username = '$username'";
	$result = $conn->query($sql);
	// $num = mysqli_num_rows($result); 
	$num = $result->num_rows;

	if($num){ 
	 	echo "用户名已存在"; 
	 } 
	else //不存在当前注册用户名称 
	 { 
		 $sql_insert = "insert into users(username,password) values ('$username','$password')";
		 $res_insert = $conn->query($sql_insert);

		 if($res_insert) 
			 { 
			 echo "注册成功！"; 
			 } 
		 else 
			 { 
			 echo "系统繁忙，请稍候"; 
			 } 
	}
	$conn->close();
?>
