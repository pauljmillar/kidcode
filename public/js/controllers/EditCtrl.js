//var Tweet = require('../../../app/models/Tweet');

angular.module('EditCtrl', ['ui.bootstrap'])

  .controller('EditController', ['$location', '$scope','$http','Todos',  '$routeParams', 'lessonRecord', function($location, $scope, $http, Todos,  $routeParams, lessonRecord) {

  //var mongoID = ($routeParams.id) ? parseInt($routeParams.id) : 0;
  var mongoID = $routeParams.id;
  $scope.title = (mongoID == 0) ? 'Add Lesson' : 'Edit Lesson';
  $scope.buttonText = (mongoID == 0) ? 'Add New Lesson' : 'Edit Lesson';

//  if (mongoID != 0) {
//    Todos.getEvent(mongoID)
//    .success(function(data) {
//       $scope.eventRecord = data;
//    });
//  }
var original = lessonRecord.data;
original._id = mongoID;
$scope.lessonRecord = angular.copy(original);
$scope.lessonRecord._id = mongoID;

if (mongoID == 3) {
//$scope.eventRecord = new Tweet();
  $scope.eventRecord.active = true;
  $scope.eventRecord.author = 'daily';
  $scope.eventRecord.screenname = 'thefulldaily';
var dt = new Date();
   var month = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  $scope.eventRecord.eventdate = dt;
  $scope.eventRecord.eventday = dt.getDate().toString();
var mth = dt.getMonth();
  $scope.eventRecord.eventmonth = month[mth];
  $scope.eventRecord.eventyear = dt.getFullYear().toString();
  $scope.eventRecord.place = 'Chicago, IL';
} 

$scope.isClean = function() {
  return angular.equals(original, $scope.lessonRecord);
}

$scope.deleteLesson = function(eventRecord) {
  //$location.path('/');
  if(confirm("Are you sure to delete lesson number: "+$scope.lessonRecord._id)==true)
    Todos.deleteLesson(lessonRecord._id);
    $location.path('/admin/');
  };

$scope.saveLesson = function(lessonRecord) {
  //$location.path('/');
  if (mongoID == 0) {
    Todos.createLesson(lessonRecord);
  } else {
    Todos.updateLesson(mongoID, lessonRecord);
  }
$location.path('/admin/');
};

}]);

