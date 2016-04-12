(function(){
    'use strict';

    angular.module('homeService', [])
        .service('homeService', homeService);

    homeService.$inject = ['$sessionStorage'];

    function homeService($sessionStorage) {

        //// list everything
        var hs = this;
        hs.storage = $sessionStorage;
        hs.selected = "";
        hs.addSearch = search;
        hs.addSelected = select;

        // public functions
        function search(searchIn) {
            hs.storage.search = searchIn;
        }

        function select(name){
            $sessionStorage.object = name;
            hs.selected = $sessionStorage.object;
        }
    }
}());