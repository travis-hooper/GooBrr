// myApp declaration
var myApp = angular.module('GooBrr', ['ngRoute']);

// routes
myApp.config(function($routeProvider) {
	$routeProvider

	// route for homepage
	.when('/', {
		templateUrl : 'angularViews/home.html',
		controller : 'homeCtrl'
	})

	.when('/selection', {
		templateUrl : 'angularViews/selection.html',
		controller : 'selectionCtrl'
	})

	.when('/view/:index', {
		templateUrl : 'angularViews/view.html',
		controller : 'viewBusinessCtrl'
	})

	.when('/directions', {
		templateUrl : 'angularViews/directions.html',
		controller : 'directionsCtrl'
	})

	.otherwise({
		redirectTo: '/'
	});
});

var businessesArr, selectedArr = [], selectedBusiness;

// controllers

myApp.controller('homeCtrl', function() {
	businessesArr = []; selectedArr = []; selectedBusiness = [];
	$("#wrapper").addClass('toggled');
});

myApp.controller('selectionCtrl', function($rootScope, $route) {
	$rootScope.results = function () {
		$("#wrapper").toggleClass("toggled");
	};
	$rootScope.selectedArr = selectedArr;
	$rootScope.businessesArr = businessesArr;
	$rootScope.remove = function (index) {
		$rootScope.businessesArr.splice(index, 1);
	};
	$rootScope.addBusiness = function (index) {
		selectedArr.push(businessesArr[index]);
		$rootScope.remove(index);
	};
	$rootScope.getMoreBusinesses = function () {
		function reloadView () {
			$route.reload();
		}
		initializeHome.getMoreBusinesses(reloadView);
	};
});

myApp.controller('viewBusinessCtrl', function($rootScope, $routeParams) {
	$rootScope.i = $routeParams.index;
	$rootScope.removeFromSelected = function (index) {
		if ($rootScope.selectedArr.length <= 1) {
			window.location = '#/';
		} else if ($rootScope.selectedArr.length === parseInt(index) + 1) {
			window.location = '#/view/' + (parseInt(index) - 1);
		}
		$rootScope.selectedArr.splice(index, 1);
	};
	$rootScope.directions = function (index) {
		selectedBusiness = selectedArr[index];
		$("#wrapper").addClass("toggled");
		window.location = '#/directions';
	};

});

myApp.controller('directionsCtrl', function($rootScope, $routeParams) {



	$rootScope.textDirections = function () {
		number = prompt("Please insert your phone number");

		function textBelt (number) {
			var data = {
				number: number.replace(/\D/g,''),
				message: "GooBrr.com\n\n" + selectedBusiness.name + "\n" + selectedBusiness.address + "\n" + selectedBusiness.city + ", " + selectedBusiness.state + " " + selectedBusiness.zip_code + "\n\nhttps://www.google.com/maps/dir/Current+Location/" + selectedBusiness.latLng.join(",")
			};
			$.ajax({
				url: '/text',
				type: 'POST',
				data: data,
				success: function(data, textStatus, jqXHR) {
					alert('Success!');
				},
				error: function (jqXHR, textStatus, errorThrown) 
				{
					alert('FAIL: ' + errorThrown);
				}
			});
		}

		textBelt(number);

	};

});


$(document).on('ready', function () {
	$('#nav-results').on('click', function () {
		$("#wrapper").toggleClass("toggled");
	});
});

