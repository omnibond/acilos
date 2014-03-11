<?php

require_once('getSuggestionsFunc.php');

use \ElasticSearch\Client;

class Suggestions{
	
	public function getSuggestions(){
	
		if(isset($_GET['word'])){
			$word = $_GET['word'];
		}else{
			$word = "";
		}
		
		$response = getSuggestionsFunc($word);
		
		$sortArr = array();
		$dataArr = array();
		for($x = 0; $x < count($response['hits']['hits']); $x++){
			$dataArr[$response['hits']['hits'][$x]['_source']['data']['displayName']] = $response['hits']['hits'][$x]['_source'];
			array_push($sortArr, $response['hits']['hits'][$x]['_source']['data']['displayName']);
		}
		natcasesort($sortArr);
		$finalArr = array();
		foreach($sortArr as $key => $value){
			$finalArr[$value] = $dataArr[$value];
		}
		
		return json_encode($finalArr);
	}

	public function getSuggestionsButton(){
		//$word = $_GET['word'];

		if(isset($_GET['word'])){
			$word = $_GET['word'];
		}else{
			$word = "";
		}
		
		$response = getSuggestionsFunc($word);
		
		$sortArr = array();
		$dataArr = array();
		for($x = 0; $x < count($response['hits']['hits']); $x++){
			$dataArr[$response['hits']['hits'][$x]['_source']['data']['displayName']] = $response['hits']['hits'][$x]['_source'];
			array_push($sortArr, $response['hits']['hits'][$x]['_source']['data']['displayName']);
		}
		natcasesort($sortArr);
		$finalArr = array();
		foreach($sortArr as $key => $value){
			$finalArr[$value] = $dataArr[$value];
		}
		
		return json_encode($finalArr);
	}

}






?>
