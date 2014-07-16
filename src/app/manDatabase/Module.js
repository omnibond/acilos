/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the views and functions for the manDatabase module
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
		'dojo-mama/Module',
		"dojo/_base/lang",
		'dojo/_base/kernel',
		
		'app/util/xhrManager',
		
		'app/manDatabase/MainView',
		'app/manDatabase/RestartAmazon',
		'app/manDatabase/RestoreDB',
		'app/manDatabase/restartDB',
		'app/manDatabase/RebootSetting',
		'app/manDatabase/BackupData',
		'app/manDatabase/RestoreData',
], function(
	declare, 
	Module, 
	lang, 
	kernel,
	
	xhrManager, 
	
	MainView,
	RestartHost,
	RestoreDB,
	restartDB,
	RebootSetting,
	BackupData,
	RestoreData
) {
	return declare([Module], {
		
		postCreate: function(){
			this.inherited(arguments);

			this.restartHost = new RestartHost({
				route: '/RestartHost',
				
				rebootHostSystem: this.rebootHostSystem,
				getAmazonInstances: this.getAmazonInstances
			});
			this.restartDB = new restartDB({
				route: '/restartDB',
				
				restartDBase: this.restartDBase
			});

			this.rebootSetting = new RebootSetting({
				route: '/RebootSetting',

				checkRebootSetting: lang.hitch(this, this.checkRebootSetting),
				saveRebootSetting: lang.hitch(this, this.saveRebootSetting)
			});

			this.backupData = new BackupData({
				route: '/BackupData',

				saveBackupData: lang.hitch(this, this.saveBackupData),
				checkForBackupData: lang.hitch(this, this.checkForBackupData),
				importBackupData: lang.hitch(this, this.importBackupData)
			});

			this.restoreData = new RestoreData({
				route: '/RestoreData',

				checkForBackupData: lang.hitch(this, this.checkForBackupData),
				importBackupData: lang.hitch(this, this.importBackupData)
			});
			
			this.rootView = new MainView({
				route: '/',
				
				restartHost: this.restartHost,
				restartDB: this.restartDB,
				getHostSystem: this.getHostSystem
			});
			this.registerView(this.rootView);
			this.registerView(this.restartHost);
			this.registerView(this.restartDB);
			this.registerView(this.rebootSetting);
			this.registerView(this.backupData);
			this.registerView(this.restoreData);
		},
		
		getBackUpList: function(){
			var params = {};
			return xhrManager.send('GET', 'rest/v1.0/Database/getBackUpList', params);
		},
		
		restoreBackUpData: function(file){
			var params = {file: file};
			return xhrManager.send('POST', 'rest/v1.0/Database/restoreBackUpData', params);
		},
		
		getAmazonInstances: function(){
			var params = {};
			return xhrManager.send('GET', 'rest/v1.0/Database/getAmazonInstances', params);
		},
		
		rebootHostSystem: function(){
			var params = {};
			return xhrManager.send('GET', 'rest/v1.0/Database/rebootHostSystem', params);
		},
		
		restartDBase: function(){
			return xhrManager.send('GET', 'rest/v1.0/Database/restart', {});
		},
		
		getHostSystem: function(){
			return xhrManager.send('GET', 'rest/v1.0/Database/getHostSystem', {});
		},

		checkRebootSetting: function(){
			return xhrManager.send('GET', 'rest/v1.0/Database/checkRebootSetting', {});
		},

		saveRebootSetting: function(reboot){
			var params = {reboot: reboot};
			return xhrManager.send('POST', 'rest/v1.0/Database/saveRebootSetting', params);
		},

		saveBackupData: function(keepServiceCreds, wipeCurrentData){
			var params = {keepServiceCreds: keepServiceCreds, wipeCurrentData: wipeCurrentData};
			return xhrManager.send('POST', 'rest/v1.0/Database/saveBackupData', params);
		},

		checkForBackupData: function(){
			return xhrManager.send('GET', 'rest/v1.0/Database/checkForBackupData', {});
		},

		importBackupData: function(restoreServiceCreds, wipeDBData, deleteBackupFile, deleteBackupCredentials){
			var params = {restoreServiceCreds: restoreServiceCreds, wipeDBData: wipeDBData, deleteBackupFile: deleteBackupFile, deleteBackupCredentials: deleteBackupCredentials};
			return xhrManager.send('POST', 'rest/v1.0/Database/importBackupData', params);
		}
	})
});