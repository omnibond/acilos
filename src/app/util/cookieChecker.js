/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the cookieChecker manager which validates that the server has the proper cookies
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
	var checkCreds = function(){
		var params = {xhr: "true"};
		return xhrManager.send('GET', 'auth.php', params);
	};
	
	var passFail = function(obj){
		if(obj['status'] == "false"){
			window.location = "login.php";
		}
		//console.log("Cookie is good");
	};
	
	var cookieChecker = declare([], {
		
		makeItHappen: function(){
			checkCreds().then(lang.hitch(this, passFail));
			//still need to lang.hitch this where this is the function scope
			window.setInterval(lang.hitch(this, function(){
				//console.log("CHECKIN MAH COOKIES");
				checkCreds().then(lang.hitch(this, passFail));
			
				//5 mins
			//}), 300000);	
				
			//15s
			}), 45000);	
		}
	
	});

	return new cookieChecker();
});
