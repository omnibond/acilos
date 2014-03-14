<?php

require_once('getSuggestionsFunc.php');

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines server side group of function pertaining to findContact functions in the app
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
