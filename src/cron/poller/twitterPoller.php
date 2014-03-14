<?php
#$clientId = $_GET['twitterClientId'];
#$clientSecret = $_GET['twitterClientSecret'];
#$redirect = $_GET['twitterRedirect'];

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the poller for twitter data
** This code is DEPRECATED in favor of cronManager
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