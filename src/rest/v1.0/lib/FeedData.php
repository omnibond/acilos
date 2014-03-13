<?php

require_once('matchHelpers.php');
require_once('getFilterObject.php');
require_once('clientHelpers.php');

use \ElasticSearch\Client;

class FeedData{

	public function getFeedData(){

		$feedName = $_GET['feed'];
		$from = $_GET['from'];

		if($feedName == "All Feed Data"){

			$var = matchAll($from);

			//this is the right way to do it CORY
			if(isset($var['error'])){
				return json_encode(array("error" => $var));
			}else{
				return json_encode(array("success" => $var));
			}			
		}else{	
			return json_encode(array("error" => 'nothing exists here'));
		}
	}

	public function setStarredClient(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);
		$status = $varObj['status'];
		$userID = $varObj['id'];

		//$userID = "Twitter-----6544052";

		$peep = getClient($userID);

		$peep['data']['starred'] = $status;

		writeClient($peep);

		return json_encode(array("success" => "success"));	
	}

	public function getFeedList(){
		$fileName = "../../app/util/feedList.json";
		
		try{
			$feedList = file_get_contents($fileName);
		}catch (Exception $e){
			$feedList = json_encode(array());
			file_put_contents($fileName, $feedList);
		}
		return $feedList;
	}

	public function getSpecificFeedList(){
		$fileName = "../../app/util/feedList.json";
		$feedName = $_GET['feedName'];

		$feedList = file_get_contents($fileName);
		$obj = json_decode($feedList, true);
		for($x = 0; $x < count($obj); $x++){
			if($obj[$x]['name'] == $feedName){
				return json_encode($obj[$x]);
			}
		}

		$error = array("error" => "Feed name not found in the list");
		return json_encode($error);
	}

	public function checkSpecificFeedList(){
		$var = file_get_contents("php://input");
		$obj = json_decode($var, true);

		$feedObj = $obj['feedObj'];
		$from = $obj['from'];

		$return = getFilterObject($feedObj, $from);

		return json_encode($return);
	}

	public function update(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);
		$feedName = $varObj['feedName'];
		$size = $varObj['size'];

		if($feedName == "All Feed Data"){
			$var = matchAllUpdate($size);
			return json_encode($var);
		}
	}

	function saveFeedList(){
		$var = file_get_contents("php://input");
		$fileName = "../../app/util/feedList.json";

		$param =  json_decode($var, true);

		$feedObject = $param['feedObj'];

		$feedList = file_get_contents($fileName);
		$obj = json_decode($feedList, true);

		print_r($obj);

		if(!$obj){
			$obj = array();
			array_push($obj, $feedObject);
		}else{
			array_push($obj, $feedObject);
		}

		$outObject = json_encode($obj);
		file_put_contents($fileName, $outObject);

		return json_encode(array("success" => "success"));
	}

	function deleteFeedList(){
		$var = file_get_contents("php://input");
		$fileName = "../../app/util/feedList.json";

		$param = json_decode($var, true);

		$feedName = $param['feedName'];

		$feedList = file_get_contents($fileName);
		$obj = json_decode($feedList, true);

		$newObj = array();

		for($x = 0; $x < count($obj); $x++){
			if($obj[$x]['name'] == $feedName){
				continue;
			}else{
				array_push($newObj, $obj[$x]);
			}
		}

		$outObject = json_encode($newObj);
		file_put_contents($fileName, $outObject);
		return json_encode(array("success" => "success"));
	}

	function checkFeedName(){
		$feedName = $_GET['feedName'];
		$fileName = "../../app/util/feedList.json";

		$feedList = file_get_contents($fileName);
		$obj = json_decode($feedList, true);

		if(count($obj) != 0){
			for($x=0; $x<count($obj); $x++){
				if($obj[$x]['name'] == $feedName){
					$returnObj = array("exists"=>"true");
				}else{
					$returnObj = array("exists" => "false");
				}
			}
		}else{
			$returnObj = array("exists" => "false");
		}

		return json_encode($returnObj);
	}

	function overwriteFeedList(){
		$var = file_get_contents("php://input");
		$fileName = "../../app/util/feedList.json";

		$param = json_decode($var, true);

		$feedName = $param['feedName'];
		$feedObj = $param['feedObj'];

		$feedList = file_get_contents($fileName);
		$obj = json_decode($feedList, true);

		if(count($obj) != 0){
			for($x=0; $x<count($obj); $x++){
				if($obj[$x]['name'] == $feedName){
					$obj[$x] = $feedObj;
				}
			}
		}

		$outObject = json_encode($obj);

		print_r($obj);

		file_put_contents($fileName, $outObject);

		return json_encode(array("success" => "success"));
	}

	function manualRefresh(){
		$var = file_get_contents("php://input");
		$param = json_decode($var, true);
		$serviceObj = $param['serviceObj'];

		file_get_contents("http://".$_SERVER['HTTP_HOST']."/cron/poller/cronManager.php?ServiceObj=".json_encode($serviceObj));

		return json_encode(array("success" => $serviceObj));
	}	
}

?>