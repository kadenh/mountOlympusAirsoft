// Code goes here
var app = angular.module('plunkr', ['ngResource', 'ui.router', 'ui.bootstrap', 'ngAnimate']);

app.controller('MainCtrl', function($scope) {
    $scope.Time = 150;
});



app.directive('time', function ($interval) {
    return {
        templateUrl: 'time.html',
        restrict: 'E',
        scope: {
            Time: '=value'
        },
        link: function (scope, element, attrs) {
            element.addClass('time');

            var promise;
            scope.mouseDown = function(dir) {
                promise = $interval(function () {
                    if (dir === "up")
                        scope.Time = scope.Time + 1;
                    else
                        scope.Time = scope.Time - 1;
                }, 100);

            };

            scope.mouseUp = function () {
                $interval.cancel(promise);
            };
        }
    };
});