<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines server side group of function pertaining to app contacts / clients
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
	
function getClient($id){
	$index = "client";
	$host = "localhost";
	$port = "9200";
	
	$es = Client::connection("http://$host:$port/$index/$index");
	$res = $es->get($id);
	
	//print_r($res);
	return $res;
}

function getSecondClients($from){
	$index = "client";
	$host = "localhost";
	$port = "9200";
	
	if(!isset($from)){
		$from = 0;
	}
	
	$es = Client::connection("http://$host:$port/$index/$index");
	$res = $es->search(array(
		'from' => $from,
		'size' => 20,
		"query" => array(
			'bool' => array(
				"should" => array(
					"term" => array("friendDegree" => "second")
				)
			)
		),
		'sort' => array(
			'data.post.recentPostTime' => array(
				"order" => "desc"
			)
		)
	));
	
	return $res;
}

function getFirstClients($from){
	$index = "client";
	$host = "localhost";
	$port = "9200";
	
	if(!isset($from)){
		$from = 0;
	}
	
	$es = Client::connection("http://$host:$port/$index/$index");
	$res = $es->search(array(
		'from' => $from,
		'size' => 20,
		"query" => array(
			'bool' => array(
				"should" => array(
					"term" => array("friendDegree" => "first")
				)
			)
		),
		'sort' => array(
			'alphaIndex' => array(
				"order" => "asc"
			)
		)
	));
	
	return $res;
}

function getClients($from){
	$index = "client";
	$host = "localhost";
	$port = "9200";
	
	if(!isset($from)){
		$from = 0;
	}
	
	$es = Client::connection("http://$host:$port/$index/$index");
	$res = $es->search(array(
		'from' => $from,
		'size' => 20,
		"query" => array(
			'bool' => array(
				"should" => array(
					"term" => array("ownedBy" => "none")
				)
			)
		),
		'sort' => array(
			'alphaIndex' => array(
				"order" => "asc"
			)
		)
	));
	
	return $res;
}

function getAlphaClients($from){
	$index = "client";
	$host = "localhost";
	$port = "9200";
	
	if(!isset($from)){
		$from = 0;
	}
	
	$es = Client::connection("http://$host:$port/$index/$index");
	$res = $es->search(array(
		'from' => $from,
		'size' => 20,
		'query' => array(
			'bool' => array(
				'must' => array(
					"range" => array(
						'totalPosts' => array(
							"from" => 1
						)
					)
				)
			)
		),
		'sort' => array(
			'alphaIndex' => array(
				"order" => "asc"
			)
		)
	));
	
	return $res;
}

function getChattyClients($from){
	$index = "client";
	$host = "localhost";
	$port = "9200";
	
	if(!isset($from)){
		$from = 0;
	}
	
	$es = Client::connection("http://$host:$port/$index/$index");
	$res = $es->search(array(
		'from' => $from,
		'size' => 20,
		'query' => array(
			'bool' => array(
				'must' => array(
					"range" => array(
						'totalPosts' => array(
							"from" => 1
						)
					)
				)
			)
		),
		'sort' => array(
			'totalPosts' => array(
				"order" => "desc"
			)
		)
	));
	
	#print_r($res);
	
	return $res;
}

function getTopClients($numClients){
	$index = "client";
	$host = "localhost";
	$port = "9200";
	
	$es = Client::connection("http://$host:$port/$index/$index");
	$res = $es->search(array(
		'from' => 0,
		'size' => $numClients,
		"query" => array(
			'match_all' => array()
		),
		'filter' => array(
			'bool' => array(
				'must' => array(
					"range" => array(
						'totalPosts' => array(
							"from" => 1
						)
					)
				)
			)
		),
		'sort' => array(
			'totalPosts' => array(
				"order" => "desc"
			)
		)
	));
	
	#print_r($res);
	
	return $res;
}

function getRecentClients($from){
	$index = "client";
	$host = "localhost";
	$port = "9200";
	
	if(!isset($from)){
		$from = 0;
	}
	
	$es = Client::connection("http://$host:$port/$index/$index");
	$res = $es->search(array(
		'from' => $from,
		'size' => 20,
		"query" => array(
			'bool' => array(
				"should" => array(
					"term" => array("ownedBy" => "none")
				)
			)
		),
		'sort' => array(
			'data.post.recentPostTime' => array(
				"order" => "desc"
			)
		)
	));
	
	#print_r($res);
	
	return $res;
}

function shh($id, $time){
	$index = "client";
	$host = "localhost";
	$port = "9200";

	$es = Client::connection("http://$host:$port/$index/$index");
	$obj = $es->get($id);

	$client['data']['shh'] = $time;

	$res = writeClient($client);
	
	if(isset($res['ok'])){
		return 'success';
	}else{
		return 'error';
	}

}

function setFriendStat($status, $id){
	$index = "client";
	$host = "localhost";
	$port = "9200";

	$es = Client::connection("http://$host:$port/$index/$index");
	$client = $es->get($id);
	
	$client['data']['friendStatus'] = $status;

	$res = writeClient($client);
	
	if(isset($res['ok'])){
		return 'success';
	}else{
		return 'error';
	}

}

function writeClient($obj){
	$index = "client";
	$host = "localhost";
	$port = "9200";

	$es = Client::connection("http://$host:$port/$index/$index/");
	$grr = $es->index($obj, $obj['data']['id']);
	return $grr;
}

?>
