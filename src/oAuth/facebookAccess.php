<?php
require_once('../cron/logs/KLogger.php');
//$log   = KLogger::instance('../logs/oAuth');
//$logPrefix = '['.basename(__FILE__).']:';
require_once('../vendor/autoload.php');
require_once('../cron/objects/authObject.php');

session_start();

	if(isset($_GET['code'])){		
	
		$code = $_GET["code"];
		$state = $_GET['state'];
		
		$url = 'https://graph.facebook.com/oauth/access_token';
		
		$credObj = file_get_contents("../serviceCreds.json");
		$credObj = json_decode($credObj, true);
		
		$temp;
		for($g=0; $g<count($credObj['facebook']); $g++){
			if($credObj['facebook'][$g]['key'] == $state){
				$temp = $credObj['facebook'][$g];
				break;
			}
		}
		
		#with the new code we set up the post to get the accessToken from google
		$params = array(
			"code" => $code,
			"client_id" => $temp['key'],
			"client_secret" => $temp['secret'],
			"redirect_uri" => $temp['redir']
		);
		
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		#response should now be a json with the accessToken and refreshToken as a json string
		$response = curl_exec($ch);
		curl_close($ch);
		
		//$log->logInfo("$logPrefix curl_exec complete, parsed params",$response);

		#make the response into an array we can use more easily
		$vars = explode('&', $response);
		$accessToken = explode('=', $vars[0]);
		$expires = explode('=', $vars[1]);
		
		$graph_url = "https://graph.facebook.com/me?access_token=" . $accessToken[1];
		$user = json_decode(file_get_contents($graph_url));
		
		$url = "https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=".$temp['key']."&client_secret=".$temp['secret']."&fb_exchange_token=".$accessToken[1];
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$response = curl_exec($ch);
		curl_close($ch);
		
		$arr = array();
		$one = explode("&", $response);
		for($x = 0; $x < count($one); $x++){
			$two = explode("=", $one[$x]);
			$arr[$two[0]] = $two[1];
		}

		if(isset($arr['access_token'])){
			if(isset($temp['user'])){
				//if the ids do not match
				if($temp['user'] != $user->id){
					//you are not the correct facebook user
					header('Location: ../login.php?error=1&service=facebook');
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
						
			$temp['accessToken'] = $arr['access_token'];
			$temp['expiresAt'] = $arr['expires'] + `date +%s`;
			$temp['user'] = $user->id;
			$temp['image'] = $user->id;
			$temp['name'] = $user->name;
			
			$credObj['facebook'][$g] = $temp;
			
			file_put_contents("../serviceCreds.json", json_encode($credObj));
			
			header('Location: ../login.php?facebook=true');
		}else{
			//setting a cookie to an expired time will trigger removal by the browser
			setcookie ("facebookCook", "", time() - 3600, $_SERVER['HTTP_HOST'], 'clemson.edu', false, false);
			
			header('Location: ../login.php?error=2&service=facebook');
		}
	}
?>
