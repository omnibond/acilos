<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines server side group of function pertaining to backing up data on the S3 amazon clouds
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
use \Aws\S3\S3Client;

function createS3Bucket() {
	//make sure that region is correct
	$credArr = array(
		'key'    => '',
		'secret' => '',
		'region' => 'us-east-1'
	);
	//create the client
	$client = S3Client::factory($credArr);
	//check to see if the bucket already exists in S3
	$socialBucket = 'SocialMediaBackup';
	$found = "false";
	//list all buckets in the client
	$result = $client->listBuckets();
	foreach ($result['Buckets'] as $bucket) {
		if($bucket['Name'] == $socialBucket){
			//set found to true
			$found = "true";
		}
	}
	
	if($found == "false"){
		//create Bucket which is like a folder on S3 that files will be uploaded into
		$result = $client->createBucket(array(
		    'Bucket' => $socialBucket
		));
		// Wait until the bucket is created
		$client->waitUntil('BucketExists', array('Bucket' => $socialBucket));
		
		return "Bucket was created for the app";
	}else{
		return "App bucket already exists";
	}
}

function restoreS3File($file) {
	$credArr = array(
		'key'    => '',
		'secret' => '',
		'region' => 'us-east-1'
	);
	//create the client
	$client = S3Client::factory($credArr);
	//check to see if the bucket already exists in S3
	$socialBucket = 'SocialMediaBackup';
	$getResult = $client->getObject(array(
		'Bucket' => $socialBucket,
		'Key'    => $file
	));
	
	$delResult = $client->deleteObjects(
		array(
			'Bucket' => $socialBucket,
			'Objects' => array(
				array(
					'Key' => $file
				)
			)
		)
	);
	
	//return a string and it will be decoded on the other side
	return (string)$getResult['Body'];
}

function getAllS3Files() {
	//make sure that region is correct
	$credArr = array(
		'key'    => '',
		'secret' => '',
		'region' => 'us-east-1'
	);
	//create the client
	$client = S3Client::factory($credArr);
	//check to see if the bucket already exists in S3
	$socialBucket = 'SocialMediaBackup';
	$itemArray = array();
	$iterator = $client->getIterator('ListObjects', array(
		'Bucket' => $socialBucket
	));
	
	foreach ($iterator as $object) {
		array_push($itemArray, $object['Key']);
	}
	
	return $itemArray;
}

function uploadS3File($file){
	//make sure that region is correct
	$credArr = array(
		'key'    => '',
		'secret' => '',
		'region' => 'us-east-1'
	);
	//create the client
	$client = S3Client::factory($credArr);

	//check to see if the bucket already exists in S3
	$socialBucket = 'SocialMediaBackup';

	$result = $client->putObject(array(
	    'Bucket'     => $socialBucket,
	    'Key'        => $file,
	    'SourceFile' => $file,
	    'Metadata'   => array()
	));
	// We can poll the object until it is accessible
	$client->waitUntilObjectExists(array(
	    'Bucket' => $socialBucket,
	    'Key'    => $file
	));
	
	return "success";
}

?>