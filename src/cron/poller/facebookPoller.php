<?php

#$index = $_GET['index'];
#$host = $_GET['host'];
#$port = $_GET['port'];
#$mapping = $_GET['mapping'];
#$clientId = $_GET['twitterClientId'];
#$clientSecret = $_GET['twitterClientSecret'];
#$redirect = $_GET['twitterRedirect'];

require_once('../objects/activityObject.php');
require_once('../../vendor/autoload.php');

use \ElasticSearch\Client;

#SETTER
function writeObject($obj){
	$index = "app";
	$host = "localhost";
	$port = "9200";

	$es = Client::connection("http://$host:$port/$index/$index/");

	$grr = $es->index($obj, $obj['id']);
	print_r($grr);
}

function getObject($id){
	$index = "app";
	$host = "localhost";
	$port = "9200";	

	$es = Client::connection("http://$host:$port/$index/");
	$res = $es->get($id);
	return $res;
	#print_r($res);
	#echo (json_encode($res)); 
}

#NORMALIZERS
function normalizeNewsFeedObj($objArray){
	echo "There are " . count($objArray) . " objects in the timeline";  ?><br/><?php
	for($k = 0; $k < count($objArray); $k++){
		$obj = $objArray[$k];
		
		#print_r($obj); ?><br/><br/><?php
		
		$manager = new Manager();
		$builder = new facebookNewsFeedObjectBuilder();
		$manager->setBuilder($builder);
		
		$manager->parseActivityObj($obj);
		
		$item = $manager->getActivityObj();
		
		#print_r($item); ?><br/><br/><?php
		
		writeObject((array)$item);
	}
}

#POLLERS
function getUserNewsFeed(){
	//get the token from the file
	$filename = "../../oAuth/facebookToken.json";
	$file = file_get_contents($filename) or die("Cannot open the file: " . $filename);
	$obj = json_decode($file, true);
	
	$url = 'https://graph.facebook.com/me/home?&access_token=' . $obj['access_token'];
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$response = curl_exec($ch);
	curl_close($ch);
	
	#print_r($response);
	
	$var = json_decode($response, true);	
	
	#print_r($var); ?><br/><br/><?php
	
	#take off the data layer so that 90% of the obj is top level
	normalizeNewsFeedObj($var['data']);
}

getUserNewsFeed();

?>