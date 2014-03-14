<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines server side group of function pertaining to EC2 amazon instances
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