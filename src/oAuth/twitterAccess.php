<?php
require_once('../cron/logs/KLogger.php');
//$log   = KLogger::instance('../logs/oAuth');
//$logPrefix = '['.basename(__FILE__).']:';
require_once('../vendor/autoload.php');
require_once('../cron/objects/authObject.php');

/* Start session and load library. */
session_start();
require_once('twitteroauth/twitteroauth.php');

if(isset($_GET['appKey']) && isset($_GET['appSecret'])){
	//$log->logInfo("$logPrefix got appKey and appSecret.");
	/* Build TwitterOAuth object with client credentials. */
	$connection = new TwitterOAuth($_GET['appKey'], $_GET['appSecret']);
	
	/* Get temporary credentials. */
	$request_token = $connection->getRequestToken($_GET['twitterRedirect']);
	
	/* Save temporary credentials to session. */
	$_SESSION['oauth_token'] = $token = $request_token['oauth_token'];

	$_SESSION['oauth_token_secret'] = $request_token['oauth_token_secret'];

	$array = array(
		"appKey" => $_GET['appKey'],
		"appSecret" => $_GET['appSecret'],
		"redirectURL" => $_GET['twitterRedirect'],
		"oauthToken" => $_SESSION['oauth_token'],
		"oauthSecret" => $_SESSION['oauth_token_secret'],
		"color" => $_GET['color']
	);
	//$log->logInfo("$logPrefix array contains ",$array);
	$json = json_encode($array);
	
	$filename = "twitterClientInfo.txt";
	//$log->logInfo("$logPrefix attempting to write array to $filename.");

	$fp = fopen($filename, 'w') or die("Cannot open the file " . $filename);
	fwrite($fp, $json);
	fclose($fp);
	//$log->logInfo("$logPrefix wrote array to $filename.");
	
	switch ($connection->http_code) {
	  case 200:
	    /* Build authorize URL and redirect user to Twitter. */
	    //$log->logInfo("$logPrefix http_code is 200.");
	    $url = $connection->getAuthorizeURL($token);
	    header('Location: ' . $url);
	    break;
	  default:
	  	//$log->logInfo("$logPrefix http_code is not 200.");
	    /* Show notification if something went wrong. */
	    echo 'Could not connect to Twitter. Refresh the page or try again later.';
	    print_r($connection);
	  break;
	}
}

if(isset($_REQUEST['oauth_verifier'])){

	$filename = "twitterClientInfo.txt";
	$file = file_get_contents($filename);

	$obj = json_decode($file, true);
	
	$credObj = file_get_contents("../serviceCreds.json");
	$credObj = json_decode($credObj, true);
	
	$temp;
	for($g=0; $g<count($credObj['twitter']); $g++){
		if($credObj['twitter'][$g]['key'] == $obj['appKey']){
			$temp = $credObj['twitter'][$g];
			break;
		}
	}
	/* Create TwitteroAuth object with app key/secret and token key/secret from default phase */
	$connection = new TwitterOAuth($obj['appKey'], $obj['appSecret'], $obj['oauthToken'], $obj['oauthSecret']);
	/* Request access tokens from twitter */
	$access_token = $connection->getAccessToken($_REQUEST['oauth_verifier']);
	$account = $connection->get('account/verify_credentials');
	
	if(isset($access_token['oauth_token'])){
		$obj['accessToken'] = $access_token['oauth_token'];
		$obj['accessSecret'] = $access_token['oauth_token_secret'];
		
		if(isset($temp['user'])){
			//if the ids do not match
			if($temp['user'] != $account->id){
				//you are not the correct facebook user
				header('Location: ../login.php?error=1&service=twitter');
				//just to be safe return here
				return;
			}
		//else if the id is empty, this is the first time
		}
		
		if($credObj['login'] == "first"){
			$credObj['login'] = "second";
		}
		if($credObj['login'] == ""){
			$credObj['login'] = "first";
		}
					
		$temp['accessToken'] = $access_token['oauth_token'];
		$temp['accessSecret'] = $access_token['oauth_token_secret'];
		$temp['expiresAt'] = `date +%s`;
		$temp['user'] = $account->id;
		$temp['image'] = $account->profile_image_url;
		$temp['name'] = $account->screen_name;
		
		$credObj['twitter'][$g] = $temp;
		
		file_put_contents("../serviceCreds.json", json_encode($credObj));

		header('Location: ../login.php?twitter=true');
	}else{
		setcookie ("facebookCook", "", time() - 3600, $_SERVER['HTTP_HOST'], 'clemson.edu', false, false);
		
		header('Location: ../login.php?error=2&service=twitter');
	}	
}

?>
