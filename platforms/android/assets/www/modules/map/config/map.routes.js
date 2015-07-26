'use strict';

/**
* @ngdoc object
* @name start.config
* @requires ng.$stateProvider
* @description Defines the routes and other config within the start module
*/
angular
    .module('map')
    .config(['$stateProvider',
        function($stateProvider) {
            /**
             * @ngdoc event
             * @name start.config.route
             * @eventOf start.config
             * @description
             *
             * Define routes and the associated paths
             *
             * - When the state is `'startroutes'`, route to startroutes
             *
            */
            $stateProvider
                .state('map', {
                    url: '/map',
                    templateUrl: 'modules/map/views/mapview.html',
                    controller: 'MapController'
                });
        }
    ]);
