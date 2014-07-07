<?php

/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines server side group of function pertaining to queries for Blasting posts
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
require_once('../../oAuth/twitteroauth/twitteroauth.php');
require_once('authCalls.php');

class Cliffton{

	function function1(){
		//POST
		$var = file_get_contents("php://input");
		$postVars = json_decode($var, true);
		
		$postParam1 = $postVars['param1'];
		
		//GET
		$getVars = $_GET['param1'];
		
		$getParam1 = $getVars['param1'];
	}

}

?>