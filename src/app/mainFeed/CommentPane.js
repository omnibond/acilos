define([
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/sniff",
	"dojo/dom",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo",

	"dojox/mobile/Container",
	"dojox/mobile/_ContentPaneMixin",

	"dojox/mobile/Accordion",
	"dojox/mobile/ContentPane",
	"dojox/mobile/Button",
	"dojox/mobile/TextBox",
	"dojox/mobile/RoundRectList",
	"dojox/mobile/EdgeToEdgeList",
	"dojox/mobile/ListItem",

	'app/util/xhrManager'

], function(
	array,
	declare,
	lang,
	has,
	dom,
	domClass,
	domConstruct,
	dojo,

	Container, 
	ContentPaneMixin,

	Accordion,
	ContentPane,
	Button,
	TextBox,
	RoundRectList,
	EdgeToEdgeList,
	ListItem,

	xhrManager

){

	// module:
	//		dojox/mobile/ContentPane

	return declare("dojox.mobile.DataObjPane", [Container, ContentPaneMixin], {
		// summary:
		//		A very simple content pane to embed an HTML fragment.
		// description:
		//		This widget embeds an HTML fragment and runs the parser. It has
		//		the ability to load external content using dojo/_base/xhr. onLoad()
		//		is called when parsing is done and the content is
		//		ready. Compared with dijit/layout/ContentPane, this widget
		//		provides only basic fuctionality, but it is much lighter.

		baseClass: "mblContentPane",

		sendFaceComment: function(id, comment){
			var params = {id: id, comment: comment};
			return xhrManager.send('POST', 'rest/v1.0/Post/sendFaceComment', params);
		},

		sendTwitReply: function(authorUsername, tweetID, message){
			var params = {authorUsername: authorUsername, tweetID: tweetID, message: message};
			console.log("params are: ", params);
			return xhrManager.send('POST', 'rest/v1.0/Post/sendTwitReply', params);
		},

		buildRendering: function(){
			//call buildRendering from Accordion, because that is where this class inherited from
			this.inherited(arguments);	
			//now the other buildRendering has been run and is done and comes back here to finish this Brender 
			var data = this.data;
			var counter = this.counter;
			var type = this.type;
			
			console.log("data is: ", data);

			switch(type){
				case "faceComment":
					var content = data.hits.hits[counter]._source.content;
					var x = data.hits.hits[counter]._source.content.comments;
					var id = data.hits.hits[counter]._source.content.id;
					this.list = new RoundRectList({
						"class": "commentPane"
					});					
					var item = new ListItem({
						variableHeight: true,
						"class": "commentLikeAccordionItemClass"
					});
					this.commentFacebookBox = new TextBox({
						placeHolder: "Write a comment",
						"class": "fullWidthTextBox"						
					});
					var commentBut = new Button({
						label: "Post!",
						"class": "postButton",
						onClick: lang.hitch(this, function(content){
							console.log("content is", content);

							/*id = content.id.split("_");
							id = id[1];*/

							id = content.id;

							var comment = this.commentFacebookBox.get("value");

							this.sendFaceComment(id, comment).then(lang.hitch(this, function(obj){
								console.log("obj is: ", obj);
							}));				 
						},content)
					});
					item.addChild(this.commentFacebookBox);
					item.addChild(commentBut);
					this.list.addChild(item);
					this.list.resize();
					
					//if(x.length > 10){
					//	var comLength = 10;
					//}else{
						var comLength = x.length;
					//}


					for(var m = 0; m < comLength; m++){
						var string = this.parseSpecialChars(x[m].text.text);
						var item = new ListItem({
							variableHeight: true,
							label: '<img src="https://graph.facebook.com/'+x[m].userId+'/picture" width="60px" height="60px" />' + " " + x[m].name  + "<br/>" + string,
							"class": "commentLikeAccordionItemClass"
						});
						this.list.addChild(item);
					}
					this.addChild(this.list);	
				break;
				case "faceLike":
					var content = data.hits.hits[counter]._source.content;
					var x = data.hits.hits[counter]._source.content.likes;
					var id = data.hits.hits[counter]._source.content.id;
					this.list = new RoundRectList({
						"class": "commentPane"
					});					
					var item = new ListItem({
						variableHeight: true,
						"class": "commentLikeAccordionItemClass"
					});
					var commentBut = new Button({
						label: "Click to like",
						onClick: lang.hitch(this, function(content){
							console.log(content.likeURL);				
						},content)
					});
					item.addChild(commentBut);
					this.list.addChild(item);
					this.list.resize();
					
					//if(x.length > 10){
					//	var comLength = 10;
					//}else{
						var comLength = x.length;
					//}

					for(var m = 0; m < comLength; m++){
						var item = new ListItem({
							variableHeight: true,
							label: '<img src="https://graph.facebook.com/'+x[m].id+'/picture" width="60px" height="60px" />' + " " + x[m].name,
							"class": "commentLikeAccordionItemClass"
						});
						this.list.addChild(item);
					}
					this.addChild(this.list);
				break;
				case "twitReply":
					var x = data.hits.hits[counter]._source.content;
					var actor = data.hits.hits[counter]._source.actor;
					this.list = new RoundRectList({
						"class": "commentPane"
					});					
					var item = new ListItem({
						variableHeight: true,
						"class": "commentLikeAccordionItemClass"
					});
					this.commentTwitterBox = new TextBox({
						placeHolder: "Write a comment",
						"class": "fullWidthTextBox"					
					});
					var replyBut = new Button({
						label: "Post",
						"class": "postButton",
						onClick: lang.hitch(this, function(){
							console.log("data is: ", data);
							console.log("@" + actor.displayName + " message" + " ==in_reply_to_status_id");

							var tweetID = data.hits.hits[counter]._id.split("-----");
							tweetID = tweetID[1];
							var message = this.commentTwitterBox.get("value");

							this.sendTwitReply(actor.displayName, tweetID, message).then(lang.hitch(this, function(obj){
								console.log("obj is: ", obj);
							}));			
						})
					});
					item.addChild(this.commentTwitterBox);
					item.addChild(replyBut);
					this.list.addChild(item);
					this.list.resize();
					
					this.addChild(this.list);
				break;
				case "twitRetweet":
					var x = data.hits.hits[counter]._source.content;
					var retweet = "";
					if(x.retweet == null){
						retweet = 0;
					}else{
						retweet = x.retweet;
					}
					this.list = new RoundRectList({
						"class": "commentPane"
					});	
					var item = new ListItem({
						label: retweet + " have retweeted this tweet",
						style: "border:none;margin: 0 0 0 0"
					});	
					this.list.addChild(item);	
					var item = new ListItem({
						variableHeight: true,
						"class": "commentLikeAccordionItemClass"
					});
					var retweetBut = new Button({
						label: "Click to retweet",
						onClick: lang.hitch(this, function(){
							console.log("https://api.twitter.com/1.1/statuses/retweet/241259202004267009.json");
						})
					});
					item.addChild(retweetBut);
					this.list.addChild(item);
					this.list.resize();
					
					this.addChild(this.list);
				break;
				case "twitFavorite":
					var x = data.hits.hits[counter]._source.content;
					var favorite = "";
					if(x.favorite == null){
						favorite = 0;
					}else{
						favorite = x.favorite;
					}
					
					this.list = new RoundRectList({
						"class": "commentPane"
					});	
					var item = new ListItem({
						label: favorite + " have favorited this tweet",
						style: "border:none;margin: 0 0 0 0"
					});	
					this.list.addChild(item);					
					var item = new ListItem({
						variableHeight: true,
						"class": "commentLikeAccordionItemClass"
					});
					var favoriteBut = new Button({
						label: "Click to favorite",
						onClick: lang.hitch(this, function(){
							console.log("https://api.twitter.com/1.1/favorites/create.json" + " and post " + x.id);
						})
					});
					item.addChild(favoriteBut);
					this.list.addChild(item);
					this.list.resize();
					
					this.addChild(this.list);
				break;
				case "instaLikes":
					var x = data.hits.hits[counter]._source.content.likes;
					var id = data.hits.hits[counter]._source.content.id;
					this.list = new RoundRectList({
						"class": "commentPane"
					});
					var likeBut = new Button({
						label: "Click to like",
						onClick: lang.hitch(this, function(id){
							var params = ["Instagram", id]; 
							app.send('publishLike', 'php/_scaffold.php', params);
							var item = new ListItem({
								variableHeight: true,
								label: "- You liked this",
								"class": "commentLikeAccordionItemClass"
							});
							item.placeAt(this.list, 1);
							this.resize();
							this.expand(this.pane, true);
						}, id)
					});
					var item = new ListItem({
						variableHeight: true,
						"class": "commentLikeAccordionItemClass"
					});
					item.addChild(likeBut);
					this.list.addChild(item);
					this.list.resize();
					if(x.length > 10){
						var comLength = 10;
					}else{
						var comLength = x.length;
					}

					for(var m = 0; m < comLength; m++){
						if(x[m].profileImg == null){
							pic = "app/resources/img/blankPerson.jpg";
						}else{
							pic = x[m].profileImg;
						}
						var item = new ListItem({
							variableHeight: true,
							label: '<img src="'+pic+'" width="60px" height="60px" />' + " " + x[m].name,
							"class": "commentLikeAccordionItemClass"
						});
						this.list.addChild(item);
					}
					
					this.addChild(this.list);
				break;
				case "instaComments":
					var x = data.hits.hits[counter]._source.content.comments;
					var id = data.hits.hits[counter]._source.content.id;
					this.list = new RoundRectList({
						"class": "commentPane"
					});
					
					var item = new ListItem({
						variableHeight: true,
						"class": "commentLikeAccordionItemClass"
					});
					this.commentInstaBox = new TextBox({
						placeHolder: "Write a comment",
						"class": "fullWidthTextBox"						
					});
					var commentBut = new Button({
						label: "Post!",
						"class": "postButton",
						onClick: lang.hitch(this, function(id){
							if(this.commentInstaBox.get("value") === ""){
								console.log("Please type a comment in the box");
							}else{
								var params = ["Instagram", this.commentInstaBox.get("value"), id]; 
								var string = this.parseSpecialChars(params[1]);
								app.send('publishComment', 'php/_scaffold.php', params);
								var item = new ListItem({
									variableHeight: true,
									label: string + " - Posted By - You",
									"class": "commentLikeAccordionItemClass"
								});
								item.placeAt(this.list, 1);
								this.resize();
								this.expand(this.pane, true);
							}							
						}, id)
					});
					item.addChild(this.commentInstaBox);
					item.addChild(commentBut);
					this.list.addChild(item);
					this.list.resize();
					
					if(x.length > 10){
						var comLength = 10;
					}else{
						var comLength = x.length;
					}

					for(var m = 0; m < comLength; m++){
						if(x[m].profileImg == null){
							pic = "app/resources/img/blankPerson.jpg";
						}else{
							pic = x[m].profileImg;
						}
						if(x[m].text.text == null){
							continue;
						}
						var string = this.parseSpecialChars(x[m].text.text);
						var item = new ListItem({
							variableHeight: true,
							label: '<img src="'+pic+'" width="60px" height="60px" />' + " " + x[m].name  + "<br/>" + string,
							"class": "commentLikeAccordionItemClass"
						});
						this.list.addChild(item);
					}
					this.addChild(this.list);					
				break;
				case "linkedLikes":
					var x = data.hits.hits[counter]._source.content.likes;
					var id = data.hits.hits[counter]._source.content.id;
					
					this.list = new RoundRectList({
						"class": "commentPane"
					});
					var likeBut = new Button({
						label: "Click to like",
						onClick: lang.hitch(this, function(id){
							var params = ["LinkedIn", id]; 
							app.send('publishLike', 'php/_scaffold.php', params);
							var item = new ListItem({
								label: "- You liked this",
								"class": "commentLikeAccordionItemClass"
							});
							item.placeAt(this.list, 1);
							this.resize();
							this.expand(this.pane, true);							
						}, id)
					});
					var item = new ListItem({
						variableHeight: true,
						"class": "commentLikeAccordionItemClass"
					});
					item.addChild(likeBut);
					this.list.addChild(item);
					this.list.resize();
					
					if(x.length > 10){
						var comLength = 10;
					}else{
						var comLength = x.length;
					}

					for(var m = 0; m < comLength; m++){
						if(x[m].pictureURL == null){
							pic = "app/resources/img/blankPerson.jpg";
						}else{
							pic = x[m].pictureURL;
						}
						var item = new ListItem({
							variableHeight: true,
							innerHTML: '<img src="'+pic+'" width="60px" height="60px" />' + " " + x[m].firstName + " " + x[m].lastName + " likes this",
							"class": "commentLikeAccordionItemClass"
						});
						this.list.addChild(item);
					}
					this.addChild(this.list);					
				break;
				case "linkedComments":
					var x = data.hits.hits[counter]._source.content.comments;
					var id = data.hits.hits[counter]._source.content.id;
					var obj = data.hits.hits[counter]._source;
	
					this.list = new RoundRectList({
						"class": "commentPane"
					});
					this.commentLinkBox = new TextBox({
						placeHolder: "Write a comment",
						"class": "fullWidthTextBox"						
					});
					var commentBut = new Button({
						label: "Post!",
						"class": "postButton",
						onClick: lang.hitch(this, function(id){
							if(this.commentLinkBox.get("value") === ""){
								console.log("Please type a comment in the box");
							}else{
								var params = ["LinkedIn", this.commentLinkBox.get("value"), id]; 
								var string = this.parseSpecialChars(params[1]);
								app.send('publishComment', 'php/_scaffold.php', params);
								var item = new ListItem({
									label: string + " - Posted By - You",
									"class": "commentLikeAccordionItemClass"
								});
								item.placeAt(this.list, 1);
								this.resize();
								this.expand(this.pane, true);
							}							
						}, id)
					});
					var item = new ListItem({
						variableHeight: true,
						"class": "commentLikeAccordionItemClass"
					});
					item.addChild(this.commentLinkBox);
					item.addChild(commentBut);
					this.list.addChild(item);
					this.list.resize();
					
					if(x.length > 10){
						var comLength = 10;
					}else{
						var comLength = x.length;
					}

					for(var m = 0; m < comLength; m++){
						if(x[m].pictureURL == null){
							pic = "app/resources/img/blankPerson.jpg";
						}else{
							pic = x[m].pictureURL;
						}
						if(x[m].text.text == null){
							continue;
						}
						var string = this.parseSpecialChars(x[m].text.text);
						var item = new ListItem({
							variableHeight: true,
							innerHTML: '<img src="'+pic+'" width="60px" height="60px" />' + " " + x[m].firstName + " " + x[m].lastName  + "<br/>" + string,
							"class": "commentLikeAccordionItemClass"
						});
						this.list.addChild(item);
					}
					this.addChild(this.list);					
				break;
				default:
					console.log("no service came to the accordion");
				break;
			}

		},
		
		makeHTTPS: function(url){
			if(url){
				oldURL = url.slice(4, -1);
			
				newURL = "https" + oldURL;

				return newURL;
			}else{
				return url;
			}
		}

	});
});
