<?php

use \ElasticSearch\Client;
require_once('../../cron/objects/authObject.php');
require_once('../../oAuth/twitteroauth/twitteroauth.php');

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
	
	public function getServiceCreds(){
		$file = "../../serviceCreds.json";
		$var = file_get_contents($file);

		return $var;
	}
	
	public function getAuthCreds(){
		$returnArr = array(
			"instagram" => array(),
			"facebook" => array(),
			"linkedin" => array(),
			"twitter" => array()
		);
		
		$file = "../../serviceCreds.json";
		$var = file_get_contents($file);
		$serviceCreds = json_decode($var, true);
		
		if(isset($serviceCreds['instagram'])){
			for($a=0; $a < count($serviceCreds['instagram']); $a++){
				if(isset($serviceCreds['instagram'][$a]['accessToken'])){
					$obj = $serviceCreds['instagram'][$a];
					
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
							"auth" => $obj['auth'],
							"name" => $obj['name'],
							"image" => $obj['image'],
							"color" => $obj['color']
						);
					}else{
						$account = array(
							"user" => $obj['user'],
							"status" => "bad",
							"auth" => $obj['auth'],
							"name" => $obj['name'],
							"image" => $obj['image'],
							"color" => $obj['color']
						);
					}
					array_push($returnArr['instagram'], $account);
				}else{
					$account = array(
						"status" => "unauthorized",
						"auth" => $serviceCreds['instagram'][$a]['auth'],
						"color" => $serviceCreds['instagram'][$a]['color']
					);
					array_push($returnArr['instagram'], $account);
				}
			}
		}else{
			$account = array(
				"status" => "null"
			);
			array_push($returnArr['instagram'], $account);
		}
		
		if(isset($serviceCreds['facebook'])){
			for($a=0; $a < count($serviceCreds['facebook']); $a++){
				if(isset($serviceCreds['facebook'][$a]['accessToken'])){
					$obj = $serviceCreds['facebook'][$a];
					
					$graph_url = "https://graph.facebook.com/me?access_token=" . $obj['accessToken'];
					$user = json_decode(file_get_contents($graph_url));
					
					$account;
					if(isset($user->id)){
						$account = array(
							"user" => $obj['user'],
							"status" => "good",
							"auth" => $obj['auth'],
							"name" => $obj['name'],
							"color" => $obj['color'],
							"image" => $obj['image'],
							'expiresAt' => $obj['expiresAt']
						);
					}else{
						$account = array(
							"user" => $obj['user'],
							"status" => "bad",
							"auth" => $obj['auth'],
							"name" => $obj['name'],
							"color" => $obj['color'],
							"image" => $obj['image'],
							'expiresAt' => $obj['expiresAt']
						);
					}
					array_push($returnArr['facebook'], $account);
				}else{					
					$account = array(
						"status" => "unauthorized",
						"auth" => $serviceCreds['facebook'][$a]['auth'],
						"color" => $serviceCreds['facebook'][$a]['color']
					);
					array_push($returnArr['facebook'], $account);
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
				if(isset($serviceCreds['twitter'][$a]['accessToken'])){
					$obj = $serviceCreds['twitter'][$a];
					
					$oauth_Token = $obj['accessToken'];
					$access_secret = $obj['accessSecret'];
					$consumer_key = $obj['key'];
					$consumer_secret = $obj['secret'];
					
					$connection = new TwitterOAuth($consumer_key, $consumer_secret, $oauth_Token, $access_secret);

					$accounts = $connection->get('account/verify_credentials');
					
					$account;
					if(isset($accounts->name)){
						$account = array(
							"user" => $obj['user'],
							"status" => "good",
							"auth" => $obj['auth'],
							"name" => $obj['name'],
							"image" => $obj['image'],
							"color" => $obj['color']
						);
					}else{
						$account = array(
							"user" => $obj['user'],
							"status" => "bad",
							"auth" => $obj['auth'],
							"name" => $obj['name'],
							"image" => $obj['image'],
							"color" => $obj['color']
						);
					}
					array_push($returnArr['twitter'], $account);
				}else{
					$account = array(
						"status" => "unauthorized",
						"auth" => $serviceCreds['twitter'][$a]['auth'],
						"color" => $serviceCreds['twitter'][$a]['color']
					);
					array_push($returnArr['twitter'], $account);
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
				if(isset($serviceCreds['linkedin'][$a]['accessToken'])){
					$obj = $serviceCreds['linkedin'][$a];
					
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
					$response = file_get_contents($url, false, $context);
					$user = json_decode($response, true);
					
					$account;
					if(isset($user['id'])){
						$account = array(
							"user" => $obj['user'],
							"status" => "good",
							"auth" => $obj['auth'],
							"name" => $obj['name'],
							"image" => $obj['image'],
							"color" => $obj['color'],
							'expiresAt' => $obj['expiresAt']
						);
					}else{
						$account = array(
							"user" => $obj['user'],
							"status" => "bad",
							"auth" => $obj['auth'],
							"name" => $obj['name'],
							"image" => $obj['image'],
							"color" => $obj['color'],
							'expiresAt' => $obj['expiresAt']
						);
					}
					array_push($returnArr['linkedin'], $account);
				}else{
					$account = array(
						"status" => "unauthorized",
						"auth" => $serviceCreds['linkedin'][$a]['auth'],
						"color" => $serviceCreds['linkedin'][$a]['color']
					);
					array_push($returnArr['linkedin'], $account);
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
