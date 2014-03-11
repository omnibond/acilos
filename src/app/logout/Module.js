define(['dojo/_base/declare',
		'dojo-mama/Module',
		'app/logout/MainView'
		
], function(
	declare, 
	Module, 
	MainView
	
){
	return declare([Module], {
		
		activate: function(){
			
			window.location = "login.php?logout=true";
		}
	})
});