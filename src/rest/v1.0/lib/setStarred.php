<?php

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

