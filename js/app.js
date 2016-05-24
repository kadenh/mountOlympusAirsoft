/**
 * Created by davidtmeadsjr on 5/15/16.
 */
var app = angular.module('MountOlympusAirsoft', ['firebase','ui.bootstrap','ngRoute','ngResource', 'ngAnimate'] ).
directive('myBackgroundImage', function () {
    return function (scope, element, attrs) {
        element.css({
            'background-image': 'url(' + attrs.myBackgroundImage + ')',
            'background-size': 'cover',
            'background-repeat': 'no-repeat',
            'background-position': 'center center',
            'width': '1215px',
            'height': '887px'
        });
    };
});
app.directive('position', function ($interval) {
    return {
        templateUrl: 'position.html',
        restrict: 'E',
        scope: {
            selectedLight: '=value'
        },
        link: function (scope, element, attrs) {
            element.addClass('position');

            var promise;
            scope.mouseDown = function(dir) {
                promise = $interval(function () {
                    if (dir === "up")
                        scope.selectedLight.top = scope.selectedLight.top + 1;
                    else if (dir === "down")
                        scope.selectedLight.top = scope.selectedLight.top - 1;
                    else if (dir === "left")
                        scope.selectedLight.left = scope.selectedLight.left - 1;
                    else if (dir === "right")
                        scope.selectedLight.left = scope.selectedLight.left + 1;
                }, 100);

            };

            scope.mouseUp = function () {
                $interval.cancel(promise);
            };
        }
    };
});
app.controller('Main', function($scope, $firebaseObject) {
    $scope.bitIdsSource = ['light0','light1','light2','light3','light4','light5','light6','light7','light8','light9','light10','light11','light12','light13','light14','light15'];
    $scope.bitIds = [];
    $scope.selectedLight = null;
    $scope.selectedLightId = null;
    $scope.counter = 100;

    var firebaseRef = new Firebase('https://blinding-heat-2342.firebaseio.com/');
    var firebaseObj = $firebaseObject(firebaseRef);
    firebaseObj.$bindTo($scope, "bitMap").then(function(){
        //This puts the list of square bitIds in the right variable for the ng-repeat, but not until after the data is retrieved
        $scope.bitIds = $scope.bitIdsSource;
    });

    $scope.calcBitStyle = function(bitId) {
        var styles = {};
        for (var key in $scope.bitMap) {
            if (key == bitId) {
                styles['background-color'] = $scope.bitMap[key].color;
                styles['top'] = $scope.bitMap[key].top+'px';
                styles['left'] = $scope.bitMap[key].left+'px';
            }
        }

        return styles;
    }


    $scope.onClickBit = function(bitId) {
        $scope.selectedLight = $scope.bitMap[bitId];
        $scope.selectedLightId = bitId;
        if ($scope.bitMap != null && $scope.bitMap[bitId] != null && $scope.bitMap[bitId].color === 'Red') {
            $scope.bitMap[bitId].color = 'Yellow';
        } else {
            $scope.bitMap[bitId].color = 'Red'
        }
    }

    $scope.score = function() {
        var red = 0;
        var yellow = 0
        for (var key in $scope.bitMap) {
            if ($scope.bitMap.hasOwnProperty(key)) {
                if ($scope.bitMap[key] != null && $scope.bitMap[key].color === "Red") {
                    red++;
                } else if ($scope.bitMap[key] != null && $scope.bitMap[key].color === "Yellow") {
                    yellow++;
                }
            }
        }
        return {"Red": red, "Yellow": yellow};
    }

    $scope.changeLeftValue = function(incrementValue) {
        $scope.selectedLight.left = $scope.selectedLight.left + incrementValue;
    }

    $scope.changeTopValue = function(incrementValue) {
        $scope.selectedLight.top = $scope.selectedLight.top + incrementValue;
    }

    $scope.handler = function(e){
        if(e.keyCode === 39) {
            console.log('right arrow');
            $scope.changeLeftValue(1);
        }
    };

    var $doc = angular.element(document);

    $doc.on('keydown', $scope.handler);
    $scope.$on('$destroy',function(){
        $doc.off('keydown', $scope.handler);
    });

});



