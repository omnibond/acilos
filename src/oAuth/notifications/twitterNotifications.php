<?php

require_once('../twitteroauth/twitteroauth.php');

function objectToArray($d){
	if(is_object($d)){
		$d = get_object_vars($d);
	}
	if(is_array($d)){
		return array_map(__FUNCTION__, $d);
	}
	else{
		return $d;
	}
}

$filename = "../twitterClientInfo.txt";
$file = file_get_contents($filename) or die("Cannot open the file: " . $filename);
$obj = json_decode($file, true);

$connection = new TwitterOAuth($obj['appKey'], $obj['appSecret'], $obj['accessToken'], $obj['accessSecret']);
$connection->host = "https://userstream.twitter.com/1.1";

$method = "/rgillet311.json";
$var = $connection->get($method);

$array = objectToArray($var);

print_r($array);

?>