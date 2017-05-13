angular.module('AdminCtrl', [])

  .controller('AdminController', ['$scope','$http','Todos', '$routeParams', function($scope, $http, Todos, $routeParams) {

    $scope.pageName = $routeParams.page;

    Todos.getAssets($scope.pageName)
			.success(function(data) {
			console.log('html'+data)
	   	$scope.theHtml = data.html;
	});



}]);
