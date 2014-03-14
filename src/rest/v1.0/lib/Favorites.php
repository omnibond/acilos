<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines server side group of function pertaining to queries for favorited posts and people
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

require_once('setStarred.php');
require_once('clientHelpers.php');
require_once('refreshES.php');

use \ElasticSearch\Client;

class Favorites{
	
	function setStarred(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);
		$postID = $varObj['id'];
		$status = $varObj['status'];

		$response = setStarred($postID, $status);
	
		if($response !== "success"){
			return json_encode(array("error" => 'error occurred saving the item'));
		}else{
			return json_encode(array());
		}
	}
	
	function setIsLiked(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);
		$postID = $varObj['id'];
		$liked = $varObj['liked'];

		$response = setIsLiked($postID, $liked);
	
		if($response !== "success"){
			return json_encode(array("error" => 'error occurred saving the item'));
		}else{
			return json_encode(array());
		}
	}
	
	function setIsFavorited(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);
		$postID = $varObj['id'];
		$favorited = $varObj['favorited'];

		$response = setIsFavorited($postID, $favorited);
	
		if($response !== "success"){
			return json_encode(array("error" => 'error occurred saving the item'));
		}else{
			return json_encode(array());
		}
	}
	
	function setIsCommented(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);
		$postID = $varObj['id'];

		$response = setIsCommented($postID);
	
		if($response !== "success"){
			return json_encode(array("error" => 'error occurred saving the item'));
		}else{
			return json_encode(array());
		}
	}
	
	function saveFriendsList(){
		$var = file_get_contents("php://input");
		$friendArr = json_decode($var, true);
		$arr = $friendArr['friendArr'];
		
		for($x = 0; $x < count($arr); $x++){
			$client = new clientObject();
			
			$client->setCredential($arr[$x]['service'], 
				array("id" => $arr[$x]['id'], "displayName" =>  $arr[$x]['displayName'], "givenName" =>  $arr[$x]['givenName'])
			);
			$client->setDisplayName($arr[$x]['givenName']);
			$client->setID($arr[$x]['service'].'-----'.$arr[$x]['id']);

			$user = getClient($arr[$x]['service'].'-----'.$arr[$x]['id']);
			if(!isset($user['data'])){
				writeClient((array)$client);
			}else{
				return json_encode(array("success" => "user exists"));
			}
		}
		
		//refresh ES
		//refreshES();
		
		return json_encode(array("success" => "success"));
	}

	function mergeFriends(){
		$var = file_get_contents("php://input");
		$friendArr = json_decode($var, true);
		$arr = $friendArr['mergeArr'];
		
		$mainClient = array_slice($arr, 0 ,1);
		$arr = array_slice($arr, 1);
		
		//set the main client owns to the new array of ids
		$main = getClient($mainClient[0]);
		
		$checkArr = array();
		for($h = 0; $h < count($main['data']['owns']); $h++){
			$checkArr[$main['data']['owns'][$h]] = "true";
		}
		
		//make sure main is owned by none
		$main['data']['ownedBy'] = 'none';
		
		//get the owned attributes for the other clients in ownedArray and blank them out and add them to the ownedArray
		$nestedOwns = array();
		for($h = 0; $h < count($arr); $h++){
			//add ownedArray to main owns
			if(!isset($checkArr[$arr[$h]])){
				array_push($main['data']['owns'], $arr[$h]);
			}
			//find out if ownedArray clients own anyone
			$peep = getClient($arr[$h]);
			
			if(count($peep['data']['owns']) > 0){
				for($k = 0; $k < count($peep['data']['owns']); $k++){
					//add previously owned to nestedOwns to go blank out later
					array_push($nestedOwns, $peep['data']['owns'][$k]);
					//add the previously owned from ownedArray to main owns
					if(!isset($checkArr[$peep['data']['owns'][$k]])){
						array_push($main['data']['owns'], $peep['data']['owns'][$k]);
					}
				}
			}
			//blank out owns and set ownedBy for the ownedArray
			$peep['data']['owns'] = array();
			$peep['data']['ownedBy'] = $mainClient[0];
			//this client now is owned my main and owns no one
			writeClient($peep);
		}
		
		//set the ownedBy Attr for all of the nestedOwns
		for($h = 0; $h < count($nestedOwns); $h++){
			$peep = getClient($nestedOwns[$h]);
			//set the nested owned to main client
			$peep['data']['ownedBy'] = $mainClient[0];
			//make sure this one doesnt own anyone anymore
			$peep['data']['owns'] = array();
			//this nested client is now owned by main
			$var = writeClient($peep);
		}
			
		//write the main client out now owning all ownedArray and nested ownedArray owns
		$var = writeClient($main);
		
		//refresh ES
		//refreshES();
	}

	function unMergeFriends(){
		$var = file_get_contents("php://input");
		$friendArr = json_decode($var, true);
		$arr = $friendArr['unMergeArr'];
		
		$mainClient = $arr[0];
		$arr = $arr[1];
		
		//set the main client owns to the new array of ids
		$main = getClient($mainClient);
		for($h = 0; $h < count($main['data']['owns']); $h++){
			if($main['data']['owns'][$h] == $arr){
				array_splice($main['data']['owns'], $h, 1);
			}
		}
		writeClient($main);
		
		$unMerged = getClient($arr);
		$unMerged['data']['ownedBy'] = 'none';
		writeClient($unMerged);
	}
}

?>
