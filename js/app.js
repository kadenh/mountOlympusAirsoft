/**
 * Created by davidtmeadsjr on 5/15/16.
 */
var app = angular.module('MountOlympusAirsoft', ['firebase']);
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
            }
        }

        return styles;
    }


    $scope.onClickBit = function(bitId) {
        $scope.selectedLight = $scope.bitMap[bitId];
        $scope.selectedLightId = bitId;
        if ($scope.bitMap != null && $scope.bitMap[bitId] != null && $scope.bitMap[bitId].color === 'Red') {
            $scope.bitMap[bitId].color = 'BCF1F5';
        } else {
            $scope.bitMap[bitId].color = 'Red'
        }
    }

    $scope.score = function() {
        var red = 0;
        var BCF1F5 = 0
        for (var key in $scope.bitMap) {
            if ($scope.bitMap.hasOwnProperty(key)) {
                if ($scope.bitMap[key] != null && $scope.bitMap[key].color === "Red") {
                    red++;
                } else if ($scope.bitMap[key] != null && $scope.bitMap[key].color === "BCF1F5") {
                    BCF1F5++;
                }
            }
        }
        return {"Red": red, "BCF1F5": BCF1F5};
    }

});



