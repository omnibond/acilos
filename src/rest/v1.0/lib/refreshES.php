<?php

use \ElasticSearch\Client;

function refreshES(){
	$index = "client";
	$host = "localhost";
	$port = "9200";

	$ci = curl_init("http://localhost:9200/_refresh");
	curl_setopt($ci, CURLOPT_RETURNTRANSFER, 1);
	$response = curl_exec($ci);
	curl_close($ci);
}

?>
