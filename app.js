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