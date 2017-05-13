var amod = angular.module('adminApp', ['ngRoute', 'AdminCtrl', 'EditCtrl', 'todoService', 'ngMaterial' ]);

  amod.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/:page', {
             templateUrl: '/views/anypage.html',
             controller: 'AdminController'
         })
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
)

/**  .filter('startFrom', function(){

    return function(data, start){
         if (!data || !data.length) { return; }
        return data.slice(start);
    }

  })
  ***/
;

