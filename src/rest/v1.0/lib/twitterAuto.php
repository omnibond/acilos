<?php
require_once('../../../oAuth/twitteroauth/twitteroauth.php');
require_once('../../../cron/objects/activityObject.php');
require_once('ObjectToArray.php');

function queryTwitter(){
	$query = "test";
	
	$file = file_get_contents('../../../serviceCreds.json');
	$credObj = json_decode($file, true);
	
	$oauth_Token = $credObj['twitter'][0]['accounts'][0]['accessToken'];
	$consumer_key = $credObj['twitter'][0]['accounts'][0]['key'];
	$consumer_secret = $credObj['twitter'][0]['accounts'][0]['secret'];
	$access_secret = $credObj['twitter'][0]['accounts'][0]['accessSecret'];

	$connection = new TwitterOAuth($consumer_key, $consumer_secret, $oauth_Token, $access_secret);
	//make the twitter request
	$status = $connection->get('search/tweets', array('q' => urlencode($query), 'count' => 1));
	$status = objectToArray($status);

	if(isset($status['errors'])){		
		return json_encode(array("Error" => $status['errors'][0]['message']));
	}else{
		if(isset($status['statuses'])){
			if(isset($status['statuses'][0])){
				if(isset($status['statuses'][0]['id_str'])){
					return $status['statuses'][0]['id_str'];
				}else{
					return json_encode(array("Error" => "Error getting a random tweet"));
				}
			}else{
				return json_encode(array("Error" => "Error getting a random tweet"));
			}
		}else{
			return json_encode(array("Error" => "Error getting a random tweet"));
		}
	}	
}
	
$tweetID = queryTwitter();
print_r($tweetID);

?>