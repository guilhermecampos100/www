(function(){
  'use strict';
  

	
	
  var module = angular.module('app', ['onsen']);

  module.controller('AppController', function($scope, $data, $http) {
    $scope.doSomething = function() {
      setTimeout(function() {
        ons.notification.alert({ message: 'tapped' });
      }, 100);
	  
    };
	
	$scope.cancelarChamado = function($data) {
	$http.get("http://chamagar.com/mx/cgjson.asp?codigomesa=aaaa&acao=cancelar&hora=" + Date.now())
	.success(function(response) {
		$scope.mesa = response;
	  
		$scope.navi.popPage();
			
		})
	.error(function(data, status) {
           $scope.messages = data || "Request failed";
           $scope.status = status;
		   
	   setTimeout(function() {
        ons.notification.alert({ message: data });
      }, 100);
     });    
 
	};

	$scope.ativarChamado = function() {
		$http.get("http://chamagar.com/mx/cgjson.asp?codigomesa=aaaa&acao=ativar&hora=" + Date.now())
		.success(function(response) {$scope.mesa = response;
		
		$scope.navi.popPage();
		})
		.error(function(data, status) {
           $scope.messages = data || "Request failed";
           $scope.status = status;
		   
	   setTimeout(function() {
        ons.notification.alert({ message: data });
      }, 100);
     });    
	};
});

  module.controller('DetailController', function($scope, $data, $http, $timeout) {
    $scope.item = $data.selectedItem;
	
	$scope.counter = 0;
    var timer;


	
    function myLoop() {
	 $http.get("http://chamagar.com/mx/cgjson.asp?codigomesa=aaaa&hora=" + Date.now())
	.success(function(response) {$scope.mesa = response;
	if (response[0].status == 0) {
		$scope.chamando =  false; 
		$scope.txtchamando = "Chamar Garçom"
	}
	else
	{
		$scope.chamando =  true; 
		$scope.txtchamando = "Chamando..."
	}
	});
	$scope.counter++;
	timer = $timeout(
		function() { 
			console.log( "Timeout executed", Date.now() ); 
		},
		1000
	);

	timer.then(
		function() { 
			console.log( "Timer resolved!");
			myLoop();

		},
		function() { 
			console.log( "Timer rejected!" ); 
		}
	);
	}

	myLoop();

	// When the DOM element is removed from the page,
	// AngularJS will trigger the $destroy event on
	// the scope. 
	// Cancel timeout
	$scope.$on(
		"$destroy",
		function( event ) { 
			$timeout.cancel( timer ); 
		}
	);
	
});

  module.controller('MasterController', function($scope, $data, $http, $timeout) {
    $scope.items = $data.items;

    $scope.showDetail = function(index) {
      var selectedItem = $data.items[index];
      $data.selectedItem = selectedItem;
      $scope.navi.pushPage('detail.html', {title : selectedItem.title});
    };
	
	$scope.counter = 0;
    var timer;

    function myLoop() {
	 $http.get("http://chamagar.com/mx/cgjson.asp?codigomesa=aaaa&hora=" + Date.now())
	.success(function(response) {$scope.mesa = response;
	if (response[0].status == 0) {
		$scope.chamando =  false; 
		$scope.txtchamando = "Chamar Garçom"
	}
	else
	{
		$scope.chamando =  true; 
		$scope.txtchamando = "Chamando..."
	}
	});
	$scope.counter++;
	timer = $timeout(
		function() { 
			console.log( "Timeout executed", Date.now() ); 
		},
		1000
	);

	timer.then(
		function() { 
			console.log( "Timer resolved!");
			myLoop();

		},
		function() { 
			console.log( "Timer rejected!" ); 
		}
	);
	}

	myLoop();

	// When the DOM element is removed from the page,
	// AngularJS will trigger the $destroy event on
	// the scope. 
	// Cancel timeout
	$scope.$on(
		"$destroy",
		function( event ) { 
			$timeout.cancel( timer ); 
		}
	);

	
  });

  


module.$inject = ['$scope','$timeout'];


  module.factory('$data', function() {
      var data = {};

      data.items = [
          {
              title: 'Chamar Garçom',
              label: '0:22s',
              desc: 'Damiano Macedo',
			  txtchamando: '0:22s'
          }
      ];

      return data;
  });
  
 

  
  
})();

