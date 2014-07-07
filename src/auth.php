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
	session_start();
	$is_xhr = isset($_GET['xhr']) && $_GET['xhr'] == 'true';
	// check cookie and session
	if(isset($_SESSION['authed']) && $_SESSION['authed'] === true) {
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
			header('Location: login.php');
		}
		die();
	}
	
?>