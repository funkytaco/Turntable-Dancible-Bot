var settings = exports;
/** BEGIN PASTE OF BOOKMARKLET VARIABLES **/
var AUTH = 'NvRxELdVhJsFUMYsMvdLCfIT';
var USERID = '6043d52c47b5e3001f34b29a';
var ROOMID = '6040fe553f4bfc001b27d4c7';
/** END PASTE OF BOOKMARKLET VARIABLES **/

//DO NOT EDIT THIS SECTION - SEE "ADDITIONAL INFO" IN README
settings.AUTH = AUTH; 
settings.USERID = USERID; 
settings.ROOMID = ROOMID; //6040fe553f4bfc001b27d4c7

//BOT DJ FUNCTIONS
//check settings_autodj.js

//OPTIONAL SETTINGS & CUSTOMIZATIONS
//Bot Name
settings.BOT_NAME = 'Dancible';
settings.BOT_SHORTNAME = 'd';
settings.BOT_AUTO_AWESOME = 1; 
settings.BOT_GREET_ON_ENTER = 1;
settings.BOT_GREET_ON_EXIT = 0;
settings.BOT_TALK_IN_CHAT = 1;
settings.BOT_TALK_IN_PRIVATE = 1;
settings.BOT_DISPLAY_UPVOTES_DOWNVOTES_AFTER_SONGEND = 1;
settings.BOT_SHOUTOUT_TO_NEW_DJ_ON_DECK = 1;


//Room Config
settings.ROOM_RULES_URL = 'http://www.dancible.com/events/rules.html'
settings.ROOM_BOT_MODERATORS_ARRAY = ['4f671b49590ca246ed01db9b', USERID ]; //NOTE: Every bot needs a user account.
settings.ROOM_MODS_ARE_BOT_ADMINS = 1; //Allow room mods to automatically be bot admins? todo

//DIAG
settings.DEBUG_LOGS = 0; //enable printing to console log.