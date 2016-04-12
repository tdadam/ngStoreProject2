(function() {
    'use strict';

    angular.module('facebookService', [])
        .service('facebookService', facebookService);

    facebookService.$inject = [];

    function facebookService() {
        var fbS = this;

        fbS.saveData = saveData;
        fbS.fbData = {};

        function saveData(authData){
            fbS.fbData = authData;
        }
    }
}());