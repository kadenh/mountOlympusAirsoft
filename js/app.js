/**
 * Created by davidtmeadsjr on 5/15/16.
 */
var app = angular.module('MountOlympusAirsoft', ['firebase']);
app.controller('Main', function($scope, $firebaseObject) {
    $scope.backgroundSize = {w:800,h:600};
    $scope.bitIdsSource = ['a0','a1','a2','a3','b0','b1','b2','b3','c0','c1','c2','c3','d0','d1','d2','d3'];
    $scope.bitIds = [];

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
                styles['background-color'] = $scope.bitMap[key];
                break;
            }
        }

        return styles;
    }


    $scope.onClickBit = function(bitId) {
        if ($scope.bitMap[bitId] === 'Red') {
            $scope.bitMap[bitId] = 'Yellow';
        } else {
            $scope.bitMap[bitId] = 'Red'
        }
    }

    $scope.score = function() {
        var red = 0;
        var yellow = 0
        for (var key in $scope.bitMap) {
            if ($scope.bitMap.hasOwnProperty(key)) {
                if ($scope.bitMap[key] === "Red") {
                    red++;
                } else if ($scope.bitMap[key] === "Yellow") {
                    yellow++;
                }
            }
        }
        return {"Red": red, "Yellow": yellow};
    }

});



