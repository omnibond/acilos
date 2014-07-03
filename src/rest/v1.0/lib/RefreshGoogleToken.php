<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the poller for all social media data
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

function refreshGoogToken($uuid){
	//print_r("refreshing google token");
	$credObj = file_get_contents($_SERVER['SERVICECREDS']);
	$credObj = json_decode($credObj, true);
	
	$obj = $credObj['google'][0]['accounts'];
	
	$found = "false";
	for($d = 0; $d < count($obj); $d++){
		if($uuid = $obj[$d]['uuid']){
			$acct = $obj[$d];
			$found = "true";
			break;
		}
	}
	
	if($found == "false"){
		return "User account was not found";
	}
	if(!isset($acct['refreshToken'])){
		return "refresh token does not exist";
	}
	
	$params = array(
		"refresh_token" => $acct['refreshToken'],
		"client_id" => $credObj['google'][0]['key'],
		"client_secret" => $credObj['google'][0]['secret'],
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
	$credObj['google'][0]['accounts'][$d]['accessToken'] = $obj['access_token'];
	$credObj['google'][0]['accounts'][$d]['expiresAt'] = @time() . intval($obj['expires_in']);
	
	file_put_contents($_SERVER['SERVICECREDS'], json_encode($credObj));
	
	return $obj['access_token'];
}

?>