<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines server side group of function pertaining to Searches
** 
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
require_once('RefreshGoogleToken.php');
require_once('matchHelpers.php');
require_once('ObjectToArray.php');
require_once('../../oAuth/twitteroauth/twitteroauth.php');
require_once('../../cron/objects/activityObject.php');
require_once('../../cron/objects/userBaseObject.php');
require_once('../../cron/objects/clientBaseObject.php');
require_once('authCalls.php');

use \ElasticSearch\Client;

class Search{
	
	public function starred(){
		if(isset($_GET['star'])){
			$service = $_GET['star'];
		}else{
			$service = "";
		}
		if(isset($_GET['from'])){
			$from = $_GET['from'];
		}else{
			$from = 0;
		}

		$serviceList = explode("+", $service);

		$var = matchStarred($serviceList, $from);
		return json_encode($var);
	}
	
	public function user(){
		if(isset($_GET['user'])){
			$user = $_GET['user'];
		}else{
			$user = "";
		}
		if(isset($_GET['from'])){
			$from = $_GET['from'];
		}else{
			$from = 0;
		}

		$userList = explode("+", $user);

		$var = matchSpecificUser($userList, $from);
		return json_encode($var);
	}
	
	public function starredClients(){
		$var = matchStarredClients();
		return json_encode($var);
	}
	
	public function searchFriendsOnOff(){
		$var = matchFriendsOnOff();
		return json_encode($var);
	}
	
	public function searchShh(){
		$res = matchShh();
		
		$dataArr = array();
		for($x = 0; $x < count($res['hits']['hits']); $x++){
                        if($res['hits']['hits'][$x]['_source']['data']['displayName'] != ""){
				$id = explode("-----", $res['hits']['hits'][$x]['_source']['data']['id']);

                                $dataArr[$id[1]] = $res['hits']['hits'][$x]['_source'];
                        }
                }
		
		return json_encode($dataArr);
	}
	
	public function service(){
		if(isset($_GET['service'])){
			$service = $_GET['service'];
		}else{
			$service = "";
		}
		if(isset($_GET['from'])){
			$from = $_GET['from'];
		}else{
			$from = 0;
		}
		
		$serviceList = explode("+", $service);
		
		$var = matchService($serviceList, $from);
		return json_encode($var);
	}

	public function sendSearchString(){
		if(isset($_GET['searchString'])){
			$searchString = $_GET['searchString'];
			$searchString = ltrim($searchString, "+");
		}else{
			$searchString = "";
		}

		if(isset($_GET['from'])){
			$from = $_GET['from'];
		}else{
			$from = 0;
		}

		//print_r($searchString);

		$contains = "";

		if(count(explode("\"", $searchString)) > 2){
			$contains = $contains . "hasQuotes";
		}
		if(count(explode("OR", $searchString)) > 1){
			$contains = $contains . "hasOR";
		}
		if((strpos($searchString, ":") !== FALSE)){
			$contains = $contains . "hasColon";
		}
		if($contains == "hasQuoteshasColon"){
			$contains = "hasQuotesAndColon";
		}
		if($contains == "hasQuoteshasOR"){
			$contains = "hasQuotesAndOR";
		}
		if($contains == "hasORhasColon"){
			$contains = "hasColonAndOR";
		}
		if($contains == "hasQuoteshasORhasColon"){
			$contains = "hasAll";
		}
		if($contains != "hasQuotes" && $contains != "hasOR" && $contains != "hasColon" && $contains != "hasQuotesAndColon" && $contains != "hasQuotesAndOR" && $contains != "hasColonAndOR" && $contains != "hasAll"){
			$contains = $contains . "normal";
		}
	
		switch ($contains){
			case "normal":
				$termList = explode("+", $searchString);
				$searchObj = array("normal" => $termList);
				$response = matchQueryString($contains, $searchObj, $from);
			break;

			case "hasQuotes":
				$searchObj = array(
					"normal" => "",
					"quotes" => ""
				);
				if (preg_match_all('/"([^"]+)"/', $searchString, $m)) {
				    $searchObj['quotes'] = $m[1];   
				}

				$var = explode('"', $searchString);
				$normObj = array();
				$tempObj = array();
				for($g = 0; $g<count($var); $g+=2){
					array_push($tempObj, $var[$g]);
				}
				
				for($h=0; $h < count($tempObj); $h++){
					$termList = explode("+", $tempObj[$h]);
					for($j=0; $j < count($termList); $j++){
						array_push($normObj, $termList[$j]);
					}
				}
				$searchObj["normal"] = $normObj;
				//return json_encode($searchObj);
				$response = matchQueryString($contains, $searchObj, $from);
			break;

			case "hasColon":
				$searchObj = array(
					"normal" => "",
					"colon" => ""
				);
				$var = explode(":", $searchString);
				
				$searchObj['colon'] = $var[0];
				
				$termList = explode("+", $var[1]);
				$searchObj['normal'] = $termList;
				
				$response = matchQueryString($contains, $searchObj, $from);
			break;

			case "hasOR":
				$searchObj = array(
					"before" => array(),
					"after" => array()
				);

				$termList = explode("OR", $searchString);
				$mustList = explode("+", $termList[0]);
				$shouldList = explode("+", $termList[1]);

				for($q = 0; $q < count($mustList); $q++){
					if(isset($mustList[$q])){
						if($mustList[$q] != ""){
							array_push($searchObj['before'], $mustList[$q]);
						}
					}
				}

				for($q = 0; $q < count($shouldList); $q++){
					if(isset($shouldList[$q])){
						if($shouldList[$q] != ""){
							array_push($searchObj['after'], $shouldList[$q]);
						}
					}
				}

				//print_r($searchObj);

				$response = matchQueryString($contains, $searchObj, $from);
			break;

			case "hasQuotesAndColon":
				$searchObj = array(
					"normal" => "",
					"colon" => ""
				);
				$var = explode(":", $searchString);
				
				$searchObj['colon'] = $var[0];
				
				if (preg_match_all('/"([^"]+)"/', $var[1], $m)) {
				    $searchObj['quotes'] = $m[1];   
				}

				$str = explode('"', $var[1]);
				$normObj = array();
				$tempObj = array();
				for($g = 0; $g<count($str); $g+=2){
					array_push($tempObj, $str[$g]);
				}
				
				for($h=0; $h < count($tempObj); $h++){
					$termList = explode("+", $tempObj[$h]);
					for($j=0; $j < count($termList); $j++){
						array_push($normObj, $termList[$j]);
					}
				}
				$searchObj["normal"] = $normObj;

				$response = matchQueryString($contains, $searchObj, $from);
			break;

			case "hasQuotesAndOR":
				$searchObj = array(
					"first" => array(
						"normal" => "",
						"quotes" => ""
					),
					"second" => array(
						"normal" => "",
						"quotes" => ""
					)
				);

				$mainTermList = explode("OR", $searchString);

				//print_R($mainTermList);

				//do first half of termList
				if (preg_match_all('/"([^"]+)"/', $mainTermList[0], $m)) {
				    $searchObj['first']['quotes'] = $m[1];   
				}

				$var = explode('"', $mainTermList[0]);
				$normObj = array();
				$tempObj = array();
				for($g = 0; $g<count($var); $g+=2){
					array_push($tempObj, $var[$g]);
				}
				
				for($h=0; $h < count($tempObj); $h++){
					$termList = explode("+", $tempObj[$h]);
					for($j=0; $j < count($termList); $j++){
						if($termList[$j] != ""){
							array_push($normObj, $termList[$j]);
						}
					}
				}
				$searchObj["first"]["normal"] = $normObj;

				//do second half of termList
				if (preg_match_all('/"([^"]+)"/', $mainTermList[1], $m)) {
				    $searchObj['second']['quotes'] = $m[1];   
				}

				$var = explode('"', $mainTermList[1]);
				$normObj = array();
				$tempObj = array();
				for($g = 0; $g<count($var); $g+=2){
					array_push($tempObj, $var[$g]);
				}
				
				for($h=0; $h < count($tempObj); $h++){
					$termList = explode("+", $tempObj[$h]);
					for($j=0; $j < count($termList); $j++){
						if($termList[$j] != ""){
							array_push($normObj, $termList[$j]);
						}
					}
				}
				$searchObj["second"]["normal"] = $normObj;

				//print_R($searchObj);

				$response = matchQueryString($contains, $searchObj, $from);
			break;

			case "hasColonAndOR":
				//here is the hasColon code
				$searchObj = array(
					"colon" => "",
					"before" => array(),
					"after" => array()
				);
				$var = explode(":", $searchString);
				
				$searchObj['colon'] = $var[0];

				$termList = explode("OR", $var[1]);
				$mustList = explode("+", $termList[0]);
				$shouldList = explode("+", $termList[1]);

				for($q = 0; $q < count($mustList); $q++){
					if(isset($mustList[$q])){
						if($mustList[$q] != ""){
							array_push($searchObj['before'], $mustList[$q]);
						}
					}
				}

				for($q = 0; $q < count($shouldList); $q++){
					if(isset($shouldList[$q])){
						if($shouldList[$q] != ""){
							array_push($searchObj['after'], $shouldList[$q]);
						}
					}
				}

				//print_R($searchObj);

				$response = matchQueryString($contains, $searchObj, $from);
			break;

			case "hasAll":
				$searchObj = array(
					"colon" => "",
					"first" => array(
						"normal" => "",
						"quotes" => ""
					),
					"second" => array(
						"normal" => "",
						"quotes" => ""
					)
				);

				$var = explode(":", $searchString);
				
				$searchObj['colon'] = $var[0];

				$mainTermList = explode("OR", $var[1]);

				//print_R($mainTermList);

				//do first half of termList
				if (preg_match_all('/"([^"]+)"/', $mainTermList[0], $m)) {
				    $searchObj['first']['quotes'] = $m[1];   
				}

				$var = explode('"', $mainTermList[0]);
				$normObj = array();
				$tempObj = array();
				for($g = 0; $g<count($var); $g+=2){
					array_push($tempObj, $var[$g]);
				}
				
				for($h=0; $h < count($tempObj); $h++){
					$termList = explode("+", $tempObj[$h]);
					for($j=0; $j < count($termList); $j++){
						if($termList[$j] != ""){
							array_push($normObj, $termList[$j]);
						}
					}
				}
				$searchObj["first"]["normal"] = $normObj;

				//do second half of termList
				if (preg_match_all('/"([^"]+)"/', $mainTermList[1], $m)) {
				    $searchObj['second']['quotes'] = $m[1];   
				}

				$var = explode('"', $mainTermList[1]);
				$normObj = array();
				$tempObj = array();
				for($g = 0; $g<count($var); $g+=2){
					array_push($tempObj, $var[$g]);
				}
				
				for($h=0; $h < count($tempObj); $h++){
					$termList = explode("+", $tempObj[$h]);
					for($j=0; $j < count($termList); $j++){
						if($termList[$j] != ""){
							array_push($normObj, $termList[$j]);
						}
					}
				}
				$searchObj["second"]["normal"] = $normObj;

				//print_R($searchObj);

				$response = matchQueryString($contains, $searchObj, $from);
			break;

			default:
				$response = array("error" => "Error has occurred with searchString: " . $searchString);
			break;
		}
		
		return json_encode($response);
	}
	
	public function term(){
		if(isset($_GET['term'])){
			$term = $_GET['term'];
		}else{
			$term = "";
		}
		if(isset($_GET['from'])){
			$from = $_GET['from'];
		}else{
			$from = 0;
		}
		
		$termList = explode("+", $term);
		
		$var = matchSpecificContent($termList, $from);
		
		return json_encode($var);
	}

	public function queryTwitter($varObj, $returnObj){
		//query string
		$query = $varObj['query'];
		//print_r($query);
		//auth junk
		$oauth_Token = $varObj['authStuff']['twitter'][0]['accounts'][0]['accessToken'];
		$consumer_key = $varObj['authStuff']['twitter'][0]['accounts'][0]['key'];
		$consumer_secret = $varObj['authStuff']['twitter'][0]['accounts'][0]['secret'];
		$access_secret = $varObj['authStuff']['twitter'][0]['accounts'][0]['accessSecret'];
		//connMan
		$connection = new TwitterOAuth($consumer_key, $consumer_secret, $oauth_Token, $access_secret);
		//make the twitter request
		$status = $connection->get('search/tweets', array('q' => urlencode($query), 'count' => 20));
		$status = objectToArray($status);

		if(isset($status['search_metadata'])){
			if(isset($status['search_metadata']['max_id_str'])){
				$since_id = $status['search_metadata']['max_id_str'];
			}
		}

		for($x = 0; $x < count($status['statuses']); $x++){
			$id = $status['statuses'][$x]['id'];
		}

		if(isset($id)){
			$max_id = $id - 1;
		}		

		$array = $status['statuses'];

		//print_r($array);
		//response
		if(isset($array['errors'])){
			print_r($array['errors'][0]['message']);
			print_r($array['errors'][0]['code']);
			
			return json_encode(array("Error" => $array['errors'][0]['message']));
		}else{
			$returnObj = $this->normalizeTwitterObject($array, $varObj['authStuff']['twitter'][0]['accounts'][0], $query, $returnObj);
		}

		if(isset($max_id)){
			$returnObj['nextToken']['twitter']['next']['max_id'] = $max_id;
		}

		return $returnObj;
	}

	public function paginateTwitter($varObj, $returnObj){
		//echo "queryTwitter ";
		//print_r($varObj);
		//query string
		$query = $varObj['query'];
		$max_id = $varObj['nextToken']['twitter']['next']['max_id'];
		//print_r($query);
		//auth junk
		$oauth_Token = $varObj['authStuff']['twitter'][0]['accounts'][0]['accessToken'];
		$consumer_key = $varObj['authStuff']['twitter'][0]['accounts'][0]['key'];
		$consumer_secret = $varObj['authStuff']['twitter'][0]['accounts'][0]['secret'];
		$access_secret = $varObj['authStuff']['twitter'][0]['accounts'][0]['accessSecret'];
		//connMan
		$connection = new TwitterOAuth($consumer_key, $consumer_secret, $oauth_Token, $access_secret);
		//make the twitte request
		$status = $connection->get('search/tweets', array('q' => urlencode($query), 'count' => 20, 'max_id' => $max_id/*, 'since_id' => $since_id*/));
		$status = objectToArray($status);

		//print_r($status);
		
		if(isset($status['search_metadata'])){
			if(isset($status['search_metadata']['max_id_str'])){
				$since_id = $status['search_metadata']['max_id_str'];
			}
		}

		for($x = 0; $x < count($status['statuses']); $x++){
			$id = $status['statuses'][$x]['id'];
		}

		if(isset($id)){
			$max_id = $id - 1;
		}

		$array = $status['statuses'];

		//print_r($array);
		//response
		if(isset($array['errors'])){
			print_r($array['errors'][0]['message']);
			print_r($array['errors'][0]['code']);
			
			return json_encode(array("Error" => $array['errors'][0]['message']));
		}else{
			$returnObj = $this->normalizeTwitterObject($array, $varObj['authStuff']['twitter'][0]['accounts'][0], $query, $returnObj);	    
		}

		if(isset($max_id)){
			$returnObj['nextToken']['twitter']['next']['max_id'] = $max_id;
		}

		return $returnObj;
	}

	public function normalizeTwitterObject($objArray, $account, $query, $returnObj){
		//echo "normal twitter stuff ";
		for($k = 0; $k < count($objArray); $k++){
			$obj = $objArray[$k];

			//print_r($obj);

			$manager = new Manager();
			$builder = new twitterObjectBuilder();
			$manager->setBuilder($builder);

			$manager->parseActivityObj($obj, $account);

			$item = array();
			$item['_source'] = $manager->getActivityObj();

			array_push($returnObj['hits']['hits'], $item);
		}

		return $returnObj;
	}

	public function writeObject($obj, $query){
		//echo "write object "; 

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

		//print_R($obj);
		$grr = $es->index($obj, $obj['id']);
		//print_R($grr);
	}

	public function getObject($id){
		//echo "getting object"; 

		$index = "public";
		$host = "localhost";
		$port = "9200";

		$es = Client::connection("http://$host:$port/$index/$index");
		$res = $es->get($id);

		return $res;
	}

	/*public function writeClient($obj){
		echo "writing to client "; 

		$index = "client";
		$host = "localhost";
		$port = "9200";

		$es = Client::connection("http://$host:$port/$index/$index/");

		$grr = $es->index($obj, $obj['data']['id']);
		return $grr;
	}*/

	public function getPublicQueryObjects(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);
		
		//get checked and call thew two functions for what is checked
		//print_r($varObj);

		$returnObj = array(
			'hits' => array(
				'hits' => array(

				)
			),
			'nextToken' => array(

			)
		);
		foreach($varObj['checked'] as $key => $value){
			if($key == "Facebook"){
				if($varObj['checked'][$key] == true){
					$returnObj = $this->queryFacebook($varObj, $returnObj);
				}
			}
			if($key == "Twitter"){
				if($varObj['checked'][$key] == true){
					$returnObj = $this->queryTwitter($varObj, $returnObj);
				}
			}
			if($key == "Google"){
				if($varObj['checked'][$key] == true){
					$returnObj = $this->queryGoogle($varObj, $returnObj);
				}
			}
		}
		
		if(!isset($returnObj['error'])){
			usort($returnObj['hits']['hits'], function($a, $b){ if($a['_source'] == $b['_source']){}else{return intval($a['_source']->published) < intval($b['_source']->published);} });
		}
		return json_encode($returnObj);
	}

	public function getPublicDBObjects(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);
		$queryString = $varObj['query'];

		//print_r($queryString . "      ");

		$from = $varObj['from'];

		$size = 20;

		$index = "public";
		$host = "localhost";
		$port = "9200";

		$es = Client::connection("http://$host:$port/$index/$index");

		if (preg_match_all('/"([^"]+)"/', $queryString, $m)) {
			$searchType = "quotes";
		    $queryString = $m[1];   
		}else{
			$searchType = "normal";
		}

	//	if(count(explode("\"", $queryString)) > 2){
	//		$searchType = "quotes";
	//		$queryString = ltrim($queryString, "\"");
	//		$queryString = rtrim($queryString, "\"");
	//	}else{
	//		$searchType = "normal";
	//	}

		$searchArr = array(
			"from" => $from,
			"size" => $size,
			"query" => array(
				'bool' => array(
					"should" => array(
						//push stuff here
					),
					"must" => array(
						//push stuff here
					)
				)
		    ),
		    'sort' => array(
				'published' => array(
					"order" => "desc"
				)
			)
		);

		if($searchType == "normal"){
			$queryString = explode(" ", $queryString);
			//print_r($queryString);
			for($x = 0; $x < count($queryString); $x++){
				$temp = array('term' => array('serviceQuery' => $queryString[$x]));
				array_push($searchArr['query']['bool']['should'], $temp);
			}
		}else{
			$temp = array("match" => 
				array("serviceQuery" => 
					array(
						"query" => strtolower($queryString),
						"type" => "phrase"
					)
				)
			);
			array_push($searchArr['query']['bool']['must'], $temp);
		}

		//print_R($searchArr);

		$res = $es->search($searchArr);
		
		$res['from'] = $from;
		$res['searchArr'] = $searchArr;

		return json_encode($res);
	}

	public function queryFacebook($varObj, $returnObj){
		//echo "queryFacebook ";
		//$var = file_get_contents("php://input");
		//$varObj = json_decode($var, true);
		//print_r($varObj);
		//query string
		$query = $varObj['query'];
		//print_r($query);
		//auth junk
		$access_token = $varObj['authStuff']['facebook'][0]['accounts'][0]['accessToken'];
		//make the facebook request
		$url = 'https://graph.facebook.com/search?limit=20&q=' . urlencode($query) . '&type=post&access_token=' . $access_token;

		//print_R($url);

		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$response = curl_exec($ch);
		curl_close($ch);

		$response = json_decode($response, true);

		//print_r($response);

		if(isset($response['paging']['next'])){
			$next = $response['paging']['next'];	
		}

		if(isset($response)){
			if(isset($response['data'])){
				$response = $response['data'];
			}
		}

		$returnObj = $this->normalizeNewsFeedObj($response, $varObj['authStuff']['facebook'][0]['accounts'][0], $query, $returnObj);	    
		
		if(isset($next)){
			$returnObj['nextToken']['facebook']['next'] = $next;
		}

		return $returnObj;
	}

	public function queryGoogle($varObj, $returnObj){
		$query = $varObj['query'];

		$access_token = $varObj['authStuff']['google'][0]['accounts'][0]['accessToken'];
		
		$url = 'https://www.googleapis.com/plus/v1/activities?maxResults=20&query='.urlencode($query);
		$ch = curl_init($url);
		$headers = array('Authorization: Bearer ' . $access_token);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$res = curl_exec($ch);
		curl_close($ch);
		//print_r($res);
		$var = json_decode($res, true);
		if(isset($var['error'])){
			$token = refreshGoogToken($varObj['authStuff']['google'][0]['accounts'][0]['uuid']);
			//print_r($token);
			$url = 'https://www.googleapis.com/plus/v1/activities?maxResults=20&query='.urlencode($query);
			$ch = curl_init($url);
			$headers = array('Authorization: Bearer ' . $token);
			curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			$res = curl_exec($ch);
			curl_close($ch);
			//print_r($res);
			$var = json_decode($res, true);
			
			if(isset($var['error'])){
				return array("error" => $var['error']['errors'][0]['message']);
			}
			$returnObj = $this->normalizeGoogObject($var['items'], $varObj['authStuff']['google'][0]['accounts'][0], $query, $returnObj);

			if(isset($var['nextPageToken'])){
				$returnObj['nextToken']['google']['next'] = $var['nextPageToken'];
			}

			return $returnObj;
		}else{
			$returnObj = $this->normalizeGoogObject($var['items'], $varObj['authStuff']['google'][0]['accounts'][0], $query, $returnObj);

			if(isset($var['nextPageToken'])){
				$returnObj['nextToken']['google']['next'] = $var['nextPageToken'];
			}

			return $returnObj;
		}
	}

	function normalizeGoogObject($objArray, $account, $query, $returnObj){
		//echo "normal goog";
		$mediaArray = array();
		for($k = 0; $k < count($objArray); $k++){
			$obj = $objArray[$k];

			//print_r($obj);

			$manager = new Manager();
			$builder = new googleObjectBuilder();
			$manager->setBuilder($builder);

			$manager->parseActivityObj($obj, $account);

			$item = array();
			$item['_source'] = $manager->getActivityObj();

			array_push($returnObj['hits']['hits'], $item);
		}

		return $returnObj;
	}

	public function paginateService(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);

		//print_r($varObj);

		$returnObj = array(
			'hits' => array(
				'hits' => array(

				)
			),
			'nextToken' => array(

			)
		);

		foreach($varObj['checked'] as $key => $value){
			if($key == "Facebook"){
				if($varObj['checked'][$key] == true){
					if(isset($varObj['nextToken']['facebook']['next'])){
						$returnObj = $this->paginateFacebook($varObj, $returnObj);
					}
				}
			}
			if($key == "Twitter"){
				if($varObj['checked'][$key] == true){
					if(isset($varObj['nextToken']['twitter']['next']['max_id'])){
						$returnObj = $this->paginateTwitter($varObj, $returnObj);
					}
				}
			}
			if($key == "Google"){
				if($varObj['checked'][$key] == true){
					if(isset($varObj['nextToken']['google']['next'])){
						$returnObj = $this->paginateGoogle($varObj, $returnObj);
					}
				}
			}
		}
		
		usort($returnObj['hits']['hits'], function($a, $b){ if($a['_source'] == $b['_source']){}else{return intval($a['_source']->published) < intval($b['_source']->published);} });

		return json_encode($returnObj);
	}

	public function paginateGoogle($varObj, $returnObj){
		//print_r($varObj);
		$query = $varObj['query'];

		$access_token = $varObj['authStuff']['google'][0]['accounts'][0]['accessToken'];

		$next = $varObj['nextToken']['google']['next'];
		
        $url = 'https://www.googleapis.com/plus/v1/activities?maxResults=20&pageToken='.$next.'&access_token='.$access_token.'&query='.urlencode($query);
		$ch = curl_init($url);

		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$res = curl_exec($ch);
		curl_close($ch);
		//print_r($res);
		$var = json_decode($res, true);

		if(isset($var['error'])){
			$token = refreshGoogToken($varObj['authStuff']['google'][0]['accounts'][0]['uuid']);
			$url = 'https://www.googleapis.com/plus/v1/activities?maxResults=20&access_token='.$token.'&query='.urlencode($query);
			$ch = curl_init($url);

			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			$res = curl_exec($ch);
			curl_close($ch);
			//print_r($res);
			$var = json_decode($res, true);
			
			$returnObj = $this->normalizeGoogObject($var['items'], $varObj['authStuff']['google'][0]['accounts'][0], $query, $returnObj);

			if(isset($var['nextPageToken'])){
				$returnObj['nextToken']['google']['next'] = $var['nextPageToken'];
			}

			return $returnObj;
		}else{
			$returnObj = $this->normalizeGoogObject($var['items'], $varObj['authStuff']['google'][0]['accounts'][0], $query, $returnObj);

			if(isset($var['nextPageToken'])){
				$returnObj['nextToken']['google']['next'] = $var['nextPageToken'];
			}

			return $returnObj;
		}
	}

	public function paginateFacebook($varObj, $returnObj){
		//print_r($varObj);
		//make the facebook request
		$url = $varObj['nextToken']['facebook']['next'];
		$query = $varObj['query'];

		//var_dump($url);

		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$response = curl_exec($ch);
		curl_close($ch);

		//var_dump($response);

		$response = json_decode($response, true);

		if(isset($response['paging']['next'])){
			$next = $response['paging']['next'];	
		}

		$response = $response['data'];

		$returnObj = $this->normalizeNewsFeedObj($response, $varObj['authStuff']['facebook'][0]['accounts'][0], $query, $returnObj);	    

		if(isset($next)){
			$returnObj['nextToken']['facebook']['next'] = $next;
		}

		return $returnObj;
	}

	function normalizeNewsFeedObj($objArray, $account, $query, $returnObj){
		//echo "normal face stuff"; 
		//print_R($objArray);
		for($k = 0; $k < count($objArray); $k++){
			$obj = $objArray[$k];

			//print_r($obj); 

			$manager = new Manager();
			$builder = new facebookNewsFeedObjectBuilder();
			$manager->setBuilder($builder);

			$manager->parseActivityObj($obj, $account);

			$item = array();			
			$item['_source'] = $manager->getActivityObj();

			array_push($returnObj['hits']['hits'], $item);
		}

		return $returnObj;
	}

	public function getGeoLocation($loc){
		if($loc == ""){
			return $loc;
		}else{
			$cityclean = str_replace(" ", "+", $loc);
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
				if(isset($var['results'][0])){
					//print_r($var);
	                $latLong = $var['results'][0]['geometry']['location']['lat'] . "#" . $var['results'][0]['geometry']['location']['lng'];
	            }
			}
			return $latLong;
		}
	}
	
	public function getUser(){
		if(isset($_GET['name'])){
			$name = $_GET['name'];
		}else{
			$name = "";
		}
		if(isset($_GET['media'])){
			$media = $_GET['media'];
		}else{
			$media = "";
		}
		
		#content type for a failed facebook request will return 
		#application/html that might be checked on curl
		$returnObj = array();
		
		if($media == "Facebook"){
			$url = 'http://graph.facebook.com/' . $name;
			$ch = curl_init($url);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			$res = curl_exec($ch);
			curl_close($ch);
			
			$obj = json_decode($res, true);
			
			if(isset($obj['error'])){
				$returnObj['Error'] = $obj['error']['message'];
			}else if($obj['id']){
				$returnObj['id'] = $obj['id'];
				$returnObj['username'] = $obj['username'];
				$returnObj['name'] = $obj['name'];
				$returnObj['link'] = $obj['link'];
				$returnObj['bio/gender'] = $obj['gender'];
				$returnObj['searchable'] = $obj['id'];
			}else{
				$returnObj['Error'] = "No users by that Name/ID";
			}
		}elseif($media == "Instagram"){
	
			$filename = "../../oAuth/instaToken.txt";
			if(($file = file_get_contents($filename)) == false){
				return json_encode(array("error" => "Cannot open the file: " . $filename));
			}else{
				$obj = json_decode($file, true);
	
				$url = "https://api.instagram.com/v1/users/search?q=". $name ."&access_token=" . $obj['access_token'];
				$ch = curl_init($url);
				curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
				$res = curl_exec($ch);
				curl_close($ch);
				
				$obj = json_decode($res, true);

				if(count($obj['data']) == 0){
					$returnObj['Error'] = "No users by that Name/ID";
				}
				if(count($obj['data']) > 0){
		
					for($f = 0; $f < count($obj['data']); $f++){
						$returnObj[$f]['id'] = $obj['data'][$f]['id'];
						$returnObj[$f]['username'] = $obj['data'][$f]['username'];
						$returnObj[$f]['name'] = $obj['data'][$f]['full_name'];
						$returnObj[$f]['link'] = $obj['data'][$f]['website'];
						$returnObj[$f]['bio/gender'] = $obj['data'][$f]['bio'];
						$returnObj[$f]['searchable'] = $obj['data'][$f]['username'];
					}

				}else{
					$returnObj['Error'] = "No users by that Name/ID";
				}
			}
		}elseif($media == "Twitter"){
		
			$filename = "../../oAuth/twitterClientInfo.txt";
			
			if(($file = file_get_contents($filename)) == false){
				return json_encode(array("error" => "Cannot open the file: " . $filename));
			}else{
			
				$obj = json_decode($file, true);
				
				$connection = new TwitterOAuth($obj['appKey'], $obj['appSecret'], $obj['accessToken'], $obj['accessSecret']);
				
				//$connection->host = "https://api.twitter.com/1.1";
				
				$obj = $connection->get("https://api.twitter.com/1.1/users/lookup.json?screen_name=" . $name);
	
			#	$url = "https://api.twitter.com/1.1/users/show.json?screen_name=" . $name . "&oauthToken=".$obj['access_token'] . "&consumerKey=".$obj['appKey'] . "&consumerSecret=".$obj['appSecret'];
			#	$ch = curl_init($url);
			#	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			#	$res = curl_exec($ch);
			#	curl_close($ch);
				
				$obj = objectToArray($obj);
				
				if(!isset($obj[0]['id'])){
					$returnObj['Error'] = "No users by that Name/ID";
				}else if(count($obj) > 0){
					for($d = 0; $d < count($obj); $d++){
						$returnObj[$d]['id'] = $obj[$d]['id'];
						$returnObj[$d]['username'] = $obj[$d]['screen_name'];
						$returnObj[$d]['name'] = $obj[$d]['name'];
						$returnObj[$d]['link'] = $obj[$d]['url'];
						$returnObj[$d]['bio/gender'] = $obj[$d]['description'];
						$returnObj[$d]['searchable'] = $obj[$d]['screen_name'];
					}
				}else{
					$returnObj['Error'] = "No users by that Name/ID";
				}
			}
		}

		return json_encode($returnObj);

	}

}



