<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines server side group of function pertaining to getting count sizes on queries to save memory
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

function saveFacebookPost($response, $postType, $postStatus, $postID, $file, $fileType, $msg, $server, $access_token, $app_id, $user_id, $date, $time){
	if(isset($response)){
		$response = $response;
	}else{
		$response = "";
	}

	if(isset($postStatus)){
		$postStatus = $postStatus;
	}else{
		$postStatus = "";
	}

	if(isset($postID)){
		$postID = $postID;
	}else{
		$postID = "";
	}

	if(isset($file)){
		$file = $file;
	}else{
		$file = "";
	}

	if(isset($fileType)){
		$fileType = $fileType;
	}else{
		$fileType = "";
	}

	if(isset($msg)){
		$msg = $msg;
	}else{
		$msg = "";
	}

	if(isset($server)){
		$server = $server;
	}else{
		$server = "";
	}

	if(isset($access_token)){
		$access_token = $access_token;
	}else{
		$access_token = "";
	}

	if(isset($app_id)){
		$app_id = $app_id;
	}else{
		$app_id = "";
	}

	if(isset($user_id)){
		$user_id = $user_id;
	}else{
		$user_id = "";
	}

	if(isset($date)){
		$date = $date;
	}else{
		$date = "";
	}

	if(isset($time)){
		$time = $time;
	}else{
		$time = "";
	}

	try{
		$fileObj = file_get_contents($_SERVER['POSTLOG']);
		$fileObj = json_decode($fileObj, true);

		$fileObj[$postID]['fileName'] = $file;
		$fileObj[$postID]['fileType'] = $fileType;
		$fileObj[$postID]['service'] = "facebook";
		$fileObj[$postID]['msg'] = $msg;
		$fileObj[$postID]['server'] = $server;
		$fileObj[$postID]['facebook'] = array();
		$fileObj[$postID]['facebook']['access_token'] = $access_token;
		$fileObj[$postID]['facebook']['app_id'] = $app_id;
		$fileObj[$postID]['facebook']['user_id'] = $user_id;
		$fileObj[$postID]['facebook']['response'] = $response;
		$fileObj[$postID]['postStatus'] = $postStatus;
		$fileObj[$postID]['date'] = $date;
		$fileObj[$postID]['time'] = $time;

		file_put_contents($_SERVER['POSTLOG'], json_encode($fileObj));
	}catch(Exception $e){
		$fileObj = array();

		$fileObj[$postID]['fileName'] = $file;
		$fileObj[$postID]['fileType'] = $fileType;
		$fileObj[$postID]['service'] = "facebook";
		$fileObj[$postID]['msg'] = $msg;
		$fileObj[$postID]['server'] = $server;
		$fileObj[$postID]['facebook'] = array();
		$fileObj[$postID]['facebook']['access_token'] = $access_token;
		$fileObj[$postID]['facebook']['app_id'] = $app_id;
		$fileObj[$postID]['facebook']['user_id'] = $user_id;
		$fileObj[$postID]['facebook']['response'] = $response;
		$fileObj[$postID]['postStatus'] = $postStatus;
		$fileObj[$postID]['date'] = $date;
		$fileObj[$postID]['time'] = $time;

		file_put_contents($_SERVER['POSTLOG'], json_encode($fileObj));
	}
}

function saveLinkedInPost($response, $postType, $postStatus, $postID, $file, $fileType, $msg, $server, $access_token, $date, $time){
	if(isset($response)){
		$response = $response;
	}else{
		$response = "";
	}

	if(isset($postStatus)){
		$postStatus = $postStatus;
	}else{
		$postStatus = "";
	}

	if(isset($postID)){
		$postID = $postID;
	}else{
		$postID = "";
	}

	if(isset($file)){
		$file = $file;
	}else{
		$file = "";
	}

	if(isset($fileType)){
		$fileType = $fileType;
	}else{
		$fileType = "";
	}

	if(isset($msg)){
		$msg = $msg;
	}else{
		$msg = "";
	}

	if(isset($server)){
		$server = $server;
	}else{
		$server = "";
	}

	if(isset($access_token)){
		$access_token = $access_token;
	}else{
		$access_token = "";
	}

	if(isset($date)){
		$date = $date;
	}else{
		$date = "";
	}

	if(isset($time)){
		$time = $time;
	}else{
		$time = "";
	}

	try{
		$fileObj = file_get_contents($_SERVER['POSTLOG']);
		$fileObj = json_decode($fileObj, true);

		$fileObj[$postID]['fileName'] = $file;
		$fileObj[$postID]['fileType'] = $fileType;
		$fileObj[$postID]['service'] = "linkedin";
		$fileObj[$postID]['msg'] = $msg;
		$fileObj[$postID]['server'] = $server;
		$fileObj[$postID]['linkedin'] = array();
		$fileObj[$postID]['linkedin']['access_token'] = $access_token;
		$fileObj[$postID]['linkedin']['response'] = $response;
		$fileObj[$postID]['postStatus'] = $postStatus;
		$fileObj[$postID]['date'] = $date;
		$fileObj[$postID]['time'] = $time;
		
		file_put_contents($_SERVER['POSTLOG'], json_encode($fileObj));
	}catch(Exception $e){
		$fileObj = array();

		$fileObj[$postID]['fileName'] = $file;
		$fileObj[$postID]['fileType'] = $fileType;
		$fileObj[$postID]['service'] = "linkedin";
		$fileObj[$postID]['msg'] = $msg;
		$fileObj[$postID]['server'] = $server;
		$fileObj[$postID]['linkedin'] = array();
		$fileObj[$postID]['linkedin']['access_token'] = $access_token;
		$fileObj[$postID]['linkedin']['response'] = $response;
		$fileObj[$postID]['postStatus'] = $postStatus;
		$fileObj[$postID]['date'] = $date;
		$fileObj[$postID]['time'] = $time;

		file_put_contents($_SERVER['POSTLOG'], json_encode($fileObj));
	}
}

function saveTwitterPost($response, $postType, $postStatus, $postID, $file, $fileType, $msg, $server, $access_token, $access_secret, $appKey, $appSecret, $date, $time){
	if(isset($response)){
		$response = $response;
	}else{
		$response = "";
	}

	if(isset($postStatus)){
		$postStatus = $postStatus;
	}else{
		$postStatus = "";
	}

	if(isset($postID)){
		$postID = $postID;
	}else{
		$postID = "";
	}

	if(isset($file)){
		$file = $file;
	}else{
		$file = "";
	}

	if(isset($fileType)){
		$fileType = $fileType;
	}else{
		$fileType = "";
	}

	if(isset($msg)){
		$msg = $msg;
	}else{
		$msg = "";
	}

	if(isset($server)){
		$server = $server;
	}else{
		$server = "";
	}

	if(isset($access_token)){
		$access_token = $access_token;
	}else{
		$access_token = "";
	}

	if(isset($access_secret)){
		$access_secret = $access_secret;
	}else{
		$access_secret = "";
	}

	if(isset($appKey)){
		$appKey = $appKey;
	}else{
		$appKey = "";
	}

	if(isset($appSecret)){
		$appSecret = $appSecret;
	}else{
		$appSecret = "";
	}

	if(isset($date)){
		$date = $date;
	}else{
		$date = "";
	}

	if(isset($time)){
		$time = $time;
	}else{
		$time = "";
	}

	try{
		$fileObj = file_get_contents($_SERVER['POSTLOG']);
		$fileObj = json_decode($fileObj, true);

		$fileObj[$postID]['fileName'] = $file;
		$fileObj[$postID]['fileType'] = $fileType;
		$fileObj[$postID]['service'] = "twitter";
		$fileObj[$postID]['msg'] = $msg;
		$fileObj[$postID]['server'] = $server;
		$fileObj[$postID]['twitter'] = array();
		$fileObj[$postID]['twitter']['access_token'] = $access_token;
		$fileObj[$postID]['twitter']['access_secret'] = $access_secret;
		$fileObj[$postID]['twitter']['appKey'] = $appKey;
		$fileObj[$postID]['twitter']['appSecret'] = $appSecret;
		$fileObj[$postID]['twitter']['response'] = $response;
		$fileObj[$postID]['postStatus'] = $postStatus;
		$fileObj[$postID]['date'] = $date;
		$fileObj[$postID]['time'] = $time;
		
		file_put_contents($_SERVER['POSTLOG'], json_encode($fileObj));
	}catch(Exception $e){
		$fileObj = array();

		$fileObj[$postID]['fileName'] = $file;
		$fileObj[$postID]['fileType'] = $fileType;
		$fileObj[$postID]['service'] = "twitter";
		$fileObj[$postID]['msg'] = $msg;
		$fileObj[$postID]['server'] = $server;
		$fileObj[$postID]['twitter'] = array();
		$fileObj[$postID]['twitter']['access_token'] = $access_token;
		$fileObj[$postID]['twitter']['access_secret'] = $access_secret;
		$fileObj[$postID]['twitter']['appKey'] = $appKey;
		$fileObj[$postID]['twitter']['appSecret'] = $appSecret;
		$fileObj[$postID]['twitter']['response'] = $response;
		$fileObj[$postID]['postStatus'] = $postStatus;
		$fileObj[$postID]['date'] = $date;
		$fileObj[$postID]['time'] = $time;

		file_put_contents($_SERVER['POSTLOG'], json_encode($fileObj));
	}
}

?>