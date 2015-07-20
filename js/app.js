(function(){
  'use strict';
  

	
	
  var module = angular.module('app', ['onsen','autocomplete']);
  

   module.controller('MyCtrl', function($scope, $http, MovieRetriever){
	   	$http.get("http://chamagar.com/mx/cardapiojson.asp?acao=cancelar&hora=" + Date.now())
	.success(function(response) {
		$scope.movies = response;
		})
	.error(function(data, status) {
           $scope.messages = data || "Request failed";
           $scope.status = status;
        })
    });
  
  
  // the service that retrieves some movie title from an url
module.factory('MovieRetriever', function($http, $q, $timeout){
  var MovieRetriever = new Object();

  MovieRetriever.getmovies = function(i) {
    var moviedata = $q.defer();
    var movies;

    var someMovies = ["The Wolverine", "The Smurfs 2", "The Mortal Instruments: City of Bones", "Drinking Buddies", "All the Boys Love Mandy Lane", "The Act Of Killing", "Red 2", "Jobs", "Getaway", "Red Obsession", "2 Guns", "The World's End", "Planes", "Paranoia", "The To Do List", "Man of Steel"];

    var moreMovies = ["The Wolverine", "The Smurfs 2", "The Mortal Instruments: City of Bones", "Drinking Buddies", "All the Boys Love Mandy Lane", "The Act Of Killing", "Red 2", "Jobs", "Getaway", "Red Obsession", "2 Guns", "The World's End", "Planes", "Paranoia", "The To Do List", "Man of Steel", "The Way Way Back", "Before Midnight", "Only God Forgives", "I Give It a Year", "The Heat", "Pacific Rim", "Pacific Rim", "Kevin Hart: Let Me Explain", "A Hijacking", "Maniac", "After Earth", "The Purge", "Much Ado About Nothing", "Europa Report", "Stuck in Love", "We Steal Secrets: The Story Of Wikileaks", "The Croods", "This Is the End", "The Frozen Ground", "Turbo", "Blackfish", "Frances Ha", "Prince Avalanche", "The Attack", "Grown Ups 2", "White House Down", "Lovelace", "Girl Most Likely", "Parkland", "Passion", "Monsters University", "R.I.P.D.", "Byzantium", "The Conjuring", "The Internship"]

    if(i && i.indexOf('T')!=-1)
      movies=moreMovies;
    else
      movies=moreMovies;

    $timeout(function(){
      moviedata.resolve(movies);
    },1000);

    return moviedata.promise
  }

  return MovieRetriever;
});

  module.controller('AppController', function($scope, $data, $http) {
    $scope.doSomething = function() {
      setTimeout(function() {
        ons.notification.alert({ message: 'tapped' });
      }, 100);
	  
    };
	
	$scope.enviarpedido = function(itemcardapio) {
	$http.get("http://chamagar.com/mx/cgjson.asp?codigomesa=aaaa&acao=enviarpedido&hora=" + Date.now() + "&itemcardapio=" + itemcardapio)
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

  module.controller('PedidoController', function($scope, $data, $http, $timeout) {
    $scope.item = $data.selectedItem;


    var timer;

    var loopgui = function myLoop() {
		 $http.get("http://chamagar.com/mx/pedidosjson.asp?codigomesa=aaaa&hora=" + Date.now())
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


    $scope.showDetail = function(index) {
      var selectedItem = $data.items[index];
      $data.selectedItem = selectedItem;
      $scope.navi.pushPage('detail.html', {title : selectedItem.title});
    };

    $scope.showPedido = function(index) {
      var selectedItem = $data.items[index];
      $data.selectedItem = selectedItem;
      $scope.navi.pushPage('pedido.html', {title : selectedItem.title});
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

