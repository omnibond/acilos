<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines server side group of function pertaining to searching filtered queries in Elasticsearch
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
			'bool' => array(
				"should" => array(
					#array push each search term inside this array
				),
				"must" => array(
					#array push each search term inside this array
				)
			)
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
				array_push($searchArr['query']['bool']['should'], $temp);
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
        $myStartTime = @DateTime::createFromFormat('Y-m-d H:i:s', $filterObj['start'] . " 00:00:01");
        
        $myEndTime = @DateTime::createFromFormat('Y-m-d H:i:s', $filterObj['end'] . " 23:59:59");

        array_push($searchArr['filter']['bool']['must'],
                array("range" => array("published" =>
                array("from" =>$myStartTime->format('U'),"to" => $myEndTime->format('U'))
                ))
        );
	}
	#print_r($searchArr);
	$res = $es->search($searchArr);
	
	#print_r($res);
	return ($res); 
		
}

?>
