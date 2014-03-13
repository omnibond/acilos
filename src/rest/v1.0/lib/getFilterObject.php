<?php

use \ElasticSearch\Client;
	
function getFilterObject($filterObj, $from){
	$index = "starreditems";
	$host = "localhost";
	$port = "9200";
	
	$size = 20;
	
	$es = Client::connection("http://$host:$port/$index/$index");
	$starObj = $es->get("starreditems");
	
	$index = "app";
	$host = "localhost";
	$port = "9200";
	
	$es = Client::connection("http://$host:$port/$index/$index");
	
	$searchArr = array(
		"from" => $from,
		"size" => $size,
		"query" => array(
			'match_all' => array()
		),
		"filter" => array(
			"bool" => array(
				"should" => array(
					#push the ids inside of here
				),
				"must" => array(
			
				)
			)
		),
		'sort' => array(
			'published' => array(
				"order" => "desc"
			)
		)
	);
	
	if($filterObj['services'] != ""){
		$strArr = explode("+", $filterObj['services']);
		for($x = 0; $x < count($strArr); $x++){
			if($strArr[$x] != ""){
				$temp = array("term" => array("service" => strtolower($strArr[$x])));
				array_push($searchArr['filter']['bool']['should'], $temp);
			}
		}
	}
	
	if($filterObj['keys'] != ""){
		$strArr = explode("+", $filterObj['keys']);
		for($x = 0; $x < count($strArr); $x++){
			if($strArr[$x] != ""){
				$temp = array("term" => array("content.queryString" =>  strtolower($strArr[$x])));
				array_push($searchArr['filter']['bool']['should'], $temp);
			}
		}
	}
	
	if($filterObj['users'] != ""){
		$strArr = explode("+", $filterObj['users']);
		for($x = 0; $x < count($strArr); $x++){
			if($strArr[$x] != ""){
				$temp = array("term" => array("actor.searchable" => strtolower($strArr[$x])));
				array_push($searchArr['filter']['bool']['should'], $temp);
				$temp = array("term" => array("actor.name" => strtolower($strArr[$x])));
				array_push($searchArr['filter']['bool']['should'], $temp);
				$temp = array("term" => array("actor.displayName" => strtolower($strArr[$x])));
				array_push($searchArr['filter']['bool']['should'], $temp);
				$temp = array("term" => array("actor.id" => strtolower($strArr[$x])));
				array_push($searchArr['filter']['bool']['should'], $temp);
			}
		}
	}
	
	if(isset($filterObj['fav'])){
		if($filterObj['fav'] == true){
			$temp = array("term" => array("starred" => "true"));
			array_push($searchArr['filter']['bool']['must'], $temp);
		}
	}
	
	if($filterObj['start'] != "" && $filterObj['end'] != "" && $filterObj['start'] != "NaN-NaN-NaN" && $filterObj['end'] != "NaN-NaN-NaN"){
	
		//Code I added to convert the dates from the DatePickers to the appropriate format
		$myDateTime = DateTime::createFromFormat('Y-m-d', $filterObj['start']);
		$filterObj['start'] = $myDateTime->format('m/d/Y');
		
		$myDateTime = DateTime::createFromFormat('Y-m-d', $filterObj['end']);
		$filterObj['end'] = $myDateTime->format('m/d/Y');
	
		$sArr = explode("/", $filterObj['start']);
		$eArr = explode("/", $filterObj['end']);
		$sDate = new DateTime($sArr[2] . "/" . $sArr[0] . "/" . $sArr[1] . " 00:00:01");
		$eDate = new DateTime($eArr[2] . "/" . $eArr[0] . "/" . $eArr[1] . " 23:59:59");
		array_push($searchArr['filter']['bool']['must'],
			array("range" => array("published" =>
			array("from" =>$sDate->format('U'),"to" => $eDate->format('U'))
			))
		);
	}
	#print_r($searchArr);
	$res = $es->search($searchArr);
	
	#print_r($res);
	return ($res); 
		
}

?>
