<?php
require 'LoggingRestException.php';
require '../../vendor/autoload.php';

if(!preg_match("/saveServiceCredsFirstTime/i", ($_SERVER['REQUEST_URI']))){
	if(
		(!isset($_COOKIE["facebookCook"]) || ($_COOKIE["facebookCook"] != $_COOKIE['PHPSESSID']) ) && 
		(!isset($_COOKIE["linkedinCook"]) || ($_COOKIE["linkedinCook"] != $_COOKIE['PHPSESSID']) ) && 
		(!isset($_COOKIE["twitterCook"]) || ($_COOKIE["twitterCook"] != $_COOKIE['PHPSESSID']) ) && 
		(!isset($_COOKIE["instagramCook"]) || ($_COOKIE["instagramCook"] != $_COOKIE['PHPSESSID']) )
	) {	
		print_r(json_encode(array("Error" => "your cookies are expired or do not match")));
	}
}

\Slim\Slim::registerAutoloader();
$app = new \Slim\Slim();

# $base = "/Branches/mobileFramework/src/rest/v1.0/";

# $Base = dirname($_SERVER['PHP_SELF']);

/*$app->get("/:var1", function($var1){
	echo "Hello World".$var1;
});*/

function loadClass($transactionClass){

    if(preg_match('/[a-zA-Z]*/', $transactionClass) !== 1){
            throw new LoggingRestException("Invalid transaction class: $transactionClass.", 400);
    }

    if(!file_exists("lib/$transactionClass.php")){
            throw new LoggingRestException("Unknown transaction class: $transactionClass.", 400);
    }

    require_once "lib/$transactionClass.php";

    if(!class_exists($transactionClass)){
            throw new LoggingRestException("Error loading transaction class: $transactionClass.", 500);
    }
}


$app->get("/:service", function($service){

	global $app;

	//try {
		loadClass($service);	
		$instance = new $service();
		echo $instance->query();
	//}catch (Exception $e) {
		//$app->halt($e->getCode(), $e->getMessage());
	//}	
});

$app->get("/:service/:method", function($service, $method){

	global $app;

	//try {
		loadClass($service);	
		$instance = new $service();
		echo $instance->$method();
	//}catch (Exception $e) {
		//$app->halt($e->getCode(), $e->getMessage());
	//}	
});

$app->post("/:service/:method", function($service, $method){

	global $app;

	//try {
		loadClass($service);
		$instance = new $service();
		echo $instance->$method();
	//}catch (Exception $e) {
		//$app->halt($e->getCode(), $e->getMessage());
	//}

});

$app->run();



