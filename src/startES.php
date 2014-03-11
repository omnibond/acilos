<?php
require_once('vendor/autoload.php');
use \ElasticSearch\Client;

#$index = $_GET['index']; 
#$host = $_GET['host'];
#$port = $_GET['port'];
#$mapping = $_GET['mapping'];
$counter = 0;

#WIPE OLD ES
function wipe($counter, $es){
	echo $counter;
	$counter++;
	try{
		$es->delete();
	}catch (Exception $e){
		if($counter < 20){
			sleep(1);
			wipe($counter, $es);
		}else{
			throw new Exception( "Database failed to launch", 0, $e );
		}
	}
}

#$index = $_GET['index'];
#$host = $_GET['host'];
#$port = $_GET['port'];
#$mapping = $_GET['mapping'];

$host = "localhost";
$port = "9200";
$index1 = "app";
$index2 = "client";
$index3 = "auth";

$es = Client::connection("http://$host:$port/$index1/$index1");
$es->delete();
$es = Client::connection("http://$host:$port/$index2/$index2");
$es->delete();
$es = Client::connection("http://$host:$port/$index3/$index3");
$es->delete();

$mapCommand = "curl -XPUT 'http://$host:$port/$index1' -d @app_mapping.json";
$output = shell_exec($mapCommand);

$mapCommand = "curl -XPUT 'http://$host:$port/$index2' -d @client_mapping.json";
$output = shell_exec($mapCommand);

$mapCommand = "curl -XPUT 'http://$host:$port/$index3' -d @auth_mapping.json";
$output = shell_exec($mapCommand);
#Now we should have a clean and mapped elasticsearch that is ready to go

?>
