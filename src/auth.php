<?php

	/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the auth page to manage logging in and checking for cookies/sessionIDs
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

	$browser = $_SERVER['HTTP_USER_AGENT'];
	
	$is_xhr = isset($_GET['xhr']) && $_GET['xhr'] == 'true';
	
	function getData(){
		try{
			$credObj = file_get_contents("serviceCreds.json");
			$credObj = json_decode($credObj, true);
		}catch (Exception $e){
			$credObj = array(
				"facebook" => array(),
				"twitter" => array(),
				"linkedin" => array(),
				"instagram" => array(),
				"login" => "first"
			);
			file_put_contents("serviceCreds.json", json_encode($credObj));
		}
		return $credObj;
	}
	
	// check cookie and session
	if(
		(isset($_COOKIE["facebookCook"]) && ($_COOKIE["facebookCook"] == $_COOKIE['PHPSESSID'])) ||
		(isset($_COOKIE["linkedinCook"]) && ($_COOKIE["linkedinCook"] == $_COOKIE['PHPSESSID'])) || 
		(isset($_COOKIE["twitterCook"]) && ($_COOKIE["twitterCook"] == $_COOKIE['PHPSESSID'])) ||
		(isset($_COOKIE["instagramCook"]) && ($_COOKIE["instagramCook"] == $_COOKIE['PHPSESSID'])) 
	) {
		//if logged in..
		if($is_xhr) {
			echo json_encode(array("status" => "true"));
		} else {
			//for all other browsers than firefox, go to the redirect
			if(!preg_match("/Firefox/", $browser)){
				header('Location: ' . $_SERVER['REDIRECT_URL']);
			}
		}
	}else{
		// if not logged in..
		if($is_xhr) {			
			echo json_encode(array("status" => "false"));
		} else {
			$var = getData();
			if(isset($var['login']) && $var['login'] == "first"){
				header('Location: credentials.php');
			}else{
				header('Location: login.php');
			}
		}
	}
	
?>