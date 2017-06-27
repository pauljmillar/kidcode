var amod = angular.module('adminApp', ['ngRoute', 'AdminCtrl', 'EditCtrl', 'profileCtrl', 'services', 'ngMaterial','ui.codemirror', 'angularResizable' ]);

  amod.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // profile page
        .when('/profile', {
            templateUrl: '/views/profile.html',
            controller: 'profileCtrl',
             resolve: {
               //factory: isTeacher,
                 user: function(services, $route){
                  return services.getUserId();
                }
             }      
        })
        // edit page
        .when('/:page/edit', {
             templateUrl: '/views/edit.html',
             controller: 'EditController',
             resolve: {           
               assetRecord: function(services, $route){
                 var pageId = $route.current.params.page;
                 return services.getAssets(pageId);
               }
             }
        })
     //   .when('/:page', {
       //      templateUrl: '/views/anypage.html',
     //        controller: 'AdminController'
       //  })
        //.when('/:id/edit', {
        //     templateUrl: '/views/edit.html',
         //    controller: 'EditController',
        //     resolve: {
               
               //lessonRecord: function(Todos, $route){
               //  var mongoID = $route.current.params.id;
               //  return Todos.getLesson(mongoID);
               //}
        //     }
        //})
         .otherwise({
//             redirectTo: '/admin'
             templateUrl: '/views/anypage.html',
             controller: 'AdminController'
        });

     $locationProvider.html5Mode(true);
 //$locationProvider.html5mode({ enabled: true, baseLocation: false});
    }])
  
.filter('trusted',
   function($sce) {
     return function(ss) {
       return $sce.trustAsHtml(ss)
     };
   }
);

amod.directive('nameunique', function($q, $timeout, $http){
  return {
    restrict: 'A',
    require: 'ngModel',
    /* 
       The link function allows us to attach a DOM listener and update the DOM when needed. In this case, 
       we want to update the DOM as we're typing and notify if the username is used or not.
       ctrl = ngModelController
       by setting the require: 'ngModel', this pass the ngModelController as the 4th parameter.
     */
    link: function(scope, elm, attrs, ctrl){
    
      //var usernames = ['Champs82','Starbucks91', 'Panera93'];
      /* Used to perform asyncronous validation on the username directive. */

      ctrl.$asyncValidators.nameunique = function(modelValue, viewValue){
        
        if(ctrl.$isEmpty(modelValue)){
          // consider empty model value
          return $q.when();
        }

        
        var def = $q.defer();
        def.notify('Querying the jsonplaceholder.typicode.com service')
        $http({method: 'GET', url: '/api/asset/username/'+modelValue+'' }).then(
          function(response){
            

            if(response.data.length === 0){
              //ngModel.$setValidity('nameunique', true)
               def.resolve();    
            }
            else{
               //ngModel.$setValidity('nameunique', false)
               def.reject();
            }
            
          }, 
          function(response){
            //alert("O no, you a problem man!!!");
          }
        );

        
        return def.promise;
      };
    }
  };
});

/**  .filter('startFrom', function(){

    return function(data, start){
         if (!data || !data.length) { return; }
        return data.slice(start);
    }

  })
  ***/
//;

