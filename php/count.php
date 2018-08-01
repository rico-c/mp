<?php
		$servername = "localhost";
		$username = "root";
		$password = "cao3967370";
		$dbname = "guitartabs";
		$address=$_POST["address"];
		 
		$conn = new mysqli($servername, $username, $password, $dbname);
		mysqli_query($conn,'set names utf8');
		if ($conn->connect_error) {
		    die("Á¬½ÓÊ§°Ü: " . $conn->connect_error);
		} 
		
		$sql = "UPDATE tabs set searchnum=searchnum+1 where address = '$address'";
		$result = $conn->query($sql);
		if($result){
		       echo "added";
		    }
		$conn->close();
?>
