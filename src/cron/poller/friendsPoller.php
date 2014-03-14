<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the poller for friend data
** This code is DEPRECATED in favor of clientmanager
**
** $QT_BEGIN_LICENSE:LGPL$
**
** GNU Lesser General Public License Usage
** Alternatively, this file may be used under the terms of the GNU Lesser
** General Public License version 2.1 as published by the Free Software
** Foundation and appearing in the file LICENSE.LGPL included in the
** packaging of this file.  Please review the following information to
** ensure the GNU Lesser General Public License version 2.1 requirements
** will be met: http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html.
**
**
** If you have questions regarding the use of this file, please contact
** Omnibond Systems -  www.omnibond.com
**
** $QT_END_LICENSE$
*/

require_once('../../oAuth/twitteroauth/twitteroauth.php');
require_once('../../cron/objects/userBaseObject.php');

#$index = $_GET['index'];
#$host = $_GET['host'];
#$port = $_GET['port'];
#$mapping = $_GET['mapping'];

use \ElasticSearch\Client;
#this function will go get all dataObjects and take their main user comments (text and story) and chop them
#into individual words in an array also on the userObject, then graphs can be made using the wordfrequencies
function createTagCloudFor($user, $numWords){
	########GET THAT DATA
	$index = "app";
	$host = "localhost";
	$port = "9200";	

	$es = Client::connection("http://$host:$port/$index/");
	$search = array(
		"query" => array(
			'bool' => array(
				"should" => array(
					#array push each search term inside this array
				)
			)
		)
	);
	$term = array("term" => array("actor.searchable" => strtolower($user)));
	array_push($search['query']['bool']['should'], $term);
	
	$res = $es->search($search);
	$data = $res['hits']['hits'];
	
	$postArray = array();
	for($g = 0; $g < count($data); $g++){
		array_push($postArray, $data[$g]['_source']['content']['text']);
	}
	
	####### DELETE THAT TAGCLOUD
	$delCommand = "curl -X DELETE " . "http://$host:$port/tagcloud/";
	$output = shell_exec($delCommand);
	
	####### MAKE THAT TAGCLOUD
	$putCommand = "curl -X PUT 'http://localhost:9200/tagcloud' -d  '{
		'settings' : {
			'index' : {
				'number_of_shards' : 1,
				'number_of_replicas' : 0
			}
		}
	}'";
	$output = shell_exec($putCommand);
	
	########POPULATE THAT TAGCLOUD WITH THAT DATA
	$es = Client::connection("http://localhost:9200/tagcloud/document");
	
	for($h=0; $h < count($postArray); $h++){
		$index = array("body");
		$index['body'] = strtolower($postArray[$h]);
		$vars = $es->index($index);
	}
	
	$refreshCommand = "curl -X POST 'http://localhost:9200/tagcloud/_refresh'";
	$output = shell_exec($refreshCommand);
	
	####### QUERY THAT TAGCLOUD
	$es = Client::connection("http://localhost:9200/tagcloud/document");
	
	$search = array(
		"query" => array(
			'match_all' => array()
		),
		"facets" => array(
			"tagcloud" => array(
				"terms" => array(
					"field" => "body",
					"size" => 10
				)
			)
		)
	);
	
	$res = $es->search($search);
	
	$hitsArr = $res['hits']['hits'];
	$termsArr = $res['facets']['tagcloud']['terms'];
	$dataArr = array();
	for($f = 0; $f < count($termsArr); $f++){
		$dataArr[$termsArr[$f]['term']] = $termsArr[$f]['count'];
	}
	
	echo json_encode($dataArr);
	
}

function normalizeUserInfoObj($userObj, $service){	
	$manager = new userManager();
	if($service == "Facebook"){
		$builder = new facebookUserObjectBuilder();
	}elseif($service ==  "Twitter"){
		$builder = new twitterUserObjectBuilder();
	}elseif($service == "Instagram"){
		$builder = new instagramUserObjectBuilder();
	}elseif($service == "LinkedIn"){
		$builder = new linkedInUserObjectBuilder();
	}
	$manager->setBuilder($builder);
	
	$manager->parseActivityObj($userObj);
	$item = $manager->getUserObj();
	
	#print_r($item);	?><br/><br/><?php
	
	writeObjectToUser((array)$item);
}

/*
function writeObjectToUser($obj){
	$index = "socialreader";
	$host = "localhost";
	$port = "9200";
	$mapping = "people";
	
	#print_r($obj);
	
	$es = Client::connection("http://$host:$port/$index/$mapping/");
	$grr = $es->index($obj, $obj['id']);
	print_r($grr);
}
*/

function getFacebookFriendInfo(){
	$filename = "/var/www/socialreader/Trunk/src/oAuth/facebookToken.txt";
	$file = file_get_contents($filename) or die("Cannot open the file: " . $filename);
	$obj = json_decode($file, true);
	

	$url = 'https://graph.facebook.com/me/friends/?&access_token=' . $obj['access_token'] . '&limit=1000&fields=location,religion,political,gender,languages,username,email,first_name,last_name,middle_name,hometown,name,birthday&limit=1000';
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$response = curl_exec($ch);
	curl_close($ch);
	
	$var = json_decode($response, true);	

	if($var['error']){	
		print_r($var);
	}else{
		for($g = 0; $g < count($var['data']); $g++){
			normalizeUserInfoObj($var['data'][$g], "Facebook");
		}
	}
	
	#make sure that no error results get treated like people
	
}

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

function getTwitterFriendInfo(){
	$filename = "/var/www/socialreader/Trunk/src/oAuth/twitterClientInfo.txt";
	$file = file_get_contents($filename) or die("Cannot open the file: " . $filename);
	$obj = json_decode($file, true);
	
	$filename = "/var/www/socialreader/Trunk/src/php/layout.json";
	$file = file_get_contents($filename) or die("Cannot open the file: " . $filename);
	$friends = json_decode($file, true);
	
	$twitterName = '';
	for($k = 0; $k < count($friends['accountList']); $k++){
		$arr = explode(":", $friends['accountList'][$k]);
		if($arr[1] == "Twitter"){
			$twitterName = $arr[2];
		}
	}
	
	$connection = new TwitterOAuth($obj['appKey'], $obj['appSecret'], $obj['accessToken'], $obj['accessSecret']);
	$connection->host = "https://api.twitter.com/1.1";

	$method = "/friends/list";
	$var = $connection->get($method);
	
	$obj = objectToArray($var);
	if($obj['users']){
		for($g = 0; $g < count($obj['users']); $g++){
			normalizeUserInfoObj($obj['users'][$g], "Twitter");
		}
	}else{
		echo "errors";
	}

}

function getInstagramFriendInfo(){
	$filename = "/var/www/socialreader/Trunk/src/oAuth/instaToken.txt";
	$file = file_get_contents($filename) or die("Cannot open the file: " . $filename);
	$obj = json_decode($file, true);
	

	$url = 'https://api.instagram.com/v1/users/self/follows/?&access_token=' . $obj['access_token'];
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$response = curl_exec($ch);
	curl_close($ch);
	
	$var = json_decode($response, true);	
	
	if($var['meta']['code'] == 200){
		for($d = 0; $d < count($var['data']); $d++){
			normalizeUserInfoObj($var['data'][$d], "Instagram");
		}
	}else{
		echo "errors";
	}
}

function getLinkedInFriendInfo(){
	$filename = "/var/www/socialreader/Trunk/src/oAuth/linkedinUserCreds.txt";
	$file = file_get_contents($filename) or die("Cannot open the file: " . $filename);
	$obj = json_decode($file, true);
	

	 $params = array('oauth2_access_token' => $obj['access_token'],
                    'format' => 'json',
              );
     
	    // Need to use HTTPS
	    $url = 'https://api.linkedin.com/v1/people/~/connections?' . http_build_query($params);
	    // Tell streams to make a (GET, POST, PUT, or DELETE) request
	    $context = stream_context_create(
			    array('http' => 
				array('method' => 'GET',
				)
			    )
			);
	 
	 
	    // Hocus Pocus
	    $response = file_get_contents($url, false, $context);
	
	    // Native PHP object, please
	   $res = json_decode($response);
	$obj = objectToArray($res);
	if($obj['values']){
		for($d = 0; $d < count($obj['values']); $d++){
			normalizeUserInfoObj($obj['values'][$d], "LinkedIn");
		}
	}else{
		echo "errors";
	}
}

function queryAllUserInfo(){
	$es = Client::connection("http://localhost:9200/socialreader/people");
	
	$search = array(
		"size" => 1000,
		"query" => array(
			'match_all' => array()
		)
	);
	
	$res = $es->search($search);
	
	$hitsArr = $res['hits']['hits'];
		
	$returnArr = array();
	for($g = 0; $g < count($hitsArr); $g++){
		try{
			$name = strtoupper($hitsArr[$g]['_source']['user']['name']);
			$returnArr[$name] =  $hitsArr[$g]['_source'];
		}catch(Exception $err){
			continue;
		}	
	}	
		
	ksort($returnArr);
	print_r($returnArr);

}

function getMapping(){
	$es = Client::connection("http://localhost:9200/_mapping?pretty=true");
	
	$res = $es->get();
	
	print_r($res);

}

function linkedInFetch($method, $resource, $token) {

	#EXAMPLE CALL
	#$user = linkedInFetch('GET', '/v1/people/~/connections', $obj['access_token']);

    $params = array('oauth2_access_token' => $token,
                    'format' => 'json',
              );
     
    // Need to use HTTPS
    $url = 'https://api.linkedin.com' . $resource . '?' . http_build_query($params);
    // Tell streams to make a (GET, POST, PUT, or DELETE) request
    $context = stream_context_create(
                    array('http' => 
                        array('method' => $method,
                        )
                    )
                );
 
 
    // Hocus Pocus
    $response = file_get_contents($url, false, $context);
 
    // Native PHP object, please
    return json_decode($response);
}

getmapping();
#queryAllUserInfo();
#createTagCloudFor('purrfectStorm');
#getTop10();

//getFacebookFriendInfo();
//getTwitterFriendInfo();
//getInstagramFriendInfo();
//getLinkedInFriendInfo();

?>