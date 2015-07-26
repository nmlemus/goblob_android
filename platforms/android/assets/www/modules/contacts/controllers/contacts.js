'use strict';

/**
 * @ngdoc object
 * @name contacts.Controllers.ContactsController
 * @description ContactsController
 * @requires ng.$scope
 */
angular
    .module('contacts')
    .controller('ContactsController',['$scope', '$rootScope', '$state', 'Users', '$http', '$timeout', '$mdSidenav', '$mdUtil', '$log', '$mdDialog', '$cordovaGeolocation', '$cordovaCamera','$stateParams', '$interval',
        function($scope, $rootScope, $state, Users, $http, $timeout, $mdSidenav, $mdUtil, $log, $mdDialog, $cordovaGeolocation, $cordovaCamera, $stateParams, $interval) {

            if(!$rootScope.phonenumber) {
                $state.go("register");
            }

            $scope.postPhoneNumber = function(){
                var username = this.phone;
                var user = new Users({
                    profile_name : this.phone
                });

                console.log(username);
                $state.go("register");
            };

            $scope.getLocation = function () {
                //var db_geo = window.sqlitePlugin.openDatabase({name: "cordova_bg_locations"});

                $rootScope.db.transaction(queryDB, errorCB);


            };

            $scope.showMap = function(){
                $state.go("map");
            };

            function queryDB(tx) {
                tx.executeSql('SELECT * FROM geo_table', [], querySuccess, errorCB);
            }

            function querySuccess(tx, results) {
                var len = results.rows.length;
                console.log("Geo table: " + len + " rows found.");
                for (var i=0; i<len; i++){
                    console.log("Row = " + i + " ID = " + results.rows.item(i).id + " Latitude =  " + results.rows.item(i).latitude + " Longitude =  " + results.rows.item(i).longitude + " Taken From =  " + results.rows.item(i).taken_from);
                }
            }

            function errorCB(err) {
                alert("Error processing SQL: "+err.code);
            }



            $scope.takePicture = function () {
                var options = {
                    quality: 50,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.CAMERA
                };

                // udpate camera image directive
                $cordovaCamera.getPicture(options).then(function (imageData) {
                    $scope.cameraimage = "data:image/jpeg;base64," + imageData;
                }, function (err) {
                    console.log('Failed because: ');
                    console.log(err);
                });
            };

            $scope.data = {
                selectedIndex: 0,
                secondLocked:  false,
                secondLabel:   "Contact Map",
                bottom:        false
            };



            $scope.goToPerson = function(person, event) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .title('Navigating')
                        .content('Inspect ' + person)
                        .ariaLabel('Person inspect demo')
                        .ok('Neat!')
                        .targetEvent(event)
                );
            };





            $scope.openChat = function(event, person) {
                $rootScope.person = person;
                person.newMessage = 'none';
                person.notification_count = 0;
                $state.go("chat");
            };



            $scope.call = function(event, person) {
                easyrtc.question(person.name, {call: 'audio'});
                $rootScope.person = person;
                $state.go("call");
                easyrtc.enableVideo(false);
                easyrtc.enableVideoReceive(false);
                easyrtc.initMediaSource(
                    function(){
                        var acceptedCB = function(accepted, caller) {
                            if( !accepted ) {
                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .title('CALL-REJECTED')
                                        .content("Sorry, your call to " + easyrtc.idToName(caller) + " was rejected")
                                        .ok('Ok')
                                        .targetEvent(event)
                                );
                                $rootScope.person = '';
								easyrtc.getLocalStream().stop();
								$rootScope.stopTimer();
                                $state.go("contacts");
                            }
                        };
                        var successCB = function() {
                        };
                        var failureCB = function() {
                        };
                        easyrtc.call(person.name, successCB, failureCB, acceptedCB);
                    },
                    function(errorCode, errmesg){
                        easyrtc.showError(errorCode, errmesg);
                    }  // failure callback
                );
            };


            $scope.videoCall = function(event, person) {
                easyrtc.question(person.name, {call: 'video'});
                $rootScope.person = person;
                $state.go("videocall");
                easyrtc.enableVideo(true);
                easyrtc.enableVideoReceive(true);
                easyrtc.initMediaSource(
                    function(){
                        var selfVideo = document.getElementById("box0");
                        easyrtc.setVideoObjectSrc(selfVideo, easyrtc.getLocalStream());
                        var acceptedCB = function(accepted, caller) {
                            if( !accepted ) {
                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .title('CALL-REJECTED')
                                        .content("Sorry, your call to " + easyrtc.idToName(caller) + " was rejected")
                                        .ok('Ok')
                                        .targetEvent(event)
                                );
                                $rootScope.person = '';
								easyrtc.getLocalStream().stop();
								$rootScope.stopTimer();
                                $state.go("contacts");
                            }
                        };
                        var successCB = function() {
                        };
                        var failureCB = function() {
                        };
                         easyrtc.call($rootScope.person.name, successCB, failureCB, acceptedCB);
                    },
                    function(errorCode, errmesg){
                        easyrtc.showError(errorCode, errmesg);
                    }  // failure callback
                );
            };


            $scope.next = function() {
                $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2) ;
            };

            $scope.previous = function() {
                $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
            };


        }
    ]);
