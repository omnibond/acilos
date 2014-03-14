/****************************************************************************
** Acilos app: https://github.com/omnibond/acilos
** Copyright (C) 2014 Omnibond Systems LLC. and/or its subsidiary(-ies).
** All rights reserved.
** Omnibond Systems - www.omnibond.com for Acilos.com
**
** This file defines the error-utils reporting for xhrManager
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
		'dojo-mama/util/toaster'
], function(declare, kernel, topic, toaster) {

	var ErrorUtilities = declare([], {

		handleNetworkError: function(/*Object*/ err, /*Object?*/ ignore404) {
			// summary:
			//    Handle network errors
			// err:
			//    A network error object (e.g. XHR errback parameter)
			// ignore404:
			//    If truthy, do not route to 404 when err.response.status === 404


			console.warn('Network error', err);

			if (err.response && err.response.status === 404 && !ignore404) {
				topic.publish('/dojo-mama/show404');
				return;
			}
			var text = kernel.global.dmConfig.networkErrorMessage;
			if (err.response && err.response.status) {
				text += ' (' + err.response.status + ')';
			}
			toaster.displayMessage({
				text: text,
				type: 'error',
				time: -1
			});
		}

	});

	return new ErrorUtilities();
});