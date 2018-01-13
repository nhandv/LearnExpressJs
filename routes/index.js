var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var router = express.Router();

router.use(cookieParser());
router.use(session({secret: "Your secret key"}));

var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer(); 

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true })); 
router.use(upload.array());

var Users = [];
/* GET home page. */

router.get('/', function(req, res) {
	res.cookie('name', 'express'); //Sets name = express res.clearCookie('foo');
  	res.render('index', { title: 'Express' });
  	
});
/*
 * by nhandv
 */
router.post('/add', function(req, res) {
	console.log("This is method post");
	console.log(req.body);
	var u = req.body.user;
	console.log(u);
	res.send("Object:" + u);
	//res.render("show", {tile:'Custom', user: u });
});

//Middleware function to log request protocol
router.use("/things", function(req,res,next){
	console.log("A request for things received at " + Date.now());
   next();
})
// Route handler that sends the response
router.get('/things', function(req, res){
	res.send('Things');
 });

router.get("/session",function(req,res){
	if(req.session.page_views){
		req.session.page_views++;
		res.send("You visited this page " + req.session.page_views + " times");
	 } else {
		req.session.page_views = 1;
		res.send("Welcome to this page for the first time!");
	 }
});

router.get('/signup', function(req, res){
	res.render('signup',{title:"Sigup"});
 });
 
 router.post('/signup', function(req, res){
	if(!req.body.id || !req.body.password){
	   res.status("400");
	   res.send("Invalid details!");
	} else {
	   Users.filter(function(user){
		  if(user.id === req.body.id){
			 res.render('signup', {
				message: "User Already Exists! Login or choose another user id"});
		  }
	   });
	   var newUser = {id: req.body.id, password: req.body.password};
	   Users.push(newUser);
	   req.session.user = newUser;
	   res.redirect('/protected_page');
	}
 });
 function checkSignIn(req, res, next){
	if(req.session.user){
	   next();     //If session exists, proceed to page
	} else {
	   var err = new Error("Not logged in!");
	   console.log(req.session.user);
	   next(err);  //Error, trying to access unauthorized page!
	}
 }
 router.get('/protected_page',checkSignIn, function(req, res){
	res.render('protected_page', {title:"protected_page",id: req.session.user.id});
 });

 router.use('/protected_page', function(err, req, res, next){
	console.log(err);
	   //User should be authenticated! Redirect him to log in.
	res.redirect('/login');
 });

 router.get('/login', function(req, res){
	res.render('login',{title:"login"});   
 });

 router.post('/login', function(req, res){
	console.log(Users);
	if(!req.body.id || !req.body.password){
	   res.render('login', {title:"login",message: "Please enter both id and password"});
	} else {
	   Users.filter(function(user){
		  if(user.id === req.body.id && user.password === req.body.password){
			 req.session.user = user;
			 res.redirect('/protected_page');
		  }else{
			res.render('login', {title:"login",message: "Invalid credentials!"});
		  }
	   });
	  
	}
 });

 router.get('/logout', function(req, res){
	req.session.destroy(function(){
	   console.log("user logged out.")
	});
	res.redirect('/login');
 });

module.exports = router;
