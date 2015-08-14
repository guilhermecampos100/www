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
	
	$scope.enviarpedido = function(itemcardapio, qtd_cardapio, token) {
		
	if (itemcardapio == undefined) {  
		ons.notification.alert({ message: 'escolha um item do cardapio, basta começar a digitar e depois escolher...' });
		return false;
	}

	
	$http.get("http://chamagar.com/mx/cgjson.asp?codigomesa="+token+"&acao=enviarpedido&hora=" + Date.now() + "&itemcardapio=" + itemcardapio + "&quantidade=" + qtd_cardapio)
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
	 if (itemcardapio == 'FECHAR A CONTA') {
		 $scope.navi.popPage();
	 }
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

  module.controller('ChamaGarcomController', function($scope, $data, $http, $timeout) {
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

    $scope.showDeUmaNota = function(index) {
      var selectedItem = $data.items[index];
      $data.selectedItem = selectedItem;
      $scope.navi.pushPage('deumanota.html', {title : selectedItem.title, token: $scope.token});
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
	$scope.pedidos_enviados = response[0].pedidos_enviados;
	$scope.pedidos_emandamento = response[0].pedidos_emandamento;
	$scope.pedidos_fechar_conta_enviados = response[0].pedidos_fechar_conta_enviados;
	$scope.pedidos_fechar_conta_emandamento = response[0].pedidos_fechar_conta_emandamento;
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

	$scope.$on(
		"$destroy",
		function( event ) { 
			$timeout.cancel( timer ); 
		}
	);

	
  });

  module.controller('DeUmaNotaController', function($scope, $data, $http, $timeout) {
    $scope.item = $data.selectedItem;
    var timer;
	var page = navi.getCurrentPage();
	$scope.token = page.options.token;

	$scope.rating = 2;
    $scope.rateFunction = function(rating) {
      alert('Rating selecionado - ' + rating);
    };

	// function enviarpedido que estava no appController
	$scope.darnota = function(nota, comentario, token) {
		
		if (nota == undefined) {  
			ons.notification.alert({ message: 'escolha uma nota...' });
			return false;
		}

		$http.get("http://chamagar.com/mx/cgjson.asp?codigomesa="+token+"&acao=darnota&hora=" + Date.now() + "&nota=" + nota + "&comentario=" + comentario)
		.success(function(response) {
			ons.notification.alert({ message: 'nota registrada, obrigado' });
			})
		.error(function(response) {
			ons.notification.alert({ message: 'erro r: ' + response });
			});
			
		$scope.navi.popPage();
	};	

});  


  module.factory('$data', function() {
      var data = {};

      data.items = [
          {
              title: 'Chamar Garçom',
              label: '0:01s',
              desc: 'NOME Garçom',
			  txtchamando: '0:00s'
          }
      ];

      return data;
  });
  
  module.directive('starRating',
	function() {
		return {
			restrict : 'A',
			template : '<ul class="rating">'
					 + '	<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">'
					 + '\u2605'
					 + '</li>'
					 + '</ul>',
			scope : {
				ratingValue : '=',
				max : '=',
				onRatingSelected : '&'
			},
			link : function(scope, elem, attrs) {
				var updateStars = function() {
					scope.stars = [];
					for ( var i = 0; i < scope.max; i++) {
						scope.stars.push({
							filled : i < scope.ratingValue
						});
					}
				};
				
				scope.toggle = function(index) {
					scope.ratingValue = index + 1;
					scope.onRatingSelected({
						rating : index + 1
					});
				};
				
				scope.$watch('ratingValue',
					function(oldVal, newVal) {
						if (newVal) {
							updateStars();
						}
					}
				);
			}
		};
	}
);

  
  
})();

