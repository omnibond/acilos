/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the credenialUtil manager which manages which services have valid credentials
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
define(['dojo/_base/declare',
		'dojo/_base/kernel',
		'dojo/topic',
		'dojo-mama/util/toaster',
		'dojo/_base/lang',
		'dojo/dom',
		'dojo/query',
		'dojo/dom-class',
		
		'app/util/xhrManager'
	], function(
		declare, 
		kernel, 
		topic, 
		toaster,
		lang,
		dom,
		query,
		domClass,
		
		xhrManager
	){
	
	//define these as normal functions that can then be called from the rest of the object
	var checkCredentials = function(){
		return xhrManager.send('GET', 'rest/v1.0/Credentials/checkForServiceCreds')
	};
	
	var updateCredStatus = function(obj){
		kernel.global.notifications.credObj = '';
		console.log("credStatus: ", obj);
		if(obj['status'] == "false"){
			window.location = "login.php?logout=true";
		}
	};
		
	var credentialUtil = declare([], {
		
		makeItHappen: function(){
			checkCredentials().then(lang.hitch(this, updateCredStatus));
			//still need to lang.hitch this where this is the function scope
			window.setInterval(lang.hitch(this, function(){
				checkCredentials().then(lang.hitch(this, updateCredStatus));
			//check every 30 seconds
			//}), 90000);	
			}), 5000);
		}
	
	});

	return new credentialUtil();
});
