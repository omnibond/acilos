<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines a credential checker for all services
** This code is DEPRECATED in favor authAccounts tab in the app
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

require_once('../../vendor/autoload.php');
require_once('../../oAuth/twitteroauth/twitteroauth.php');

$credentialObject = array(
	"Linkedin" => array(
		"status" => "bad"
	),
	"Twitter" => array(
		"status" => "bad"
	),
	"Facebook" => array(
		"status" => "bad"
	),
	"Instagram" => array(
		"status" => "bad"
	)
);

function checkFacebook(){
	$fileName = "../../oAuth/facebookToken.txt";
	$var = file_get_contents($fileName);
	$varObj = json_decode($var, true);
	
	$attachment =  array(
		'access_token' => $varObj['access_token']
		//'access_token' => "FAKEACCESSTOKEN"
	);
	
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL,'https://graph.facebook.com/me');
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $attachment);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);  //to suppress the curl output 
	$result = curl_exec($ch);
	curl_close ($ch);
	
	if($result == "true"){
		global $credentialObject;
		$credentialObject['Facebook']['status'] = "good";
	}
}

function checkTwitter(){
	$fileName = "../../oAuth/twitterClientInfo.txt";
	$var = file_get_contents($fileName);
	$varObj = json_decode($var, true);
	
	$oauth_Token = $varObj['accessToken'];
	$oauth_TokenSecret = $varObj['oauthSecret'];
	$consumer_key = $varObj['appKey'];
	$consumer_secret = $varObj['appSecret'];
	$access_token = $varObj['accessToken'];
	$access_secret = $varObj['accessSecret'];

	$connection = new TwitterOAuth($consumer_key, $consumer_secret, $oauth_Token, $access_secret);

	$account = $connection->get('account/verify_credentials');
	
	if(isset($account->name)){
		global $credentialObject;
		$credentialObject['Twitter']['status'] = "good";
	}
}

function checkLinkedIn(){
	$fileName = "../../oAuth/linkedinUserCreds.txt";
	$var = file_get_contents($fileName);
	$varObj = json_decode($var, true);

	$access_token = $varObj['access_token'];
	$api_Key = $varObj['apiKey'];
	$api_Secret = $varObj['apiSecret'];
	$user_Id = $varObj['userId'];

	$params = array('oauth2_access_token' => $access_token,
                    'format' => 'json',
              );
     
    // Need to use HTTPS
    $url = 'https://api.linkedin.com/v1/people/~/connections?' . http_build_query($params);
    // Tell streams to make a (GET, POST, PUT, or DELETE) request
    $context = stream_context_create(
	    array('http' => 
		array('method' => 'GET',
		)
	    )
	);

	$response = file_get_contents($url, false, $context);
	$responseObj = json_decode($response, true);

	if(isset($responseObj['_total'])){
		global $credentialObject;
		$credentialObject['Linkedin']['status'] = "good";
	}
}

function checkInstagram(){
	$fileName = '../../oAuth/instaToken.txt';
	$var = file_get_contents($fileName);
	$varObj = json_decode($var, true);

	$access_token = $varObj['access_token'];
	$access_token_FAKE = 'bob';
	$user_id = $varObj['user_id'];

	$url = 'https://api.instagram.com/v1/users/self/?&access_token=' . $access_token;
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$response = curl_exec($ch);
	curl_close($ch);

	$responseObj = json_decode($response, true);

	if(isset($responseObj['data']['username'])){
		global $credentialObject;
		$credentialObject['Instagram']['status'] = "good";
	}
}

checkFacebook();
checkTwitter();
checkLinkedIn();
checkInstagram();

print_r($credentialObject);

