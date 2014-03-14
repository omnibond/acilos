/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the locateMe module
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
define([
	'dojo/_base/declare',
	'dojo-mama/Module',
	"dojo/_base/lang",
	
	'app/util/xhrManager',
	
	'app/locateUsers/MainView'
], function(
	declare, 
	Module, 
	lang, 
	xhrManager, 
	MainView
) {
	return declare([Module], {
		postCreate: function(){
			this.inherited(arguments);
			
			this.rootView = new MainView({
				route: '/',

				getAroundMe: lang.hitch(this, this.getAroundMe)	
			});
			this.registerView(this.rootView);
		},

		getAroundMe: function(call, location){
			params = {call: call, location: location};
			return xhrManager.send('GET', 'rest/v1.0/LocationData/getAroundMe', params);
		}
		
	})
});