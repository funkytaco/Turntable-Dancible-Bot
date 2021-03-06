# Turntable.FM Room Bot that can DJ automatically/manually, and perform basic DJ and room functions.
This bought was written 9 years ago and updated for Turntable.fm

https://turntable.fm/dancible Hang out here if you like House Music


A very basic, customizable Turntable.fm bot written in javascript for Node.js utilizing [ttapi](https://github.com/alaingilbert/Turntable-API).

## Installation

### Git Clone This Repo
`git clone https://github.com/funkytaco/Turntable-Dancible-Bot;`
`cd Turntable-API-Taco-Bot`
### Install NodeJS > 12.x and Turntable API
`npm install nodejs;`
`npm install ttapi;`

### Join The Chat Room
Every bot needs it's own account.

Once you've logged into Turntable.FM with the account you will use for the bot, click this bookmarklet:

http://alaingilbert.github.io/Turntable-API/bookmarklet.html

*    Drag the button in your bookmarks bar.
*   Browse to turntable.fm and click it.
* Use the three variables in the next step below.

#Copy the bookmarklet output into bot_settings.js

Paste the three variables obtained from the bookmarklet (USERID, ROOMID, AUTH) into botsettings.js *at the top of the bot_settings.js file*.

### Launch NodeJS

Just run the following to start the bot:
node ./bot.js

* make sure bot_settings.js has your authentication settings for turntable.fm

Your bot should join the room and say hello. That's it!

# Additional Info
You should browse through bot_settings.js to toggle settings. 

NOTE: **1 = YES, 0 = NO.**

## Features

This bot is written in Node.JS and utilizes Alain Gilbert's Turntable API.

The bot can: 

* Respond to a limited set of chat commands and PM commands.
* Awesome songs if forced to by bot admin.
* Greet room visitors on both enter & exit, or just one of the two.
* Display song statistics after a song is done.



## Resources
* Getting the ID's without the bookmarklet https://github.com/alaingilbert/Turntable-API/wiki/How-to-find-the:-auth,-userid-and-roomid


I'm usually hanging out in the [Dancible](http://turntable.fm/dancible) room on Turntable.
If I'm on Turntable, I'm usually working, so please try getting it to work before contacting me.

