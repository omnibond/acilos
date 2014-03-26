/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the mainView for the logout module
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
		'dojo-mama/views/ModuleScrollableView',
		'dojo/dom-construct',
		'dojo/topic',
		'dojo/_base/kernel',
		"dojo/_base/lang",
		"dojo/DeferredList",
		
		"dojo-mama/util/RoundRectList",
		"dojox/mobile/ListItem",
		"dojox/mobile/Button",
		
		'app/util/xhrManager'
], function(
		declare, 
		ModuleScrollableView, 
		domConstruct, 
		topic, 
		kernel, 
		lang, 
		DeferredList, 
		
		RoundRectList, 
		ListItem, 
		Button, 
		
		xhrManager
) {
	return declare([ModuleScrollableView], {	
		
		activate: function(){
			window.location = "login.php?logout=true";
		}
	})
});