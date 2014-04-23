<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the poller for all public social media data
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

require_once('../objects/activityObject.php');
require_once('../objects/clientBaseObject.php');
require_once('../../oAuth/twitteroauth/twitteroauth.php');
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

function normalizeActivityObjects($objArray, $builder, $account){
	for($k = 0; $k < count($objArray); $k++){
		$obj = $objArray[$k];

		#print_r($obj);

		$manager = new Manager();
		$manager->setBuilder($builder);
		$manager->parseActivityObj($obj, $account);	
		$item = $manager->getActivityObj();
		
		//print_r($item);
		
		$this->writeObject((array)$item, $query);
	}
}

function writeObject($obj, $query){
	$index = "public";
	$host = "localhost";
	$port = "9200";

	$es = Client::connection("http://$host:$port/$index/$index/");

	$obj['id'] = strtolower($obj['id']);
	$exists = $this->getObject($obj['id']);
	if(isset($exists['starred'])){
		$obj['starred'] = $exists['starred'];
		$obj['isLiked'] = $exists['isLiked'];
		$obj['isCommented'] = $exists['isCommented'];
		$obj['isFavorited'] = $exists['isFavorited'];
	}
	$obj['serviceQuery'] = $query;

	$grr = $es->index($obj, $obj['id']);
	#print_r($grr);
}

function minePublicQueryTerms($service){
	$credObj = file_get_contents("../../serviceCreds.json");
	$credObj = json_decode($credObj, true);
	
	$queryTermObj = file_get_contents("../../publicQueryTermObj.json");
	$queryTermObj = json_decode($queryTermObj, true);
	
	foreach($queryTermObj as $key => $value){
		$services = $value['services'];
		$query = $value['terms'];
		$feeds = $value['feeds'];
		
		for($f = 0; $f < count($services); $f++){
			switch($services[$f]){
				case "Facebook":
					$accountNum = count($credObj['facebook'][0]['accounts']);
					$RNG = rand(0, $accountNum-1);
					
					$token = $credObj['facebook'][0]['accounts'][$RNG]['accessToken'];
					$account = $credObj['facebook'][0]['accounts'][$RNG];
					if(isset($responseObj['data'])){
						$builder = new facebookNewsFeedObjectBuilder();
						normalizeActivityObjects($responseObj['data'], $builder, $account);
					}
				break;
				case "Google":
					$accountNum = count($credObj['google'][0]['accounts']);
					$RNG = rand(0, $accountNum-1);
					
					$token = $credObj['google'][0]['accounts'][$RNG]['accessToken'];
					$account = $credObj['google'][0]['accounts'][$RNG];
					$responseObj = queryGoogle($query, $token);
					if(isset($responseObj['items'])){
						$builder = new googleObjectBuilder();
						normalizeActivityObjects($responseObj['items'], $builder, $account);
					}
				break;
				case "Twitter":
					$accountNum = count($credObj['twitter'][0]['accounts']);
					$RNG = rand(0, $accountNum-1);
					
					$token = $credObj['twitter'][0]['accounts'][$RNG];
					$account = $credObj['twitter'][0]['accounts'][$RNG];
					$responseObj = queryTwitter($query, $token);
					if(isset($responseObj['statuses'])){
						$builder = new twitterObjectBuilder();
						normalizeActivityObjects($responseObj['statuses'], $builder, $account);
					}
				break;
				case "Instagram":
					return json_encode(array("error" => "service has not been activated yet"));
				break;
				case "Linkedin":
					return json_encode(array("error" => "service has not been activated yet"));
				break;
				default:
					return json_encode(array("error" => "should not have gotten here"));
				break;
			}
		}
	}
}

function queryGoogle($queryStr, $accessToken){
	$query = $queryStr;
	$access_token = $accessToken;
	
	$url = 'https://www.googleapis.com/plus/v1/activities?maxResults=20&access_token='.$access_token.'&query='.$query;
	$ch = curl_init($url);

	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$res = curl_exec($ch);
	curl_close($ch);
	return $var = json_decode($res, true);
}

function queryTwitter($queryStr, $tokenObj){
	$query = $queryStr;

	$oauth_Token = $tokenObj['accessToken'];
	$consumer_key = $tokenObj['key'];
	$consumer_secret = $tokenObj['secret'];
	$access_secret = $tokenObj['accessSecret'];

	$connection = new TwitterOAuth($consumer_key, $consumer_secret, $oauth_Token, $access_secret);

	$status = $connection->get('search/tweets', array('q' => urlencode($query), 'count' => 20));
	return $status = objectToArray($status);
}

function queryFacebook($queryStr, $accessToken){
	$query = $queryStr;
	$access_token = $accessToken;
	$url = 'https://graph.facebook.com/search?limit=20&q=' . urlencode($query) . '&type=post&access_token=' . $access_token;

	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$response = curl_exec($ch);
	curl_close($ch);
	return $response = json_decode($response, true);
}

//600 = 10 mins
if(!file_exists("../../lockFiles/publicManager.lock") || (time() > filemtime("../../lockFiles/publicManager.lock") + 600)){
	touch("../../lockFiles/publicManager.lock");

	echo "mining public search term data"; ?><br/><?php
	minePublicQueryTerms();

	unlink("../../lockFiles/publicManager.lock");
}

















