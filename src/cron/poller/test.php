<?php

	$cTime = date('Y-m-d H:i:s', "1395770400");
	echo $cTime;

	$timeArr1 = explode(" ", $cTime);
		$timeArr2 = explode("-", $timeArr1[0]);

		$month = $timeArr2[1];
		$day = $timeArr2[2];
		$year = $timeArr2[0];
		$preTime = $timeArr1[1];

		echo $month . " ";
		echo $day . " ";
		echo $year . " ";
		echo $preTime . " ";
?>