<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the poller for all public social media data
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

require_once('../objects/activityObject.php');
require_once('../objects/clientBaseObject.php');
require_once('../../oAuth/twitteroauth/twitteroauth.php');
require_once('../../vendor/autoload.php');

use \ElasticSearch\Client;

function minePublicQueryTerms($service){
	if($service == null){
		
	}else{
		echo $service;
	}
}

//600 = 10 mins
if(!file_exists("../../lockFiles/publicManager.lock") || (time() > filemtime("../../lockFiles/publicManager.lock") + 600)){
	touch("../../lockFiles/publicManager.lock");

	if(isset($_GET['ServiceObj'])){
		$serviceObj = json_decode($_GET['ServiceObj'], true);
		foreach($serviceObj as $key => $value){
			minePublicQueryTerms($key);		
		}
	}else{
		echo "google feed"; ?><br/><?php
		minePublicQueryTerms(null);
	}
	unlink("../../lockFiles/publicManager.lock");
}

















