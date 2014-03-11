<?php

use \ElasticSearch\Client;

function santizeWord($word){
	$s = substr($word, 0, 1);
	$e = substr($word, -1);
	
	if($s == ":" || 
	$s == "?" || 
	$s == '"' || 
	$s == "'" ||
	$s == "." || 
	$s == "," || 
	$s == "&" || 
	$s == ")" || 
	$s == "!" || 
	$s == "(" ||
	$s == "+" || 
	$s == ";"){
		$word = substr($word, 1);
	}
	
	if($e == ":" || 
	$e == "?" || 
	$e == '"' || 
	$e == "'" ||
	$e == "." || 
	$e == "," || 
	$e == "&" || 
	$e == ")" || 
	$e == "!" || 
	$e == "(" ||
	$e == "+" ||
	$e == ";"){
		$word = substr($word, 0, -1);
	}
	
	return $word;
}

Class WordCloud{

	function createTagCloud(){		
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);
		$clients = $varObj['users'];
		$numWords = $varObj['numWords'];
	
		$index = "app";
		$host = "localhost";
		$port = "9200";
	
		$es = Client::connection("http://$host:$port/$index/$index/");
		$search = array(
			"query" => array(
				'bool' => array(
					"should" => array(
						#array push each search term inside this array				
					)
				)
			),
			'filter' => array(
				"not" => array(
					"term" => array('title' => 'CONN')
				)
			)			
		);
		
		for($x = 0; $x < count($clients); $x++){
			$arr = explode("-----", $clients[$x]['data']['id']);
			$term = array("term" => array("actor.id" => strtolower($arr[1])));
			#$term = array("term" => array("actor.searchable" => strtolower($clients[$x]['data']['displayName'])));
			array_push($search['query']['bool']['should'], $term);
		}
		
		$res = $es->search($search);
		
		$data = $res['hits']['hits'];
		
		$postArray = array();
		for($g = 0; $g < count($data); $g++){
			array_push($postArray, $data[$g]['_source']['content']['text']['text']);
		}
		
		#return json_encode($postArray);
		$dataArr = array();
		$badWords = array(
			"a"=>true, "the"=>true, 
			"an"=>true, "it"=>true, 
			"and"=>true,	"to"=>true, 
			"also"=>true,	"too"=>true, 
			"of"=>true, "from"=>true, 
			"for"=>true, "by"=>true, 
			"is"=>true, "..."=>true, 
			"in"=>true, "url"=>true, 
			"on"=>true, "+"=>true,
			"I"=>true, "1"=>true,
			"3"=>true, "4"=>true,
			"as"=>true, "if"=>true,
			"5"=>true, "6"=>true,
			"7"=>true, "8"=>true,
			"9"=>true, "at"=>true,
			"i"=>true, "2"=>true
		);
		
		for($e = 0; $e < count($postArray); $e++){
			$choppedArr = explode(" ", $postArray[$e]);
			for($h = 0; $h < count($choppedArr); $h++){
				$word = santizeWord($choppedArr[$h]);
				if( !(isset($badWords[strtolower($word)])) ){
					array_push($dataArr, $word);
				}
			}
		}
		
		return json_encode($dataArr);
		
	}
}

?>