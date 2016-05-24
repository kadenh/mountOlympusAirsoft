// Code goes here
var app = angular.module('plunkr', ['ngResource', 'ui.router', 'ui.bootstrap', 'ngAnimate']);

app.controller('MainCtrl', function($scope) {
    $scope.position = 150;
    $scope.altTime = 125;
});


app.directive('time', function ($interval) {
    return {
        templateUrl: 'time.html',
        restrict: 'E',
        scope: {
            position: '=value'
        },
        link: function (scope, element, attrs) {
            element.addClass('time');

            var promise;
            scope.mouseDown = function(dir) {
                promise = $interval(function () {
                    if (dir === "up")
                        scope.position = scope.position + 1;
                    else
                        scope.position = scope.position - 1;
                }, 100);

            };

            scope.mouseUp = function () {
                $interval.cancel(promise);
            };
        }
    };
});