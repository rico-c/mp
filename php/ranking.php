<?php
		$servername = "localhost";
		$username = "root";
		$password = "cao3967370";
		$dbname = "guitartabs";
		 
		$conn = new mysqli($servername, $username, $password, $dbname);

		if ($conn->connect_error) {
		    die("Á¬½ÓÊ§°Ü: " . $conn->connect_error);
		} 
		
		$sql = "SELECT * from tabs ORDER BY searchnum DESC limit 0,100";
		mysqli_query($conn,'set names utf8');
		$result = $conn->query($sql);
		$num_results = $result->num_rows;
		
		if ($result->num_rows > 0) {
			    $backresults=array();
			    for($i=0;$i<$num_results;$i++){
			        $row = $result->fetch_assoc();
			        array_push($backresults,array("name"=>$row['name'],"singer"=>$row['singer'],"address"=>$row['address']));
			    };
			    header('Content-type: application/json;charset=utf-8');
			    echo(json_encode($backresults));
			}

		$conn->close();
?>
