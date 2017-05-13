var Asset = require('./models/Asset');
var rest = require('../node_modules/restler');
var  nodemailer = require('nodemailer');
var request = require('request');
var cheerio = require('cheerio');
var sleep = require('sleep');
 
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

// if user is authenticated in the session, carry on
   if (req.isAuthenticated()) {
      if (req.user.local.email.split("@")[0] == req.params.id){
					return next();				
			} else {
				res.json({msg:'sorry not your page', emailspli:req.user.local.email.split("@")[0], params: req.params.id })
			}
	 } else {
// if they aren't redirect them to the home page
   res.redirect('/login');
	 }
}

// route middleware to make sure a user is logged in
function isValidPage(req, res, next) {
		var validUsers = ['paul','joe'];
// if user is authenticated in the session, carry on
      if (validUsers.indexOf(req.params.page) > -1){
					return next();				
			} else {
				res.json({msg:'sorry nota valid page', params: req.params.page })
			}

}


module.exports = function(app, passport) {

	// api ======================================================================
	app.get('/api/lessons', function(req, res) {
			Lesson.find({  }).sort({_id: -1}).exec(function(err,docs){
	        if(!err) {
						//success
		       	}

    			res.json(docs);
	   		});
	});

	// get specific event for admin: edit or delete----------------------------------------=
	app.get('/api/asset/:id', function(req, res) {
			Asset.findOne({ 'userid':req.params.id }).exec(function(err,docs){
	           	if(!err) {
	               	  // add default if none
		       		} else {
							docs ={message: 'error'+err};
              //docs = new A();
              }
    			res.json(docs);
	   		});
	});
	
 // update lesson
 app.put('/api/lesson/:id', function(req, res) {
					
		Lesson.findOneAndUpdate({
				_id: req.params.id
			}, {
					$set: {
						subject: req.body.subject,
            unitname: req.body.unitname,
            dayofyear: req.body.dayofyear,
            sequence: req.body.sequence,
            body: req.body.body,
            bodysrc: req.body.bodysrc,
            img: req.body.img,
            imgsrc: req.body.imgsrc
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

	app.get('/login', function(req, res) {
		res.sendfile('./public/login.html', { message: req.flash('loginMessage') }); // nd)
	});
  
	app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/:id/edit', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));
	
  app.get('/signup', function(req, res) {
		res.sendfile('./public/signup.html', { message: req.flash('signupMessage') }); // nd)
	});
  
	app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));
   
	app.get('/logout', function(req, res) {
		req.logout();
    res.redirect('/');
	});

	app.get('/:id/edit', isLoggedIn, function(req, res) {
	   res.sendfile('./public/views/edit.html'); //
	});

	app.get('/:page', isValidPage, function(req, res) {
	   res.sendfile('./public/page.html'); //
	});	
	
	app.get('/', function(req, res) {
	   res.sendfile('./public/index.html'); //
	});	

	app.get('*', function(req, res) {
		 console.log("in app get")
	   res.sendfile('./public/views/frame.html'); //
	});



};

