const createError = require('http-errors');
const express = require("express");
const exphbs  = require('express-handlebars');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const logger = require('morgan');
const TodosModel = require('./models/todos.model');

const app = express();
const PORT = process.env.PORT || 3000;

// DATABASE
mongoose.Promise = global.Promise;
//var basename  = path.basename(__filename);
const env       = process.env.NODE_ENV || 'development';
const dbConfig    = require('./config/database.config.json')[env];

mongoose.connect(dbConfig.url)
.then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...');
    console.log(dbConfig);
    process.exit();
});
// END DATABASE

// Logger and BodyParser
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
  });
// END CORS

// API ROUTES
var todoRouter = require('./routes/todo.routes');
app.use('/api', todoRouter);
// END API ROUTES

// HTML ROUTES
app.engine('handlebars', exphbs({defaultLayout: 'main', partialsDir: __dirname + '/views/partials/'}));
app.set('view engine', 'handlebars');

app.use(express.static("public"));

// GOOGLE HEALTH MONITOR
app.get('/_ah/start', function(req, res){
  res.status(200).send("OK");
});

app.get('/', function (req, res) {
  TodosModel.find().then(todos => {
    res.render('home', { todos: todos, url: {home: true} });
	}, err => {
		res.render('error', { err: err, url: req.url });
	});
});

app.get('/completed', function (req, res) {
  TodosModel.find({done: true}).then(todos => {
    res.render('completed', { todos: todos, url: {completed: true} });
	}, err => {
		res.render('error', { err: err, url: req.url });
	});
});

app.get('/uncompleted', function (req, res) {
  TodosModel.find({done: false}).then(todos => {
    res.render('uncompleted', { todos: todos, url: {uncompleted: true} });
	}, err => {
		res.render('error', { err: err, url: req.url });
	});
});

app.get('/about', function (req, res) {
  res.render('about', { url: {about: true} });
});

// ADD TODO
app.post('/todo', function(req, res) {

  if(req.body.name.length <= 0){
    res.redirect('back');
  } else {
    TodosModel.create({
        name: req.body.name,
        completed: false
    }).then(todo => {
      res.redirect('back');
    }, err => {
        console.log(err);
        res.render('error', { err: err });
    });
  }

});

// EDIT TODO
app.post('/todo/:id', function(req, res) {

  TodosModel.findById(req.params.id).then(todo => {
    if(!todo){
      res.render('error', { err: "ID NO ENCONTRADO." });
    } else {
        todo.name = req.body.name;
        todo.done = !todo.done; // CHANGE STATUS
        todo.save().then(todo => {
          res.redirect('back');
        }, err => {
            console.log(err);
            res.render('error', { err: err });
        });
    }
  }, err => {
    console.log(err);
    res.render('error', { err: err });
  });

});
// HTML ROUTES

// ROUTES ERROR HANDLER
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    //console.log(req);
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.json({ message: err.message });
  });

// END ROUTES ERROR HANDLER

// Start the API server
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});