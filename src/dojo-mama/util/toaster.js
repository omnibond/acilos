define(['dojo/dom-construct',
		'dojo/dom-attr',
		'dojo/_base/kernel',
		'dojo/on'
], function (domConstruct, domAttr, kernel, on) {

	// module:
	//     dojo-mama/util/toaster

	// a list of toaster containers, indexed by id.
	var toasterContainers = {};

	// this id counter is used so that each message and or container gets it's own unique id.
	var idCounter = 0;

	function getToasterContainer( view ) {
		// summary:
		//     This function gets the toaster container associated with a view (or null if there is none)
		var id;
		for (id in toasterContainers) {
			if (toasterContainers.hasOwnProperty(id) && view === toasterContainers[id].view) {
				return toasterContainers[id];
			}
		}
		return null;
	}

	function createToasterContainer(view, /*Object?*/ domNode) {
		// summary:
		//     This function creates a toaster container in a view

		var node = domConstruct.create('div', {
			'class': 'toasterContainer'
		}, domNode || view.containerNode, 'first');

		// get a new id
		var id = idCounter++;

		var newContainer = {
			view: view, 
			messages: {}, 
			numberMessages: 0, 
			node: node, 
			id: id
		};

		toasterContainers[id] = newContainer;
		return newContainer;
	}

	function destroyMessage(message, container) {
		// summary:
		//     destroys a message from a container
		if (!message.itemElement) {
			return;
		}
		domConstruct.destroy(message.itemElement);
		delete container.messages[message.id];
		container.numberMessages--;

		// if the container now has no messages, remove it
		if (container.numberMessages === 0) {
			domConstruct.destroy(container.node);
			delete toasterContainers[container.id];
		}
	}

	function buildMessage(message, container) {
		// summary: 
		//     builds a message and places it in the container

		// gets a unique id
		var id = idCounter++;
		message.id = id;

		container.messages[id] = message;
		container.numberMessages++;

		var cls = message['class'] || 'toasterMessage';

		if (!message.type) {
			console.warn('Warning, no type provided to displayMessage!');
		}
		var type = message.type || 'none';
		switch (type) {
			case 'information': 
				cls += ' toasterInformation';
				break;
			case 'success': 
				cls += ' toasterSuccess';
				break;
			case 'warning': 
				cls += ' toasterWarning';
				break;
			case 'error': 
				cls += ' toasterError';
				break;
		}

		// create the message div
		var itemElement = domConstruct.create('div', {
			'class': cls,
			innerHTML: message.text,
			role: 'alert'
		}, container.node);

		// set aria properties
		if (type !== 'error' && type !== 'warning') {
			domAttr.set(itemElement, 'aria-live', 'polite');
		}

		// create close button
		var closeBtn = domConstruct.create('div', {
			'class': 'toasterClose',
			'aria-label': 'close alert button',
			innerHTML: '&times;'
		}, itemElement);

		message.itemElement = itemElement;

		// set timeout and close button handlers
		on(closeBtn, 'click', function () {
			destroyMessage(message, container);
		});

		var time = message.time || 3; // Time in seconds
		if (time !== -1) {
			setTimeout(function () {
				destroyMessage(message, container);
			}, time * 1000);
		}

	}

	function messageExists(message, container) {
		// summary:
		//     Returns true if message already exists in container, false otherwise.
		var msgs = container.messages;
		var id;
		for (id in msgs) {
			if (msgs.hasOwnProperty(id) && 
					msgs[id].text === message.text &&
					msgs[id].type == message.type &&
					msgs[id].time == message.time
					) {
				return true;
			}
		}
		return false;
	}

	function getActiveView() {
		// summary:
		//     Returns the active view.
		var am = kernel.global.dmConfig.activeModule;
		if (am && am.currentView) {
			return am.currentView;
		}
		return 'index';
	}
	

	return {
		// description:
		//     The toaster library provides an interface to display messages on the screen.
		//
		//     The basic use is:
		//     | toaster.displayMessage({
		//     |     text: "Message text here.",
		//     |     type: 'error',
		//     |     time: 5 // The message will disappear after 5 seconds
		//     | });
		//
		//     There is also a clearMessages() function which clears all messages from the current view.


		displayMessage: function (message) {
			// summary:
			//     Displays a message in the current view. The message will be inserted in the current view's dom.
			//     If the view uses absolutely positioned elements, then the message will be displayed over them.
			//     Otherwise, the message will push the view content down.
			// message: Object
			//     An object with the following properties:
			//     ** text (String)** -- The message text.
			//     ** type (String)** -- Type of message, either 'error', 'warning', 'information', or 'success'.
			//     ** time (Integer)** -- The timeout of the message, in seconds.  If -1, then the message is persistent. Default is 3 seconds.
			//     ** multiple (Boolean)** -- True means multiple identical messages are allowed, false means duplicate messages are ignored.  Default is false.
			//     ** 'class' (String)** -- the css class to assign the message. Default is 'toasterMessage'
			//     ** containerNode (Object?)** -- the container node for toaster messages. Default value is the view's container node.

			var view, container;

			view = getActiveView();
			container = getToasterContainer(view);
			// get the toaster container for the active view
			if (container === null) {
				container = createToasterContainer(view, message.containerNode);
			}

			// check for duplicate messages:
			message.multiple = message.multiple || false;

			if (!message.multiple && messageExists(message, container)) {
				console.log('ignoring duplicate message:', message);
				return;
			}

			console.log('displaying message:', message);
			buildMessage(message, container);
		},

		clearMessages: function () {
			// summary:
			//     Clears all messages in active view and removes the toaster container

			console.log('clearing messages...');
			var view = getActiveView();
			console.log(view);
			if (!view) {
				return;
			}

			var container = getToasterContainer(view);
			if (container === null) {
				return;
			}

			var id;
			for (id in container.messages) {
				if (container.messages.hasOwnProperty(id)) {
					console.log('destroying message:', container.messages[id]);
					destroyMessage(container.messages[id], container);

				}
			}

		}

	};
});
