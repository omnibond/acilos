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
