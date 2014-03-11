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

#SETTER
function writeObject($obj){
	$index = "app";
	$host = "localhost";
	$port = "9200";

	$es = Client::connection("http://$host:$port/$index/$index/");

	$grr = $es->index($obj, strtolower($obj['id']));
	print_r($grr); ?><br/><br/><?php
}

#GETTER
function getObject($id){
	$index = "app";
	$host = "localhost";
	$port = "9200";

	$es = Client::connection("http://$host:$port/$index/");
	$res = $es->get($id);
	return $res;
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

function linkedInFetch($method, $resource, $token) {
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

function linkedInFetchWithParams($method, $resource, $token, $start, $count) {
    $params = array('oauth2_access_token' => $token,
                    'format' => 'json',
		    'start' => $start,
		    'count' => $count
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

function getPeopleAttrs($token){
	$user = linkedInFetch('GET', '/v1/people/~:(firstName,lastName,id)', $token);
	
	$user = objectToArray($user);
	
	#print_r($user);
}

function getConnections($token){
	$users = linkedInFetch('GET', '/v1/people/~/connections', $token);
	
	$user = objectToArray($users);

	$userArray = array();
	for($x = 0; $x < count($user['values']); $x++){
		$obj = (array)($user['values'][$x]);
		
		$obj['location'] = (array)$obj['location'];
		$obj['location']['country'] = (array)$obj['location']['country'] ;
		
		array_push($userArray, $obj);
	};

	#print_r($userArray);
}

function normalizeNewsFeedObj($objArray){
	echo "There are " . count($objArray) . " objects in the timeline";  ?><br/><?php
	for($k = 0; $k < count($objArray); $k++){
			$obj = $objArray[$k];
			
			print_r($obj); ?><br/><br/><?php
			
			$manager = new Manager();
			$builder = new linkedInNetworkObjectBuilder();
			$manager->setBuilder($builder);
			
			$manager->parseActivityObj($obj);
			
			$item = $manager->getActivityObj();
			
			print_r($item); ?><br/><br/><?php

			writeObject((array)$item);
	}
}

function normalizeDiscussionObj($objArray){
	echo "There are " . count($objArray) . " discussion objects between all groups";  ?><br/><?php
	for($k = 0; $k < count($objArray); $k++){
			$obj = $objArray[$k];
			
			#print_r($obj); ?><br/><br/><?php
			
			$manager = new Manager();
			$builder = new linkedInNetworkObjectBuilder();
			$manager->setBuilder($builder);
			
			$manager->parseActivityObj($obj);
			
			$item = $manager->getActivityObj();
			
			print_r($item); ?><br/><br/><?php

			writeObject((array)$item);
	}
}

function getPersonalFeed($token){
	$feed = linkedInFetchWithParams('GET', '/v1/people/~/network/updates', $token, 0, 100);
	
	$feed = objectToArray($feed);
	
	#print_r($feed);
	
	normalizeNewsFeedObj($feed['values']);
}

function getDiscussionObjects($token){
	
	$user = linkedInFetch('GET', '/v1/people/~/group-memberships', $token);
	
	$user = objectToArray($user);
	
	#print_r($user);
	
	$groupArr = array();
	$counter = 0;
	for($z = 0; $z < count($user['values']); $z++){
		$groupPost = linkedInFetch('GET', '/v1/groups/'.$user['values'][$z]['group']['id'].'/posts:(creator:(first-name,last-name,picture-url,id,headline),title,summary,creation-timestamp,id,likes,comments,attachment:(image-url,content-domain,content-url,title,summary))', $token);
		$thing = objectToArray($groupPost);
		
		#print_r($thing);?><br/><br/><?php
		
		for($t = 0; $t < count($thing['values']); $t++){
			$groupArr[$counter]['networkObjectType'] = "DISCUSS";
			$groupArr[$counter]['timestamp'] = $thing['values'][$t]['creationTimestamp'];
			$groupArr[$counter]['id'] = $thing['values'][$t]['id'];
			
			$groupArr[$counter]['group']['name'] = $user['values'][$z]['group']['name'];
			$groupArr[$counter]['group']['id'] = $user['values'][$z]['group']['id'];
			$groupArr[$counter]['group']['status'] =  $user['values'][$z]['membershipState']['code'];
		
			$groupArr[$counter]['title'] = $thing['values'][$t]['title'];
			$groupArr[$counter]['summary'] = $thing['values'][$t]['summary'];
			$groupArr[$counter]['creator']['firstName'] = $thing['values'][$t]['creator']['firstName'];
			$groupArr[$counter]['creator']['lastName'] = $thing['values'][$t]['creator']['lastName'];
			$groupArr[$counter]['creator']['pictureUrl'] = $thing['values'][$t]['creator']['pictureUrl'];
			$groupArr[$counter]['creator']['headline'] = $thing['values'][$t]['creator']['headline'];
			$groupArr[$counter]['creator']['id'] = $thing['values'][$t]['creator']['id'];
			
			if($thing['values'][$t]['attachment'] != null){
				$groupArr[$counter]['attachment'][0]['contentDomain'] = $thing['values'][$t]['attachment']['contentDomain'];
				$groupArr[$counter]['attachment'][0]['contentUrl'] = $thing['values'][$t]['attachment']['contentUrl'];
				$groupArr[$counter]['attachment'][0]['imageUrl'] = $thing['values'][$t]['attachment']['imageUrl'];
				$groupArr[$counter]['attachment'][0]['summary'] = $thing['values'][$t]['attachment']['summary'];
				$groupArr[$counter]['attachment'][0]['title'] = $thing['values'][$t]['attachment']['title'];
			}else{
				$groupArr[$counter]['attachment'] = array();
			}
			
			$groupArr[$counter]['comments'] = array();
			for($x = 0; $x < $thing['values'][$t]['comments']['_total']; $x++){
				$groupArr[$counter]['comments'][$x]['person']['firstName'] = $thing['values'][$t]['comments']['values'][$x]['creator']['firstName'];
				$groupArr[$counter]['comments'][$x]['person']['lastName'] = $thing['values'][$t]['comments']['values'][$x]['creator']['lastName'];
				$groupArr[$counter]['comments'][$x]['person']['id'] = $thing['values'][$t]['comments']['values'][$x]['creator']['id'];
				$groupArr[$counter]['comments'][$x]['person']['headline'] = $thing['values'][$t]['comments']['values'][$x]['creator']['headline'];
				$groupArr[$counter]['comments'][$x]['person']['pictureUrl'] = $thing['values'][$t]['comments']['values'][$x]['creator']['pictureUrl'];
				$groupArr[$counter]['comments'][$x]['id'] = $thing['values'][$t]['comments']['values'][$x]['id'];
				$groupArr[$counter]['comments'][$x]['text'] = $thing['values'][$t]['comments']['values'][$x]['text'];
			}
			$groupArr[$counter]['likes'] = array();
			for($x = 0; $x < $thing['values'][$t]['likes']['_total']; $x++){
				$groupArr[$counter]['likes'][$x]['person']['firstName'] = $thing['values'][$t]['likes']['values'][$x]['person']['firstName'];
				$groupArr[$counter]['likes'][$x]['person']['lastName'] = $thing['values'][$t]['likes']['values'][$x]['person']['lastName'];
				$groupArr[$counter]['likes'][$x]['person']['id'] = $thing['values'][$t]['likes']['values'][$x]['person']['id'];
				$groupArr[$counter]['likes'][$x]['person']['headline'] = $thing['values'][$t]['likes']['values'][$x]['person']['headline'];
				$groupArr[$counter]['likes'][$x]['person']['pictureUrl'] = $thing['values'][$t]['likes']['values'][$x]['person']['pictureUrl'];
			}
		$counter++;
		}
	}
	normalizeDiscussionObj($groupArr);
}

$filename = "../../oAuth/linkedinToken.json";
$file = file_get_contents($filename) or die("Cannot open the file: " . $filename);
$obj = json_decode($file, true);

#getPeopleAttrs($obj['access_token']);
#getConnections($obj['access_token']);

getPersonalFeed($obj['access_token']);
#getDiscussionObjects($obj['access_token']);



?>