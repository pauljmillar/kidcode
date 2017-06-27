

var thisMod = angular.module('EditCtrl', [ 'services', 'ui.codemirror', 'ngFileUpload', 'angularResizable', 'ngclipboard'])

  .controller('EditController', ['$location', '$scope','$http','services',  '$routeParams', 'assetRecord', '$mdSidenav', 'Upload', '$timeout', '$window','$mdDialog', function($location, $scope, $http, services,  $routeParams, assetRecord, $mdSidenav, Upload, $timeout, $window, $mdDialog) {

	services.getUserId()
			.success(function(data) {
					  //$scope.chosenLonlat = lat+','+lon;
				$scope.user = data;
	});

 $scope.pageId = $routeParams.page;
 $scope.pagePath = '/'+$scope.pageId+'?dummyVar='+ (new Date()).getTime();
 $scope.selectedTabIndex = 0;
 $scope.selectedMoreTabIndex = 0;
		
 $scope.theHtml = assetRecord.data.html;
 $scope.theCss = assetRecord.data.css;
 $scope.imageList = assetRecord.data.images;
 $scope.fullHtml = "<style>"+$scope.theCss+"</style>"+$scope.theHtml;
 $scope.errorMsg = "good";
 
		
    $scope.htmlHints = [{
      what: 'Image',
      who: '',
      notes: '<img src="img_name.jpg" height="300px">'
    }, {
      what: 'List',
      who: '',
      notes: '<ul><li>Coffee</li><li>Tea</li></ul>'
    }, {
      what: 'Button',
      who: '',
      notes: '<button type="button">Click Me!</button>'
    }, {
      what: 'Title',
      who: '',
      notes: '<h1>Welcome to my Page</h1>'
    }, {
      what: 'Anchor/Link',
      who: '',
      notes: '<a href="https://www.w3schools.com">Visit W3Schools.com!</a>'
    }];		
		
    $scope.cssHints = [{
      what: 'Font Family',
      who: '',
      notes: 'p {font-family: "Times New Roman", Times, serif;}'
    }, {
      what: 'Font Size',
      who: '',
      notes: 'p {font-size: 14px;}'
    }, {
      what: 'Color',
      who: '',
      notes: 'h2 {color: green;}'
    }, {
      what: 'Background Image',
      who: '',
      notes: '#example1 {background-image: url(img_flwr.gif);}'
    }, {
      what: 'Background Color',
      who: '',
      notes: 'h1 {background: yellow;}'
    }];		
		
		  $scope.templates = [
    { name: 'My Trip to the Zoo', wanted: false, html: '<!DOCTYPE html><html><title>My Trip to the Zoo</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"><body> <header class="w3-display-container w3-content w3-center" style="max-width:1500px"> <img class="w3-image" src="https://lorempixel.com/1500/600/animals" alt="Me" width="1500" height="600"> <div class="w3-display-middle w3-padding-large w3-border w3-wide w3-text-light-grey w3-center"> <h1 class="w3-hide-medium w3-hide-small w3-xxxlarge">My Trip to the Zoo</h1> <h5 class="w3-hide-large" style="white-space:nowrap">My Trip to the Zoo</h5> <h3 class="w3-hide-medium w3-hide-small">JANE DOE</h3> </div><div class="w3-bar w3-light-grey w3-round w3-display-bottommiddle w3-hide-small" style="bottom:-16px"> <a href="#" class="w3-bar-item w3-button">Home</a> <a href="#pics" class="w3-bar-item w3-button">Pics</a> <a href="#story" class="w3-bar-item w3-button">Story</a> </div></header> <div class="w3-center w3-light-grey w3-padding-16 w3-hide-large w3-hide-medium"> <div class="w3-bar w3-light-grey"> <a href="#" class="w3-bar-item w3-button">Home</a> <a href="#pics" class="w3-bar-item w3-button">Pics</a> <a href="#story" class="w3-bar-item w3-button">Story</a> </div></div><div class="w3-content w3-padding-large w3-margin-top" id="pics"> <img src="https://lorempixel.com/1000/500/animals" alt="Pic1" class="w3-image" width="1000" height="500"> <img src="https://lorempixel.com/1000/500/nature" alt="Pic2" class="w3-image w3-margin-top" width="1000" height="500"> <img src="https://lorempixel.com/1000/500/cats" alt="Pic3" class="w3-image w3-margin-top" width="1000" height="500"> <img src="https://lorempixel.com/1000/500/animals" alt="Pic4" class="w3-image w3-margin-top" width="1000" height="500"> <div class="w3-light-grey w3-padding-large w3-padding-32 w3-margin-top" id="story"> <h3 class="w3-center">My Story</h3> <hr> <p>I went to Lincoln Park Zoo in Chicago with my Mom and my sister in June, 2017.</p><p>It was a sunny day and we got to have popcorn.</p><p>We saw so many animals. I wish I could have seen an elephant though.</p><p>If you want to share your pics from the zoo, share with my mom on Twitter:</p><p><a href="https://twitter.com">@myMom</a></p></div></div><div class="w3-grey w3-center w3-padding-24">Powered by <a href="https://www.w3schools.com/w3css/default.asp" title="W3.CSS" target="_blank" class="w3-hover-opacity">w3.css</a></div></body></html>' },
		{ name: 'Science Fair', wanted: false, css: 'body,h1,h2,h3,h4,h5 {font-family: "Poppins", sans-serif} body {font-size:16px;} .w3-half img{margin-bottom:-6px;margin-top:16px;opacity:0.8;cursor:pointer} .w3-half img:hover{opacity:1}', html: '<!DOCTYPE html><html><title>Science Fair</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"><link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins"><body><nav class="w3-sidebar w3-red w3-collapse w3-top w3-large w3-padding" style="z-index:3;width:300px;font-weight:bold;" id="mySidebar"><br><a href="javascript:void(0)" onclick="w3_close()" class="w3-button w3-hide-large w3-display-topleft" style="width:100%;font-size:22px">Close Menu</a> <div class="w3-container"> <h3 class="w3-padding-64"><b>Science Fair<br>Project</b></h3> </div><div class="w3-bar-block"> <a href="#" onclick="w3_close()" class="w3-bar-item w3-button w3-hover-white">Question</a> <a href="#hypothesis" onclick="w3_close()" class="w3-bar-item w3-button w3-hover-white">Hypothesis</a> <a href="#materials" onclick="w3_close()" class="w3-bar-item w3-button w3-hover-white">Materials</a> <a href="#procedure" onclick="w3_close()" class="w3-bar-item w3-button w3-hover-white">Procedure</a> <a href="#analysis" onclick="w3_close()" class="w3-bar-item w3-button w3-hover-white">Analysis</a> <a href="#conclusion" onclick="w3_close()" class="w3-bar-item w3-button w3-hover-white">Conclusion</a> </div></nav><header class="w3-container w3-top w3-hide-large w3-red w3-xlarge w3-padding"> <a href="javascript:void(0)" class="w3-button w3-red w3-margin-right" onclick="w3_open()">☰</a> <span>Science Fair</span></header><div class="w3-overlay w3-hide-large" onclick="w3_close()" style="cursor:pointer" title="close side menu" id="myOverlay"></div><div class="w3-main" style="margin-left:340px;margin-right:40px"> <div class="w3-container" style="margin-top:80px" id="question"> <h1 class="w3-jumbo"><b>How Smell Affects Taste</b></h1> <h1 class="w3-xxxlarge w3-text-red"><b>By: Jack John</b></h1> <hr style="width:50px;border:5px solid red" class="w3-round"> </div><div class="w3-row-padding"> <div class="w3-half"> <img src="http://lorempixel.com/400/400/technics/" style="width:100%" > </div><div class="w3-half"> <p>We are lorem ipsum consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure </p></div></div><div class="w3-container" id="hypothesis" style="margin-top:75px"> <h1 class="w3-xxxlarge w3-text-red"><b>Hypothesis.</b></h1> <hr style="width:50px;border:5px solid red" class="w3-round"> <div class="w3-row-padding"> <div class="w3-half"> <p>We are lorem ipsum consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure </p></div><div class="w3-half"> <img src="http://lorempixel.com/400/400/sports/" style="width:100%" > </div></div></div><div class="w3-container" id="materials" style="margin-top:75px"> <h1 class="w3-xxxlarge w3-text-red"><b>Materials.</b></h1> <hr style="width:50px;border:5px solid red" class="w3-round"> <div class="w3-row-padding"> <div class="w3-half"> <img src="http://lorempixel.com/400/400/nature/" style="width:100%" > </div><div class="w3-half"> <p>We are lorem ipsum consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure </p></div></div><div class="w3-container" id="procedure" style="margin-top:75px"> <h1 class="w3-xxxlarge w3-text-red"><b>Procedure.</b></h1> <hr style="width:50px;border:5px solid red" class="w3-round"> <div class="w3-row-padding"> <div class="w3-half"> <p>We are lorem ipsum consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure </p></div><div class="w3-half"> <img src="http://lorempixel.com/400/400/technics/" style="width:100%" > </div></div></div><div class="w3-container" id="analysis" style="margin-top:75px"> <h1 class="w3-xxxlarge w3-text-red"><b>Analysis.</b></h1> <hr style="width:50px;border:5px solid red" class="w3-round"> <div class="w3-row-padding"> <div class="w3-half"> <img src="http://lorempixel.com/400/400/sports/" style="width:100%" > </div><div class="w3-half"> <p>We are lorem ipsum consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure </p></div></div><div class="w3-container" id="conclusion" style="margin-top:75px"> <h1 class="w3-xxxlarge w3-text-red"><b>Conclusion.</b></h1> <hr style="width:50px;border:5px solid red" class="w3-round"> <div class="w3-row-padding"> <div class="w3-half"> <p>We are lorem ipsum consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure </p></div><div class="w3-half"> <img src="http://lorempixel.com/400/400/nature/" style="width:100%" > </div></div></div></div><div class="w3-light-grey w3-container w3-padding-32" style="margin-top:75px;padding-right:58px"><p class="w3-right">Powered by <a href="https://www.w3schools.com/w3css/default.asp" title="W3.CSS" target="_blank" class="w3-hover-opacity">w3.css</a></p></div><script>// Script to open and close sidebarfunction w3_open(){document.getElementById("mySidebar").style.display="block"; document.getElementById("myOverlay").style.display="block";}function w3_close(){document.getElementById("mySidebar").style.display="none"; document.getElementById("myOverlay").style.display="none";}</script></body></html>'}, 
		{ name: 'My Summer', wanted: false, css: 'body,h1,h2,h3,h4,h5 {font-family: "Raleway", sans-serif}', html: '<!DOCTYPE html><html><title>W3.CSS Template</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"><link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway"><body class="w3-light-grey"><!-- w3-content defines a container for fixed size centered content, and is wrapped around the whole page content, except for the footer in this example --><div class="w3-content" style="max-width:1400px"><header class="w3-container w3-center w3-padding-32"> <h1><b>MY SUMMER - 2017</b></h1> <p>What I did, by <span class="w3-tag">Jonathan S.</span></p></header><div class="w3-row"><div class="w3-col l2">&nbsp;</div><div class="w3-col l8 s12"> <div class="w3-card-4 w3-margin w3-white"> <img src="http://lorempixel.com/600/600/city/" alt="Nature" style="width:100%"> <div class="w3-container"> <h3><b>TITLE HEADING</b></h3> <h5>Title description, <span class="w3-opacity">April 7, 2014</span></h5> </div><div class="w3-container"> <p>Mauris neque quam, fermentum ut nisl vitae, convallis maximus nisl. Sed mattis nunc id lorem euismod tincidunt sed tellus ut rutrum. Sed vitae justo condimentum, porta lectus vitae, ultricies congue gravida diam non fringilla.</p></div></div><hr> <div class="w3-card-4 w3-margin w3-white"> <img src="http://lorempixel.com/600/600/nature/" alt="Norway" style="width:100%"> <div class="w3-container"> <h3><b>BLOG ENTRY</b></h3> <h5>Title description, <span class="w3-opacity">July 2, 2017</span></h5> </div><div class="w3-container"> <p>Mauris neque quam, fermentum ut nisl vitae, convallis maximus nisl. Sed mattis nunc id lorem euismod  tincidunt sed tellus ut rutrum. Sed vitae justo condimentum, porta lectus vitae, ultricies congue gravida diam non fringilla.</p><div class="w3-row"> <div class="w3-col m8 s12"> <p><a href="https://www.yahoo.com" class="w3-button w3-padding-large w3-white w3-border"><b>View More Pics »</b></a></p></div></div></div></div></div></div><br></div><footer class="w3-container w3-dark-grey w3-padding-32 w3-margin-top"> <p>Powered by <a href="https://www.w3schools.com/w3css/default.asp" target="_blank">w3.css</a></p></footer></body></html>'},
		{ name: "Kelly's Lawn Care", wanted: false, css: 'body, html{height: 100%}body,h1,h2,h3,h4,h5,h6{font-family: "Amatic SC", sans-serif}.menu{display: none}.bgimg{background-repeat: no-repeat; background-size: cover; background-image: url("http://lorempixel.com/400/200/nature/4/"); min-height: 90%;}', html:'<!DOCTYPE html><html><title>Kelly Cuts</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"><link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Amatic+SC"><body><div class="w3-top w3-hide-small"> <div class="w3-bar w3-xlarge w3-green w3-opacity w3-hover-opacity-off" id="myNavbar"> <a href="#" class="w3-bar-item w3-button">HOME</a> <a href="#menu" class="w3-bar-item w3-button">SERVICES</a> <a href="#about" class="w3-bar-item w3-button">ABOUT</a> <a href="#contact" class="w3-bar-item w3-button">CONTACT</a> </div></div><header class="bgimg w3-display-container " id="home"> <div class="w3-display-bottomleft w3-padding"> <span class="w3-tag w3-xlarge">From Western to Ashland</span> </div><div class="w3-display-middle w3-center"> <span class="w3-text-white w3-hide-small" style="font-size:100px">Kelly<br>Cuts Lawns</span> <span class="w3-text-white w3-hide-large w3-hide-medium" style="font-size:60px"><b>Kelly<br>Cuts Lawns</b></span> <p><a href="#menu" class="w3-button w3-xxlarge w3-green">Services</a></p></div></header><div class="w3-container w3-white w3-padding-64 w3-xxlarge" id="menu"> <div class="w3-content"> <h1 class="w3-center w3-jumbo" style="margin-bottom:64px">Services</h1> <div class="w3-row w3-center w3-border w3-border-dark-grey"> <a href="javascript:void(0)" onclick="openMenu(event, \'Mowing\');" id="myLink"> <div class="w3-col s4 tablink w3-padding-large w3-hover-green">Mowing</div></a> <a href="javascript:void(0)" onclick="openMenu(event, \'Raking\');"> <div class="w3-col s4 tablink w3-padding-large w3-hover-green">Raking</div></a> <a href="javascript:void(0)" onclick="openMenu(event, \'Misc\');"> <div class="w3-col s4 tablink w3-padding-large w3-hover-green">Misc</div></a> </div><div id="Mowing" class="w3-container menu w3-padding-32 w3-white"> <h1><b>Front Yard</b> <span class="w3-right w3-tag w3-dark-grey w3-round">$5.00</span></h1> <p class="w3-text-grey">Includes mowing and bagging of clippings</p><hr> <h1><b>Front & Rear</b> <span class="w3-right w3-tag w3-dark-grey w3-round">$10.00</span></h1> <p class="w3-text-grey">Includes mowing and bagging</p><hr> <h1><b>Edging</b> <span class="w3-right w3-tag w3-dark-grey w3-round">+$5.00</span></h1> <p class="w3-text-grey">(corner house add $2)</p><hr></div><div id="Raking" class="w3-container menu w3-padding-32 w3-white"> <h1><b>Front Yard</b> <span class="w3-right w3-tag w3-dark-grey w3-round">$5.00</span></h1> <p class="w3-text-grey">Includes up to 2 compost bags</p><hr> <h1><b>Front & Rear</b> <span class="w3-right w3-tag w3-dark-grey w3-round">$10.00</span></h1> <p class="w3-text-grey">Includes up to 5 compost bags</p><hr> </div><div id="Misc" class="w3-container menu w3-padding-32 w3-white"> <h1><b>Spring Fertilizer</b> <span class="w3-right w3-tag w3-dark-grey w3-round">$15.00</span></h1> <p class="w3-text-grey">Includes up to 500 sf</p><hr> <h1><b>Pulling Weeds</b> <span class="w3-right w3-tag w3-dark-grey w3-round">$5.00</span></h1> <p class="w3-text-grey">Hourly cost</p><hr> </div><br></div></div><div class="w3-container w3-padding-64 w3-grey w3-grayscale w3-xlarge" id="about"> <div class="w3-content"> <h1 class="w3-center w3-jumbo" style="margin-bottom:64px">About Me</h1> <p>Hi, I am Kelly. I have been mowing lawns for two summers.</p><p><strong>Why Me?</strong> I take my time and will never miss a day.<img src="https://lorempixel.com/400/400/people/9/" style="width:150px" class="w3-circle w3-right" alt="Chef"></p><p>I am saving up for a new phone.</p><img src="https://lorempixel.com/400/400/nature" style="width:100%" class="w3-margin-top w3-margin-bottom" alt="Restaurant"> </div></div><div class="w3-container w3-padding-64 w3-blue-grey w3-grayscale-min w3-xlarge" id="contact"> <div class="w3-content"> <h1 class="w3-center w3-jumbo" style="margin-bottom:64px">Contact</h1> <p>Text my mom at 05050515-122330</p><p><span class="w3-tag">FYI!</span> I will be on vacation with my parents from July 18th - 26. Sorry!</p></div></div><footer class="w3-center w3-black w3-padding-48 w3-xxlarge"> <p>Powered by <a href="https://www.w3schools.com/w3css/default.asp" title="W3.CSS" target="_blank" class="w3-hover-text-green">w3.css</a></p></footer><script>function openMenu(evt, menuName){var i, x, tablinks; x=document.getElementsByClassName("menu"); for (i=0; i < x.length; i++){x[i].style.display="none";}tablinks=document.getElementsByClassName("tablink"); for (i=0; i < x.length; i++){tablinks[i].className=tablinks[i].className.replace(" w3-green", "");}document.getElementById(menuName).style.display="block"; evt.currentTarget.firstElementChild.className +=" w3-green";}document.getElementById("myLink").click();</script></body></html>' },
		{ name: "My Summer Vacation", wanted: false, html: '<!DOCTYPE html><html><title>My Summer Vacation</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"><body class="w3-content" style="max-width:1200px"><div class="w3-panel"> <i class="w3-xlarge fa fa-suitcase"></i></div><div class="w3-row"><div class="w3-half w3-container"> <h1 class="w3-xxlarge w3-text-grey">By: Jack Johns</h1> <h1 class="w3-jumbo">My Summer Vacation</h1></div><div class="w3-half w3-container w3-xlarge w3-text-grey"> <p class="">My family and I went to the Grand Canyon this summer. We drove 1,233 miles. </p><p>We went camping, hiking, swimming, and stayed in a hotel with free bagels.</p></div></div><div class="w3-panel w3-text-grey"><h4>My Favorite Pictures:</h4></div><div class="w3-row"><div class="w3-half w3-container w3-center"> <img src="http://lorempixel.com/400/400/nature/" style="width:100%"> <i class="w3-xlarge fa fa-car" ></i> <img src="http://lorempixel.com/400/400/cats/" style="width:100%"></div><div class="w3-half w3-container"> <img src="http://lorempixel.com/400/400/animals/" style="width:100%"> <p class="w3-xlarge w3-text-grey"> My sister got carsick on the ride home, so we had make a lot of stops. It was fun!</p></div></div><div class="w3-row w3-section"> <div class="w3-center w3-large w3-dark-grey w3-text-white w3-padding" style="height:150px"> <h2>Thanks for looking!</h2> <p>Room 212, Mr. Hobbs, English</p></div></div><div class="w3-container w3-text-grey"> <p>Powered by <a href="https://www.w3schools.com/w3css/default.asp" target="_blank">w3.css</a></p></div></body></html>'},
		{ name: "Book Report", wanted: false, css:'body,h1,h2,h3,h4,h5,h6{font-family: "Lato", sans-serif}.w3-bar,h1,button{font-family: "Montserrat", sans-serif}.fa-anchor,.fa-coffee{font-size:200px}', html:'<!DOCTYPE html><html><title>W3.CSS Template</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"><link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato"><link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"><body><div class="w3-top"> <div class="w3-bar w3-red w3-card-2 w3-left-align w3-large"> <a class="w3-bar-item w3-button w3-hide-medium w3-hide-large w3-right w3-padding-large w3-hover-white w3-large w3-red" href="javascript:void(0);" onclick="myFunction()" title="Toggle Navigation Menu"><i class="fa fa-bars"></i></a> <a href="#" class="w3-bar-item w3-button w3-padding-large w3-white">Home</a> <a href="#setting" class="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white">Setting</a> <a href="#characters" class="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white">Characters</a> <a href="#plot" class="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white">Plot</a> </div><div id="navDemo" class="w3-bar-block w3-white w3-hide w3-hide-large w3-hide-medium w3-large"> <a href="#setting" class="w3-bar-item w3-button w3-padding-large">Setting</a> <a href="#characters" class="w3-bar-item w3-button w3-padding-large">Characters</a> <a href="#plot" class="w3-bar-item w3-button w3-padding-large">Plot</a> </div></div><header class="w3-container w3-red w3-center" style="padding:128px 16px"> <h1 class="w3-margin w3-jumbo">Fantastic Mr. Fox</h1> <p class="w3-xlarge">By Jane Doe</p><a href="#plot" class="w3-button w3-black w3-padding-large w3-large w3-margin-top">My Summary</a></header><div class="w3-row-padding w3-padding-64 w3-container" id="setting"> <div class="w3-content"> <div class="w3-twothird"> <h1>Setting</h1> <h5 class="w3-padding-32">Mostly underground, near the farms of Boggis, Bunce and Bean.</h5> <p class="w3-text-grey">Sometimes Mr. Fox would go above ground, but that is where he got into trouble.</p></div><div class="w3-third w3-center"> <i class="fa fa-anchor w3-padding-64 w3-text-red"></i> </div></div></div><div class="w3-row-padding w3-light-grey w3-padding-64 w3-container" id="characters"> <div class="w3-content"> <div class="w3-third w3-center"> <i class="fa fa-coffee w3-padding-64 w3-text-red w3-margin-right"></i> </div><div class="w3-twothird"> <h1>Characters</h1> <h5 class="w3-padding-32">Mr. Fox, Mrs. Fox, Boggis, Bunce and Bean</h5> <p class="w3-text-grey">There were also a lot of animals.</p></div></div></div><div class="w3-row-padding w3-padding-64 w3-container" id="plot"> <div class="w3-content"> <div class="w3-twothird"> <h1>Plot</h1> <h5 class="w3-padding-32">The story is about Mr. Fox stealing food from the farmers, and about how they tried to catch him.</h5> <p class="w3-text-grey">The story revolves around an anthropomorphic, tricky, clever fox named Mr Fox who lives underground beside a tree with his wife and four children. In order to feed his family, he makes nightly visits to farms owned by three wicked, cruel and dim-witted farmers named Boggis, Bunce and Bean and snatches the livestock available on each man\'s farm. Tired of being outsmarted by Mr Fox, the evil farmers devise a plan to ambush him as he leaves his burrow, but they succeed only in shooting off his tail.</p></div><div class="w3-third w3-center"> <i class="fa fa-anchor w3-padding-64 w3-text-red"></i> </div></div></div><div class="w3-container w3-black w3-center w3-opacity w3-padding-64"> <h1 class="w3-margin w3-xlarge">Favorite Quote: "We are all different."</h1></div><footer class="w3-container w3-padding-64 w3-center w3-opacity"> <div class="w3-xlarge w3-padding-32">By Jane Doe for Ms. Thomas, Room 113, 3rd Period. 05/14/2017 </div><p>Powered by <a href="https://www.w3schools.com/w3css/default.asp" target="_blank">w3.css</a></p></footer><script>// Used to toggle the menu on small screens when clicking on the menu buttonfunction myFunction(){var x=document.getElementById("navDemo"); if (x.className.indexOf("w3-show")==-1){x.className +=" w3-show";}else{x.className=x.className.replace(" w3-show", "");}}</script></body></html>' }
  ];
	
	$scope.goToPerson = function(template, event) {
    $mdDialog.show(
      $mdDialog.alert()
        .title('Navigating')
        .textContent('All about this template: ' + template)
        .ariaLabel('Person inspect demo')
        .ok('Choose It')
        .targetEvent(event)
    );
  };
		
//need to get this from the user's record
		$scope.chosenTemplate = 'none';

 $scope.showConfirm = function(template, ev) {
    // Appending dialog to document.body to cover sidenav in docs app
	 $scope.chosenTemplate = template;
 
    var confirm = $mdDialog.confirm()
          .title('Would you like to use this template?')
          .textContent('Template Name:' + template)
          .ariaLabel('Template')
          .targetEvent(ev)
          .ok('Yes!')
          .cancel('No Thanks');

    $mdDialog.show(confirm).then(function() {
      $scope.status = 'You decided to get rid of your debt.';
			//$scope.theHtml = '<html><body><h1>chosen template:</h1><h2>'+$scope.chosenTemplate+'</h2></body></html>';
			//$scope.updateHtml();
			//$scope.changeTab(0);

			
			for (var i=0; i<$scope.templates.length; i++) {
				//alert($scope.templates[i].name);
  			if ($scope.templates[i].name == $scope.chosenTemplate) {
    			$scope.templates[i].wanted = true;
					$scope.theHtml = $scope.templates[i].html;
					$scope.theCss = $scope.templates[i].css;

  			} else {
					$scope.templates[i].wanted = false;
				}
			}
			
			$scope.updateHtml();
			$scope.changeTab(0);
			
    }, function() {
      $scope.status = 'You decided to keep your debt.';
    });
  };		
		
		
		
  $scope.cmOption = {
    lineNumbers: true,
    indentWithTabs: true,
    readOnly: false,
    showCursorWhenSelecting: true,
    autoRefresh:true,
    styleActiveLine: true,
    matchBrackets: true,
    mode: 'htmlmixed'
  };

    
  $scope.cmOption_css = {
    lineNumbers: true,
    indentWithTabs: true,
    readOnly: false,
    showCursorWhenSelecting: true,
    autoRefresh:true,
    styleActiveLine: true,
    matchBrackets: true,
    mode: 'css'
  }; 
    
    $scope.pictabs = [          { title: 'One', content: "Tabs will become paginated if there isn't enough room for them."}
];


$scope.isClean = function() {
  return angular.equals(original, $scope.lessonRecord);
}

$scope.changeTab = function(tabIndex) {
	$scope.selectedTabIndex = tabIndex;	
}

$scope.changeMoreTab = function(tabIndex) {
	$scope.changeTab(2);
	$scope.selectedMoreTabIndex = tabIndex;	
}

$scope.deleteLesson = function(eventRecord) {
  //$location.path('/');
  if(confirm("Are you sure to delete lesson number: "+$scope.lessonRecord._id)==true)
    services.deleteLesson(lessonRecord._id);
    $location.path('/admin/');
  };

$scope.updateHtml = function(ev) {
    services.updateHtml($scope.pageId, {theHtml:$scope.theHtml, theCss:$scope.theCss})
			.then(function(data) {
			    $scope.pagePath = '/'+$scope.pageId+'?dummyVar='+ (new Date()).getTime();
					$scope.theHtml = data.html;
					$scope.theCss = data.css;
			
			    //if not logged in, show "sign in" msg: sign in to name you page
					if (!$scope.user.local) {
						var confirm2 = $mdDialog.confirm()
						.title('Log in to save your changes')
						.textContent('and name your web site.')
						.ariaLabel('Save')
						.targetEvent(ev)
						.ok('Log in')
						.cancel('Continue as guest');

						$mdDialog.show(confirm2).then(function() {
										$location.path('/profile');

						}, function() {
							$scope.status = 'You decided to keep your debt.';
						});
					}

			
		});
  //updateHtml is updating HTML and CSS
	//for now, update both
    //services.updateCss($scope.pageId, {theCss:$scope.theCss});
  //alert('after second');
};

$scope.updateCss = function() {
    services.updateCss($scope.pageId, {theCss:$scope.theCss})
			.then(function(data) {
    			$scope.pagePath = '/'+$scope.pageId+'?dummyVar='+ (new Date()).getTime();
				});
};
    
	$scope.goEdit = function(id){
    	$location.path('/'+$scope.pageId+'/edit');

  };
	
	$scope.goPage = function() {
		$window.open('/'+$scope.pageId, '_blank');
 //$window.location.href = '/'+$scope.pageId;
   	//$location.path('/'+$scope.pageId);
        console.log($location.path());
	};

	$scope.goProfile = function(){
    $location.path('/profile'); // path not hash
  };
	
	$scope.goHome = function(){
    	$location.path('/');
	};
		
$scope.openLeftMenu = function() {
		$mdSidenav('left').toggle();
};
		
    $scope.addTab = function (title) {
      $scope.imageList.push({name:title});
		};
		
    $scope.removeTab = function (imagename) {
			alert('removing image:'+imagename);
			
			for (var i=0; i<$scope.imageList.length; i++) {
				alert($scope.imageList[i].name);
  			if ($scope.imageList[i].name == imagename) {
      		$scope.imageList.splice(i, 1);
    			break;
  			}
			}
      //var index = $scope.imageList.name.indexOf(imagename);
			//			alert('found image at position:'+index);

			services.deleteImage($scope.pageId, imagename);
    };
		
var originatorEv;
$scope.openMenu = function($mdOpenMenu, ev) {
		originatorEv = ev;
		$mdOpenMenu(ev);
};
		
		
    $scope.uploadFiles = function(file, errFiles) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
					//alert('about to call upload');
					var data = {file: file, 
											name: 'test', 
											path: './../public/pages/image.png'};
            file.upload = Upload.upload({
                url: '/upload/'+$scope.pageId,
								headers : {'Content-Type': 'multipart/form-data'},
                //data: {file: file}
							  data: data
            });
					
					//alert('before then');

            file.upload.then(function (response) {
					//alert('in then');
            console.log('Success ' + response.config.data.file.name + 'uploaded. Response: ' + response.data);
            //alert('Success ' + response.config.data.file.name + 'uploaded. Response: ' + response.data);
						alert(response.data.fileName.toLowerCase()+' was uploaded!');
							$scope.addTab(response.data.fileName );
							
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
//                file.progress = Math.min(100, parseInt(100.0 * 
                $fileProgress = Math.min(100, parseInt(100.0 * 
                                         evt.loaded / evt.total));
            });
        }   
    }
		
	    
    
}]);

thisMod.filter('html', ['$sce', function ($sce) { 
    return function (text) {
        return $sce.trustAsHtml(text);
    };    
}])
