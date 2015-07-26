'use strict';

/**
 * @ngdoc object
 * @name start.Controllers.StartroutesController
 * @description StartroutesController
 * @requires ng.$scope
 */
angular
    .module('start')
    .controller('StartRoutesController', [
        '$scope', '$state', '$cordovaPreferences', '$cordovaSQLite', '$rootScope',
        function ($scope, $state, $cordovaPreferences, $cordovaSQLite, $rootScope) {

            document.addEventListener('deviceready', onDeviceReady, false);

            function onDeviceReady() {
                $rootScope.db = window.sqlitePlugin.openDatabase({name: "goblob.db"});

                $rootScope.db.transaction(function (tx) {
                    tx.executeSql('CREATE TABLE IF NOT EXISTS profile_table (id integer primary key, profile_name text, profile_status text)');
                    tx.executeSql('CREATE TABLE IF NOT EXISTS chat_table (id integer primary key, uuid text, person_name text, text text, status text, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, sent_at DATETIME, received_at DATETIME, read_at DATETIME)');
                    tx.executeSql('CREATE TABLE IF NOT EXISTS geo_table (id integer primary key, latitude text, longitude text, taken_from text)');

                    // demonstrate PRAGMA:
                    $rootScope.db.executeSql("pragma table_info (profile_table);", [], function (res) {
                        console.log("PRAGMA res: " + JSON.stringify(res));
                    });

                    tx.executeSql("select count(id) as cnt, profile_name from profile_table;", [], function (tx, res) {
                        console.log("res.rows.length: " + res.rows.length + " -- should be 1");
                        console.log("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");

                        if (res.rows.item(0).cnt === 0) {
                            $state.go("register");
                        } else {
                            $state.go("home", {phonenumber: res.rows.item(0).profile_name});
                        }

                    }, function (e) {
                        console.log("ERROR: " + e.message);
                    });
                });
            }

            $scope.setName = function () {
                $cordovaPreferences.set('name_identifier', $scope.name).then(function () {
                    console.log('successfully saved!');
                })
            };

            $scope.getName = function () {
                $cordovaPreferences.get('name_identifier').then(function (name) {
                    $scope.name = name;
                })
            };
        }
    ]);
