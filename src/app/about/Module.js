define(['dojo/_base/declare',
		'dojo-mama/Module',
		'app/about/MainView'		
], function(
	declare, 
	Module, 
	MainView	
){
	return declare([Module], {
		
		activate: function(){
			
			window.location = "#/appHelp/AboutView";
		}
	})
});