<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines server side group of function pertaining to app credentials
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

use \ElasticSearch\Client;
require_once('../../cron/objects/authObject.php');
require_once('../../oAuth/twitteroauth/twitteroauth.php');
require_once('RefreshGoogleToken.php');
require_once('authCalls.php');

class Credentials{
	public function checkCredentials(){
		$fileName = "appCredentialStatus.txt";

            $status = file_get_contents("../../cron/poller/" . $fileName);
            if($status == false){
                    echo json_encode($credentialObject = array(
                            "Linkedin" => array(
                                    "status" => "bad"
                            ),
                            "Twitter" => array(
                                    "status" => "bad"
                            ),
                            "Facebook" => array(
                                    "status" => "bad"
                            ),
                            "Instagram" => array(
                                    "status" => "bad"
                            )
                    ));
            }else{
                 return $status;   
            }
	}
	
	public function checkForServiceCreds(){
		try{
			$credObj = file_get_contents($_SERVER['SERVICECREDS']);
			$credObj = json_decode($credObj, true);
			foreach($credObj as $key => $value){
				if(count($credObj[$key]) > 0){
					return json_encode(array("status" => "true"));
				}
			}
			return json_encode(array("status" => "false"));
		}catch (Exception $e){
			return json_encode(array("status" => "false"));
		}
	}
	
	public function getServiceCreds(){
		$file = $_SERVER['SERVICECREDS'];
		$var = file_get_contents($file);

		return $var;
	}

	public function getAuthCreds(){
		$returnArr = array(
			"instagram" => array(),
			"facebook" => array(),
			"linkedin" => array(),
			"twitter" => array(),
			"google" => array()
		);

		$file = $_SERVER['SERVICECREDS'];
		$var = file_get_contents($file);
		$serviceCreds = json_decode($var, true);

		if(isset($serviceCreds['instagram'])){
			for($a=0; $a < count($serviceCreds['instagram']); $a++){
				for($d=0; $d < count($serviceCreds['instagram'][$a]['accounts']); $d++){
					if($serviceCreds['instagram'][$a]['accounts'][$d]['authenticated'] == "true"){
						$obj = $serviceCreds['instagram'][$a]['accounts'][$d];

						$url = 'https://api.instagram.com/v1/users/self/?&access_token=' . $obj['accessToken'];
						$ch = curl_init($url);
						curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
						$response = curl_exec($ch);
						curl_close($ch);

						$account;
						$responseObj = json_decode($response, true);
						if(isset($responseObj['data']['username'])){
							$account = array(
								"user" => $obj['user'],
								"status" => "good",
								"auth" => $serviceCreds['instagram'][$a]['auth'],
								"name" => $obj['name'],
								"image" => $obj['image'],
								"color" => $obj['color'],
								"loginDisallow" => $obj['loginDisallow'],
								"authenticated" => $obj['authenticated']
							);
						}else{
							$account = array(
								"user" => $obj['user'],
								"status" => "bad",
								"auth" => $serviceCreds['instagram'][$a]['auth'],
								"name" => $obj['name'],
								"image" => $obj['image'],
								"color" => $obj['color'],
								"loginDisallow" => $obj['loginDisallow'],
								"authenticated" => $obj['authenticated']
							);
						}
						array_push($returnArr['instagram'], $account);
					}else{
						$account = array(
							"status" => "unauthorized",
							"auth" => $serviceCreds['instagram'][$a]['auth'],
							"color" => $serviceCreds['instagram'][$a]['accounts'][0]['color']
						);
						array_push($returnArr['instagram'], $account);
					}
				}
			}
		}else{
			$account = array(
				"status" => "null"
			);
			array_push($returnArr['instagram'], $account);
		}
		
		if(isset($serviceCreds['google'])){
			for($a=0; $a < count($serviceCreds['google']); $a++){
				for($d=0; $d < count($serviceCreds['google'][$a]['accounts']); $d++){
					if($serviceCreds['google'][$a]['accounts'][$d]['authenticated'] == "true"){
						$obj = $serviceCreds['google'][$a]['accounts'][$d];
						
						$url = 'https://www.googleapis.com/plus/v1/people/me';
						$ch = curl_init($url);
						$headers = array('Authorization: Bearer ' . $obj['accessToken']);
						curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
						curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
						$response = curl_exec($ch);
						curl_close($ch);

						$account;
						$responseObj = json_decode($response, true);

						if(isset($responseObj['kind'])){
							$account = array(
								"user" => $obj['user'],
								"status" => "good",
								"auth" => $serviceCreds['google'][$a]['auth'],
								"name" => $obj['name'],
								"image" => $obj['image'],
								'expiresAt' => $obj['expiresAt'],
								"color" => $obj['color'],
								"loginDisallow" => $obj['loginDisallow'],
								"authenticated" => $obj['authenticated']
							);
						}else{
							$token = refreshGoogToken($obj['uuid']);
							$url = 'https://www.googleapis.com/plus/v1/people/me';
							$ch = curl_init($url);
							$headers = array('Authorization: Bearer ' . $token);
							curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
							curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
							$response = curl_exec($ch);
							curl_close($ch);
							$responseObj = json_decode($response, true);
							if(isset($responseObj['error'])){
								$account = array(
									"user" => $obj['user'],
									"status" => "bad",
									"auth" => $serviceCreds['google'][$a]['auth'],
									"name" => $obj['name'],
									"image" => $obj['image'],
									'expiresAt' => $obj['expiresAt'],
									"color" => $obj['color'],
									"loginDisallow" => $obj['loginDisallow'],
									"authenticated" => $obj['authenticated']
								);							
							}else{
								$account = array(
									"user" => $obj['user'],
									"status" => "good",
									"auth" => $serviceCreds['google'][$a]['auth'],
									"name" => $obj['name'],
									"image" => $obj['image'],
									'expiresAt' => $obj['expiresAt'],
									"color" => $obj['color'],
									"loginDisallow" => $obj['loginDisallow'],
									"authenticated" => $obj['authenticated']
								);
							}
						}
							
						array_push($returnArr['google'], $account);
					}else{
						$account = array(
							"status" => "unauthorized",
							"auth" => $serviceCreds['google'][$a]['auth'],
							"color" => $serviceCreds['google'][$a]['accounts'][0]['color']
						);
						array_push($returnArr['google'], $account);
					}
				}
			}
		}else{
			$account = array(
				"status" => "null"
			);
			array_push($returnArr['google'], $account);
		}
		
		if(isset($serviceCreds['facebook'])){
			for($a=0; $a < count($serviceCreds['facebook']); $a++){
				for($d=0; $d < count($serviceCreds['facebook'][$a]['accounts']); $d++){
					if($serviceCreds['facebook'][$a]['accounts'][$d]['authenticated'] == "true"){
						$obj = $serviceCreds['facebook'][$a]['accounts'][$d];

						$graph_url = "https://graph.facebook.com/me?access_token=" . $obj['accessToken'];
						$user = json_decode(file_get_contents($graph_url));

						$account;
						if(isset($user->id)){
							$account = array(
								"user" => $obj['user'],
								"status" => "good",
								"auth" => $serviceCreds['facebook'][$a]['auth'],
								"name" => $obj['name'],
								"color" => $obj['color'],
								"image" => $obj['image'],
								'expiresAt' => $obj['expiresAt'],
								"loginDisallow" => $obj['loginDisallow'],
								"authenticated" => $obj['authenticated']
							);
						}else{
							$account = array(
								"user" => $obj['user'],
								"status" => "bad",
								"auth" => $serviceCreds['facebook'][$a]['auth'],
								"name" => $obj['name'],
								"color" => $obj['color'],
								"image" => $obj['image'],
								'expiresAt' => $obj['expiresAt'],
								"loginDisallow" => $obj['loginDisallow'],
								"authenticated" => $obj['authenticated']
							);
						}
						array_push($returnArr['facebook'], $account);
					}else{					
						$account = array(
							"status" => "unauthorized",
							"auth" => $serviceCreds['facebook'][$a]['auth'],
							"color" => $serviceCreds['facebook'][$a]['accounts'][0]['color']
						);
						array_push($returnArr['facebook'], $account);
					}
				}
			}
		}else{
			$account = array(
				"status" => "null"
			);
			array_push($returnArr['facebook'], $account);
		}

		if(isset($serviceCreds['twitter'])){
			for($a=0; $a < count($serviceCreds['twitter']); $a++){
				for($d=0; $d < count($serviceCreds['twitter'][$a]['accounts']); $d++){
					if($serviceCreds['twitter'][$a]['accounts'][$d]['authenticated'] == "true"){
						$obj = $serviceCreds['twitter'][$a]['accounts'][$d];

						$oauth_Token = $obj['accessToken'];
						$access_secret = $obj['accessSecret'];
						$consumer_key = $serviceCreds['twitter'][$a]['key'];
						$consumer_secret = $serviceCreds['twitter'][$a]['secret'];

						$connection = new TwitterOAuth($consumer_key, $consumer_secret, $oauth_Token, $access_secret);

						$accounts = $connection->get('account/verify_credentials');

						$account;
						if(isset($accounts->name)){
							$account = array(
								"user" => $obj['user'],
								"status" => "good",
								"auth" => $serviceCreds['twitter'][$a]['auth'],
								"name" => $obj['name'],
								"image" => $obj['image'],
								"color" => $obj['color'],
								"loginDisallow" => $obj['loginDisallow'],
								"authenticated" => $obj['authenticated']
							);
						}else{
							$account = array(
								"user" => $obj['user'],
								"status" => "bad",
								"auth" => $serviceCreds['twitter'][$a]['auth'],
								"name" => $obj['name'],
								"image" => $obj['image'],
								"color" => $obj['color'],
								"loginDisallow" => $obj['loginDisallow'],
								"authenticated" => $obj['authenticated']
							);
						}
						array_push($returnArr['twitter'], $account);
					}else{
						$account = array(
							"status" => "unauthorized",
							"auth" => $serviceCreds['twitter'][$a]['auth'],
							"auth" => $serviceCreds['twitter'][$a]['accounts'][0]['color']
						);
						array_push($returnArr['twitter'], $account);
					}
				}
			}
		}else{
			$account = array(
				"status" => "null"
			);
			array_push($returnArr['twitter'], $account);
		}

		if(isset($serviceCreds['linkedin'])){
			for($a=0; $a < count($serviceCreds['linkedin']); $a++){
				for($d=0; $d < count($serviceCreds['linkedin'][$a]['accounts']); $d++){
					if($serviceCreds['linkedin'][$a]['accounts'][$d]['authenticated'] == "true"){
						$obj = $serviceCreds['linkedin'][$a]['accounts'][$d];

						$params = array(
							'oauth2_access_token' => $obj['accessToken'],
							'format' => 'json'
						);
						$url = 'https://api.linkedin.com/v1/people/~:(id)?' . http_build_query($params);
						$context = stream_context_create(
							array('http' => 
								array('method' => 'GET')
							)
						);

						try{
							$response = file_get_contents($url, false, $context);
							$user = json_decode($response, true);
						}catch(Exception $e){
							$user = array();
						}

						$account;
						if(isset($user['id'])){
							$account = array(
								"user" => $obj['user'],
								"status" => "good",
								"auth" => $serviceCreds['linkedin'][$a]['auth'],
								"name" => $obj['name'],
								"image" => $obj['image'],
								"color" => $obj['color'],
								'expiresAt' => $obj['expiresAt'],
								"loginDisallow" => $obj['loginDisallow'],
								"authenticated" => $obj['authenticated']
							);
						}else{
							$account = array(
								"user" => $obj['user'],
								"status" => "bad",
								"auth" => $serviceCreds['linkedin'][$a]['auth'],
								"name" => $obj['name'],
								"image" => $obj['image'],
								"color" => $obj['color'],
								'expiresAt' => $obj['expiresAt'],
								"loginDisallow" => $obj['loginDisallow'],
								"authenticated" => $obj['authenticated']
							);
						}
						array_push($returnArr['linkedin'], $account);
					}else{
						$account = array(
							"status" => "unauthorized",
							"auth" => $serviceCreds['linkedin'][$a]['auth'],
							"color" => $serviceCreds['linkedin'][$a]['accounts'][0]['color']
						);
						array_push($returnArr['linkedin'], $account);
					}
				}
			}
		}else{
			$account = array(
				"status" => "null"
			);
			array_push($returnArr['linkedin'], $account);
		}

		return json_encode($returnArr);
	}

	public function accountReset(){
		$index = "auth";
		$host = "localhost";
		$port = "9200";

		$es = Client::connection("http://$host:$port/$index/$index");
	        $authObj = $es->delete("authItem");

		$authObj = new authObject();
		$authObj = objectToArray($authObj);
		$var = $es->index($authObj, "authItem");
	}

	public function appFactoryReset(){
		$host = "localhost";
		$port = "9200";
		$index1 = "app";
		$index2 = "client";
		$index3 = "auth";

		$es = Client::connection("http://$host:$port/$index1/$index1");
		$es->delete();
		$es = Client::connection("http://$host:$port/$index2/$index2");
		$es->delete();
		$es = Client::connection("http://$host:$port/$index3/$index3");
		$es->delete();

		$mapCommand = "curl -XPUT 'http://$host:$port/app' -d ../../@app_mapping.json";
		$output = shell_exec($mapCommand);

		$mapCommand = "curl -XPUT 'http://$host:$port/client' -d ../../@client_mapping.json";
		$output = shell_exec($mapCommand);

		$mapCommand = "curl -XPUT 'http://$host:$port/auth' -d ../../@auth_mapping.json";
		$output = shell_exec($mapCommand);

		$es = Client::connection("http://$host:$port/$index3/$index3");
	        $authObj = $es->delete("authItem");

		$authObj = new authObject();
		$authObj = objectToArray($authObj);
		$var = $es->index($authObj, "authItem");
	}
}

?>