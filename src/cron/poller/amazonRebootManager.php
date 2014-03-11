<?php

require '../../vendor/autoload.php';

use \Aws\Ec2\Ec2Client;

$id = file_get_contents('http://169.254.169.254/latest/meta-data/instance-id');

$credArr = array(
	'key'    => 'AKIAJS2QEUMYI7DKZYUA',
	'secret' => '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',
	'region' => 'us-east-1'
);
//create the client
$client = Ec2Client::factory($credArr);

$result = $client->rebootInstances(array(
	'InstanceIds' => array($id)
));

?>