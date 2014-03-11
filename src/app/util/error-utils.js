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