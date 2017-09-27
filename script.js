// create the module and name it myApp
var myApp = angular.module('myApp', ['ngRoute']);

// configure our routes
myApp.config(function($routeProvider) {
  $routeProvider

    // route for the home page
    .when('/', {
      templateUrl : 'pages/login.html',
      controller  : 'mainController'
    })

    .when('/login', {
      templateUrl : 'pages/login.html',
      controller  : 'mainController'
    })

    // route for the about page
    .when('/select', {
      templateUrl : 'pages/select.html',
      controller  : 'selectController'
    })

});

myApp.factory("SharedStateService", function() {
    return {
        token: 'SharedStateService'
    };
});

myApp.controller('mainController', function($scope, $http, $location, SharedStateService) {
  $scope.data = SharedStateService;

  $scope.login = function(){
    $http({
      method: 'POST',
      url: 'http://stg-dialogue-hub.minarai.io:3003/operator/login',
      data: { organization_name: $scope.org,
              email: $scope.email,
              password: $scope.password
            }
    })
    // 成功時の処理（ページにあいさつメッセージを反映）
    .success(function(data, status, headers, config){
      //SharedStateService.token = data.token;
      console.log(data);
      $scope.data.token = data.token;
      $location.path('/select');
    })
    // 失敗時の処理（ページにエラーメッセージを反映）
    .error(function(data, status, headers, config){
      alert("ログインに失敗しました。組織名、メールアドレス及びパスワードをご確認ください。");
    });

  }
});

myApp.controller('selectController', function($scope, $http, $location, SharedStateService) {
  $scope.data = SharedStateService

  $http({
    method: 'GET',
    url: 'http://stg-dialogue-hub.minarai.io:3003/operator/applications',
    params: { token: $scope.data.token}
  })
  // 成功時の処理（ページにあいさつメッセージを反映）
  .success(function(data, status, headers, config){
    $scope.apps = data;
    $scope.apps.appid = data[0].application_id;
    console.log(data);

    //$location.path('/select');
  })
  // 失敗時の処理（ページにエラーメッセージを反映）
  .error(function(data, status, headers, config){
    alert("アプリケーション一覧の取得に失敗しました。ログインからやり直してください。")
    $location.path('/login');
  });

  $scope.select = function(){
    console.log($scope.apps.appid);
  }

});
