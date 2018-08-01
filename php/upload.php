<?php
header("charset=utf-8");

$name = $_POST['name'];
$singer = $_POST['singer'];


$upload_path = "/var/www/html/uploads/";
$dest_file = $upload_path.basename($_FILES['file']['name']);

$songname = $_FILES['file']['name'];
$songaddress = "uploads/".$songname;

move_uploaded_file($_FILES['file']['tmp_name'],$dest_file);
//将乐谱信息插入数据库中
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

$sql = "SELECT name FROM tabs where name = '$name'";
$result = $conn->query($sql);
$num = $result->num_rows;

if($num){ 
 	echo "错误：该乐谱已存在"; 
 } 
else //不存在当前注册名称 
 { 
	 $sql_insert = "insert into tabs(name,singer,address) values ('$name','$singer','$songaddress')";
	 $res_insert = $conn->query($sql_insert);

	 if($res_insert) 
		 { 
		 echo "上传曲谱成功！"; 
		 } 
	 else 
		 { 
		 echo "错误：上传失败，请稍候再试"; 
		 } 
}
$conn->close();
?>