<?php
/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the redirect script that saves tokens and user data for logged in accounts to the app
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

require_once('../cron/logs/KLogger.php');

require_once('../vendor/autoload.php');
require_once('../cron/objects/authObject.php');

session_start();

	if(isset($_GET['code'])){		
	
		$code = $_GET["code"];
		$state = $_GET['state'];
		
		$url = 'https://graph.facebook.com/oauth/access_token';
		
		$credObj = file_get_contents("../serviceCreds.json");
		$credObj = json_decode($credObj, true);
		
		#with the new code we set up the post to get the accessToken from facebook
		$app = $credObj['facebook'][0];
		$params = array(
			"code" => $code,
			"client_id" => $app['key'],
			"client_secret" => $app['secret'],
			"redirect_uri" => $app['redir']
		);
		$tempApp = $credObj['facebook'][0]['accounts'];
		
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		#response should now be a json with the accessToken and refreshToken as a json string
		$response = curl_exec($ch);
		curl_close($ch);
		
		#make the response into an array we can use more easily
		$vars = explode('&', $response);
		$accessToken = explode('=', $vars[0]);
		$expires = explode('=', $vars[1]);
		
		$graph_url = "https://graph.facebook.com/me?access_token=" . $accessToken[1];
		$user = json_decode(file_get_contents($graph_url));
		
		$url = "https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=".$app['key']."&client_secret=".$app['secret']."&fb_exchange_token=".$accessToken[1];
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
			$found = "false";
			$open = 0;
			//check all accounts for this user if there are accounts
			if(isset($tempApp['accounts']) && count($tempApp['accounts']) > 0){
				for($j=0; $j<count($tempApp['accounts']); $j++){
					if($tempApp['accounts'][$j]['user'] == $user->id && $tempApp['accounts'][$j]['loginDisallow'] == "false"){
						//if we find the user $temp is now that user
						$temp = $tempApp['accounts'][$j];
						$found = "true";
						break;
					}
					if($tempApp['accounts'][$j]['authenticated'] == "false"){
						$open = $j;
					}
				}
				//if we loop through everyone and done find the user
				if($found == "false"){
					if($state == "outside"){
						header('Location: ../login.php?error=1&service=facebook');
						return;
					}
				}
			}else{
				$j = 0;
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
			$temp['authenticated'] = "true";
			$temp['loginDisallow'] = "false";
			if(!isset($temp['color'])){
				$temp['color'] = "#0066FF";
			}
			if(!isset($temp['uuid'])){
				$temp['uuid'] = uniqid();
			}
			
			if($found == "false"){
				$credObj['facebook'][0]['accounts'][$open] = $temp;
			}else{
				$credObj['facebook'][0]['accounts'][$j] = $temp;
			}
			
			file_put_contents("../serviceCreds.json", json_encode($credObj));

			header('Location: ../login.php?facebook=true');
		}else{
			//setting a cookie to an expired time will trigger removal by the browser
			setcookie ("facebookCook", "", time() - 3600, $_SERVER['HTTP_HOST'], 'clemson.edu', false, false);
			
			header('Location: ../login.php?error=2&service=facebook');
		}
	}
?>
