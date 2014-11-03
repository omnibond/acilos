<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines server side group of function pertaining to elasticsearch search functions
** 
**
** $QT_BEGIN_LICENSE:LlGPL$
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

require_once('authCalls.php');
	
function matchAll($from){
	$size = 20;

	$index = "app";
	$host = "localhost";
	$port = "9200";

	$es = Client::connection("http://$host:$port/$index/$index");
	$res = $es->search(array(
		'from' => $from,
		'size' => $size,
		'query' => array(
			'match_all' => array()
		),
		'sort' => array(
			'published' => array(
				"order" => "desc"
			)
		)
	));
	
	return $res;
}

function matchAll200($from){
	$size = 200;

	$index = "app";
	$host = "localhost";
	$port = "9200";

	$es = Client::connection("http://$host:$port/$index/$index");
	$res = $es->search(array(
		'from' => $from,
		'size' => $size,
		'query' => array(
			'match_all' => array()
		),
		'sort' => array(
			'published' => array(
				"order" => "desc"
			)
		)
	));
	
	return $res;
}

function matchAllClients($from){

	if(!(isset($_GET['from']))){
		$from = 0;
	}

	$size = 2000;

	$index = "client";
	$host = "localhost";
	$port = "9200";

	$es = Client::connection("http://$host:$port/$index/$index");
	$res = $es->search(array(
		'from' => $from,
		'size' => $size,
		'query' => array(
			'match_all' => array()
		),
		'sort' => array(
			'alphaIndex' => array(
				"order" => "asc"
			)
		)
	));
	
	return $res;
} 

function matchServiceClients(){
	$size = 1000;

	$index = "client";
	$host = "localhost";
	$port = "9200";

	$es = Client::connection("http://$host:$port/$index/$index");

	$searchArr = array(
		"from" => $from,
		"size" => $size,
		"query" => array(
			'bool' => array(
				"should" => array(
					'term' => array("service" => strtolower($service))
				)
			)
	        )
	);
}

function matchTotalPostsInterval($from, $service){
	if(!(isset($_GET['from']))){
		$from = 0;
	}else{
		$from = $from;
	}

	$size = 1000;

	$index = "client";
	$host = "localhost";
	$port = "9200";

	$es = Client::connection("http://$host:$port/$index/$index");

	$searchArr = array(
		"from" => $from,
		"size" => $size,
		"query" => array(
			'bool' => array(
				"must" => array(
					'term' => array("service" => $service)
				)
			)
	        ),
		"facets" => array(
			"histo1" => array(
				"histogram" => array(
					"field" => "totalPosts",
					"interval" => 1
				)
			)
		)
	);

	$res = $es->search($searchArr);
	   
	return $res;
}

function matchBarGraphClients($users){
	if(!(isset($_GET['from']))){
		$from = 0;
	}

	$size = 1000;

	$index = "client";
	$host = "localhost";
	$port = "9200";

	$es = Client::connection("http://$host:$port/$index/$index");

	$searchArr = array(
		"from" => $from,
		"size" => $size,
		"query" => array(
			'bool' => array(
				"should" => array(
					#push here
				)
			)
	    )
	);
	
	for($f=0; $f<count($users); $f++){
		$idArr = explode("-----", $users[$f]);
		$id = $idArr[1];
		$temp = array("term" => array("id" => $id));
		array_push($searchArr['query']['bool']['should'], $temp);
	}
	
	$res = $es->search($searchArr);

	return $res;
}

function matchSelectedLineChartUser($id){
	if(!(isset($_GET['from']))){
		$from = 0;
	}

	$size = 1000;

	$index = "client";
	$host = "localhost";
	$port = "9200";

	$es = Client::connection("http://$host:$port/$index/$index");
	
	$tempUser = explode("-----", $id);
	$id = $tempUser[1];
	//print_r($id);
	$searchArr = array(
		"from" => $from,
		"size" => $size,
		"query" => array(
			'bool' => array(
				"must" => array(
					"term" => array(
						"data.id" => $id
					)
				)
			)
	    )
	);

	$res = $es->search($searchArr);
	
	return $res;
}

function matchDateIntervalClients($users){
	$size = 1000;

	$index = "app";
	$host = "localhost";
	$port = "9200";

	$es = Client::connection("http://$host:$port/$index/$index");

	$searchArr = array(
		"size" => $size,
		"query" => array(
			'bool' => array(
				"should" => array(
					
				)
			)
	    ),
	    "facets" => array(
	        "histo2" => array(
	            "date_histogram" => array(
	                "field" => "published",
	                "interval" => "minute"
	            )
	        )
	    )
	);

	for($f=0; $f<count($users); $f++){	
		#searches must all be in lower case
		$temp = array("term" => array("actor.id" => strtolower($users[$f])));
		array_push($searchArr['query']['bool']['should'], $temp);
	}

	$res = $es->search($searchArr);

	return $res;
}

function matchService($serviceList, $from){
	$index = "app";
	$host = "localhost";
	$port = "9200";
	$size = 20;
	
	$es = Client::connection("http://$host:$port/$index/$index");

	$searchArr = array(
		"size" => $size,
		"from" => $from,
		"query" => array(
			'bool' => array(
				"should" => array(
					#array push each search term inside this array
				)
			)
		),
		'sort' => array(
			'published' => array(
				"order" => "desc"
			)
		)
	);
	
	for($f=0; $f<count($serviceList); $f++){	
		#searches must all be in lower case
		$temp = array("term" => array("service" => $serviceList[$f]));
		array_push($searchArr['query']['bool']['should'], $temp);
	}
	
	$res = $es->search($searchArr);
	return ($res); 
}

function matchSpecificContent($termList, $from){
	$index = "app";
	$host = "localhost";
	$port = "9200";
	
	$size = 20;

	$es = Client::connection("http://$host:$port/$index/$index");
	
	$searchArr = array(
		'from' => $from,
		'size' => $size,
		"query" => array(
			'bool' => array(
				"should" => array(
					#array push each search term inside this array
				)
			)
		),
		'filter' => array(
			'or' => array(
				
			)
		),
		'sort' => array(
			'published' => array(
				"order" => "desc"
			)
		)
	);
	
	for($f=0; $f<count($termList); $f++){	
		#searches must all be in lower case
		$temp = array("term" => array("content.story.text" => strtolower($termList[$f])));
		array_push($searchArr['query']['bool']['should'], $temp);
		$temp = array("term" => array("content.text.text" => strtolower($termList[$f])));
		array_push($searchArr['query']['bool']['should'], $temp);
		$temp = array("term" => array("content.discussion.summary.text" => strtolower($termList[$f])));
		array_push($searchArr['query']['bool']['should'], $temp);
		$temp = array("term" => array("content.discussion.title.text" => strtolower($termList[$f])));
		array_push($searchArr['query']['bool']['should'], $temp);
		$temp = array("term" => array("content.title" => strtolower($termList[$f])));
		array_push($searchArr['query']['bool']['should'], $temp);
		$temp = array("term" => array("content.status.text" => strtolower($termList[$f])));
		array_push($searchArr['query']['bool']['should'], $temp);
	}
	
	$res = $es->search($searchArr);
	return $res; 
}

function matchQueryString($action, $searchObj, $from){
	$index = "app";
	$host = "localhost";
	$port = "9200";
	
	if(!isset($from)){
		$from = 0;
	}
	$size = 20;
	$es = Client::connection("http://$host:$port/$index/$index");
	
	$searchArr = array(
		'from' => $from,
		'size' => $size,
		"query" => array(
			'bool' => array(
				"should" => array(),
				"must" => array()
			)
		),
		'filter' => array(
			'bool' => array(
				'should' => array(
				),
				'must' => array(
				)
			)
		),
		'sort' => array(
			'published' => array(
				"order" => "desc"
			)
		)
	);

	switch($action){
		case "normal":
			for($f=0; $f<count($searchObj['normal']); $f++){
				$temp = array("term" => array("content.queryString" => strtolower($searchObj['normal'][$f])));
				array_push($searchArr['query']['bool']['must'], $temp);
			}

			$res = $es->search($searchArr);
		break;
		
		case "hasQuotes":
			for($f=0; $f<count($searchObj['normal']); $f++){
				if($searchObj['normal'][$f] != ""){
					$temp = array("term" => array("content.queryString" => strtolower($searchObj['normal'][$f])));
					array_push($searchArr['query']['bool']['should'], $temp);
				}
			}
			for($f=0; $f<count($searchObj['quotes']); $f++){
				$rep = str_replace("+", " ", $searchObj['quotes'][$f]);
				$temp = array("match" => 
							array("content.queryString" => 
								array(
									"query" => strtolower($rep),
									"type" => "phrase"
								)
							)
						);
				array_push($searchArr['query']['bool']['must'], $temp);
			}

			$res = $es->search($searchArr);
		break;
		
		case "hasColon":
			for($f=0; $f<count($searchObj['normal']); $f++){
				if($searchObj['normal'][$f] != ""){
					$temp = array("term" => array("content.queryString" => strtolower($searchObj['normal'][$f])));
					array_push($searchArr['filter']['bool']['must'], $temp);
				}
			}
	
			if($searchObj['colon'] == "twitter" || $searchObj['colon'] == "Twitter" ||
			$searchObj['colon'] == "facebook" || $searchObj['colon'] == "Facebook" ||
			$searchObj['colon'] == "instagram" || $searchObj['colon'] == "Instagram" ||
			$searchObj['colon'] == "linkedin" || $searchObj['colon'] == "Linkedin" || 
			$searchObj['colon'] == "google" || $searchObj['colon'] == "Google"){
				$temp = array("term" => array("service" => strtolower($searchObj['colon'])));
				array_push($searchArr['query']['bool']['must'], $temp);
			}else{
				$replaced = explode("+", $searchObj['colon']);
				for($r=0; $r < count($replaced); $r++){
					$temp = array("term" => array("actor.displayName" => strtolower($replaced[$r])));
					array_push($searchArr['query']['bool']['must'], $temp);
				}
			}

			$res = $es->search($searchArr);
		break;

		case "hasOR":
			for($f=0; $f<count($searchObj['before']); $f++){
				$temp = array("term" => array("content.queryString" => strtolower($searchObj['before'][$f])));
				array_push($searchArr['query']['bool']['must'], $temp);
			}

			$res = $es->search($searchArr);

			$finalResponse = array(
				"hits" => array(
					"hits" => array()
				)
			);

			if(isset($res)){
				if(isset($res['hits'])){
					if(isset($res['hits']['hits'])){
						for($r = 0; $r < count($res['hits']['hits']); $r++){
							if(isset($res['hits']['hits'][$r])){
								$finalResponse['hits']['hits'][$r] = $res['hits']['hits'][$r];
							}
						}
					}
				}
			}

			$searchArr['query']['bool']['must'] = array();
			for($f=0; $f<count($searchObj['after']); $f++){
				$temp = array("term" => array("content.queryString" => strtolower($searchObj['after'][$f])));
				array_push($searchArr['query']['bool']['must'], $temp);
			}

			$res = $es->search($searchArr);

			if(isset($res)){
				if(isset($res['hits'])){
					if(isset($res['hits']['hits'])){
						$count = 0;
						for($f = $r; $f < (count($res['hits']['hits']) + $r); $f++){
							$count++;
							if(isset($res['hits']['hits'][$count])){
								$finalResponse['hits']['hits'][$f] = $res['hits']['hits'][$count];
							}
						}
					}
				}
			}

			$res = array(
				"hits" => array(
					"hits" => array()
				)
			);

			for($t = 0; $t < count($finalResponse['hits']['hits']); $t++){
				if(isset($finalResponse['hits']['hits'][$t])){
					array_push($res['hits']['hits'], $finalResponse['hits']['hits'][$t]);
				}	
			}
		break;
		
		case "hasQuotesAndColon":
			if($searchObj['colon'] == "twitter" || $searchObj['colon'] == "Twitter" ||
			$searchObj['colon'] == "facebook" || $searchObj['colon'] == "Facebook" ||
			$searchObj['colon'] == "instagram" || $searchObj['colon'] == "Instagram" ||
			$searchObj['colon'] == "linkedin" || $searchObj['colon'] == "Linkedin" || 
			$searchObj['colon'] == "google" || $searchObj['colon'] == "Google"){
				$temp = array("term" => array("service" => strtolower($searchObj['colon'])));
				array_push($searchArr['query']['bool']['must'], $temp);
			}else{
				$replaced = explode("+", $searchObj['colon']);
				for($r=0; $r < count($replaced); $r++){
					$temp = array("term" => array("actor.displayName" => strtolower($replaced[$r])));
					array_push($searchArr['query']['bool']['must'], $temp);
				}
			}
			
			for($f=0; $f<count($searchObj['normal']); $f++){
				if($searchObj['normal'][$f] != ""){
					$temp = array("term" => array("content.queryString" => strtolower($searchObj['normal'][$f])));
					array_push($searchArr['filter']['bool']['should'], $temp);
				}
			}
			
			for($f=0; $f<count($searchObj['quotes']); $f++){
				$rep = str_replace("+", " ", $searchObj['quotes'][$f]);
				$temp = array("match" => 
							array("content.queryString" => 
								array(
									"query" => strtolower($rep),
									"type" => "phrase"
								)
							)
						);
				array_push($searchArr['query']['bool']['must'], $temp);
			}

			#print_r($searchArr);
			$res = $es->search($searchArr);
		break;

		case "hasQuotesAndOR":
			//print_R($searchObj);
			if(isset($searchObj['first']['normal']) && $searchObj['first']['normal'] != ""){
				for($f=0; $f<count($searchObj['first']['normal']); $f++){
					if($searchObj['first']['normal'][$f] != ""){
						$temp = array("term" => array("content.queryString" => strtolower($searchObj['first']['normal'][$f])));
						array_push($searchArr['query']['bool']['must'], $temp);
					}
				}
			}
			if(isset($searchObj['first']['quotes']) && $searchObj['first']['quotes'] != ""){
				for($f=0; $f<count($searchObj['first']['quotes']); $f++){
					$rep = str_replace("+", " ", $searchObj['first']['quotes'][$f]);
					$temp = array("match" => 
								array("content.queryString" => 
									array(
										"query" => strtolower($rep),
										"type" => "phrase"
									)
								)
							);
					array_push($searchArr['query']['bool']['must'], $temp);
				}
			}

			$res = $es->search($searchArr);

			$finalResponse = array(
				"hits" => array(
					"hits" => array()
				)
			);

			if(isset($res)){
				if(isset($res['hits'])){
					if(isset($res['hits']['hits'])){
						for($r = 0; $r < count($res['hits']['hits']); $r++){
							if(isset($res['hits']['hits'][$r])){
								$finalResponse['hits']['hits'][$r] = $res['hits']['hits'][$r];
							}
						}
					}
				}
			}			

			$searchArr['query']['bool']['should'] = array();
			$searchArr['query']['bool']['must'] = array();

			if(isset($searchObj['second']['normal']) && $searchObj['second']['normal'] != ""){
				for($f=0; $f<count($searchObj['second']['normal']); $f++){
					if($searchObj['second']['normal'][$f] != ""){
						$temp = array("term" => array("content.queryString" => strtolower($searchObj['second']['normal'][$f])));
						array_push($searchArr['query']['bool']['must'], $temp);
					}
				}
			}
			if(isset($searchObj['second']['quotes']) && $searchObj['second']['quotes'] != ""){
				for($f=0; $f<count($searchObj['second']['quotes']); $f++){
					$rep = str_replace("+", " ", $searchObj['second']['quotes'][$f]);
					$temp = array("match" => 
								array("content.queryString" => 
									array(
										"query" => strtolower($rep),
										"type" => "phrase"
									)
								)
							);
					array_push($searchArr['query']['bool']['must'], $temp);
				}
			}

			$res = $es->search($searchArr);

			if(isset($res)){
				if(isset($res['hits'])){
					if(isset($res['hits']['hits'])){
						$count = 0;
						for($f = $r; $f < (count($res['hits']['hits']) + $r); $f++){
							$count++;
							if(isset($res['hits']['hits'][$count])){
								$finalResponse['hits']['hits'][$f] = $res['hits']['hits'][$count];
							}
						}
					}
				}
			}

			$res = array(
				"hits" => array(
					"hits" => array()
				)
			);

			for($t = 0; $t < count($finalResponse['hits']['hits']); $t++){
				if(isset($finalResponse['hits']['hits'][$t])){
					array_push($res['hits']['hits'], $finalResponse['hits']['hits'][$t]);
				}	
			}
		break;

		case "hasColonAndOR":
			//here is the hasOR code
			for($f=0; $f<count($searchObj['before']); $f++){
				$temp = array("term" => array("content.queryString" => strtolower($searchObj['before'][$f])));
				array_push($searchArr['query']['bool']['must'], $temp);
			}

			if($searchObj['colon'] == "twitter" || $searchObj['colon'] == "Twitter" ||
			$searchObj['colon'] == "facebook" || $searchObj['colon'] == "Facebook" ||
			$searchObj['colon'] == "instagram" || $searchObj['colon'] == "Instagram" ||
			$searchObj['colon'] == "linkedin" || $searchObj['colon'] == "Linkedin" || 
			$searchObj['colon'] == "google" || $searchObj['colon'] == "Google"){
				$temp = array("term" => array("service" => strtolower($searchObj['colon'])));
				array_push($searchArr['query']['bool']['must'], $temp);
			}else{
				$replaced = explode("+", $searchObj['colon']);
				for($r=0; $r < count($replaced); $r++){
					$temp = array("term" => array("actor.displayName" => strtolower($replaced[$r])));
					array_push($searchArr['query']['bool']['must'], $temp);
				}
			}

			$res = $es->search($searchArr);

			$finalResponse = array(
				"hits" => array(
					"hits" => array()
				)
			);

			if(isset($res)){
				if(isset($res['hits'])){
					if(isset($res['hits']['hits'])){
						for($r = 0; $r < count($res['hits']['hits']); $r++){
							if(isset($res['hits']['hits'][$r])){
								$finalResponse['hits']['hits'][$r] = $res['hits']['hits'][$r];
							}
						}
					}
				}
			}

			$searchArr['query']['bool']['must'] = array();
			for($f=0; $f<count($searchObj['after']); $f++){
				$temp = array("term" => array("content.queryString" => strtolower($searchObj['after'][$f])));
				array_push($searchArr['query']['bool']['must'], $temp);
			}

			if($searchObj['colon'] == "twitter" || $searchObj['colon'] == "Twitter" ||
			$searchObj['colon'] == "facebook" || $searchObj['colon'] == "Facebook" ||
			$searchObj['colon'] == "instagram" || $searchObj['colon'] == "Instagram" ||
			$searchObj['colon'] == "linkedin" || $searchObj['colon'] == "Linkedin" || 
			$searchObj['colon'] == "google" || $searchObj['colon'] == "Google"){
				$temp = array("term" => array("service" => strtolower($searchObj['colon'])));
				array_push($searchArr['query']['bool']['must'], $temp);
			}else{
				$replaced = explode("+", $searchObj['colon']);
				for($r=0; $r < count($replaced); $r++){
					$temp = array("term" => array("actor.displayName" => strtolower($replaced[$r])));
					array_push($searchArr['query']['bool']['must'], $temp);
				}
			}

			$res = $es->search($searchArr);

			if(isset($res)){
				if(isset($res['hits'])){
					if(isset($res['hits']['hits'])){
						$count = 0;
						for($f = $r; $f < (count($res['hits']['hits']) + $r); $f++){
							$count++;
							if(isset($res['hits']['hits'][$count])){
								$finalResponse['hits']['hits'][$f] = $res['hits']['hits'][$count];
							}
						}
					}
				}
			}

			$res = array(
				"hits" => array(
					"hits" => array()
				)
			);

			for($t = 0; $t < count($finalResponse['hits']['hits']); $t++){
				if(isset($finalResponse['hits']['hits'][$t])){
					array_push($res['hits']['hits'], $finalResponse['hits']['hits'][$t]);
				}	
			}
		break;

		case "hasAll":
			//print_R($searchObj);
			if(isset($searchObj['first']['normal']) && $searchObj['first']['normal'] != ""){
				for($f=0; $f<count($searchObj['first']['normal']); $f++){
					if($searchObj['first']['normal'][$f] != ""){
						$temp = array("term" => array("content.queryString" => strtolower($searchObj['first']['normal'][$f])));
						array_push($searchArr['query']['bool']['must'], $temp);
					}
				}
			}
			if(isset($searchObj['first']['quotes']) && $searchObj['first']['quotes'] != ""){
				for($f=0; $f<count($searchObj['first']['quotes']); $f++){
					$rep = str_replace("+", " ", $searchObj['first']['quotes'][$f]);
					$temp = array("match" => 
								array("content.queryString" => 
									array(
										"query" => strtolower($rep),
										"type" => "phrase"
									)
								)
							);
					array_push($searchArr['query']['bool']['must'], $temp);
				}
			}

			if($searchObj['colon'] == "twitter" || $searchObj['colon'] == "Twitter" ||
			$searchObj['colon'] == "facebook" || $searchObj['colon'] == "Facebook" ||
			$searchObj['colon'] == "instagram" || $searchObj['colon'] == "Instagram" ||
			$searchObj['colon'] == "linkedin" || $searchObj['colon'] == "Linkedin" || 
			$searchObj['colon'] == "google" || $searchObj['colon'] == "Google"){
				$temp = array("term" => array("service" => strtolower($searchObj['colon'])));
				array_push($searchArr['query']['bool']['must'], $temp);
			}else{
				$replaced = explode("+", $searchObj['colon']);
				for($r=0; $r < count($replaced); $r++){
					$temp = array("term" => array("actor.displayName" => strtolower($replaced[$r])));
					array_push($searchArr['query']['bool']['must'], $temp);
				}
			}

			$res = $es->search($searchArr);

			$finalResponse = array(
				"hits" => array(
					"hits" => array()
				)
			);

			if(isset($res)){
				if(isset($res['hits'])){
					if(isset($res['hits']['hits'])){
						for($r = 0; $r < count($res['hits']['hits']); $r++){
							if(isset($res['hits']['hits'][$r])){
								$finalResponse['hits']['hits'][$r] = $res['hits']['hits'][$r];
							}
						}
					}
				}
			}			

			$searchArr['query']['bool']['should'] = array();
			$searchArr['query']['bool']['must'] = array();

			if(isset($searchObj['second']['normal']) && $searchObj['second']['normal'] != ""){
				for($f=0; $f<count($searchObj['second']['normal']); $f++){
					if($searchObj['second']['normal'][$f] != ""){
						$temp = array("term" => array("content.queryString" => strtolower($searchObj['second']['normal'][$f])));
						array_push($searchArr['query']['bool']['must'], $temp);
					}
				}
			}
			if(isset($searchObj['second']['quotes']) && $searchObj['second']['quotes'] != ""){
				for($f=0; $f<count($searchObj['second']['quotes']); $f++){
					$rep = str_replace("+", " ", $searchObj['second']['quotes'][$f]);
					$temp = array("match" => 
								array("content.queryString" => 
									array(
										"query" => strtolower($rep),
										"type" => "phrase"
									)
								)
							);
					array_push($searchArr['query']['bool']['must'], $temp);
				}
			}

			if($searchObj['colon'] == "twitter" || $searchObj['colon'] == "Twitter" ||
			$searchObj['colon'] == "facebook" || $searchObj['colon'] == "Facebook" ||
			$searchObj['colon'] == "instagram" || $searchObj['colon'] == "Instagram" ||
			$searchObj['colon'] == "linkedin" || $searchObj['colon'] == "Linkedin" || 
			$searchObj['colon'] == "google" || $searchObj['colon'] == "Google"){
				$temp = array("term" => array("service" => strtolower($searchObj['colon'])));
				array_push($searchArr['query']['bool']['must'], $temp);
			}else{
				$replaced = explode("+", $searchObj['colon']);
				for($r=0; $r < count($replaced); $r++){
					$temp = array("term" => array("actor.displayName" => strtolower($replaced[$r])));
					array_push($searchArr['query']['bool']['must'], $temp);
				}
			}

			$res = $es->search($searchArr);

			if(isset($res)){
				if(isset($res['hits'])){
					if(isset($res['hits']['hits'])){
						$count = 0;
						for($f = $r; $f < (count($res['hits']['hits']) + $r); $f++){
							$count++;
							if(isset($res['hits']['hits'][$count])){
								$finalResponse['hits']['hits'][$f] = $res['hits']['hits'][$count];
							}
						}
					}
				}
			}

			$res = array(
				"hits" => array(
					"hits" => array()
				)
			);

			for($t = 0; $t < count($finalResponse['hits']['hits']); $t++){
				if(isset($finalResponse['hits']['hits'][$t])){
					array_push($res['hits']['hits'], $finalResponse['hits']['hits'][$t]);
				}	
			}
		break;
		
		default:
			
		break;
	}
	
	return $res;
}

function matchSpecificUser($friendList, $from){	
	$index = "app";
	$host = "localhost";
	$port = "9200";

	//if(!$from){
	//	$from = 0;
	//}

	$size = 20;

	$es = Client::connection("http://$host:$port/$index/$index");

	$searchArr = array(
		'from' => $from,
		'size' => $size,
		"query" => array(
			'bool' => array(
				"should" => array(
					#array push each search term inside this array
				)
			)
		),
		'sort' => array(
			'published' => array(
				"order" => "desc"
			)
		)
	);
	for($f=0; $f<count($friendList); $f++){	
		#searches must all be in lower case
		$temp = array("term" => array("actor.searchable" => strtolower($friendList[$f])));
		array_push($searchArr['query']['bool']['should'], $temp);
		$temp = array("term" => array("actor.name" => strtolower($friendList[$f])));
		array_push($searchArr['query']['bool']['should'], $temp);
		$temp = array("term" => array("actor.displayName" => strtolower($friendList[$f])));
		array_push($searchArr['query']['bool']['should'], $temp);
		$temp = array("term" => array("actor.id" => strtolower($friendList[$f])));
		array_push($searchArr['query']['bool']['should'], $temp);
	}
	
	$res = $es->search($searchArr);
	return ($res); 
}

function matchStarred($serviceList, $from){
	$index = "app";
	$host = "localhost";
	$port = "9200";
	$size = 20;
	
	$es = Client::connection("http://$host:$port/$index/$index");
	
	$searchArr = array(
		"size" => $size,
		"from" => $from,
		'query' => array(
			"bool" => array(
				"should" => array(
					"term" => array("starred" => "true")
				)
			)
		),
		'sort' => array(
			'published' => array(
				"order" => "desc"
			)
		)
	);

	$res = $es->search($searchArr);
	
	return ($res); 
}

function matchStarredClients(){
	$index = "client";
	$host = "localhost";
	$port = "9200";
	
	$es = Client::connection("http://$host:$port/$index/$index");
	$res = $es->search(array(
		'size' => 1000,
		"query" => array(
			'bool' => array(
				"should" => array(
					"term" => array("starred" => "true")
				)
			)
		)
	));
	return $res;
}

function matchFriendsOnOff(){
	$index = "client";
	$host = "localhost";
	$port = "9200";
	
	$es = Client::connection("http://$host:$port/$index/$index");
	$res = $es->search(array(
		'size' => 2000,
		"query" => array(
			'bool' => array(
				"should" => array(
					"term" => array("friendStatus" => "true")
				)
			)
		)
	));
	return $res;
}

function matchShh(){
	$index = "client";
	$host = "localhost";
	$port = "9200";
	
	$es = Client::connection("http://$host:$port/$index/$index");
	$res = $es->search(array(
		'size' => 2000,
		"query" => array(
			'match_all' => array()
		)
	));
	return $res;
}

function matchAllUpdate($size){
	$from = 0;

	$index = "app";
	$host = "localhost";
	$port = "9200";

	$es = Client::connection("http://$host:$port/$index/$index");
	
	$searchArr = array(
		'from' => $from,
		'size' => $size,
		'query' => array(
			'match_all' => array()
		),
		'sort' => array(
			'published' => array(
				"order" => "desc"
			)
		)
	);
	
	$res = $es->search($searchArr);
	
	return $res;
}

function matchSpecificUserUpdate($friendList, $size){	
	$index = "app";
	$host = "localhost";
	$port = "9200";
	
	$from = 0;

	$es = Client::connection("http://$host:$port/$index/$index");
	
	$searchArr = array(
		'from' => $from,
		'size' => $size,
		"query" => array(
			'bool' => array(
				"should" => array(
					#array push each search term inside this array
				)
			)
		),
		'sort' => array(
			'published' => array(
				"order" => "desc"
			)
		)
	);
	
	for($f=0; $f<count($friendList); $f++){	
		#searches must all be in lower case
		$temp = array("term" => array("actor.searchable" => strtolower($friendList[$f])));
		array_push($searchArr['query']['bool']['should'], $temp);
	}

	$res = $es->search($searchArr);
	return ($res); 
}


?>
