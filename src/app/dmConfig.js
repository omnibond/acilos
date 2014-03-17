/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file describes the general layout in relation to the modules for the entire app
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
// dojo-mama configuration
define({
	title: '<span style="position:absolute;top:10px;left:10px"><img src="../favicon.ico" height=25px width=25px></span><span style="position:absolute;left:40px;font-weight:normal">Private Social Valet</span>',
	//title: '<span><img src="app/resources/img/acilosTitleLogo.png"></span>',
	titleLabel: 'Private Social Valet',
	nav: {
		/* navigational elements point to groups */
		primary: [
			'mainFeed',
			'feeds',
			'people',
			'favorites',
			'analytics',
			'post',
			'settings',
			'help'
		],
		/* secondary links show up in the meta nav secondary: */
		secondary: [
			//menu will pop up when there is something here to go into it
			//'notificationManager',
			'aboutManager',
			'logoutManager'
		]
	},
	networkErrorMessage: "We're sorry. There seems to be a network issue. Please try again later.",
	modules: {
		index: {
			moduleId: 'dojo-mama/layout/responsiveTwoColumn/index/Module'
		},
		
		mainFeed: {
			title: 'Main Feed',
			moduleId: 'app/mainFeed/Module'
		},
		feeds: {
			title: 'Custom Feeds',
			moduleId: 'app/feeds/Module'
		},
		people: {
			title: 'People',
			moduleId: 'app/userList/Module'
			/*moduleId: 'dojo-mama/util/ModuleGroup',
			modules: ['userAlphabetical', 'recentPosts', 'userQuantity', 'secondDegree', 'userList']*/
		},
		favorites: {
			title: 'Favorites',
			moduleId: 'app/AppModuleGroup',
			modules: ['favoritePosts', 'favoritePeople']
		},
		search: {
			title: 'Search',
			moduleId: 'dojo-mama/util/ModuleGroup',
			modules: ['searchUser', 'searchKeyword', 'searchService']
		},
		analytics: {
			title: 'Analytics',
			moduleId: 'dojo-mama/util/ModuleGroup',
			modules: ['wordCloud', /*'locateUsers',*/ 'barGraph', 'lineChart', 'pieChart'/*, 'locateUsersTest'*/]
		},
		post: {
			title: 'Post',
			moduleId: 'app/post/Module'
		},
		settings: {
			title: 'Settings',
			moduleId: 'dojo-mama/util/ModuleGroup',
			modules: ['manAccounts', 'manContacts', 'manDatabase' /*, 'userLookup'*/]
		},
		help: {
			title: 'Help',
			moduleId: 'dojo-mama/util/ModuleGroup',
			modules: ['restartDB', 'appHelp']
		},

		/* analytics modules */
		wordCloud: {
			title: 'Generate a Word Cloud',
			moduleId: 'app/wordCloud/Module',
			selectedPrimaryNavItem: "analytics"
		},
		locateUsers: {
			title: 'Locate App Users',
			moduleId: 'app/locateUsers/Module',
			selectedPrimaryNavItem: "analytics"
		},
		barGraph: {
			title: 'Generate a Bar Graph',
			moduleId: 'app/barGraph/Module',
			selectedPrimaryNavItem: "analytics"
		},
		lineChart: {
			title: 'Generate a Line Chart',
			moduleId: 'app/lineChart/Module',
			selectedPrimaryNavItem: "analytics"
		},
		pieChart: {
			title: 'Generate a Pie Chart',
			moduleId: 'app/pieChart/Module',
			selectedPrimaryNavItem: "analytics"
		},
		locateUsersTest: {
			title: 'Testing D3 map canvas',
			moduleId: 'app/locateUsersTest/Module',
			selectedPrimaryNavItem: "analytics"
		},
		
		/*favorite modules*/
		favoritePosts: {
			title: 'Your favorite posts',
			icon: "app/resources/img/starSmall.png",
			moduleId: 'app/favoritePosts/Module',
			selectedPrimaryNavItem: "favorites"
		},
		favoritePeople: {
			title: 'Your favorite people',
			icon: "app/resources/img/profileSmall.png",
			moduleId: 'app/favoritePeople/Module',
			selectedPrimaryNavItem: "favorites"
		},
		
		/*people modules*/
		/*userQuantity: {
			title: 'Chattiest people',
			moduleId: 'app/userFeeds/Module',
			selectedPrimaryNavItem: "people"
		},
		recentPosts: {
			title: 'Most recent posts',
			moduleId: 'app/recentPosts/Module',
			selectedPrimaryNavItem: "people"
		},
		userAlphabetical: {
			title: 'People alphabetically',
			moduleId: 'app/userAlpha/Module',
			selectedPrimaryNavItem: "people"
		},
		secondDegree: {
			title: 'Friends of Friends',
			moduleId: 'app/secondDegree/Module',
			selectedPrimaryNavItem: "people"
		},*/
		userList: {
			title: 'Select Users',
			moduleId: 'app/userList/Module',
			selectedPrimaryNavItem: "people"
		},
		
		/*settings modules*/
		manAccounts: {
			title: 'Manage your accounts',
			moduleId: 'app/manAccounts/Module',
			selectedPrimaryNavItem: "settings"
		},
		manContacts: {
			title: 'Merge your contacts',
			moduleId: 'app/manContacts/Module',
			selectedPrimaryNavItem: "settings"
		},
		userLookup: {
			title: 'Username/ID lookup',
			moduleId: 'app/userLookup/Module',
			selectedPrimaryNavItem: "settings"
		},
		findContact: {
			title: 'Find a contact in the app',
			moduleId: 'app/findContact/Module',
			selectedPrimaryNavItem: "settings"
		},
		manDatabase: {
			title: 'Manage the Database',
			moduleId: 'app/manDatabase/Module',
			selectedPrimaryNavItem: "settings"
		},
				
		/*help modules*/
		restartDB: {
			title: 'Restart the Database',
			moduleId: 'app/restartDB/Module',
			selectedPrimaryNavItem: "help"
		},
		/*
		factoryReset: {
			title: 'Reset the app to factory defaults',
			moduleId: 'app/factoryReset/Module',
			selectedPrimaryNavItem: "help"
		},
		*/
		appHelp: {
			title: 'Get help with the app',
			moduleId: 'app/appHelp/Module',
			selectedPrimaryNavItem: "help"
		},
		
		/*search modules */
		searchUser: {
			title: 'Search by user',
			moduleId: 'app/searchUser/Module',
			selectedPrimaryNavItem: "search"
		},
		searchKeyword: {
			title: 'Search by keyword',
			moduleId: 'app/searchKeyword/Module',
			selectedPrimaryNavItem: "search"
		},
		searchService: {
			title: 'Search by specific service',
			moduleId: 'app/searchService/Module',
			selectedPrimaryNavItem: "search"
		},

		/*notifications / credentials */
		notificationManager: {
			title: 'Notifications',
			moduleId: 'app/notifications/Module',
			linkText: true
		},
		logoutManager: {
			title: 'Logout',
			moduleId: 'app/logout/Module',
			linkText: true
		},
		aboutManager: {
			title: "About",
			moduleId: 'app/about/Module',
			linkText: true
		}
		
	}
});
