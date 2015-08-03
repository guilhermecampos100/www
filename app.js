(function(){
  'use strict';

var module = angular.module('app', ['onsen','autocomplete']);
 
	
module.controller('CardapioController', function($scope, $http){
	$http.get("http://chamagar.com/mx/cardapiojson.asp?acao=cancelar&hora=" + Date.now())
.success(function(response) {
	$scope.cardapio = response;
	})
.error(function(data, status) {
	   $scope.messages = data || "Request failed";
	   $scope.status = status;
	})
});

  module.controller('AppController', function($scope, $data, $http) {
    $scope.doSomething = function() {
      setTimeout(function() {
        ons.notification.alert({ message: 'tapped' });
      }, 100);
	  
    };
	
	$scope.enviarpedido = function(itemcardapio, token) {
	$http.get("http://chamagar.com/mx/cgjson.asp?codigomesa="+token+"&acao=enviarpedido&hora=" + Date.now() + "&itemcardapio=" + itemcardapio)
	.success(function(response) {
		ons.notification.alert({ message: 'pedido enviado' });

		var scope = angular.element(document.getElementById("IDPedidoController")).scope();
		scope.loopgui();
		})
	.error(function(data, status) {
           $scope.messages = data || "Request failed";
           $scope.status = status;
	   setTimeout(function() {
        ons.notification.alert({ message: data });
      }, 100);
     });    
	};	
		
	$scope.cancelarChamado = function(token) {
	$http.get("http://chamagar.com/mx/cgjson.asp?codigomesa="+token+"&acao=cancelar&hora=" + Date.now())
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

	$scope.ativarChamado = function(token) {
		$http.get("http://chamagar.com/mx/cgjson.asp?codigomesa="+token+"&acao=ativar&hora=" + Date.now())
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
    var timer;
	var page = navi.getCurrentPage();
	$scope.token = page.options.token;
	
    function myLoop() {
	 $http.get("http://chamagar.com/mx/cgjson.asp?codigomesa="+ $scope.token +"&hora=" + Date.now())
	.success(function(response) {
	$scope.mesa = response;
	$scope.fotogarcom = response[0].fotogarcom;
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
	timer = $timeout(
		function() { 
			console.log( "Timeout executed", Date.now() ); 
		},
		10000
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

  module.controller('LoginController', function($scope, $data, $http) {
    var entrar = function(token, numeromesa, nomerestaurante) {
      $scope.navi.pushPage('principal.html', {title : 'testegui', token: token, numeromesa: numeromesa, nomerestaurante: nomerestaurante});
    };
	
	var x = 1;
	var url_token = getUrlParameter('token');


	function getUrlParameter(sParam)
	{
		var sPageURL = window.location.search.substring(1);
		var sURLVariables = sPageURL.split('&');
		for (var i = 0; i < sURLVariables.length; i++) 
		{
			var sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] == sParam) 
			{
				return sParameterName[1];
			}
		}
	} 


	$scope.loginMesa = function(token) {
	 $http.get("http://chamagar.com/mx/cgjson.asp?codigomesa="+ token +"&hora=" + Date.now())
	.success(function(response) {
		$scope.mesa = response;
		if (response[0].mesa == 'nao encontrada') {
			$scope.mensagem =  "mesa não encontrada"; 
		}
		else
		{
			$scope.numeromesa = response[0].mesa;
			entrar(token, response[0].mesa, response[0].restaurante );
		}
	});
  };
  
	
	if (url_token != undefined) {
		$scope.loginMesa(url_token);
	}  
	
  });
  
  module.controller('PedidoController', function($scope, $data, $http, $timeout) {
    $scope.item = $data.selectedItem;
    var timer;
	var page = navi.getCurrentPage();
	$scope.token = page.options.token;
		
    var loopgui = function myLoop() {
		 $http.get("http://chamagar.com/mx/pedidosjson.asp?codigomesa="+ $scope.token + "&hora=" + Date.now())
		.success(function(response) {
			$scope.pedidos = response;
		});
		timer = $timeout(
			function() { 
				console.log( "Timeout executed", Date.now() ); 
			},
			10000
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

	loopgui();

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

	var page = navi.getCurrentPage();
	$scope.token = page.options.token;
	$scope.numeromesa = page.options.numeromesa;
	$scope.nomerestaurante = page.options.nomerestaurante;

    $scope.showChamaGarcom = function(index) {
      var selectedItem = $data.items[index];
      $data.selectedItem = selectedItem;
      $scope.navi.pushPage('chamaGarcom.html', {title : selectedItem.title, token: $scope.token});
    };

    $scope.showPedido = function(index) {
      var selectedItem = $data.items[index];
      $data.selectedItem = selectedItem;
      $scope.navi.pushPage('pedido.html', {title : selectedItem.title, token: $scope.token});
    };

    $scope.showFecharConta = function(index) {
      var selectedItem = $data.items[index];
      $data.selectedItem = selectedItem;
      $scope.navi.pushPage('fecharconta.html', {title : selectedItem.title, token: $scope.token});
    };

	
	$scope.counter = 0;
    var timer;

    function myLoop() {
	 $http.get("http://chamagar.com/mx/cgjson.asp?codigomesa="+$scope.token+"&hora=" + Date.now())
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
		10000
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

