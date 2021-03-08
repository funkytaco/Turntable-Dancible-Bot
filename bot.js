/******************************************************************************************************
	Turntable-API-Taco-Bot 0.1
	by Luis Gonzalez

*******************************************************************************************************/
var Bot    = require('ttapi');
var moderatorList = [];
var dJList = [];
var BOT_VERSION = '0.1.7';




var bIsModerator = (user) => { 
	if (settings.ROOM_MODS_ARE_BOT_ADMINS) {
		//All room mods are bot admins
		return settings.ROOM_BOT_MODERATORS_ARRAY.indexOf(user) >= 0||moderatorList.indexOf(user) >= 0; 
	} else {
		//Only the mods specified in settings.ROOM_BOT_MODERATORS_ARRAY are bot admins
		return settings.ROOM_BOT_MODERATORS_ARRAY.indexOf(user) >= 0; 
	}
} 

/** Settings File - Adjust accordingly.	**/
	
var settings = require('./settings.js');

/** Connect to Turntable.fm **/

	var bot = new Bot(settings.AUTH, settings.USERID, settings.ROOMID);

	/* IMPORT MODULES */
	var mod_autoDj = require('./mod_autodj');
	mod_autoDj.init(settings);
	var mod_autoBop = require('./mod_autobop');
	mod_autoBop.init(settings);

	/** SONG - newsong **/
	bot.on('newsong', function(data) { 
		/** settings.BOT_AUTO_AWESOME - Auto Bop **/
		mod_autoBop.newSong(bot);
		mod_autoDj.newSong(data);


	});
	/** SONG - nosong **/
	bot.on('nosong', function(data) { 
	});
	/** SONG - endsong **/
	bot.on('endsong', function(data) { 
		/* Modules */
		mod_autoDj.endSong(data, bot);

	});

	/** BOT - new_moderator **/
	bot.on('new_moderator', function(data) { 
		bot.roomInfo(function(data) { moderatorList = data.room.metadata.moderator_id; }); 
	});
	/** BOT - rem_moderator **/
	bot.on('rem_moderator', function(data) { 
		bot.roomInfo(function(data) { moderatorList = data.room.metadata.moderator_id; }); 
	});
	/** BOT - roomChanged **/
	bot.on('roomChanged', function (data) {
				/** Update Room Moderators - on room join **/
				moderatorList = data.room.metadata.moderator_id;
				dJList = data.room.metadata.djs;
				/* Modules */
				mod_autoDj.roomChanged(bot);
				mod_autoBop.roomChanged(bot);

		
				if (settings.DEBUG_LOGS) {
		
						bot.playlistAll(function (data) {
						   		console.log('----- begin room playlist data -----');
						      	console.log(data);
						   		console.log('----- end room playlist data -----');
						}); //end bot.playlistAll	
				} //end console logs.
	
	}); 
	
	/** settings.VOTE_POLLING **/
		
	bot.on('endsong', function (data) {
			if (settings.BOT_DISPLAY_UPVOTES_DOWNVOTES_AFTER_SONGEND) {
				var room = data.room;
				var upvotes = room.metadata.upvotes;
				var downvotes = room.metadata.downvotes;
				var listeners = room.metadata.listeners;
				var djcount = room.metadata.djcount;
				bot.speak(':speaker: :thumbsup:'+upvotes+' :thumbsdown: '+downvotes+'');
				if (djcount == 0) {
					//bot.speak('The decks are open.');
				}
			}
	});
	
	
	/** settings.BOT_TALK_IN_CHAT **/
	
	if (settings.BOT_TALK_IN_CHAT) {
		
		bot.on('speak', function (data) {
		   // Get the data
			var name = data.name;
			var text = data.text;
			var user = data.userid;


				/** if bot name is mentioned **/
				if (text.match('/mods')) {
					moderatorList.forEach(async function(element,idx) {

						bot.getProfile(element, function (element) { 
							if (element.name == settings.BOT_NAME) {
								bot.speak(':kiss: ' + element.name);
							} else {
								bot.speak(':hurtrealbad: ' + element.name);
							}
						});

					})

				}
				if (text.match('/djs')) {
					if (dJList) bot.speak('DJs: '+dJList+'');
				}
				/** if bot name is mentioned **/
				if (text.match(settings.BOT_NAME) && name != settings.BOT_NAME) {
					bot.speak('That\'s my name, don\'t wear it out, '+ name + '!');
				}
				/** Room Rules **/
				if (text.match(/^(?:\*|\/)rules$/)) {
				bot.speak('See '+settings.ROOM_RULES_URL+' for the room rules.');
				}
				/** Song Information **/
				if (text.match(/^\/songinfo$/)) {
				   bot.roomInfo(true, function(data) {
						var current_song = data.room.metadata.current_song;
						if (current_song) {

						var songId = current_song._id;
						var songAlbum = current_song.metadata.album;
						var songGenre = current_song.metadata.genre;
						var songName = current_song.metadata.song;
					}
					
					if (settings.DEBUG_LOGS) {
						console.log('---- BEGIN CURRENT SONG METADATA --------------------');
						if (current_song) { console.log(current_song.metadata) } else  { console.log('No song is playing.');}
						console.log('---- END CURRENT SONG METADATA --------------------');
					}
					
												
					bot.speak(':notes: "'+songName+'" :cd: Album: '+songAlbum+' :radio: Genre: '+songGenre+'');
						
					
				
						
						
						
						
						
				   });	
				} //end songinfo
				
				/** Look in Moderators array or room mods to see if chatting with an admin.
				If chatting with an admin, allow user to moderate. **/
				if (bIsModerator(user)) {
					//console.log('MODCHATDEBUG');

					/** Update Bot's DJ Queue - push playing song to top of queue **/
					if (text.match(/^\*top$/)) {
					   bot.roomInfo(true, function(data) {
					      var song = data.room.metadata.current_song._id;
					      var songName = data.room.metadata.current_song.metadata.song;

						if (song) { bot.playlistAdd(song); }
							bot.speak(''+songName+' - to the top you go!');
					   });
					}
					/** fart **/
					if (text.match(/^poop$/)) {
						bot.speak('feart.');
						bot.snag();
					}
					/** Disconnect from Turntable.fm **/

					if (text.match(/^\/die$/)) {

						bot.speak('/me dies tragically.'); 
						bot.close(); //fixme
					}
					/** Get DJ's Playlist **/
						if (text.match(/^\/playlist$/)) {

							if (settings.DEBUG_LOGS) { 

								bot.pm('Okay, '+name+'. Check log for playlist.',user);

					   			bot.playlistAll(function (data) {
				      				console.log(data);
				   				});

							} 
					}
					

					
						if (text.match(/^\/votes$/)) {

							
							bot.roomInfo(true, function(data) {
							
								if (settings.DEBUG_LOGS) {
									console.log('---- BEGIN ROOM DATA --------------------');
									console.log(data.room);
									console.log('---- END ROOM DATA --------------------');
								}
								

							var room = data.room;
							var upvotes = room.metadata.upvotes;
							var downvotes = room.metadata.downvotes;
							var listeners = room.metadata.listeners;
							var djcount = room.metadata.djcount;
							if (room.metadata.current_song != null) { 
								var current_song = room.metadata.current_song.metadata;
								bot.speak(':speaker: ' + current_song.song +' by ' + current_song.artist) && 
								bot.speak(':thumbsdown:'+downvotes+' :thumbsup: '+upvotes + '');
							} else {
								bot.speak('No song is playing.');
							}
							
						   });
					}
					
					
					
						if (text.match(/^\/votelog$/)) {

							
							bot.roomInfo(true, function(data) {
							
								if (settings.DEBUG_LOGS) {
									console.log('---- BEGIN ROOM DATA --------------------');
									console.log(data.room);
									console.log('---- END ROOM DATA --------------------');
								}
								
							var room = data.room;
							var upvotes = room.metadata.upvotes;
							var downvotes = room.metadata.downvotes;
							var listeners = room.metadata.listeners;
							var djcount = room.metadata.djcount;
							var creatorname = room.metadata.creator.name;
							var currentdj = room.metadata.current_dj;
							var vote_log = room.metadata.votelog;
							var current_song = room.metadata.current_song;
							if (current_song) {

							var songId = current_song._id;
							var songAlbum = current_song.metadata.album;
							var songGenre = current_song.metadata.genre;
							var songName = current_song.metadata.song;
							
						}
						
						if (vote_log.length > 0) {
							vote_log.forEach(async function(el,idx) {

								myVote = el[1];
								myId = el[0];
								bot.getProfile(myId, function (data) { 
									//console.log('data for profile' + JSON.stringify(element)); 
									if (myId == settings.USERID) {
										bot.speak(':kiss: I voted ' + myVote);
									} else {

										bot.speak(':hurtrealbad: ' + data.name + ' voted ' + myVote);
									}
								});
		
							})

						} else {
							bot.speak('I\'ve got nothing...');
						}
					
	
							if (settings.DEBUG_LOGS) {
								console.log('---- BEGIN VOTELOG DATA --------------------');
								console.log(vote_log);
								console.log('---- END VOTELOG DATA --------------------');
							}

							
						   });
					}
					
					
					
					
				} //end if name in settings.BOT_MODERATORS_ARRAY - end admin chat section

		}); //end on bot speak.
	
		
		
	} //end if settings.BOT_TALK_IN_CHAT. This ends the chat section.
	
	
		bot.on('pmmed', function (data) { 
		if (settings.BOT_TALK_IN_PRIVATE) {

			/** settings.BOT_TALK_IN_PRIVATE: we have to get the variables again **/
			var name = data.name;
			var sender = data.senderid;
			var text = data.text;
			var user = data.userid;		
			/** settings.BOT_TALK_IN_PRIVATE: Test for Bot Responsiveness **/
				if (text.match(/^hi$/)) {
					bot.pm('Hey! How are you ?',sender);
					bot.pm('I\'m just glad to have somebody to talk to.', sender);
					//bot.pm('I\'m just glad to have somebody to talk to.',sender);

			}
			
			//settings.BOT_TALK_IN_PRIVATE 
				if (text.match(/^test$/)) {
					//if (moderatorList.indexOf(user) >= 0) {
					if (bIsModerator(user)) {
						bot.pm('hi mod',sender);
					} else {
						bot.pm('hi user '+user+'',sender);					
					}

			}

			/**  settings.BOT_TALK_IN_PRIVATE: Look in Moderators array to see if private messaging (PM) with an admin.
			If in PM with an admin, allow user to moderate via PM. **/
			if (bIsModerator(user)) {
				
				/** settings.BOT_TALK_IN_PRIVATE: Am I a bot admin? **/
				if (text.match(/^\/botadmin$/)) {
					bot.pm('Welcome, admin.',sender);
				} 
			
				
				/** settings.BOT_TALK_IN_PRIVATE: Upvote Current Song **/
				if (text.match(/^\/upvote|up$/)) {
					bot.pm('bopping. skipped songs slow bops.')
					bot.bop();
				}
				/** settings.BOT_TALK_IN_PRIVATE: Downvote Current Song **/
				if (text.match(/^\/downvote|down$/)) {
					bot.pm('Downvoting.')
					bot.vote('down');
				}
				/** settings.BOT_TALK_IN_PRIVATE: Skip Current Song if bot is DJ'ing **/
				if (text.match(/^\/skip$/)) {

					bot.pm('Gonna skip this song.',sender);
					bot.skip();
				}			
				/** settings.BOT_TALK_IN_PRIVATE: Snag the Song Currently Playing **/
				if (text.match(/^\/feart|\/snag$/)) {
					bot.pm('Gonna heart this song',sender);
						bot.roomInfo(true, function(data) {
						var song = data.room.metadata.current_song._id;
						var songName = data.room.metadata.current_song.metadata.song;
							bot.snag();
							bot.playlistAdd(song);
					});
				} //end snag
			} else {
				bot.pm('Thanks for sliding into my DM\'s. I only talk to room moderators. :kiss:')
			}
		} //end if settings.BOT_TALK_IN_PRIVATE. This ends the private message section.

		
	});
	
	
	//time_afk_list.js code
	var usersList = { };

	// Add everyone in the users list.
	bot.on('roomChanged',  function (data) {
	});

	// Someone enter the room, add him.
	bot.on('registered',   function (data) {
	   var user = data.user[0];
		if (user.userid != settings.USERID) {
			if (settings.BOT_GREET_ON_ENTER)  {
				bot.speak('Welcome, '+user.name+'!');
				bot.speak('Genres: House, Tech House, Bass House, G-House encouraged as well as dubstep, riddim, trance techno.');
			}
		} else {
			bot.speak('Hey guys. I am back. (Dancible Bot v. '+BOT_VERSION+')');	
		}

	});

	bot.on('deregistered', function (data) {
		var user = data.user[0];
		if (settings.BOT_GREET_ON_EXIT) bot.speak('Come back soon, '+user.name+'!');
	});

	bot.on('speak', function (data) {
	});



	// Someone stepped up to DJ, update his timestamp.
	bot.on('add_dj', function (data) {
	   var user = data.user[0];
	   if (settings.BOT_SHOUTOUT_TO_NEW_DJ_ON_DECK) {
			bot.speak('Are you ready for DJ '+user.name+'?!');
	   }
	   /* Modules */
	   mod_autoDj.addDj(data, bot);
	});

	// Someone step down, update his timestamp.
	bot.on('rem_dj', function (data) {
	   /* Modules */
	   mod_autoDj.remDj(data, bot);

	});

	// Someone add the surrent song to his playlist.
	bot.on('snagged', function (data) {
	   bot.snag();
	});

	
