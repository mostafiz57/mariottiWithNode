This app is for web developers who want to build highly interactive javascript applications. 
This will cover using Backbone.Marionette.js to achieve that goal, 
and will empower you to build your own applications by understanding how Marionette apps are built. 

=========Package.json========

{
  "name": "couch-app",
  "version": "0.1.0",
  "description": "ilm file upload project",
  "main": "app.js",
  "dependencies": {
    "express": "~4.4.5",
    "grunt": "~0.4.5",
    "grunt-contrib-cssmin": "~0.10.0",
    "grunt-contrib-watch": "~0.6.1",
    "hbs": "~2.7.0",
    "nib": "~1.0.3"  
  },
  "devDependencies": {
    "grunt": "~0.4.5",
    "grunt-couchapp": "~0.2.1"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/chadananda/ilm.git"
  },
  "scripts": {
    "test": "watch"
  },
  "keywords": [
    "couchapp"
  ],
  "author": "Mostafizur Rahman",
  "license": "ilm",
  "bugs": {
    "url": "https://github.com/chadananda/ilm/issues"
  }
}


=========App.js===========

var express = require('express');
var stylus  = require('stylus');
var nib     = require('nib');
var hbs     = require('hbs');
var app = module.exports = express();

  app.engine('html', hbs.__express);
  app.set('view engine', 'html');


  var DEV_PATH = '/source';


   app.set('views', __dirname + DEV_PATH);

  app.use(express.static(__dirname + DEV_PATH));

app.get('/', function(req, res) {
  res.render('index.html');
});

  hbs.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

var PORT = 3000;
app.listen(PORT);
console.log("http://localhost:"+PORT+" ["+app.settings.env+"]");

process.on('uncaughtException', function(err) {
  console.error("FATAL ERROR: "+err.message);
  console.error('Stack: '+err.stack);
  console.error("Shuting down app...");
  process.exit(1);
});


======Grunt.js=========

var DEMO_COUCH_DB = 'http://localhost:5984/ilm-app';
module.exports = function (grunt) {

	var cssFiles = [
		'source/assets/css/site.css',
		'source/assets/css/style.css'
	];


	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

        watch: {
            files: '<config:lint.files>',
            tasks: 'default'
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                node: true,
                es5: true
            },
            globals: {}
        },
        mkcouchdb: {
            demo: {
                db: DEMO_COUCH_DB
            }
        },
        rmcouchdb: {
            demo: {
                db: DEMO_COUCH_DB,
                options: {
                    okay_if_missing: true
                }
            }
        },
        couchapp: {
            demo: {
                db: DEMO_COUCH_DB,
                app: './demo/app.js'
            }
        },

		cssmin: {

			options : {
				 banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
				},
			combine: {
				files: {
					'source/css/<%= pkg.name %>.min.css' :cssFiles
				}
			}

		}

	});

	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadTasks('tasks');
	grunt.registerTask('default', ['cssmin']);
	grunt.registerTask('buildcss', ['cssmin']);
	grunt.registerTask('demo', 'rmcouchdb:demo mkcouchdb:demo couchapp:demo');
	
}

Others mariotti file check inside source/app . Here I have separate and organize view,controller,model and router
