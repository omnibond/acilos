<?php

require_once('../objects/activityObject.php');
require_once('../objects/userBaseObject.php');
require_once('../../cron/objects/clientBaseObject.php');
require_once('../../vendor/autoload.php');

use \ElasticSearch\Client;

function writeObject($obj){
	#echo "write object"; 

	$index = "app";
	$host = "localhost";
	$port = "9200";

	$es = Client::connection("http://$host:$port/$index/$index/");

	$obj['id'] = strtolower($obj['id']);
	$exists = getObject($obj['id']);
	if(isset($exists['starred'])){
		$obj['starred'] = $exists['starred'];
		$obj['isLiked'] = $exists['isLiked'];
		$obj['isCommented'] = $exists['isCommented'];
		$obj['isFavorited'] = $exists['isFavorited'];
	}

	$grr = $es->index($obj, $obj['id']);
	#print_r($grr);
	
	updateRecentPost($obj);
}

function getObject($id){
	#echo "getting object"; 

	$index = "app";
	$host = "localhost";
	$port = "9200";

	$es = Client::connection("http://$host:$port/$index/$index");
	$res = $es->get($id);

	return $res;
}

function getGoogleFeed(){
	echo "get google stuff"; ?><br/><?php

	//get the token from the file
	$filename = "../../serviceCreds.json";
	$file = file_get_contents($filename);
	
	$tokenObject = json_decode($file, true);
	
	if(count($tokenObject['google']) > 0){
		if(isset($tokenObject['google'][0]['accounts'])){
			$accts = $tokenObject['google'][0]['accounts'];
		}else{
			$accts = array();
		}
	}
	
	for($h=0; $h < count($accts); $h++){
		$url = "https://www.googleapis.com/plus/v1/people/me/people/visible?access_token=".$accts[$h]['accessToken'];
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$res = curl_exec($ch);
		curl_close($ch);
		$var = json_decode($res, true);

		$idArr = array();
		if(isset($var['error'])){
			return;
		}else{
			$returnArr = array();
			for($x = 0; $x < count($var['items']); $x++){
				array_push($idArr, $var['items'][$x]['id']);
			}
		}
		
		$dataArr = array();
		for($t=0; $t < count($idArr); $t++){
			$url = "https://www.googleapis.com/plus/v1/people/".$idArr[17]."/activities/public?access_token=".$accts[$h]['accessToken'];
			$ch = curl_init($url);

			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			$res = curl_exec($ch);
			curl_close($ch);
			$var = json_decode($res, true);
			for($h=0; $h < count($var['items']); $h++){
				array_push($dataArr, $var['items'][$h]);
			}
		}
		#print_r($dataArr);
		normalizeGoogObject($var['items'], $accts[$h]);
	}
}

function normalizeGoogObject($objArray, $account){
	echo "normal goog";

	$mediaArray = array();
	for($k = 0; $k < count($objArray); $k++){
		$obj = $objArray[$k];

		#print_r($obj);

		$manager = new Manager();
		$builder = new googleObjectBuilder();
		$manager->setBuilder($builder);
		$manager->parseActivityObj($obj, $account);

		$item = $manager->getActivityObj();

		writeObject((array)$item);
	}
}
	
echo "google objs"; ?><br/><?php
getGoogleFeed();

?>