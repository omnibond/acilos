define([ 'dojo/_base/declare', 'dojo/Stateful' ], function (declare, Stateful) {
	var Internal = declare(Stateful, {
		//	summary:
		//		A sample constructor that is not publicly exposed.
		//	description:
		//		This also features a _description_, which is made out of *Markdown*.
		//
		//		- first list item
		//		- second list item
		//			- nested list item one
		//			- nested list item two
		//		- third list item
		//
		//		And another paragraph.
		//	foo: foo-type?
		//		A property that only exists in your mind.
	});

	var External = declare(Internal, {
		//	summary:
		//		A sample declare module.
		//
		//		- hello
		//		- world
		//			- world 1
		//			- world 2
		//		- goodbye
		//
		//		Code example:
		// |	if(true){
		// |		(only) this line should be indented
		// |	}
		//		And another paragraph.

		//	obj: Object?
		//		An optional object with an explicit type.
		obj: null,

		//	arr: Array
		arr: [],

		//	bool:
		//		A boolean with no explicit type.
		bool: false,

		fn: function (/**a-type*/ a, /**b-type?*/ b, c) {
			//	summary:
			//		A function
			//	a:
			//		String type in parameters.
			//	b:
			//		Optional string type in parameters.
			//	c: c-type
			//		Boolean type in comment.
			//	returns: Boolean
			//		Markdown return description
			//
			//		1. one
			//		2. two
			//		3. three
			//
			//		End of description

			return a + // return-type
				b;
		},

		addClassFx: function(cssClass, args){
			// summary:
			//		Animate the effects of adding a class to all nodes in this list.
			//		see `dojox.fx.addClass`
			// tags:
			//		FX, NodeList
			// example:
			//	|	// fade all elements with class "bar" to to 50% opacity
			//	|	dojo.query(".bar").addClassFx("bar").play();

			return coreFx.combine(this.map(function(n){ // dojo.Animation
				return styleX.addClass(n, cssClass, args);
			}));
		}
	});

	External.fn2 = function () {
		//	summary:
		//		A static function.
		//	returns: another-return-type
		//		This one has the return type specified in the comment
	};

	External.Class1 = declare(null, {
		// summary:
		//		Description of class

		c1f1: function(a){
			// summary:
			//		Function in class
			// a: Number
			//		arg
		}
	});

	return External;
});