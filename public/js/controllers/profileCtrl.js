
angular.module('profileCtrl', ['ngLetterAvatar', 'ngMessages'])

.controller('profileCtrl', function($routeParams, $scope, $http, services, $log, $timeout, $mdSidenav, $mdDialog, user, $location) {

	    $scope.user = {};
	    var original = {};
			var orig_username, orig_email;

			//if google sign-in (rather than signup) send directly to dashboard
	   // if (user.data.firstName) {
		//	if ($scope.user.userType == "student")
    //			$location.path('/studentdashboard');
		//		else 
    //			$location.path('/dashboard');
		//	}
	
			$scope.user = user.data;
			$scope.userId = user.data._id;
			$scope.userName = user.data.username;
			//alert($scope.user.username);

      //for guests in demo
			if (!user.data.local){
				//not signed up yet
				if (!user.data.google){
					//no email yet
					$scope.email = '';					
				} else {
					//not signed up, but used google so we know email
					$scope.email = user.data.google.email;
					$scope.user.local.email = user.data.google.email; 
				}
				$scope.isReadOnly = false;
				$scope.isLoggedIn = false;
			} else {
				$scope.email = user.data.local.email;
				$scope.isReadOnly = true;
				$scope.isLoggedIn = true;
			}
	

	
			if (!user.data.username ){
				//alert('in if');
				//create temp username from email
				var tempusername = $scope.email.split('@')[0];
				tempusername = tempusername.replace(/[\W]+/g,"_");
				tempusername = tempusername.substring(0,15).toLowerCase();
				services.createAsset({userid: $scope.userId, username: tempusername})
						.then(function(data2) {
									//alert('in then');
									//alert('username'+data2.username);
		    					$scope.userName = data2.username;
    							$scope.user.username = data2.username;
					
					});
			}

	
			//set orig so cancel edit button can restore
			orig_email = $scope.email;
			orig_username = $scope.user.username;
			original = $scope.user.data;

	$scope.setEditMode = function() {
			$scope.isReadOnly = false;
	};
	
	$scope.cancelEditMode = function(form) {
			//$scope.user = $scope.original;
		//$scope.user= angular.copy(original);
		//$scope.signupform.$setValidity();
//$scope.signupform.$setPristine();
			//$scope.signupform.$setPristine();
			
			   let controlNames = Object.keys(form).filter(key => key.indexOf('$') !== 0);

    // Set each control back to undefined. This is the only way to clear validation messages.
    // Calling `form.$setPristine()` won't do it (even though you wish it would).
    for (let name of controlNames) {
        let control = form[name];
        control.$setViewValue(undefined);
    }

    form.$setPristine();
    form.$setUntouched();
		
			$scope.user.username = orig_username;
			$scope.user.local.email = orig_email;

			$scope.isReadOnly = true;


				//if ($scope.user.userType == "student")
    		//	$location.path('/studentdashboard');
				//else 
    		//	$location.path('/dashboard');
	};
		$scope.cancelSignup = function() {
			$scope.isReadOnly = true;
    	$location.path('/'+$scope.userName+'/edit');
	};

	
	$scope.changeView = function(view){
    $location.path('/'+view); // path not hash
  };

	$scope.goEdit = function(id){
    	$location.path('/'+$scope.userName+'/edit');

  };
	
	$scope.goPage = function() {
    	$location.path('/'+$scope.username);
	};

	$scope.goProfile = function(){
    $location.path('/profile'); // path not hash
  };
	
	$scope.goHome = function(){
    	$location.path('/');
	};

	
	$scope.updateProfile = function(){
	
		//$scope.user.email = $scope.user.local.email;
		//alert(user.username);
		//alert(user.local.email);
		services.updateProfile($scope.user)
			.success(function(data2) {
				$scope.isReadOnly = true;
    		$location.path('/'+data2.username+'/edit');

			});
	};
	
	$scope.openLeftMenu = function() {
		$mdSidenav('left').toggle();
	};

	var originatorEv;
	$scope.openMenu = function($mdOpenMenu, ev) {
		originatorEv = ev;
		$mdOpenMenu(ev);
	};
	

	






});