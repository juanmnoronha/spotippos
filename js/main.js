var app = angular.module("app", []);

app.controller("AdsCtrl", function($scope, $http, $filter) {

	$scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.ads = [];
    $scope.q = '';
    $scope.loaded = false;

	$scope.maskCurrency = function (obj) {
		obj.mininamc = obj.minmax.toString().replace(/\D/g, "").replace(/([0-9])([0-9]{2})$/, '$1.$2');
	};

	$scope.getData = function () {
      $scope.disablePrev = $scope.currentPage == 0;
      $scope.disableNext = $scope.currentPage >= $scope.ads.length/$scope.pageSize - 1;
      return $filter('filter')($scope.ads);
    }
    
    $scope.numberOfPages = function () {
        return Math.ceil($scope.getData().length/$scope.pageSize);                
    }

    $scope.$watch('q', function(newValue,oldValue){
    	if(oldValue!=newValue) {
    		$scope.currentPage = 0;
    	}
    },true);

	$http.get('http://spotippos.vivareal.com/properties?ax=1&ay=1&bx=1400&by=1000').
	success(function(data, status, headers, config) {
		$scope.ads = data.properties;
		$scope.loaded = true;
	}).error(function(data, status, headers, config) {
		// log error
	});

	$scope.navigatePage = function (paramDirection) {
		if ((paramDirection == 'next' && $scope.disableNext) || (paramDirection != 'next' && $scope.disablePrev)) {
			return;
		}
		$scope.currentPage = paramDirection == 'next' ? $scope.currentPage + 1 : $scope.currentPage - 1;
	};
});

app.filter('startFrom', function () {
    return function(input, start) {
        start = +start;
        return input.slice(start);
    }
});

app.filter('customCurrency', function($filter) {
	return function(value) {
		return value ? parseFloat(value).toFixed(2).toString().replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') : "R$ 0,00";
	};
});

app.directive('numericOnly', function(){
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {

            modelCtrl.$parsers.push(function (inputValue) {
                var transformedInput = inputValue ? inputValue.replace(/[^\d.-]/g,'') : null;

                if (transformedInput!=inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }

                return transformedInput;
            });
        }
    };
}); 