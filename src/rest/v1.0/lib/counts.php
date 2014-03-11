<?php

use \ElasticSearch\Client;
	
	function objectToArray($d){
		if(is_object($d)){
			$d = get_object_vars($d);
		}
		if(is_array($d)){
			return array_map(__FUNCTION__, $d);
		}
		else{
			return $d;
		}
	}
	
	function countSpecificUser($friendList){
		$index = "app";
		$host = "localhost";
		$port = "9200";
		$size = 1000;

		$url = "http://$host:$port/$index/_count";
		$ch = curl_init($url);
		
		$searchArr = array(
			"bool" => array(
				"should" => array(
				)
			)
		);
		
		for($f=0; $f<count($friendList); $f++){	
			#searches must all be in lower case
			$temp = array("term" => array("actor.searchable" => strtolower($friendList[$f])));
			array_push($searchArr['bool']['should'], $temp);
		}
		
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($searchArr));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		
		$response = curl_exec($ch);
		curl_close($ch);
		
		return $response;
	}

	function countAll(){
		$index = "app";
		$host = "localhost";
		$port = "9200";

		#$es = Client::connection("http://$host:$port/$index/$mapping/_count");
		$url = "http://$host:$port/$index/_count";
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

		$response = curl_exec($ch);
		curl_close($ch);
		#$res = json_decode($response, true);
		
		return $response;
	}
	
	function getCountByDate($startDate){
		$index = "app";
		$host = "localhost";
		$port = "9200";
		
		$url = "http://$host:$port/$index/_count";
		$ch = curl_init($url);
		
		$searchArr = array(
			"bool" => array(
				"must" => array(
				)
			)
		);
		
		$current = time();
		$start = time() - $startDate;
		
		array_push($searchArr['bool']['must'],
			array("range" => array(
					"published" => array(
						"from" =>$start,"to" => $current
					)
				)
			)
		);
		
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($searchArr));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		
		$response = curl_exec($ch);
		curl_close($ch);
		
		return $response;
	}

	function backUp($startDate, $size){
		$index = "app";
		$host = "localhost";
		$port = "9200";
		
		$es = Client::connection("http://$host:$port/$index/$index");
		$searchArr = array();
		
		if($startDate == "everything"){
			$searchArr = array(
				'size' => $size,
				"query" => array(
					'match_all' => array()
				),
			);
		}else{
			$current = time();
			$start = time() - $startDate;
		
			$searchArr = array(
				'size' => $size,
				"query" => array(
					'match_all' => array()
				),
				"filter" => array(
					"bool" => array(
						"must" => array(
						)
					)
				)
			);
			
			array_push($searchArr['filter']['bool']['must'],
				array("range" => array(
						"published" => array(
							"from" =>$start,
							"to" => $current
						)
					)
				)
			);
		}
		
		$res = $es->search($searchArr);
		
		return $res;
	}
	
	function deleteAllBackedUp($idArr){
		$index = "app";
		$host = "localhost";
		$port = "9200";
		
		$es = Client::connection("http://$host:$port/$index/$index");
		
		foreach ($idArr as $key => $value){
			$res = $es->delete($key);
		}

		$es->refresh();
		
		return json_encode(array("success"));
		
	}
?>
