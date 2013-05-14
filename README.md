OpenRecess
==========

Remember recess?  Kids play everyday, but few adults find time for fun and games together. OpenRecess is here to help. Join on-demand soccer, baseball, volleyball, doubles tennis, tag or any game you can imagine.  What are you playing?

To help managers and players, OpenRecess allows easy RSVPs and notifications via text messaging. Here is a brief overview of our project:

1. Create a public or private game
1. Add phone numbers for friends you want to invite or open enrollment to anyone
1. OpenRecess will notify users via text and process RSVP responses
1. OpenRecess will send regular text message updates to remind and organize all players

##Features

1. OpenRecess is a single page responsive web application
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
