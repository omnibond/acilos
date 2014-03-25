<?php

	$d = date('Y-m-d H:i:s', '1395782490');

	$date = new DateTime($d, new DateTimeZone(date_default_timezone_get()));
	$final = $date->format('Y-m-d H:i:s');

	echo $final;

?>