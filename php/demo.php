	<?php
		$servername = "localhost";
		$username = "root";
		$password = "cao3967370";
		$dbname = "guitartabs";
		$search=$_POST["search"];
		 
		// 创建连接
		$conn = new mysqli($servername, $username, $password, $dbname);
		// Check connection
		if ($conn->connect_error) {
		    die("连接失败: " . $conn->connect_error);
		} 
		mysqli_query($conn,'set names utf8');
		$sql = "SELECT * FROM tabs where name like '%$search%'";
		$result = $conn->query($sql);
		 
		if ($result->num_rows > 0) {
		    // 输出数据		    
		        $row = $result->fetch_assoc();
		        echo(json_encode($row['address']));
		} else {
		    echo "no_result";
		}
		$conn->close();
	?>
