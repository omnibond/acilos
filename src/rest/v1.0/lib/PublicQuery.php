<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines server side group of function pertaining to Searches
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

class PublicQuery{
	public function writeQueryTerm(){
		$var = file_get_contents("php://input");
		$varObj = json_decode($var, true);

		print_r($varObj);
		try{
			$queryObj = file_get_contents("../../publicQueryTermObj.json");
			$queryObj = json_decode($queryObj, true);

			//print_r($queryObj);

			$services = array();
			$feeds = array();

			foreach($varObj['services'] as $key => $value){
				if($varObj['services'][$key] == true){
					array_push($services, $key);
				}
			}

			for($x = 0; $x < count($varObj['feeds']); $x++){
				array_push($feeds, $varObj['feeds'][$x]);
			}

			$queryObj[$varObj['feedName']] = array(
				"Services" => $services,
				"terms" => $varObj['queryString'],
				"feeds" => $feeds
			);

			//print_r($queryObj);

			file_put_contents("../../publicQueryTermObj.json", json_encode($queryObj));
		}catch (Exception $e){
			$services = array();
			$feeds = array();

			foreach($varObj['services'] as $key => $value){
				if($varObj['services'][$key] == true){
					array_push($services, $key);
				}
			}

			for($x = 0; $x < count($varObj['feeds']); $x++){
				array_push($feeds, $varObj['feeds'][$x]);
			}

			$queryObj = array(
				$varObj['feedName'] => array(
					"Services" => $services,
					"terms" => $varObj['queryString'],
					"feeds" => $feeds
				)
			);

			//print_r($queryObj);

			file_put_contents("../../publicQueryTermObj.json", json_encode($queryObj));
		}
	}

	public function getPublicQueryObject(){
		$file = "../../publicQueryTermObj.json";
		$var = file_get_contents($file);

		return $var;
	}

	public function deletePublicQueryObjectTerm(){
		$var = file_get_contents("php://input");
		$fileName = "../../publicQueryTermObj.json";

		$param = json_decode($var, true);

		//print_r($param);

		$term = $param['term'];

		$feedList = file_get_contents($fileName);
		$obj = json_decode($feedList, true);

		if(isset($obj[$term])){
			unset($obj[$term]);
		}

		file_put_contents("../../publicQueryTermObj.json", json_encode($obj));
		return json_encode(array("success" => "success"));
	}
}