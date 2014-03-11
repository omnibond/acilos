<?php

require_once('../../cron/objects/clientBaseObject.php');
require_once('../../oAuth/twitteroauth/twitteroauth.php');
require_once('../../vendor/autoload.php');

use \ElasticSearch\Client;

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

class LocationData{
	function writeClient($obj){
		echo "writeClient";
		global $log;
		global $logPrefix;
		$index = "client";
		$host = "localhost";
		$port = "9200";

		$es = Client::connection("http://$host:$port/$index/$index/");
		$grr = $es->index($obj, $obj['data']['id']);
		}

		function linkedInFetch($method, $resource, $token) {
		echo "linkedInFetch"; ?><br/><?php

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

		function getClients(){
		echo "getClients"; ?><br/><?php

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

		$index = "client";
		$host = "localhost";
		$port = "9200";

		$es = Client::connection("http://$host:$port/$index/");
		$res = $es->get($id);
		return $res;
	}

	function getAroundMe(){
		if(isset($_GET['call'])){
			$call = $_GET['call'];
		}
		if(isset($_GET['location'])){
			$location = $_GET['location'];
		}

		/*$call = $_GET['call'];
		$location = $_GET['place'];*/

		$filename = "../../oAuth/instaToken.txt";
		$file = file_get_contents($filename) or die("Cannot open the file: " . $filename);
		$obj = json_decode($file, true);

		$returnObj = array();
		switch ($call){
			case "InstagramLocal":
				$latlng = getGeoLocation($location);
				$arr = explode("#", $latlng);

				$params = "&lat=" . $arr[0] . "&lng=" . $arr[1] . "&distance=5000";

				$url = "https://api.instagram.com/v1/media/search?access_token=" . $obj['access_token'] . $params;
				
				$ch = curl_init($url);
				curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
				$response = curl_exec($ch);
				curl_close($ch);
				
				$var = json_decode($response, true);
				
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
				
				return json_encode($returnObj);
			break;
			case "Foursquare":
				$latlng = getGeoLocation($location);

				$arr = explode("#", $latlng);
				
				$params = "&lat=" . $arr[0] . "&lng=" . $arr[1] . "&distance=5000";
				
				#instagram will query the foursquare API and return an ID for the location chosen
				#then maybe use that ID to get recent media in a location
				$url = "https://api.instagram.com/v1/locations/search?access_token=" . $obj['access_token'] . $params;
				$ch = curl_init($url);
				curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
				$response = curl_exec($ch);
				curl_close($ch);
				
				$var = json_decode($response, true);
				for($h = 0; $h < count($var['data']); $h++){
					$object['latlng'] = $var['data'][$h]['latitude'] . "#" . $var['data'][$h]['longitude'];
					$object['user']['username'] = $var['data'][$h]['name'];
					$object['id'] = $var['data'][$h]['id'];
					
					array_push($returnObj, $object);
				}
				
				return json_encode($returnObj);
			break;
			default:
				echo "";				
			break;
		}
	}

	function getFriendsList($service){
		echo "getFriendsList"; ?><br/><?php

		$returnArr = array();
		switch ($service){
			case "Facebook":
				echo "case \"Facebook\""; ?><br/><?php
				$filename = "../../oAuth/facebookToken.txt";
				if(($file = file_get_contents($filename)) == false){
					echo ("Cannot open the file: " . $filename);
				}else{
					$obj = json_decode($file, true);
					
					$url = 'https://graph.facebook.com/me/friends?fields=id,name,location,hometown&access_token=' . $obj['access_token'];
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
							$user = array(
								'id' => $var['data'][$x]['id'],
								'givenName' => $var['data'][$x]['name'],
								'displayName' => $var['data'][$x]['name'],
								'service' => 'Facebook',
								'about' => array(
									'description' => "",
									'link' => "https://facebook.com/".$var['data'][$x]['id'],
									'givenName' => $var['data'][$x]['name'],
									'location' => $var['data'][$x]['location']['name'],
									'displayName' => $var['data'][$x]['name'],
									'hometown' => $var['data'][$x]['hometown']['name']
								)
							);
							array_push($returnArr, $user);
						}
					}
				}
			break;
			case "Twitter":
				echo "case \"Twitter\""; ?><br/><?php
				$filename = "../../oAuth/twitterClientInfo.txt";
				if(($file = file_get_contents($filename)) == false){
					echo "Cannot open file $filename";
				}else{

					$obj = json_decode($file, true);
					
					/* Create TwitteroAuth object with app key/secret and token key/secret from default phase */
					$connection = new TwitterOAuth($obj['appKey'], $obj['appSecret'], $obj['accessToken'], $obj['accessSecret']);
					$connection->host = "https://api.twitter.com/1.1";

					$method = "/friends/list";
					$var = $connection->get($method);
					
					if($var->errors){
						$returnArr = array("false" => $var->errors[0]->message);
					}else{
						$data = objectToArray($var->users);
						$returnArr = array();
						for($x = 0; $x < count($data); $x++){
							if($data[$x]['url'] == "" || $data[$x]['url'] == null){
								$link = "https://www.twitter.com/" . $data[$x]['screen_name'];
							}else{
								$link = $data[$x]['url'];
							}
							$user = array(
								'id' => $data[$x]['id'],
								'givenName' => $data[$x]['name'],
								'displayName' => $data[$x]['screen_name'],
								'service' => 'Twitter',
								'about' => array(
									'description' => $data[$x]['description'],
									'link' => $link,
									'givenName' => $data[$x]['name'],
									'location' => $data[$x]['description']['location'],
									'displayName' => $data[$x]['screen_name']
								)
							);
							array_push($returnArr, $user);
						}
					}
				}
			break;
			case "Instagram":
			echo "case \"Instagram\""; ?><br/><?php
				$filename = "../../oAuth/instaToken.txt";
				if(($file = file_get_contents($filename)) == false){
					echo(json_encode($returnArr['Instagram'] = array("false" =>"Cannot open the file")));
				}else{
					$obj = json_decode($file, true);
					
					$url = "https://api.instagram.com/v1/users/".$obj['user_id']."/follows?access_token=".$obj['access_token'];
					
					$ch = curl_init($url);
					
					curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
					$res = curl_exec($ch);
					curl_close($ch);
					
					$var = json_decode($res, true);
					if($var['meta']['code'] != 200){
						$returnArr = array("false" => array());
					}else if($var['data']){
						$returnArr = array();
						for($x = 0; $x < count($var['data']); $x++){
							if($var['data'][$x]['website'] == "" || $var['data'][$x]['website'] == null){
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
									'link' => $link,
									'givenName' => $var['data'][$x]['full_name'],
									'location' => '',
									'displayName' => $var['data'][$x]['username']
								)
							);
							array_push($returnArr, $user);
						}
					}else{
						$returnArr = array("false" => array());
					}
				}
			break;
			case "LinkedIn":
			echo "case \"LinkedIn\""; ?><br/><?php
				$filename = "../../oAuth/linkedinUserCreds.txt";
				if(($file = file_get_contents($filename)) == false){
					echo("Cannot open the file: " . $filename);
				}else{
					$obj = json_decode($file, true);
					
					$user = linkedInFetch('GET', '/v1/people/~/connections', $obj['access_token'], true);
					
					$user = objectToArray($user);
					
					if($user['error']){
						$returnArr = array("false" => array());
					}else{
						$returnArr = array();
						for($x = 0; $x < count($user['values']); $x++){
							$client = array(
								'id' => $user['values'][$x]['id'],
								'givenName' => $user['values'][$x]['firstName'] . " " . $user['values'][$x]['lastName'],
								'displayName' => $user['values'][$x]['firstName'] . " " . $user['values'][$x]['lastName'],
								'service' => 'LinkedIn',
								'about' => array(
									'description' => $user['values'][$x]['headline'] . " - " . $user['values'][$x]['industry'],
									'link' => $user['values'][$x]['siteStandardProfileRequest']['url'],
									'givenName' => $user['values'][$x]['firstName'] . " " . $user['values'][$x]['lastName'],
									'location' => $user['values'][$x]['location']['name'] . ", " . $user['values'][$x]['location']['country']['code'],
									'displayName' => $user['values'][$x]['firstName'] . " " . $user['values'][$x]['lastName']
								)
							);
							array_push($returnArr, $client);
						}

					}
				}
			break;
			default:
				$returnArr['Default'] = array("success" => "false", "msg" => "Default switch option");
			break;
		}
		#print_r(json_encode($returnArr));
		return json_encode($returnArr);
	}

	#$var = getFriendsList("Facebook");
	#$var = getFriendsList("Twitter");
	#$var = getFriendsList("LinkedIn");
	#$var = getFriendsList("Instagram");

	#$var = json_decode($var, true);
	#print_r(count($var));
	#for($x = 0; $x < count($var); $x++){
	#	print_r($var[$x]); 
	#}

	#print_r($var);

	/*$obj = getAroundMe("InstagramLocal", "Clemson, SC");

	print_r(json_decode($obj));*/
	###CHANGES
	#facebook has a hometown now in the about field $user->about->hometown
	#worked on getting media from a certain location from an instagram endpoint
}


?>