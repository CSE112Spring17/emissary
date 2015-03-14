'use strict';

angular.module('robobetty', 
  [
  IONIC,
  'ui.router',
  'widget',
  'product', 
  'dashboard',
  'ui.bootstrap',
  'signin',
  'register',
  'thankyou',
  'DashboardFormBuilderModule',
   'checkin',
   'thankyouCheckIn',
   'recovery',
   'recoverythx',
   'themes'
   ])
  .config(function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/patientQueue');
    $stateProvider
      .state('common',{
        templateUrl: 'views/components/dashboard/main/views/dashboard.html',
        abstract: true
      })
      .state('home', {
        url: '/home',
        templateUrl: 'views/components/home/views/home.html'
      })
      .state('createForm', {
        url: '/createform',
        controller: 'FormCreateController',
        templateUrl: 'views/components/dashboard/formBuilder/views/create.html',
        parent: 'common',
        title: 'Create New Form'
      })
      /* Enables route to editforms page
      .state('editForm', {
        url: '/editform',
        controller: 'FormEditController',
        templateUrl: 'views/components/dashboard/formBuilder/views/edit.html',
        parent: 'common',
        title: 'Edit Existing Template'
      })
      */
      .state('dashboard',{
        url:'/dashboard',
        template: '',
        parent: 'common',
        title: ''
      })
       .state('patientQueue', {
        url: '/patientQueue',
        templateUrl: 'views/components/dashboard/patientQueue/views/patients.html',
        parent: 'common',
        title: 'Patients Queue',
        mobile: false
      })    
      .state('employees', {
        url: '/employees',
        templateUrl: 'views/components/dashboard/employees/views/employees.html',
        parent: 'common',
        title: 'Employees',
        mobile: false
      })
      .state('signin', {
        url: '/signin',
        templateUrl: 'views/components/receptionistPortal/signin/views/login.html',
        mobile: true
      })
      .state('register', {
        url: '/register',
        templateUrl: 'views/components/receptionistPortal/register/views/register.html',
        mobile: false
      })
      .state('checkin', {
        url: '/checkin',
        templateUrl: 'views/components/patientCheckin/checkin/views/checkin.html',
        mobile: true
      })
      .state('thankyou', {
        url: '/thankyou',
        templateUrl: 'views/components/receptionistPortal/register/views/thankyou.html'
      })
      .state('thankyouCheckIn', {
        url: '/thankyouCheckIn',
        templateUrl: 'views/components/patientCheckin/checkin/views/CheckInthankyou.html'
      })
      .state('recovery', {
        url: '/recovery',
         controller: 'RecoveryController',
        templateUrl: 'views/components/receptionistPortal/recovery/views/recovery.html'
      })
      .state('recoverythx',{
        url: '/recoverythx',
        controller: 'RecoveryConfirmController',
        templateUrl: 'views/components/receptionistPortal/recovery/views/recoveryconfirm.html'
      })
      .state('themes',{
        url: '/themes',
        parent: 'common',
        title: 'Themes',        
        templateUrl: 'views/components/dashboard/themes/views/dashboardIndex.html'
      });
  })
  .ionicCallback();


  // This is called app.run()
  function initRunCallback($rootScope, $state, appConfig) {
     $rootScope.$on('$stateChangeSuccess', 
    function(event, toState, toParams, fromState, fromParams){
      // var nonMobile = ["da"]

      // // Routing for mobile app
      // if(appConfig.isMobile) {
      //   if(toState == "")
      // }

      if(!appConfig.debugMode) { 
        if(!$rootScope.admin_id) {
          if(toState.name != 'signin') {
            $state.go("signin");
          }
        }
      }
    });
  }

  ////////////////////
  
  function ionicCallback(isMobile) {
    if(mobile) {
      this.run(['$rootScope', '$state', 'appConfig', function($rootScope, $state, appConfig){
        initRunCallback($rootScope, $state, appConfig);
      }])
    } else {
      this.run(['$rootScope', '$state', 'appConfig', '$ionicPlatform', function($rootScope, $state, appConfig, $ionicPlatform){
          ionicPlatform.ready(
            function() {
              initRunCallback($rootScope, $state, appConfig)
            }
          );
      }]);
    }
  };



