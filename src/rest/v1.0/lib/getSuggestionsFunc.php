<?php

use \ElasticSearch\Client;
	
function getSuggestionsFunc($word){ 
	
	$index = "client";
	$host = "localhost";
	$port = "9200";
	
	$searchArr = array(
	    "facets" => array(
			"results" => array(
			    "terms" => array( 
					"field" => "data.searchIndex"
			    )
			)
	    ),
	    "query" => array(
			"match" => array(
				"data.searchIndex.autocomplete" => $word
			)
	    )
	);



	$es = Client::connection("http://$host:$port/$index/$index");
	
	$arr = $es->search($searchArr);
	
	return $arr;
	
}

?>
