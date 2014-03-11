<?php
require_once('../cron/logs/KLogger.php');
//$log   = KLogger::instance('../logs/oAuth');
//$logPrefix = '['.basename(__FILE__).']:';
require_once('../vendor/autoload.php');
require_once('../cron/objects/authObject.php');

session_start();

if(isset($_GET['code'])){
	$code = $_GET["code"];
	$state = $_GET["state"];
	
	$arr = explode("|||", $state);
	$key = $arr[0];
	$color = $arr[1];
	
	$grant = "authorization_code";
	
	$credObj = file_get_contents("../serviceCreds.json");
	$credObj = json_decode($credObj, true);
	
	$temp;
	for($g=0; $g<count($credObj['instagram']); $g++){
		if($credObj['instagram'][$g]['key'] == $key){
			$temp = $credObj['instagram'][$g];
			break;
		}
	}
	
	$params = array(
		"client_id" => $temp['key'],
		"client_secret" => $temp['secret'],
		"redirect_uri" => $temp['redir'],
		"code" => $code,
		"grant_type" => $grant,
	);

	$url = "https://api.instagram.com/oauth/access_token";
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$response = curl_exec($ch);
	curl_close($ch);
		
	$obj = json_decode($response, true);
	
	if($obj['access_token']){
		if(isset($temp['user'])){
			//if the ids do not match
			if($temp['user'] != $obj['user']['id']){
				//you are not the correct facebook user
				header('Location: ../login.php?error=1&service=instagram');
				//just to be safe return here
				return;
			}
		}
		
		if($credObj['login'] == "first"){
			$credObj['login'] = "second";
		}
		if($credObj['login'] == ""){
			$credObj['login'] = "first";
		}
					
		$temp['accessToken'] = $obj['access_token'];
		$temp['expiresAt'] = `date +%s`;
		$temp['user'] = $obj['user']['id'];
		$temp['image'] = $obj['user']['profile_picture'];
		$temp['name'] =  $obj['user']['username'];
		
		$credObj['instagram'][$g] = $temp;
		
		file_put_contents("../serviceCreds.json", json_encode($credObj));
		
		header('Location: ../login.php?instagram=true');
	}else{
		//setting a cookie to an expired time will trigger removal by the browser
		setcookie ("instagramCook", "", time() - 3600, $_SERVER['HTTP_HOST'], 'clemson.edu', false, false);
		
		header('Location: ../login.php?error=2&service=instagram');
	}
}
	
?>
