<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the poller for friend data
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

require_once('../../cron/objects/clientBaseObject.php');
require_once('../../oAuth/twitteroauth/twitteroauth.php');
require_once('../../vendor/autoload.php');

//the Logger
require_once('../logs/KLogger.php');

use \ElasticSearch\Client;

function writeClient($obj){
	echo "writeClient";
	//global //$log;
	//global //$logPrefix;
	$index = "client";
	$host = "localhost";
	$port = "9200";

	$es = Client::connection("http://$host:$port/$index/$index/");
	$grr = $es->index($obj, $obj['data']['id']);
}

function linkedInFetch($method, $resource, $token) {
	echo "linkedInFetch"; ?><br/><?php
	//global //$log;
	//global //$logPrefix;
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

function objectToArray($d){
	echo "objectToArray";
	//global //$log;
	//global //$logPrefix;
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

function getGeoLocation($loc){
	$key = "Fmjtd%7Cluub2g07nu%2Cb0%3Do5-9ub2gr";
	if($loc == ""){
		return $loc;
	}else{
		$cityclean = str_replace(" ", ",", $loc);
		#$url = "https://maps.googleapis.com/maps/api/geocode/json?address=" . $cityclean . "&sensor=false";
		$url = "http://www.mapquestapi.com/geocoding/v1/address?key=" . $key . "&callback=&inFormat=kvp&outFormat=json&location=".$cityclean;
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$response = curl_exec($ch);
		curl_close($ch);

		$var = json_decode($response, true);

		$latLong = "";
		if($var['info']['statuscode'] != 0){
			$latLong = "";
		}else{
			$latLong = $var['results'][0]['locations'][0]['latLng']['lat'] . "#" . $var['results'][0]['locations'][0]['latLng']['lng'] ;
		}
		return $latLong;
	}
}

function getClients(){
	echo "getClients"; ?><br/><?php
	//global //$log;
	//global //$logPrefix;
	$index = "client";
	$host = "localhost";
	$port = "9200";

	$es = Client::connection("http://$host:$port/$index/");
	$res = $es->search(array(
		'size' => 1000,
		'query' => array(
			'match_all' => array()
		)
	));

	return $res;
}


function getClient($id){
	echo "getClient";
	//global //$log;
	//global //$logPrefix;
	$index = "client";
	$host = "localhost";
	$port = "9200";

	$es = Client::connection("http://$host:$port/$index/");
	$res = $es->get($id);
	return $res;
}

function getFriendsList($service){
	echo "getFriendsList"; ?><br/><?php
	//global //$log;
	//global //$logPrefix;
	$returnArr = array();
	switch ($service){
		case "Facebook":
			echo "case \"Facebook\""; ?><br/><?php
			$filename = "../../serviceCreds.json";
			if(($file = file_get_contents($filename)) == false){
				echo ("Cannot open the file: " . $filename);
			}else{
				$tokenObject = json_decode($file, true);
				
				if(count($tokenObject['facebook']) > 0){
					if(isset($tokenObject['facebook'][0]['accounts'])){
						$accts = $tokenObject['facebook'][0]['accounts'];
					}else{
						$accts = array();
					}
				}
	
				for($h=0; $h < count($accts); $h++){
					$url = 'https://graph.facebook.com/me/friends?fields=id,name,location,hometown&access_token=' . $accts[$h]['accessToken'];
					$ch = curl_init($url);
					curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
					$response = curl_exec($ch);
					curl_close($ch);

					$var = json_decode($response, true);	

					if($var['error']){
						$returnArr = array("false" => $var['error']['message']);
					}else{
						$returnArr = array();
						for($x = 0; $x < count($var['data']); $x++){
							if($var['data'][$x]['location']['name'] != '' && $var['data'][$x]['location']['name']){
								$geoCurrent = getGeoLocation($var['data'][$x]['location']['name']);
							}
							if($var['data'][$x]['hometown']['name'] != '' && $var['data'][$x]['hometown']['name']){
								$geoHomeTown = getGeoLocation($var['data'][$x]['hometown']['name']);
							}
							$user = array(
								'id' => $var['data'][$x]['id'],
								'givenName' => $var['data'][$x]['name'],
								'displayName' => $var['data'][$x]['name'],
								'homeTown' => $geoHomeTown,
								'currentTown' => $geoCurrent,
								'service' => 'Facebook',
								'about' => array(
									'description' => "",
									'link' => "https://facebook.com/".$var['data'][$x]['id']
								)
							);
							array_push($returnArr, $user);
						}
					}
				}
			}
		break;
		case "Twitter":
			echo "case \"Twitter\""; ?><br/><?php
			$filename = "../../serviceCreds.json";
			if(($file = file_get_contents($filename)) == false){
				echo "Cannot open file $filename";
			}else{
				$tokenObject = json_decode($file, true);
				
				if(count($tokenObject['twitter']) > 0){
					if(isset($tokenObject['twitter'][0]['accounts'])){
						$accts = $tokenObject['twitter'][0]['accounts'];
					}else{
						$accts = array();
					}
				}
	
				for($h=0; $h < count($accts); $h++){
					/* Create TwitteroAuth object with app key/secret and token key/secret from default phase */
					$connection = new TwitterOAuth($accts[$h]['appKey'], $accts[$h]['appSecret'], $accts[$h]['accessToken'], $accts[$h]['accessSecret']);
					$cursor = -1;
					$returnArr = array();
					do{
						$method = "/friends/list";
						$connection->host = "https://api.twitter.com/1.1";
						$param = array('cursor' => $cursor);
						$var = $connection->get($method, $param);

						if(isset($var->errors)){
							$returnArr = array("false" => $var->errors[0]->message);
						}else{				
							$data = objectToArray($var->users);

							for($x = 0; $x < count($data); $x++){
								if($data[$x]['url'] == "" && $data[$x]['url'] == null){
									$link = "https://www.twitter.com/" . $data[$x]['screen_name'];
								}else{
									$link = $data[$x]['url'];
								}
								if($data[$x]['location'] != '' && $data[$x]['location'] != null){
									$geo = getGeoLocation($data[$x]['location']);
								}
								$user = array(
									'id' => $data[$x]['id'],
									'givenName' => $data[$x]['name'],
									'displayName' => $data[$x]['screen_name'],
									'currentTown' => $geo,
									'service' => 'Twitter',
									'about' => array(
										'description' => $data[$x]['description'],
										'link' => $link
									)
								);
								array_push($returnArr, $user);
							}
						}
						$cursor =  $var->next_cursor;
					}
					while($cursor != 0);
				}
			}
		break;
		case "Instagram":
		echo "case \"Instagram\""; ?><br/><?php
			$filename = "../../serviceCreds.json";
			if(($file = file_get_contents($filename)) == false){
				echo(json_encode($returnArr['Instagram'] = array("false" =>"Cannot open the file")));
			}else{
				$tokenObject = json_decode($file, true);
				
				if(count($tokenObject['instagram']) > 0){
					if(isset($tokenObject['instagram'][0]['accounts'])){
						$accts = $tokenObject['instagram'][0]['accounts'];
					}else{
						$accts = array();
					}
				}
	
				for($h=0; $h < count($accts); $h++){
					$url = "https://api.instagram.com/v1/users/".$accts[$h]['user_id']."/follows?access_token=".$accts[$h]['accessToken'];

					$ch = curl_init($url);

					curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
					$res = curl_exec($ch);
					curl_close($ch);

					$var = json_decode($res, true);
					if($var['meta']['code'] != 200){
						$returnArr = array("false" => array());
					}else if(isset($var['data'])){
						$returnArr = array();
						for($x = 0; $x < count($var['data']); $x++){
							if($var['data'][$x]['website'] == "" && $var['data'][$x]['website'] == null){
								$link = "http://www.instagram.com/" . $var['data'][$x]['username'];
							}else{
								$link = $var['data'][$x]['website'];
							}
							$user = array(
								'id' => $var['data'][$x]['id'],
								'givenName' => $var['data'][$x]['full_name'],
								'displayName' => $var['data'][$x]['username'],
								'service' => 'Instagram',
								'about' => array(
									'description' => $var['data'][$x]['bio'],
									'link' => $link
								)
							);
							array_push($returnArr, $user);
						}
					}else{
						$returnArr = array("false" => array());
					}
				}
			}
		break;
		case "Linkedin":
		echo "case \"Linkedin\""; ?><br/><?php
			$filename = "../../serviceCreds.json";
			if(($file = file_get_contents($filename)) == false){
				echo("Cannot open the file: " . $filename);
			}else{
				$tokenObject = json_decode($file, true);
				$linkedinTokens = $tokenObject['linkedin'];
				
				if(count($tokenObject['linkedin']) > 0){
					if(isset($tokenObject['linkedin'][0]['accounts'])){
						$accts = $tokenObject['linkedin'][0]['accounts'];
					}else{
						$accts = array();
					}
				}
	
				for($h=0; $h < count($accts); $h++){
					$user = linkedInFetch('GET', '/v1/people/~/connections', $accts[$h]['accessToken'], true);

					$user = objectToArray($user);

					if(isset($user['error'])){
						$returnArr = array("false" => array());
					}else{
						$returnArr = array();
						for($x = 0; $x < count($user['values']); $x++){
							if($user['values'][$x]['location']['name'] != '' && $user['values'][$x]['location']['name'] != null){
								$geo = getGeoLocation($user['values'][$x]['location']['name']);
							}
							$client = array(
								'id' => $user['values'][$x]['id'],
								'givenName' => $user['values'][$x]['firstName'] . " " . $user['values'][$x]['lastName'],
								'displayName' => $user['values'][$x]['firstName'] . " " . $user['values'][$x]['lastName'],
								'currentTown' => $geo . ", " . $user['values'][$x]['location']['country']['code'],
								'service' => 'Linkedin',
								'about' => array(
									'description' => $user['values'][$x]['headline'] . " - " . $user['values'][$x]['industry'],
									'link' => $user['values'][$x]['siteStandardProfileRequest']['url']
								)
							);
							array_push($returnArr, $client);
						}

					}
				}
			}
		case "Google":
		echo "case \"Google\""; ?><br/><?php
			$filename = "../../serviceCreds.json";
			if(($file = file_get_contents($filename)) == false){
				echo("Cannot open the file: " . $filename);
			}else{
				$tokenObject = json_decode($file, true);
				$linkedinTokens = $tokenObject['google'];
				
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
					
					if(isset($var['error'])){
						$returnArr = array("false" => array());
					}else{
						$returnArr = array();
						for($x = 0; $x < count($var['items']); $x++){
							$client = array(
								'id' => $var['items'][$x]['id'],
								'givenName' => $var['items'][$x]['displayName'],
								'displayName' => $var['items'][$x]['displayName'],
								'image' => $var['items'][$x]['image']['url'],
								'service' => 'Google',
								'about' => array(
									'link' => $var['items'][$x]['url']
								)
							);
							array_push($returnArr, $client);
						}

					}
				}
			}
		break;
		default:
			$returnArr['Default'] = array("success" => "false", "msg" => "Default switch option");
		break;
	}
	return json_encode($returnArr);
}

function saveFriendsList($friendArr){
	echo "saveFriendsList"; ?><br/><?php
	//global //$log;
	//global //$logPrefix;
	$arr = json_decode($friendArr, true);

	for($x = 0; $x < count($arr); $x++){
		$client = new clientObject();

		$client->setCredential($arr[$x]['service'], 
			array("id" => $arr[$x]['id'], "displayName" =>  $arr[$x]['displayName'], "givenName" =>  $arr[$x]['givenName'])
		);
		$client->setDisplayName($arr[$x]['displayName']);
		$client->setGivenName($arr[$x]['givenName']);
		$client->setID($arr[$x]['service'].'-----'.$arr[$x]['id']);
		$client->setAbout($arr[$x]['service'], $arr[$x]['about']);
		$client->setService($arr[$x]['service']);
		if($arr[$x]['currentTown'] != '' && $arr[$x]['currentTown'] != null){
			$client->setCurrentTown($arr[$x]['currentTown']);
		}
		if($arr[$x]['homeTown'] != '' && $arr[$x]['homeTown'] != null){
			$client->setHomeTown($arr[$x]['homeTown']);
		}

		$user = getClient($arr[$x]['service'].'-----'.$arr[$x]['id']);
		if(isset($user['data'])){
			$client->setStarred($user['data']['starred']);
			$client->setOwns($user['data']['owns']);
			$client->setOwnedBy($user['data']['ownedBy']);
			$client->setRecentPost($user['data']['post']['recentPost']);
			$client->setRecentPostTime($user['data']['post']['recentPostTime']);		
			$client->setTotalPosts($user['data']['post']['totalPosts']);
			writeClient((array)$client);
		}else{
			writeClient((array)$client);
		}
	}

	return "Success";
}

//43200 = 12 hours
if(!file_exists("../../lockFiles/clientManager.lock") || (time() > filemtime("../../lockFiles/clientManager.lock") + 43200)){
	touch("../../lockFiles/clientManager.lock");

	$var = getFriendsList("Facebook");
	saveFriendsList($var);

	$var = getFriendsList("Twitter");
	saveFriendsList($var);

	$var = getFriendsList("Linkedin");
	saveFriendsList($var);

	$var = getFriendsList("Instagram");
	saveFriendsList($var);

	unlink("../../lockFiles/clientManager.lock");
}

?>