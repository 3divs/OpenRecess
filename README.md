OpenRecess
==========

A website designed to simplify organizing sports for both managers and players. The primary focus of this project is to allow RSVPs and notifications to be performed via text messaging. The UX of our product from a user's perspective is as follows:

1. Create a public or private game
1. Add invitees phone numbers to your game or allow any user to join
1. Notify users via text and process RSVP responses
1. Send continuous updates via text when a game is confirmed for all players

##Features

1. Single page responsive web application
1. Team management for maintaining rosters and ability to send mass text message notifications
1. Easy-to-use game creation and join game process

##Technologies
1. Express backend for REST calls
1. Backbone.Marionette frontend
1. Twilio API integration
1. Passport.js authentication
1. Mongodb NoSQL database
1. Stylus CSS
1. Grunt.js Task Runner

##Installation
To install and run this project, follow the following steps:

####Clone Repo
`git clone https://github.com/3divs/OpenRecess.git`

####Install Node Modules
`npm install`

####Install grunt globally
`sudo npm install -g grunt grunt-cli`

####Install and run mongodb (using homebrew)
`brew install mongodb`
`mongod --port 17017`

####Run Grunt commands
`grunt db`
`grunt`

NOTE: You will need to setup LocalTunnel and specify your own Twilio API key in order to get text messaging to work.