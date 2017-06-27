var Asset = require('./models/Asset');
var User = require('./models/User');
var rest = require('../node_modules/restler');
var  nodemailer = require('nodemailer');
var request = require('request');
var cheerio = require('cheerio');
var sleep = require('sleep');
var fs = require('fs');
var fse = require('fs-extra')
var path = require('path');
var multer  = require('multer');
var uploadsFolder = __dirname + '/uploads/';  // defining real upload path
var upload = multer({ dest: uploadsFolder }); // setting path for multer
var beautify_html = require('js-beautify').html;
var beautify_css = require('js-beautify').css;
var shortid = require('shortid');
var bcrypt   = require('bcrypt-nodejs'); 

//for saving password after guest conversion
var generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//used for guest login creation
function yourCustomGuestAuthenticationMiddleware(req, res, next){
    // No need to do anything if a user already exists.
    if(req.user) return next();

    // Create a new user and login with that
    var user = new User({username: '_'+shortid.generate().toLowerCase() });
    user.save(function(err, usr) {

			if (err)
				res.send(err);
			
			//create asset record
			var asset = new Asset();
			asset.userid = usr._id;
			asset.username = usr.username;
			asset.lastmodified = new Date();
			asset.html = "<html>\n<head>\n</head>\n<body>\n<h1>hi mom</h1>\n</body>\n</html>";
			asset.css = "h1 { color:red; }";
			var theCss = "<style>\n"+asset.css+"\n</style>\n";
			var thePage = [asset.html.slice(0, asset.html.indexOf("</head>")), theCss, asset.html.slice(asset.html.indexOf("</head>"))].join('');								

			console.log('NEW ASSET: ' + JSON.stringify(asset));
			asset.save(function(err, ass) {

				if (err)
					res.send(err);
	
				//create folder and file
				var dirpath = "./public/pages/"+usr.username;
				var filepath = "./public/pages/"+usr.username + "/index.html";
					
				fs.mkdir(dirpath, function(err) {
    			if (err) throw err;

					fs.writeFile(filepath, thePage, function(err) {
    				if (err) throw err;

    				console.log("The file was succesfully saved!");
						req.logIn(user, next);
					});
									
    			console.log("The directroy was succesfully created!");
				}); 	

			});
		});
}

// route middleware to make sure a user is logged in
function isMyPage(req, res, next) {

// if user is authenticated in the session, carry on
   if (req.isAuthenticated()) {
      //if (req.user.local.email.split("@")[0] == req.params.id){
      if (req.user.username == req.params.id){
					return next();				
			} else {
				res.json({msg:'sorry not your page', params: req.params.id })
			}
	 } else {
// if they aren't redirect them to the home page
   res.redirect('/login');
	 }
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

// if user is authenticated in the session, carry on
   if (req.isAuthenticated()) {
				return next();				
	 } else {
			// if they aren't redirect them to the home page
   		res.redirect('/login');
	 }
}

// route middleware to make sure a user is logged in
function isValidPage(req, res, next) {
		//var validUsers = ['paul','joe'];
	
	
	Asset.findOne({ 'username':req.params.page }).exec(function(err,asset){
		console.log('in asset find'+JSON.stringify(asset) );
      if (asset){
					return next();				
			} else {
				res.json({msg:'sorry not a valid page', params: req.params.page })
			}
	   		});
// if user is authenticated in the session, carry on


}


module.exports = function(app, passport) {

	// api ======================================================================
	app.get('/api/userid', function(req, res) {
		console.log(req.user.id);
		res.send(req.user);
	});
	
	
// Process upload file
app.post('/upload/:pageId', upload.single('file'), function(request, response) {
	console.log("hello "+request.file.originalname+"path"+request.file.path);

    var fileName = request.file.originalname.toLowerCase(); //request.file.name; // original file name
    var file = request.file.path; // real file path with temporary name

    // renaming real file to it's original name
    fs.rename(file, './public/pages/'+request.params.pageId+'/'+fileName, function (err) {
      if (err) {
        console.log(err);
        response.json({success:false, message: err});
       return;
      }

			//update the image array in the asset record
			var img = {'name':fileName};
			//Asset.findOneAndUpdate({username: request.params.pageId}, {$push: {images: img}});
			Asset.findOneAndUpdate({
				username: request.params.pageId
			}, {
						$push: {images: img}
					}, function(err, doc) {

						if (err)
								response.send(err);

							console.log('updated image');//return doc so that view can immediately display new klass in array
      			response.json({success:true, message: 'File uploaded successfully', fileName: fileName});
					});
			
    });
});

	// update userinfo
	app.put('/api/user/:user_id', function(req, res) {

		var oldName, newName;
		
		// use our klass model to find the bear we want
		User.findById(req.params.user_id, function(err, user) {

			if (err)
				res.send(err);
			
			oldName = user.username;
			newName = req.body.username;
			
			console.log('email'+req.body.local.email);
			console.log('pass'+req.body.local.password);
			console.log('new'+req.body.username);

			user.username = req.body.username;
			//user.lastName = req.body.lastName;
			//user.userType = req.body.userType;
			user.local.email = req.body.local.email;
			if (req.body.local.password)
				user.local.password = generateHash(req.body.local.password);


			user.save(function(err) {
				if (err)
					res.send(err);
console.log('doing asset update on userid:'+user._id);
				//then update the asset record with the username where id=id
				Asset.findOneAndUpdate({
						userid: user._id
					}, {
							$set: {
								username: req.body.username,
								lastmodified: new Date()
							}
							}, function(err, doc) {

								if (err)
										res.send(err);

								//rename file
								//fs.rename("./public/pages/"+oldName + ".html", "./public/pages/"+newName + ".html", function(err) {
								fs.rename("./public/pages/"+oldName, "./public/pages/"+newName, function(err) {
    							if (err) throw err;

    							console.log("The file was succesfully saved!");
									//send resp
									res.json(user);
								}); 
					
									//return user so that view can immediately display new username
									//res.json(user);
							});
						});
				
			});

		});
	

	
	//remove image
	app.put('/api/asset/:pagename/image/:imagename', function(req,res){
		console.log('in delete route');
			Asset.findOneAndUpdate({
				username: req.params.pagename
			}, {
				  	$pull: { images: { name: req.params.imagename } } 
					}, function(err, doc) {

						if (err)
								res.send(err);

							console.log('deleted image');//return doc so that view can immediately display new klass in array
      			res.json({success:true, message: 'deleted image successfully', imagename: req.params.imagename});
					});
	});
	
	// get specific event for admin: edit or delete----------------------------------------=
	app.get('/api/asset/:username', function(req, res) {
			Asset.findOne({ 'username':req.params.username }).exec(function(err,docs){
	           	if(!err) {
	               	  // add default if none
								docs.html = beautify_html(docs.html);
								docs.css = beautify_css(docs.css);
		       		} else {
              //docs = new A();
              }
    			res.json(docs);
	   		});
	});

	// lightweight, called by profile form while typing----------------------------------------=
	app.get('/api/asset/username/:username', function(req, res) {
			Asset.findOne({ 'username':req.params.username }, { 'username': 1}).exec(function(err,docs){
	           	if(!err) {

		       		} else {
              //docs = new A();
              }
    			res.json(docs);
	   		});
	});	
	
	// delete an account
	app.delete('/api/user/:username', function(req, res) {
		
		var dirpath = "./public/pages/"+req.params.username;
		fse.remove(dirpath, function(err) {
			if (err) throw err;

			Asset.remove({
				username : req.params.username
			}, function(err, evt) {
				if (err) throw err;
				
					//set timestamp on user record
					User.findOneAndUpdate({
						username: req.params.username
					}, {
							$set: {
								guestdeleted: new Date()
							}
							}, function(err, usr) {
			
								res.json({msg:'The directory was deleted: '+ req.params.username})
								console.log("The directroy was succesfully deleted!");
							}
						);

		});
			
		});

	});
	
	//create asset rec if not exist
	app.post('/api/asset', function(req, res) {
		
		var asset = new Asset();
		asset.userid = req.body.userid;
		asset.username = req.body.username;
		asset.lastmodified = new Date();
		asset.html = "<html>\n<head>\n</head>\n<body>\n<h1>hi mom</h1>\n</body>\n</html>";
		asset.css = "h1 { color:red; }";
		var theCss = "<style>\n"+asset.css+"\n</style>\n";
		var thePage = [asset.html.slice(0, asset.html.indexOf("</head>")), theCss, asset.html.slice(asset.html.indexOf("</head>"))].join('');								

    
		console.log('NEW ASSET: ' + JSON.stringify(asset));


		asset.save(function(err, ass) {

			if (err)
				res.send(err);

				//then update the asset record with the username where id=id
				User.findOneAndUpdate({
						_id: req.body.userid
					}, {
							$set: {
								username: asset.username,
							}
							}, function(err, usr) {

								if (err)
										res.send(err);
										
								var dirpath = "./public/pages/"+asset.username;
								var filepath = "./public/pages/"+asset.username + "/index.html";
					
								fs.mkdir(dirpath, function(err) {
    							if (err) throw err;

									fs.writeFile(filepath, thePage, function(err) {
    								if (err) throw err;

    								console.log("The file was succesfully saved!");
										res.json(asset);
									});
									
    							console.log("The directroy was succesfully created!");
									//send resp
									//res.json(asset);
								}); 
									//return user so that view can immediately display new username
									//res.json(asset);
							});
			

		});
	});
	
	// update asset - html
 app.put('/api/asset/:pagename/html', function(req, res) {
					
		Asset.findOneAndUpdate({
				username: req.params.pagename
			}, {
					$set: {
						html: beautify_html(req.body.theHtml),
						css: beautify_css(req.body.theCss),
						lastmodified: new Date()
					}
					}, function(err, doc) {

						if (err)
								res.send(err);
						
						var thePage = "";
						var theHtml = beautify_html(req.body.theHtml);
						var theCss = "\n<style>\n"+beautify_css(req.body.theCss)+"\n</style>\n";
			
						//write file
						var filepath = "./public/pages/"+req.params.pagename + "/index.html";

			
						//find imag tag src, add pageId/ before
						var imgPosition = theHtml.indexOf("src=");
					 //theHtml = theHtml.replace('/src=\"/gi', 'src=\"'+req.params.pagename);
    				var rep = 'img src="'+req.params.pagename+'/';
     				theHtml = theHtml.replace(/img src="(?!\w*(?:http|https))/gi,rep);

						//find </head> string
						//insert css at that position
						var headPosition = theHtml.indexOf("</head>");

						var htmlPosition;
						var bodyPosition;
						if (headPosition == -1){
							bodyPosition = theHtml.indexOf("<body>");
								
								if (bodyPosition == -1){
									htmlPosition = theHtml.indexOf("<html>");
									if (htmlPosition == -1){
										//add css to top of html string; no head or html tags
										thePage = theCss + theHtml;
									} else {
										//no head tag, so add css after <html>
										thePage = [theHtml.slice(0, htmlPosition+6), theCss, theHtml.slice(htmlPosition+6)].join('');								
									}
								} else {
									//found body tag..add css just before body tag (no head tag exists)
									thePage = [theHtml.slice(0, bodyPosition), theCss, theHtml.slice(bodyPosition)].join('');								

								}
						} else {
							//found </head>
							thePage = [theHtml.slice(0, headPosition), theCss, theHtml.slice(headPosition)].join('');								

						}

			
						fs.writeFile(filepath, thePage, function(err) {
    					if (err) throw err;

    					console.log("The file was succesfully saved!");
							res.json(doc);
						}); 
							//return doc so that view can immediately display new klass in array
							
					});
        });
			


	//update asset - css
	app.put('/api/asset/:pagename/css', function(req, res) {
					
		Asset.findOneAndUpdate({
				username: req.params.pagename
			}, {
					$set: {
						css: req.body.theCss,
						lastmodified: new Date()
					}
					}, function(err, doc) {

						if (err)
								res.send(err);

							//return doc so that view can immediately display new klass in array
							res.json(doc);
					});
        });
	
	
	
	app.post('/api/lesson', function(req, res) {

		var lesson = new Lesson();
		lesson.subject = req.body.subject;
		lesson.unitname = req.body.unitname;
		lesson.dayofyear = req.body.dayofyear;
    lesson.sequence = req.body.sequence;
    lesson.body = req.body.body;
    lesson.bodysrc = req.body.bodysrc;
		lesson.img = req.body.img;
    lesson.imgsrc = req.body.imgsrc;

		console.log('LESSON: ' + JSON.stringify(lesson));


		lesson.save(function(err, lesson) {

			if (err)
				res.send(err);

			res.json({
				message: 'Lesson created',
				_id: lesson._id
			});

		});
	});

	// delete a lesson
	app.delete('/api/lesson/:id', function(req, res) {
		Lesson.remove({
			_id : req.params.id
		}, function(err, evt) {
			if (err)
				res.send(err);

		});
	});

	//app.get('/api/metro', function(req, res) {
        //    res.send( res.locals.metro );
	//});

	// application -------------------------------------------------------------

   
	app.get('/logout', function(req, res) {
		req.logout();
    res.redirect('/');
	});

	app.get('/:id/edit', isMyPage, function(req, res) {
	   res.sendfile('./public/page.html'); //
	});
	
		app.get('/profile', isLoggedIn, function(req, res) {			
	   res.sendfile('./public/page.html'); //
	});


	
	
	// =============================================================================
	// AUTHENTICATE (FIRST LOGIN) ==================================================
	// =============================================================================

	// locally --------------------------------
	// LOGIN ===============================
	// show the login form
	app.get('/login', function(req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage') }); // nd)
		//res.sendfile('./public/login.html', { message: req.flash('loginMessage') }); // nd)
	});
  
	app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));
	
  app.get('/signup', function(req, res) {
//		res.sendfile('./public/signup.html', { message: req.flash('signupMessage') }); // nd)
		res.render('signup.ejs', { message: req.flash('loginMessage') }); // nd)
	});
  
	app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));
	
	//app.post('/demo/:temp', passport.authenticate('demo-signup', {
  //  successRedirect : '/'+req.params.temp+'/edit', // redirect to the secure profile section
  //  failureRedirect : '/signup', // redirect back to the signup page if there is an error
  //  failureFlash : true // allow flash messages
  //}));
	
		//app.get('/:id/edit', isMyPage, function(req, res) {
	  // res.sendfile('./public/page.html'); //
	  //});
	//app.post('/demo', passport.authenticate('demo-signup'), function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
//    res.redirect('/' + req.user.username + '/edit');
 // });
	
 // app.get('/demo', function(req, res) {
//		res.sendfile('./public/signup.html', { message: req.flash('signupMessage') }); // nd)
//  	res.redirect(307, '/demo');
//	});
	
	app.get('/guest', yourCustomGuestAuthenticationMiddleware, function (req, res) {        
        res.redirect('/'+req.user.username+'/edit');
//res.render('PeerRoom.ejs', req.user);        
});


	
	// facebook -------------------------------

	// send to facebook to do the authentication
	app.get('/auth/facebook', passport.authenticate('facebook', {
		scope: 'email'
	}));

	// handle the callback after facebook has authenticated the user
	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect: '/dashboard',
			failureRedirect: '/'
		}));

	// twitter --------------------------------

	// send to twitter to do the authentication
	app.get('/auth/twitter', passport.authenticate('twitter', {
		scope: 'email'
	}));

	// handle the callback after twitter has authenticated the user
	app.get('/auth/twitter/callback',
		passport.authenticate('twitter', {
			successRedirect: '/dashboard',
			failureRedirect: '/'
		}));


	// google ---------------------------------

	// send to google to do the authentication
	app.get('/auth/google', passport.authenticate('google', {
		scope: ['profile', 'email']
	}));

	// the callback after google has authenticated the user
	app.get('/auth/google/callback',
		passport.authenticate('google', {
			successRedirect: '/profile',
			failureRedirect: '/'
		}));

	// =============================================================================
	// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
	// =============================================================================

	// locally --------------------------------
	app.get('/connect/local', function(req, res) {
		res.render('connect-local.ejs', {
			message: req.flash('loginMessage')
		});
	});
	app.post('/connect/local', passport.authenticate('local-signup', {
		successRedirect: '/dashboard', // redirect to the secure profile section
		failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));

	// facebook -------------------------------

	// send to facebook to do the authentication
	app.get('/connect/facebook', passport.authorize('facebook', {
		scope: 'email'
	}));

	// handle the callback after facebook has authorized the user
	app.get('/connect/facebook/callback',
		passport.authorize('facebook', {
			successRedirect: '/dashboard',
			failureRedirect: '/'
		}));

	// twitter --------------------------------

	// send to twitter to do the authentication
	app.get('/connect/twitter', passport.authorize('twitter', {
		scope: 'email'
	}));

	// handle the callback after twitter has authorized the user
	app.get('/connect/twitter/callback',
		passport.authorize('twitter', {
			successRedirect: '/dashboard',
			failureRedirect: '/'
		}));


	// google ---------------------------------

	// send to google to do the authentication
	app.get('/connect/google', passport.authorize('google', {
		scope: ['profile', 'email']
	}));

	// the callback after google has authorized the user
	app.get('/connect/google/callback',
		passport.authorize('google', {
			successRedirect: '/profile',
			failureRedirect: '/'
		}));

	// =============================================================================
	// UNLINK ACCOUNTS =============================================================
	// =============================================================================
	// used to unlink accounts. for social accounts, just remove the token
	// for local account, remove email and password
	// user account will stay active in case they want to reconnect in the future

	// local -----------------------------------
	app.get('/unlink/local', isLoggedIn, function(req, res) {
		var user = req.user;
		user.local.email = undefined;
		user.local.password = undefined;
		user.save(function(err) {
			res.redirect('/dashboard');
		});
	});

	// facebook -------------------------------
	app.get('/unlink/facebook', isLoggedIn, function(req, res) {
		var user = req.user;
		user.facebook.token = undefined;
		user.save(function(err) {
			res.redirect('/dashboard');
		});
	});

	// twitter --------------------------------
	app.get('/unlink/twitter', isLoggedIn, function(req, res) {
		var user = req.user;
		user.twitter.token = undefined;
		user.save(function(err) {
			res.redirect('/dashboard');
		});
	});

	// google ---------------------------------
	app.get('/unlink/google', isLoggedIn, function(req, res) {
		var user = req.user;
		user.google.token = undefined;
		user.save(function(err) {
			res.redirect('/dashboard');
		});
	});
	
	

app.get('/:page/:subfile', function(req, res){
    var page = req.params.page,
          subfile = req.params.subfile;
    res.sendfile(page+'/'+subfile, {root: './public/pages/'});
});
	
	app.get('/:page', isValidPage, function(req, res) {
		 console.log("in test routes :page")
	   //res.sendfile('./public/pages/'+req.params.page+'.html'); //
		 res.sendfile('/pages/'+req.params.page+'/index.html', {root: './public'});

	});	
	
//	app.get('/:page', isValidPage, function(req, res) {
//		 console.log("in routes :page")
//	   res.sendfile('./public/barepage.html'); //
//	});		

	
	
	app.get('/', function(req, res) {
	   res.sendfile('./public/index.html'); //
	});	

	app.get('*', function(req, res) {
		 console.log("in app get")
	   res.sendfile('./public/views/frame.html'); //
	});



};

