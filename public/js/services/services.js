angular.module('services', [])

	// super simple service
	// each function returns a promise object
	.factory('services', ['$http',function($http) {
		return {
      getUserId : function() {
			  return $http.get('/api/userid');
			},
			updateProfile : function(userData) {
				return $http.put('/api/user/' + userData._id, userData ).success(function (status){
	        return status.data;  
				});
			},
			deleteImage : function(pagename, imagename) {
				return $http.put('/api/asset/'+pagename+'/image/' + imagename).success(function (status){
						        return status.data;  
				});
			},
			getLessons : function() {
				return $http.get('/api/lessons');
			},
			getAssets : function(id) {
				return $http.get('/api/asset/' + id);
			},
			createAsset : function(assetData) {
				return $http.post('/api/asset', assetData).then(function (results){
					return results.data;
        });
			},
			updateHtml : function(id, htmlData, cssData) {
				return $http.put('/api/asset/' + id + '/html', htmlData, cssData).then(function (status){
							return status.data;
        });
			},			
			updateCss : function(id, cssData) {
				return $http.put('/api/asset/' + id + '/css', cssData).then(function (status){
							return status.data;
        });
			},	
			deleteLesson : function(id) {
				return $http.delete('/api/lesson/' + id);
			}
		}
	}])

;
