<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines server side group of function pertaining to Starring favorite posts/people
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

function setStarred($id, $status){
	$index = "app";
	$host = "localhost";
	$port = "9200";

	$es = Client::connection("http://$host:$port/$index/$index");
	$obj = $es->get($id);

	$obj['starred'] = $status;

	$res = $es->index($obj, $obj['id']);
	
	if(isset($res['ok'])){
		return 'success';
	}else{
		return 'error';
	}

}

function setIsLiked($id, $liked){
	$index = "app";
	$host = "localhost";
	$port = "9200";

	$es = Client::connection("http://$host:$port/$index/$index");
	$obj = $es->get($id);

	print_r($obj);

	if($liked == "true"){
		$obj['isLiked'] = $liked;
		
		 array_push($obj['content']['likes'], array("id" => $id));
	}else{
		$obj['isLiked'] = $liked;
	        for($x = 0; $x < count($obj['content']['likes']); $x++){
	            if($obj['content']['likes'][$x]['id'] == $id){
	                array_splice($obj['content']['likes'], $x, 1);
	            }
	        }
		$obj['isLiked'] = $liked;
	}

	$res = $es->index($obj, $obj['id']);
	
	if(isset($res['ok'])){
		return 'success';
	}else{
		return 'error';
	}

}

function setIsCommented($id){
	$index = "app";
	$host = "localhost";
	$port = "9200";

	$es = Client::connection("http://$host:$port/$index/$index");
	$obj = $es->get($id);
	
	$obj['isCommented'] = "true";

	$res = $es->index($obj, $obj['id']);
	
	if(isset($res['ok'])){
		return 'success';
	}else{
		return 'error';
	}

}

function setIsFavorited($id, $favorited){
	$index = "app";
	$host = "localhost";
	$port = "9200";

	$es = Client::connection("http://$host:$port/$index/$index");
	$obj = $es->get($id);
	
	if($favorited){
		$obj['isLiked'] = $favorited;
	}else{
		$obj['isLiked'] = $favorited;
	}
	
	$res = $es->index($obj, $obj['id']);
	
	if(isset($res['ok'])){
		return 'success';
	}else{
		return 'error';
	}

}

