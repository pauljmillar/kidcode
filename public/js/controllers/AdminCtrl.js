angular.module('AdminCtrl', [])

  .controller('AdminController', ['$scope','$http','services', '$routeParams', function($scope, $http, services, $routeParams) {

    $scope.pageName = $routeParams.page;

    services.getAssets($scope.pageName)
			.success(function(data) {
			console.log('html'+data)
	   	$scope.theHtml = data.html;
		 	$scope.theCss = data.css;
 			$scope.fullHtml = "<style>"+$scope.theCss+"</style>"+$scope.theHtml;			
	});



}]);
