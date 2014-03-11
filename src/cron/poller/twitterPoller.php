<?php
#$clientId = $_GET['twitterClientId'];
#$clientSecret = $_GET['twitterClientSecret'];
#$redirect = $_GET['twitterRedirect'];

require_once('../../oAuth/twitteroauth/twitteroauth.php');
require_once('../objects/activityObject.php');
require_once('../../vendor/autoload.php');

use \ElasticSearch\Client;

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

function normalizeObject($objArray){
	echo "There are " . count($objArray) . " objects in the timeline";  ?><br/><?php
	for($k = 0; $k < count($objArray); $k++){
		$obj = $objArray[$k];
		#print_r($obj); ?><br/><br/><?php
		$manager = new Manager();
		$builder = new twitterObjectBuilder();
		$manager->setBuilder($builder);
		$manager->parseActivityObj($obj);
		
		$item = $manager->getActivityObj();
		#print_r($item); ?><br/><br/><?php
		writeObject((array)$item);
	}
}

function getUserTimeline(){
	//get the token from the file
	$filename = "../../oAuth/twitterToken.json";
	$file = file_get_contents($filename) or die("Cannot open the file: " . $filename);
	$obj = json_decode($file, true);
	/* Create TwitteroAuth object with app key/secret and token key/secret from default phase */
	$connection = new TwitterOAuth($obj['appKey'], $obj['appSecret'], $obj['accessToken'], $obj['accessSecret']);
	$connection->host = "https://api.twitter.com/1.1";
	
	$method = "/statuses/home_timeline";
	$var = $connection->get($method, array("count" => 70));	
	$array = objectToArray($var);
	
	if($array['errors']){
		print_r($array['errors'][0]['message']);
		print_r($array['errors'][0]['code']);
		//refresh token or call get new token again
		file_get_contents("../../oAuth/twitterAccess.php?appKey=" + $obj['appKey'] + "&appSecret=" + $obj['appSecret']);
	}else{
		normalizeObject($array);	    
	}
}

getUserTimeline();

#getObject("12706598");


?>