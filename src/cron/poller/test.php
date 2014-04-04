<?php

	$var = exec("wget -q -O - http://169.254.169.254/latest/meta-data/instance-id");
	$durr = exec("whoami");
	
	echo $durr;
	echo $var;
?>