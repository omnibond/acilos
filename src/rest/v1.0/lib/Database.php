<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines server side group of function pertaining to Database calls
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

require_once('../../vendor/autoload.php');
require_once('../../cron/objects/authObject.php');
require_once('counts.php');
require_once('S3Functions.php');
require_once('EC2Functions.php');

use \ElasticSearch\Client;

class Database{

	public function writeObject($obj){
		$index = "app";
		$host = "localhost";
		$port = "9200";

		$es = Client::connection("http://$host:$port/$index/$index/");

		$grr = $es->index($obj, $obj['id']);
	}

    public function restart(){
        $count = `ps -ef | grep -c elasticsearch`;
        if($count == 3){
            return json_encode(array("success" => "running"));
        }elseif($count == 2){
			exec('sh ../../cron/esHeartbeat.sh');
            return json_encode(array("success" => "started"));
        }else{
            return json_encode(array("error" => "Not going to matter what is here"));
        }
    }

	public function getHostSystem(){
		$var = exec("uname -a | grep amzn1");
		if($var != ""){
			$instance = "amazon";
		}else{
			$instance = "other";
		}
		return json_encode(array("system" => $instance));
	}

	public function rebootHostSystem(){
		#file get contents must originate from an amazon instance. 
		$var = exec("wget -q -O - http://169.254.169.254/latest/meta-data/instance-id");
		if($var != ""){
			exec("ec2-reboot-instances" . $var);
		}else{
			//exec("sudo reboot");
		}
		return json_encode(array("response" => "if this worked, you wont get this message"));
	}

	public function getAmazonInstances(){
		$var = getInstances();
		return json_encode($var);
	}

    public function checkForNewItems(){
        $feedName = $_GET['feed'];
        $fileName = "../../app/util/layout.json";
        
        if($feedName == "All Feed Data"){
                $var = countAll();
                return $var;
        }else{  
            if(($fileContents = file_get_contents($fileName)) == false){
                  echo json_encode(array("error" => "Cannot get the file"));
            }elseif(($layout = json_decode($fileContents, true)) == false){
                    echo json_encode(array("error" => "Cannot decode the file"));
            }elseif(($feed = $layout['feedList'][$feedName]) == false){
                    echo json_encode(array("error" => "Feed not found in database"));
            }else{
                #feed will be a list of the friends names that are in that feed
                #must find all usernames for that friend, then pass that to matchSpec
                #make an array of all the friends usernames as they will be the query params for ES
                $friendArr = array();
                for($g=0;$g<count($feed); $g++){
                    if($layout['friendList'][$feed[$g]]){
                        for($h=0; $h<count($layout['friendList'][$feed[$g]]); $h++){
                            $strings = explode(":", $layout['friendList'][$feed[$g]][$h]);
                            array_push($friendArr, $strings[2]);
                        }
                    }
                }
                $var = countSpecificUser($friendArr);
                return $var;
            }
        }
    }

	function deleteItem(){
		$var = file_get_contents("php://input");
		$obj = json_decode($var, true);

		$index = "app";
		$host = "localhost";
		$port = "9200";

		$es = Client::connection("http://$host:$port/$index/$index");
		$res = $es->delete($obj['id']);

		if(isset($res['ok'])){
			return "success";
		}else{
			return "error";
		}
	}

	function deleteAll(){
		$var = file_get_contents("php://input");
		$obj = json_decode($var, true);

		$index = "app";
		$host = "localhost";
		$port = "9200";

		$es = Client::connection("http://$host:$port/$index/$index");

		foreach ($obj['obj'] as $key => $value){
			$res = $es->delete($key);
		}

		$es->refresh();

		return json_encode(array("success"));

	}

	function getBackUpCounts(){		
		$oneWeek = (60 * 60 * 24) * 7;
		$twoWeeks = (60 * 60 * 24) * 14;
		$threeWeeks = (60 * 60 * 24) * 21;
		$oneMonth = (60 * 60 * 24) * 30;

		$uno = getCountByDate($oneWeek);
		$uno = json_decode($uno, true);
		$dos = getCountByDate($twoWeeks);
		$dos = json_decode($dos, true);
		$tres = getCountByDate($threeWeeks);
		$tres = json_decode($tres, true);
		$cuatro = getCountByDate($oneMonth);
		$cuatro = json_decode($cuatro, true);
		$all = countAll();		
		$all = json_decode($all, true);	

		$response = array();
		$response["one"] = $uno['count'];
		$response["two"] = $dos['count'];
		$response["three"] = $tres['count'];
		$response["four"] = $cuatro['count'];
		$response["all"] = $all['count'];

		return json_encode($response);
	}

	function backUpDB(){
		$var = file_get_contents("php://input");
		$obj = json_decode($var, true);

		$res = "";

		$time = $obj['time'];
		$size = $obj['size'];

		switch($time){
			case 1:
				$oneWeek = (60 * 60 * 24) * 7;
				$res = backUp($oneWeek, $size);
			break;
			case 2:
				$twoWeeks = (60 * 60 * 24) * 14;
				$res = backUp($twoWeeks, $size);
			break;
			case 3:
				$threeWeeks = (60 * 60 * 24) * 21;
				$res = backUp($threeWeeks, $size);
			break;
			case 4:
				$oneMonth = (60 * 60 * 24) * 30;
				$res = backUp($oneMonth, $size);
			break;
			case 5:
				$res = backUp("everything", $size);
			break;
		}

		//make one array of ids to delete with and one array of the data to save
		$writeArr = array();
		$idArr = array();
		for($x = 0; $x < count($res['hits']['hits']); $x++){
			array_push($writeArr, $res['hits']['hits'][$x]['_source']);
			$idArr[$res['hits']['hits'][$x]['_source']['id']] = 1;
		}
		$fileName = "file-".time()."-".$size.".json";
		$path = '../../app/manDatabase/backups/';
		//save the data to file with writeArr
		file_put_contents($path.$fileName, json_encode($writeArr));

		//delete saved data from app with uidArr
		deleteAllBackedUp($idArr);

		uploadS3File($path, $fileName);

		unlink(realpath($path.$fileName));

		return json_encode(array("file" => $fileName));
	}

	function getBackUpList(){
		$fileArr = getAllS3Files();
		return json_encode($fileArr);	
	}

	function manualCrons(){
		$ctx = stream_context_create(array(
		    'http' => array(
			'timeout' => 1
			)
		    )
		);
		file_get_contents("http://".$_SERVER['HTTP_HOST']."/cron/poller/cronManager.php", 0, $ctx);
		file_get_contents("http://".$_SERVER['HTTP_HOST']."/cron/poller/clientManager.php", 0, $ctx);
	}

	function restoreBackUpData(){
		$var = file_get_contents("php://input");
		$obj = json_decode($var, true);

		$fileName = $obj['file'];

		$dataStr = restoreS3File($fileName);

		$object = json_decode($dataStr, true);

		if($object['version'] == "1.0"){
			for($y = 0; $y < count($object['data']); $y++){
				$this->writeObject($object['data'][$y]);
			}
			return json_encode(array("file" => $object['name']));
		}else{
			return json_encode(array("error" => "This file version is not up to date"));
		}
	}
	
	public function saveNewAccount(){
		$var = file_get_contents("php://input");
		$obj = json_decode($var, true);
		$credObj;		

		try{
			$credObj = file_get_contents("../../serviceCreds.json");
			$credObj = json_decode($credObj, true);
		}catch (Exception $e){
			$credObj = array(
				"facebook" => array(),
				"twitter" => array(),
				"linkedin" => array(),
				"instagram" => array(),
				"google" => array(),
				"login" => "first"
			);
			file_put_contents("../../serviceCreds.json", json_encode($credObj));
		}
		
		$color = $obj['color'];
		$loginDisallow = $obj['login'];
		$authenticated = $obj['auth'];
		$param = $obj['param'];
		$id = uniqid();
		
		$temp = array(
			"color" => $color,
			"loginDisallow" => $loginDisallow,
			"authenticated" => $authenticated,
			"uuid" => $id
		);
		array_push($credObj[$param][0]['accounts'], $temp);

		file_put_contents("../../serviceCreds.json", json_encode($credObj));

		return json_encode(array("success" => "App Saved"));		
	}
	
	public function saveServiceCredsObj(){
		$var = file_get_contents("php://input");
		$obj = json_decode($var, true);
		$credObj;		

		try{
			$credObj = file_get_contents("../../serviceCreds.json");
			$credObj = json_decode($credObj, true);
		}catch (Exception $e){
			$credObj = array(
				"facebook" => array(),
				"twitter" => array(),
				"linkedin" => array(),
				"instagram" => array(),
				"google" => array(),
				"login" => "first"
			);
			file_put_contents("../../serviceCreds.json", json_encode($credObj));
		}

		if(count($credObj[$obj['param']]) > 0){
			for($x = 0; $x < count($credObj[$obj['param']]); $x++){
				for($f = 0; $f < count($credObj[$obj['param']]); $f++){
					if($credObj[$obj['param']][$x]['key'] == $obj['key']){
						$exists = true;
						return json_encode(array("error" => "You have already saved this app Id/Secret combo"));
					}
				}
			}			
		}

		$authLink = '';
		if($obj['param'] == "linkedin"){
			$scope = "rw_groups r_fullprofile r_contactinfo r_network r_basicprofile rw_nus w_messages";
			$authLink = $obj['redir']."?apiKey=".$obj['key']."&secretKey=".$obj['secret']."&lredirect_uri=".$obj['redir']."&scope=".$scope;
		}
		if($obj['param'] == "twitter"){
			$authLink = $obj['redir']."?appKey=".$obj['key']."&appSecret=".$obj['secret']."&twitterRedirect=".$obj['redir'];
		}
		if($obj['param'] == "facebook"){
			$scope = "friends_location,friends_hometown,user_hometown,user_location,publish_actions,publish_stream,read_stream,read_friendlists,friends_birthday,friends_religion_politics,email,user_likes,friends_likes,manage_notifications";
			$authLink = "https://www.facebook.com/dialog/oauth?client_id=".$obj['key']."&redirect_uri=".$obj['redir']."&scope=".$scope."&state=".$obj['key'];
		}
		if($obj['param'] == "instagram"){
			$scope = "relationships likes comments";
			$authLink = "https://api.instagram.com/oauth/authorize/?client_id=".$obj['key']."&redirect_uri=".$obj['redir']."&response_type=code&scope=".$scope."&state=".$obj['key'];
		}
		if($obj['param'] == "google"){
			$scope = "https://www.googleapis.com/auth/plus.stream.read,https://www.googleapis.com/auth/plus.stream.write,https://www.googleapis.com/auth/plus.media.upload,https://www.googleapis.com/auth/plus.me,https://www.googleapis.com/auth/plus.circles.read,https://www.googleapis.com/auth/plus.circles.write,https://www.googleapis.com/auth/plus.login";
			$authLink = $obj[$key]['redir']."?apiKey=".$obj[$key]['key']."&secretKey=".$obj[$key]['secret']."&redirect_uri=".$obj[$key]['redir']."&scope=".$scope;
		}
		
		$temp = array(
			"key" => $obj['key'],
			"secret" => $obj['secret'],
			"redir" => $obj['redir'],
			"auth" => $authLink,
			"accounts" => array()
		);
		array_push($credObj[$obj['param']], $temp);


		file_put_contents("../../serviceCreds.json", json_encode($credObj));

		return json_encode(array("success" => "App Saved"));
	}
	
	public function deleteServiceCred(){
		$var = file_get_contents("php://input");
		$obj = json_decode($var, true);
		$obj = $obj['obj'];
		$credObj;
		
		try{
			$credObj = file_get_contents("../../serviceCreds.json");
			$credObj = json_decode($credObj, true);
		}catch (Exception $e){
			$credObj = array(
				"facebook" => array(),
				"twitter" => array(),
				"linkedin" => array(),
				"instagram" => array(),
				"google" => array(),
				"login" => "first"
			);
			file_put_contents("../../serviceCreds.json", json_encode($credObj));
		}
		
		if(count($credObj[$obj['param']]) > 0){
			for($x = 0; $x < count($credObj[$obj['param']]); $x++){
				if($credObj[$obj['param']][$x]["key"] == $obj["key"]){
					array_splice($credObj[$obj['param']], $x, 1);
					break;
				}
			}			
		}

		file_put_contents("../../serviceCreds.json", json_encode($credObj));

		return json_encode(array("success" => "Authenticator Deleted"));
	}
	
	public function deleteAccountCred(){
		$var = file_get_contents("php://input");
		$obj = json_decode($var, true);
		$obj = $obj['obj'];
		$credObj;		

		try{
			$credObj = file_get_contents("../../serviceCreds.json");
			$credObj = json_decode($credObj, true);
		}catch (Exception $e){
			$credObj = array(
				"facebook" => array(),
				"twitter" => array(),
				"linkedin" => array(),
				"instagram" => array(),
				"google" => array(),
				"login" => "first"
			);
			file_put_contents("../../serviceCreds.json", json_encode($credObj));
		}		
		
		$totalAccounts = 0;

		foreach($credObj as $key => $value){
			if($key != "login"){
				if(count($credObj[$key]) > 0){
					for($t = 0; $t < count($credObj[$key][0]['accounts']); $t++){
						if($credObj[$key][0]['accounts'][$t]['authenticated'] == 'true'){
							$totalAccounts += 1;
						}
					}
				}
			}
		}

		if($totalAccounts > 1 || $obj["authenticated"] == "false"){
			for($x = 0; $x < count($credObj[$obj['param']]); $x++){
				for($f = 0; $f < count($credObj[$obj['param']][$x]['accounts']); $f++){
					if($credObj[$obj['param']][$x]['accounts'][$f]["uuid"] == $obj["uuid"]){
						array_splice($credObj[$obj['param']][$x]['accounts'], $f, 1);
						break;
					}
				}
			}
		
			file_put_contents("../../serviceCreds.json", json_encode($credObj));

			return json_encode(array("success" => "Account Deleted"));
		}else{
			return json_encode(array("error" => "You cannot delete all of your accounts, you must have one to log in with"));
		}
	}

	public function getDomain(){
		$redirect = $_SERVER['HTTP_HOST'];
		return json_encode(array("domain" => $redirect));
	}

	public function editServiceCreds(){
		$var = file_get_contents("php://input");
		$obj = json_decode($var, true);
		$credObj;		

		try{
			$credObj = file_get_contents("../../serviceCreds.json");
			$credObj = json_decode($credObj, true);
		}catch (Exception $e){
			$credObj = array(
				"facebook" => array(),
				"twitter" => array(),
				"linkedin" => array(),
				"instagram" => array(),
				"google" => array(),
				"login" => "first"
			);
			file_put_contents("../../serviceCreds.json", json_encode($credObj));
		}

		if(count($credObj[$obj['param']]) > 0){
			if(count($credObj[$obj['param']][0]['accounts']) > 0){
				for($x = 0; $x < count($credObj[$obj['param']][0]['accounts']); $x++){
					if($credObj[$obj['param']][0]['accounts'][$x]["uuid"] == $obj['uuid']){
						$credObj[$obj['param']][0]['accounts'][$x]['color'] = $obj['color'];
						break;
					}
				}	
			}
		}

		file_put_contents("../../serviceCreds.json", json_encode($credObj));

		return json_encode(array("success" => "Account Edited"));
	}

	public function setDisableLogin(){
		$var = file_get_contents("php://input");
		$obj = json_decode($var, true);
		$loginObj = $obj['obj'];

		try{
			$credObj = file_get_contents("../../serviceCreds.json");
			$credObj = json_decode($credObj, true);
		}catch (Exception $e){
			$credObj = array(
				"facebook" => array(),
				"twitter" => array(),
				"linkedin" => array(),
				"instagram" => array(),
				"google" => array(),
				"login" => "first"
			);
			file_put_contents("../../serviceCreds.json", json_encode($credObj));
		}
		
		$exists = false;
		if(count($credObj[$loginObj['param']]) > 0){
			for($x = 0; $x < count($credObj[$loginObj['param']][0]['accounts']); $x++){
				if(isset($credObj[$loginObj['param']][0]['accounts'][$x]['user'])){
					if($credObj[$loginObj['param']][0]['accounts'][$x]['user'] == $loginObj['user']){
						print "here";
						if($credObj[$loginObj['param']][0]['accounts'][$x]['loginDisallow'] == "true"){
							print "false";
							$credObj[$loginObj['param']][0]['accounts'][$x]['loginDisallow'] = "false";
						}else{
							print "login";
							$credObj[$loginObj['param']][0]['accounts'][$x]['loginDisallow'] = "true";
						}
						break;
					}
				}
			}			
		}

		file_put_contents("../../serviceCreds.json", json_encode($credObj));	
	}

	public function saveServiceCredsFirstTime(){
		$var = file_get_contents("php://input");
		$obj1 = json_decode($var, true);

		$obj = $obj1['obj'];
		$credObj = $obj1['obj'];
		$finalObj;

		foreach ($credObj as $key => $value) {
			if($key == "linkedin"){
				$scope = "rw_groups r_fullprofile r_contactinfo r_network r_basicprofile rw_nus w_messages";
				$authLink = $obj[$key]['redir']."?apiKey=".$obj[$key]['key']."&secretKey=".$obj[$key]['secret']."&lredirect_uri=".$obj[$key]['redir']."&scope=".$scope;
				$account = array(
					"color" => "#B33DA5",
					"loginDisallow" => "false",
					"authenticated" => "false",
					"uuid" => uniqid()
				);
			}
			if($key == "twitter"){
				$authLink = $obj[$key]['redir']."?appKey=".$obj[$key]['key']."&appSecret=".$obj[$key]['secret']."&twitterRedirect=".$obj[$key]['redir'];
				$account = array(
					"color" => "#E32252",
					"loginDisallow" => "false",
					"authenticated" => "false",
					"uuid" => uniqid()
				);
			}
			if($key == "facebook"){
				$scope = "friends_location,friends_hometown,user_hometown,user_location,publish_stream,read_stream,read_friendlists,friends_birthday,friends_religion_politics,email,user_likes,friends_likes,manage_notifications";
				$authLink = "https://www.facebook.com/dialog/oauth?client_id=".$obj[$key]['key']."&redirect_uri=".$obj[$key]['redir']."&scope=".$scope;
				$account = array(
					"color" => "#0066FF",
					"loginDisallow" => "false",
					"authenticated" => "false",
					"uuid" => uniqid()
				);
			}
			if($key == "instagram"){
				$scope = "relationships likes comments";
				$authLink = "https://api.instagram.com/oauth/authorize/?client_id=".$obj[$key]['key']."&redirect_uri=".$obj[$key]['redir']."&response_type=code&scope=".$scope;
				$account = array(
					"color" => "#F66733",
					"loginDisallow" => "false",
					"authenticated" => "false",
					"uuid" => uniqid()
				);
			}
			if($key == "google"){
				$scope = "https://www.googleapis.com/auth/plus.stream.read,https://www.googleapis.com/auth/plus.stream.write,https://www.googleapis.com/auth/plus.media.upload,https://www.googleapis.com/auth/plus.me,https://www.googleapis.com/auth/plus.circles.read,https://www.googleapis.com/auth/plus.circles.write";
				$authLink = $obj[$key]['redir']."?apiKey=".$obj[$key]['key']."&secretKey=".$obj[$key]['secret']."&redirect_uri=".$obj[$key]['redir']."&scope=".$scope;
				$account = array(
					"color" => "#41CCCC",
					"loginDisallow" => "false",
					"authenticated" => "false",
					"uuid" => uniqid()
				);
			}
			$credObj[$key]['auth'] = $authLink;

			$finalObj[$key] = array();
			$temp = array(
				"key" => $obj[$key]['key'],
				"secret" => $obj[$key]['secret'],
				"auth" => $authLink,
				"accounts" => array(),
				"redir" => $obj[$key]['redir']	
			);
			array_push($temp['accounts'], $account);
			array_push($finalObj[$key], $temp);
		}

		$finalObj['login'] = "first";
		
		if(!isset($finalObj['twitter'])){
			$finalObj['twitter'] = array();
		}
		if(!isset($finalObj['linkedin'])){
			$finalObj['linkedin'] = array();
		}
		if(!isset($finalObj['facebook'])){
			$finalObj['facebook'] = array();
		}
		if(!isset($finalObj['instagram'])){
			$finalObj['instagram'] = array();
		}
		if(!isset($finalObj['google'])){
			$finalObj['google'] = array();
		}
		
		file_put_contents("../../serviceCreds.json", json_encode($finalObj));

		return json_encode(array("success" => "App Saved"));
	}
}

?>