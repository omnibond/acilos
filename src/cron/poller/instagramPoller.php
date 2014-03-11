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
	$exists = getObject($obj['id']);

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

function getMediaLocData($id, $token){	
	$url = "https://api.instagram.com/v1/media/". $id ."?access_token=".$token['access_token'];
	
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$res = curl_exec($ch);
	curl_close($ch);
	
	$var = json_decode($res, true);
	return $var['data']['location']; 	
}

function normalizeObject($objArray){
	echo "There are " . count($objArray) . " objects in the timeline";  ?><br/><?php
	
	$filename = "../../oAuth/instagramToken.json";
	$file = file_get_contents($filename) or die("Cannot open the file: " . $filename);
	$token = json_decode($file, true);
	
	$mediaArray = array();
	for($k = 0; $k < count($objArray); $k++){
		$obj = $objArray[$k];
	
		print_r($obj);?><br/><br/><?php
	
		$manager = new Manager();
		$builder = new instagramObjectBuilder();
		$manager->setBuilder($builder);
		$manager->parseActivityObj($obj);
		
		$item = $manager->getActivityObj();
		
		#$loc = getMediaLocData($item->id, $token);
		#if($loc['latitude'] == "" || $loc['longitude'] == ""){
		#}else{
		#	$item->content->geoLocation = $loc['latitude'] . "#" . $loc['longitude'];
		#}
		
		#print_r($item); ?><br/><br/><?php
		
		writeObject((array)$item);
	}
}

function getPopularMedia(){
	//get the token from the file
	$filename = "../../oAuth/instagramToken.json";
	$file = file_get_contents($filename) or die("Cannot open the file: " . $filename);
	$obj = json_decode($file, true);
	
	$url = "https://api.instagram.com/v1/media/popular?access_token=".$obj['access_token'];
	
	$ch = curl_init($url);
	
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$res = curl_exec($ch);
	curl_close($ch);

	$var = json_decode($res, true);
	
	normalizeObject($var['data']);
}

function getUserFeed(){
	//get the token from the file
	$filename = "../../oAuth/instagramToken.json";
	$file = file_get_contents($filename) or die("Cannot open the file: " . $filename);
	$obj = json_decode($file, true);
	
	$url = "https://api.instagram.com/v1/users/self/feed?access_token=".$obj['access_token'];
	
	$ch = curl_init($url);
	
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$res = curl_exec($ch);
	curl_close($ch);

	$var = json_decode($res, true);
	
	normalizeObject($var['data']);
}

function getGeoLocation($loc){
	if($loc == ""){
		return $loc;
	}else{
		$cityclean = str_replace(" ", "+", $loc);
		echo $cityclean;
		$url = "https://maps.googleapis.com/maps/api/geocode/json?address=" . $cityclean . "&sensor=false";
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$response = curl_exec($ch);
		curl_close($ch);
		
		$var = json_decode($response, true);
		
		$latLong = "";
		if($var['status'] == "ZERO_RESULTS"){
			$latLong = "";
		}else{
			$latLong = $var['results'][0]['geometry']['location']['lat'] . "#" . $var['results'][0]['geometry']['location']['lng'];
		}
		return $latLong;
	}
}

#instagram will query the foursquare API and return an ID for the location chosen
#then maybe use that ID to get recent media in a location
function getPlacesAround($place, $radius){
	$filename = "../../oAuth/instagramToken.json";
	$file = file_get_contents($filename) or die("Cannot open the file: " . $filename);
	$obj = json_decode($file, true);
	
	$latlng = getGeoLocation($place);
	$arr = explode("#", $latlng);
	$params = "&lat=" . $arr[0] . "&lng=" . $arr[1] . "&distance=" .$radius;
	
	$url = "https://api.instagram.com/v1/locations/search?access_token=" . $obj['access_token'] . $params;
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$response = curl_exec($ch);
	curl_close($ch);
	
	$var = json_decode($response, true);
	
	$returnObj = array();
	$var = json_decode($response, true);
	for($h = 0; $h < count($var['data']); $h++){
		$object['latlng'] = $var['data'][$h]['latitude'] . "#" . $var['data'][$h]['longitude'];
		$object['name'] = $var['data'][$h]['name'];
		$object['id'] = $var['data'][$h]['id'];
		
		array_push($returnObj, $object);
	}
	
	#print_r($returnObj);
}

function getMediaFromLoc($place, $radius){
	$filename = "../../oAuth/instagramToken.json";
	$file = file_get_contents($filename) or die("Cannot open the file: " . $filename);
	$obj = json_decode($file, true);
	
	$latlng = getGeoLocation($place);
	$arr = explode("#", $latlng);
	$params = "&lat=" . $arr[0] . "&lng=" . $arr[1] . "&distance=" .$radius;
	
	$url = "https://api.instagram.com/v1/media/search?access_token=" . $obj['access_token'] . $params;
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$response = curl_exec($ch);
	curl_close($ch);

	$var = json_decode($response, true);
	
	$returnObj = array();
	for($h = 0; $h < count($var['data']); $h++){
		$object['latlng'] = $var['data'][$h]['location']['latitude'] . "#" . $var['data'][$h]['location']['longitude'];
		$object['user']['username'] = $var['data'][$h]['user']['username'];
		$object['user']['full_name'] = $var['data'][$h]['user']['full_name'];
		$object['user']['id'] = $var['data'][$h]['user']['id'];
		$object['content']['link'] =  $var['data'][$h]['link'];
		$object['content']['lowres'] =  $var['data'][$h]['images']['low_resolution']['url'];
		$object['content']['thumb'] =  $var['data'][$h]['images']['thumbnail']['url'];
		$object['content']['highres'] =  $var['data'][$h]['images']['standard_resolution']['url'];
		$object['content']['id'] =  $var['data'][$h]['id'];
		
		array_push($returnObj, $object);
	}

	#print_r($returnObj);
}

#getPlacesAround("central, sc", 5000);
#getMediaFromLoc("clemson, sc", 5000);

#getPopularMedia();
getUserFeed();





?>