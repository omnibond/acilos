<?php

use \ElasticSearch\Client;
use \Aws\Ec2\Ec2Client;

function rebootEC2Instance($id){
	$credArr = array(
		'key'    => '',
		'secret' => '',
		'region' => 'us-east-1'
	);
	//create the client
	$client = Ec2Client::factory($credArr);
	
	$result = $client->rebootInstances(array(
		'InstanceIds' => array($id)
	));
	
	return $result;
}

function getInstances(){
	$credArr = array(
		'key'    => '',
		'secret' => '',
		'region' => 'us-east-1'
	);
	//create the client
	$client = Ec2Client::factory($credArr);
	
	$result = $client->DescribeInstances(array(
		'Filters' => array(
			array('Name' => 'instance-type', 'Value' => array('t1.micro'))
			//array('Name' => 'instance-state', 'Values' => array('running'))
		)
	));
	
	return $result;
}

?>