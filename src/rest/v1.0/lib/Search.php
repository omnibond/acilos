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

require_once('matchHelpers.php');
require_once('ObjectToArray.php');
require_once('../../oAuth/twitteroauth/twitteroauth.php');
require_once('../../cron/objects/activityObject.php');
require_once('../../cron/objects/userBaseObject.php');
require_once('../../cron/objects/clientBaseObject.php');

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
		if((strpos($searchString, ":") !== FALSE)){
			$contains = $contains . "hasColon";
		}
		if($contains != "hasQuotes" && $contains != "hasColon" && $contains != "hasQuoteshasColon"){
			$contains = $contains . "normal";
		}
		if($contains == "hasQuoteshasColon"){
			$contains = "hasBoth";
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

			case "hasBoth":
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

	public function queryTwitter(){
		//echo "queryTwitter ";
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);
		//print_r($varObj);
		//query string
		$query = $varObj['query'];
		//print_r($query);
		//auth junk
		$oauth_Token = $varObj['authStuff'][0]['accounts'][0]['accessToken'];
		$consumer_key = $varObj['authStuff'][0]['accounts'][0]['key'];
		$consumer_secret = $varObj['authStuff'][0]['accounts'][0]['secret'];
		$access_secret = $varObj['authStuff'][0]['accounts'][0]['accessSecret'];
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

		$max_id = $id - 1;		

		$array = $status['statuses'];

		//print_r($array);
		//response
		if(isset($array['errors'])){
			print_r($array['errors'][0]['message']);
			print_r($array['errors'][0]['code']);
			
			return json_encode(array("Error" => $array['errors'][0]['message']));
		}else{
			$this->normalizeTwitterObject($array, $varObj['authStuff'][0]['accounts'][0], $query);	    
		}

		if(isset($since_id)){
			return json_encode(array(
					"Success" => "It worked",
					"next" => array(
						"since_id" => $since_id,
						"max_id" => $max_id
					)
				)
			);
		}else{
			return json_encode(array(
					"Success" => "It worked",
					"next" => ""
				)
			);
		}
	}

	public function paginateTwitter(){
		//echo "queryTwitter ";
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);
		//print_r($varObj);
		//query string
		$query = $varObj['query'];
		$since_id = $varObj['cursor']['since_id'];
		$max_id = $varObj['cursor']['max_id'];
		//print_r($query);
		//auth junk
		$oauth_Token = $varObj['authStuff'][0]['accounts'][0]['accessToken'];
		$consumer_key = $varObj['authStuff'][0]['accounts'][0]['key'];
		$consumer_secret = $varObj['authStuff'][0]['accounts'][0]['secret'];
		$access_secret = $varObj['authStuff'][0]['accounts'][0]['accessSecret'];
		//connMan
		$connection = new TwitterOAuth($consumer_key, $consumer_secret, $oauth_Token, $access_secret);
		//make the twitte request
		$status = $connection->get('search/tweets', array('q' => urlencode($query), 'count' => 20, 'max_id' => $max_id, 'since_id' => $since_id));
		$status = objectToArray($status);

		print_r($status);

		// We do this here because what we return depends on whether or not this variable is set. We don't want to return the $since_id from the top of the function. We only want to return a $since_id if we get one back from twitter this time.
		unset($since_id);
		
		if(isset($status['search_metadata'])){
			if(isset($status['search_metadata']['max_id_str'])){
				$since_id = $status['search_metadata']['max_id_str'];
			}
		}

		for($x = 0; $x < count($status['statuses']); $x++){
			$id = $status['statuses'][$x]['id'];
		}

		$max_id = $id - 1;

		$array = $status['statuses'];

		//print_r($array);
		//response
		if(isset($array['errors'])){
			print_r($array['errors'][0]['message']);
			print_r($array['errors'][0]['code']);
			
			return json_encode(array("Error" => $array['errors'][0]['message']));
		}else{
			$this->normalizeTwitterObject($array, $varObj['authStuff'][0]['accounts'][0], $query);	    
		}

		if(isset($since_id)){
			return json_encode(array(
					"Success" => "It worked",
					"next" => array(
						"since_id" => $since_id,
						"max_id" => $max_id
					)
				)
			);
		}else{
			return json_encode(array(
					"Success" => "It worked",
					"next" => ""
				)
			);
		}
	}

	public function normalizeTwitterObject($objArray, $account, $query){
		//echo "normal twitter stuff ";
		for($k = 0; $k < count($objArray); $k++){
			$obj = $objArray[$k];

			//print_r($obj);

			$manager = new Manager();
			$builder = new twitterObjectBuilder();
			$manager->setBuilder($builder);
			$manager->parseActivityObj($obj, $account);

			$item = $manager->getActivityObj();

			//print_r($item);

			$this->writeObject((array)$item, $query, "twitter");
		}
	}

	public function writeObject($obj, $query, $service){
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

		if($service == "twitter"){
			$obj['twitterQuery'] = $query;
		}else if($service == "facebook"){
			$obj['facebookQuery'] = $query;
		}

		//print_R($obj);
		$grr = $es->index($obj, $obj['id']);

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

	public function getTwitterQueryObjects(){
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

		if(count(explode("\"", $queryString)) > 2){
			$searchType = "quotes";
			$queryString = ltrim($queryString, "\"");
			$queryString = rtrim($queryString, "\"");
		}else{
			$searchType = "normal";
		}

		$searchArr = array(
			"from" => $from,
			"size" => $size,
			"query" => array(
				'bool' => array(
					"must" => array(
						//push stuff here
					)
				)
		    )
		);

		if($searchType == "normal"){
			$queryString = explode(" ", $queryString);
			//print_r($queryString);
			for($x = 0; $x < count($queryString); $x++){
				$temp = array('term' => array('twitterQuery' => $queryString[$x]));
				array_push($searchArr['query']['bool']['must'], $temp);
			}
		}else{
			$temp = array("match" => 
				array("twitterQuery" => 
					array(
						"query" => $queryString,
						"type" => "phrase"
					)
				)
			);
			array_push($searchArr['query']['bool']['must'], $temp);
		}

		//print_R($searchArr);

		$res = $es->search($searchArr);
	
		return json_encode($res);
	}

	/*public function updateRecentPost($post){
		global $clientObject;
		//Dont count CONN objects as posts
		if($post['title'] != "CONN"){
			//if that poster is a client then update most recent
			if(isset($clientObject[$post['actor']->id])){
				$tempClientObj = $clientObject[$post['actor']->id];
				$tempClientObj['data']['service'] = $post['service'];
				if($tempClientObj['data']['post']['recentPostTime'] < $post['published'] || $tempClientObj['data']['post']['recentPostTime'] = ''){
					$tempClientObj['data']['post']['recentPostTime'] = $post['published'];
					$tempClientObj['data']['post']['recentPost'] = $post['id'];
					$tempClientObj['data']['post']['totalPosts'] = $tempClientObj['data']['post']['totalPosts'] + 1;
					if($post['actor']->location != '' || $post['actor']->location != null){
						$arr = explode("#", $post['actor']->location);
						if(count($arr) == 2){
							$tempClientObj['data']['currentTown'] = $post['actor']->location;
						}else{
							$geo = getGeoLocation($post['actor']->location);
							$tempClientObj['data']['currentTown'] = $geo;
						}
					}
					$tempClientObj['data']['friendDegree'] = "first";

					//$log->logInfo($logPrefix.'updateRecentPost() calling writeClient to update recentPost');
					writeClient($tempClientObj);
				}
			}else{
				//else add them as a client and set their most recent
				$client = new clientObject(); 
				$client->setDisplayName($post['actor']->displayName);
				$client->setID($post['service'].'-----'.$post['actor']->id);
				$client->setRecentPost($post['id']);
				$client->setRecentPostTime($post['published']);
				$client->setTotalPosts(1);
				$client->setService($post['service']);
				$client->setFriendDegree("second");

				if($post['actor']->location != '' || $post['actor']->location != null){
					$geo = $this->getGeoLocation($post['actor']->location);
					$client->setCurrentTown($geo);
				}		

				$type = $post['service'];
				$credential = array('id' => $post['actor']->id, 'givenName' => $post['actor']->displayName, 'displayName' => $post['actor']->displayName);
				$client->setCredential($type, $credential);

				$var = $this->writeClient((array)$client);

			}
		}
	}*/

	public function queryFacebook(){
		//echo "queryFacebook ";
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);
		//print_r($varObj);
		//query string
		$query = $varObj['query'];
		//print_r($query);
		//auth junk
		$access_token = $varObj['authStuff'][0]['accounts'][0]['accessToken'];
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

		$response = $response['data'];

		//response
		if(isset($array['errors'])){
			print_r($array['errors'][0]['message']);
			print_r($array['errors'][0]['code']);

			return json_encode(array("Error" => $array['errors'][0]['message']));
		}else{
			$this->normalizeNewsFeedObj($response, $varObj['authStuff'][0]['accounts'][0], $query);	    
		}

		if(isset($next)){
			return json_encode(array(
					"Success" => "It worked",
					"next" => $next
				)
			);
		}else{
			return json_encode(array(
					"Success" => "It worked",
					"next" => ""
				)
			);
		}	
	}

	public function paginateFacebook(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);

		//make the facebook request
		$url = $varObj['cursor'];
		$query = $varObj['query'];

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

		$response = $response['data'];

		//response
		if(isset($array['errors'])){
			print_r($array['errors'][0]['message']);
			print_r($array['errors'][0]['code']);

			return json_encode(array("Error" => $array['errors'][0]['message']));
		}else{
			$this->normalizeNewsFeedObj($response, $varObj['authStuff'][0]['accounts'][0], $query);	    
		}

		if(isset($next)){
			return json_encode(array(
					"Success" => "It worked",
					"next" => $next
				)
			);
		}else{
			return json_encode(array(
					"Success" => "It worked",
					"next" => ""
				)
			);
		}	
	}

	function normalizeNewsFeedObj($objArray, $account, $query){
		//echo "normal face stuff"; 
		//print_R($objArray);
		for($k = 0; $k < count($objArray); $k++){
			$obj = $objArray[$k];

			//print_r($obj); 

			$manager = new Manager();
			$builder = new facebookNewsFeedObjectBuilder();
			$manager->setBuilder($builder);

			$manager->parseActivityObj($obj, $account);

			$item = $manager->getActivityObj();

			//print_r($item); 

			$this->writeObject((array)$item, $query, "facebook");
		}
	}

	public function getFacebookQueryObjects(){
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

		if(count(explode("\"", $queryString)) > 2){
			$searchType = "quotes";
			$queryString = ltrim($queryString, "\"");
			$queryString = rtrim($queryString, "\"");
		}else{
			$searchType = "normal";
		}

		$searchArr = array(
			"from" => $from,
			"size" => $size,
			"query" => array(
				'bool' => array(
					"must" => array(
						//push stuff here
					)
				)
		    )
		);

		if($searchType == "normal"){
			$queryString = explode(" ", $queryString);
			//print_r($queryString);
			for($x = 0; $x < count($queryString); $x++){
				$temp = array('term' => array('facebookQuery' => $queryString[$x]));
				array_push($searchArr['query']['bool']['must'], $temp);
			}
		}else{
			$temp = array("match" => 
				array("facebookQuery" => 
					array(
						"query" => $queryString,
						"type" => "phrase"
					)
				)
			);
			array_push($searchArr['query']['bool']['must'], $temp);
		}

		//print_R($searchArr);

		$res = $es->search($searchArr);

		$res['from'] = $from;
	
		return json_encode($res);
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
		
		/*
		elseif($media == "LinkedIn"){
			$index = "socialreader";
			$host = "localhost";
			$port = "9200";
			$mapping = "people";
			$size = 1000;
			
			
			#USER FILTER SHOULD ONLY GET ONE RESPONSE PER
			$es = Client::connection("http://$host:$port/$index/$mapping/");
			$search = array(
				"query" => array(
					'term' => array(
						"user.lastName" => strtolower($name),
					)					
				),
				"filter" => array(
					"term" => array(
						"service" => strtolower($media)
					)
				)
			);

			$res = $es->search($search);
			
			if($res['hits']['total'] > 0){
				for($s = 0; $s < count($res['hits']['hits']); $s++){
					$returnObj[$s]['id'] = $res['hits']['hits'][$s]['_source']['user']['id'];
					$returnObj[$s]['username'] = $res['hits']['hits'][$s]['_source']['user']['name'];
					$returnObj[$s]['name'] = $res['hits']['hits'][$s]['_source']['user']['name'];
					$returnObj[$s]['bio/gender'] = $res['hits']['hits'][$s]['_source']['user']['bio'];
					$returnObj[$s]['searchable'] = $res['hits']['hits'][$s]['_source']['user']['id'];
				}
			}else{
				$returnObj['Error'] = "No Users were found by that name";
			}
			
		} */

	return json_encode($returnObj);

	}

}



