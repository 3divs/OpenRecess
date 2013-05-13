var mongoose = require('mongoose');

module.exports = function(grunt) {

  grunt.initConfig({
    stylus: {
      compile: {
        options: {
          'paths': ['public/stylesheets']
        },
        files: {
          'public/stylesheets/style.css': 'public/stylesheets/style.styl'
        }
      }
    },
    exec: {
      users: {
        cmd: 'mongoimport --jsonArray --drop --upsert --port 17017 --db openRecess --collection users --file ./config/users.json'
      },
      games: {
        cmd: 'mongoimport --jsonArray --drop --upsert --port 17017 --db openRecess --collection games --file ./config/games.json'
      },
      teams: {
        cmd: 'mongoimport --jsonArray --drop --upsert --port 17017 --db openRecess --collection teams --file ./config/teams.json'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-exec');

  // Run commands with syntax: "grunt default" or "grunt db"
  grunt.registerTask('default', ['stylus']);
  grunt.registerTask('db', ['exec']);
};
