angular.module('todoService', [])

	// super simple service
	// each function returns a promise object
	.factory('Todos', ['$http',function($http) {
		return {
			getLessons : function() {
				return $http.get('/api/lessons');
			},
			getAssets : function(id) {
				return $http.get('/api/asset/' + id);
			},
			createLesson : function(lessonData) {
				return $http.post('/api/lesson', lessonData).then(function (results){
					return results;
                                });
			},
			updateLesson : function(id, lessonData) {
				return $http.put('/api/lesson/' + id, lessonData).then(function (status){
                                  return status.data;
                                });
			},			
			deleteLesson : function(id) {
				return $http.delete('/api/lesson/' + id);
			}
		}
	}])

;
