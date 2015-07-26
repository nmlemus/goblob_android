'use strict';

/**
 * @ngdoc object
 * @name register.Controllers.RegistercontrollerController
 * @description RegistercontrollerController
 * @requires ng.$scope
 */
angular
    .module('register')
    .controller('RegisterController', [
        '$scope', 'Profiles', '$state', '$rootScope',
        function ($scope, Profiles, $state, $rootScope) {

            $scope.createUser = function () {

                $rootScope.db.transaction(function (tx) {

                    tx.executeSql("INSERT INTO profile_table (id, profile_name, profile_status) VALUES (?,?,?);", [1, $scope.username, "online"], function (tx, res) {
                        $state.go("home", {phonenumber: $scope.username});
                    }, function (e) {
                        console.log("ERROR: " + e.message);
                    });
                });


            }

        }]);
