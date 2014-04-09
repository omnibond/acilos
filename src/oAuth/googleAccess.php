<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the redirect script that saves tokens and user data for logged in accounts to the app
** This is DEPRECATED
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

error_reporting(E_ALL);
ini_set("display_errors", 1);

$client_id = '1091545547604.apps.googleusercontent.com';
$client_secret = '68uk8nqoNzmcwveRTqs-ucmH';
$redirect_uri = 'http://richardgpc.clemson.edu/oAuth/googleAccess.php';

$scope = 'https://sites.google.com/feeds/';
$state = '';
$response_type = 'code';
$access_type = 'offline';
$approval_prompt = 'auto';

function refresh_token($token, $client_id, $client_secret){
	$params = array(
		"refresh_token" => $token,
		"client_id" => $client_id,
		"client_secret" => $client_secret,
		"grant_type" => 'refresh_token'
	);
	
	$url = "https://accounts.google.com/o/oauth2/token";
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	#here is a new access_token object minues the refresh_token, so add it and then write to the file
	$response = curl_exec($ch);		
	curl_close($ch);
	
	#the decode true param turns them into assoc arrays, 
	#decode to add the refresh token to the object
	$obj = json_decode($response, true);
	$obj['refresh_token'] = $token;

	#encode to make a string to write to file with
	$json = json_encode($obj);
	
	$filename = "googleToken.txt";
	$fp = fopen($filename, 'w') or die("Cannot open file " . $filename);
	fwrite($fp, $json);
	fclose($fp);
}

#this function gets the access_token and the refresh_token it is the callback for fakeCentral.php
if(isset($_GET['code'])){
	#code is what we get abck from fakeCentral calling google for the first quth step
	$code = $_GET["code"];

	#echo "The code is: " . $code; ?><br/><br/><?php
	
	$url = "https://accounts.google.com/o/oauth2/token";
	
	#with the new code we set up the post to get the refreshToken and accessToken from google
	$params = array(
		"code" => $code,
		"client_id" => $client_id,
		"client_secret" => $client_secret,
		"redirect_uri" => $redirect_uri,
		"grant_type" => 'authorization_code'
	);
	
	$ch = curl_init($url);
	
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	
	#response should now be a json with the accessToken and refreshToken as a json string
	$response = curl_exec($ch);
	curl_close($ch);
	
	#decode that string and now u have a json that you can play with
	#the decode true param turns them into assoc arrays
	$obj = json_decode($response, true);
	$userURL = "https://www.googleapis.com/plus/v1/people/me?access_token=".$obj['access_token'];
	$answer = file_get_contents($userURL);
	$object = json_decode($answer, true);
	
	#set the timestamp and the userID
	$obj['time'] = `date +%s`;
	$obj['userID'] = $object['id'];
	
	$ds = ldap_connect('ccedirdev.clemson.edu');
	$login = ldap_bind($ds, 'cn=nimda,o=cuvault', 'd0j0h3ads');
	
	$param = json_encode($obj);
	
#	$info['vaultdataauthority'] = $param;

	#MODIFY
#	$result = ldap_modify($ds, "Vaultzid=27247e25-9b4c-ff48-b15d-25871ced,ou=Identities,o=cuvault-gen", $info);

#	ldap_close($ds);
	
        if($obj['refresh_token']){
		$filename = "googleToken.txt";
		#write out $response to the file because then we can read the whole file later and json_encode it for use
		$fp = fopen($filename, 'w') or die("Cannot open file " . $filename);
		fwrite($fp, $param);
		fclose($fp);
	}else{
		echo "ERROR: No refresh token was returned" . $response; ?><br/><?php
	}
	
	echo "<html><head></head><body><div>You have successfully authenticated with Google, please close this window</div><script type=\"text/javascript\">window.close()</script></body></html>";
	
	#call refreshToken with token, clientID, and clientSecret to get a new access token when old one expires
#	refresh_token( $obj['refresh_token'], $client_id, $client_secret);
	
	#FOR Google sites API add v=1.4 as a query parameter to specify GdataVersion 1.4 if it cant be done with headers
	
	
}else{
	echo "ERROR: No code was sent to this script"; ?><br/><?php
}

?>