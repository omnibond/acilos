define([
		 "dojo/_base/declare"
		,"dojo/_base/Deferred"
		,"dojo/DeferredList"
		,"dojo/_base/lang"
	], function(
		declare
		,Deferred
		,DeferredList
		,lang
	){
		return declare("app.DeferredExecuterMixin",[], {
			//	To use this class, the parent object must define a this._executeSteps hash.
			//	as an example, here's a hash used to define a multi-step search sequence:
			//_executeSteps:{
			//	search: [
			//		"initialSearch",
			//		"mergeSearch",
			//		"altIdentitySearch",
			//		"buildSearchResults"
			//	]
			//}
			//	Additionally, each of the strings inside the 'search' array must be defined as a function.
			//	So this.initialSearch() must exist for example.  Each of these sequence functions should return a Deferred or DeferredList,
			//	but it is not required.  If a deferred or deferredList is returned by a sequence function, the executer will wait for the deferred
			//	to complete before firing the next step in the sequence.  Otherwise if anything other than a Deferred or DeferredList is returned,
			//	(including null / undefined) the next sequence step will be called imediately.  
			//
			//	To stop the executer from continuing on to the next sequence function, call stopExecution(sequenceName).
			//	This will not cancel any inflight requests, but it will not call the next step in the sequence.  
			//
			//	Caveats:  This will only be able to run 1 concurrent sequence of a specific name.  If you have two different sequences, "search" and "create",
			//	those two sequences should be able to run concurrently.  But you will not be able to run the "search" sequence twice concurrently.  
			
			constructor: function(args){
				//this._executeSteps = [];
				//this._executeStep = 0;
				
				this._executerCounter = {};
				
				lang.mixin(this, args);
			},
			
			execute: function(sequenceName){
				this._executerCounter[sequenceName] = 0;
				
				this._executer(sequenceName);
			},
			
			_executer: function(sequenceName, dfd){
				if(this._executeSteps[sequenceName][this._executerCounter[sequenceName]] == undefined){
					console.log("Done Executing "+sequenceName);
					if(dfd != undefined){
						dfd.callback();
					}else{
						//this would only happen if the loadSteps array is empty...
						//IE, the very first time _execute() is called _executeSteps[0] == undefined
						//so no deferred was created before we hit that if...
						this._newDeferredLoad().callback();
					}
					if (this._executeingDeferred) delete this._executeingDeferred;
					return;
				}
				
				//if this is the first iteration through _execute(), we need to get
				//this to give us a new deferred.  If any this.addOnLoads are called while
				//_execute() is loading, the functions will be called when _execute() finishes all _executeSteps
				if(this._executerCounter[sequenceName] == 0){
					dfd = this._newDeferredLoad();
					
					//purely logging
					console.log("Starting sequence '"+sequenceName+"'...");
				}else{
					//purely logging
					console.log("finished "+sequenceName+"::"+this._executeSteps[sequenceName][this._executerCounter[sequenceName]-1]);
				}
				//purely logging
				console.log("Starting "+sequenceName+"::"+this._executeSteps[sequenceName][this._executerCounter[sequenceName]]);
				
				//get a string representing the current loadStep
				var stepName = this._executeSteps[sequenceName][this._executerCounter[sequenceName]];
				
				//convert string step into a fctn ptr
				//var stepFctn = ;
				
				//incrememt the loadStep before we fire the stepFctn
				//so if the stepFctn fails or throws an error _execute() wont infinite loop
				this._executerCounter[sequenceName]++;

				//all stepFctns (or _executeSteps) should return a deferred.
				//when said deferred returns, call this _execute() fctn again and pass in 
				//_execute's deferred object as the first argument
	
				Deferred.when(
					this[stepName](),
					this._executer.bind(this,sequenceName,dfd)
				)
			},
			
			stopExecution: function(sequenceName){
				this._executerCounter[sequenceName] = -1;
			},
			
			//this and this.addOnLoad work together to allow app devs
			//to attach onLoad functions at any point in the loading process
			//even in secondary loads like loading users
			_newDeferredLoad: function(){
				var d;
				console.log("nDL");
				if(!this._executeingDeferred){
					console.log("Branch 1");
					this._executeingDeferred = d = new Deferred();
				}else{
					console.log("Branch 2");
					this._executeingDeferred = new DeferredList([
						this._executeingDeferred, 
						d = new Deferred()
					]);
				}
				return d;
			},
			
			_addOnLoad: function(callback){
				if(callback && typeof callback == "function")
					this._executeingDeferred.addCallback(callback);
			}

		});
	}
);
