'use strict';

/**
 * @ngdoc object
 * @name start.Controllers.StartroutesController
 * @description StartroutesController
 * @requires ng.$scope
 */
angular
    .module('map')
    .controller('MapController', [
        '$scope', '$state', '$cordovaPreferences', '$cordovaSQLite', '$rootScope',
        function ($scope, $state, $cordovaPreferences, $cordovaSQLite, $rootScope) {

            var map;

            document.addEventListener('deviceready', onDeviceReady, false);

            function onDeviceReady() {
                var div = document.getElementById("map");
                map = plugin.google.maps.Map.getMap(div);
                map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);
                console.log("onDeviceReady del controlador Contacts");
            }

            function onMapReady(map) {
                //navigator.geolocation.getCurrentPosition(onSuccess, onError);
                map.getMyLocation(onSuccess, onError);
                map.showDialog();
            }

            var onSuccess = function(location) {
                var msg = ["Current your location:\n",
                    "latitude:" + location.latLng.lat,
                    "longitude:" + location.latLng.lng,
                    "speed:" + location.speed,
                    "time:" + location.time,
                    "bearing:" + location.bearing].join("\n");

                map.setClickable(false);

                map.addMarker({
                    'position': location.latLng,
                    'title': msg
                }, function(marker) {
                    marker.showInfoWindow();
                });

                /*map.animateCamera({
                    target: location.latLng,
                    zoom: 17
                }, onAnimationFinished);

                function onAnimationFinished(){
                    alert("Animation Finished");
                }*/
            };

            var onError = function(msg) {
                alert("error: " + msg);
            };




            $scope.back = function () {
                $state.go("contacts");
            }
        }
    ]);
