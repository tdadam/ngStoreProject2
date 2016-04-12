(function(){
    'use strict';

    angular.module('home')

        .controller('SearchResultController', SearchResultController);

    function SearchResultController($state, searchResult, $http, homeService, $localStorage) {

       var sc = this;
        sc.walData = searchResult.data;
        sc.searchLim = 9;

        sc.selectedItem = function (name) {
            homeService.addSelected(name);
        };

        sc.clickEnter = function (keyEvent, search) {
            if (keyEvent.which === 13){
                homeService.addSearch(search);
                $localStorage.searchQuery = search;
                $state.go("SearchResult", {searchQuery: $localStorage.searchQuery});
            }
        };

        sc.search = function() {
            homeService.addSearch(sc.newSearch);
            sc.url = "http://api.walmartlabs.com/v1/search?query=" + sc.newSearch + "&format=json&apiKey=evyfdf3gs4svd5vx3zs9br4w&callback=JSON_CALLBACK";
            $localStorage.searchQuery = sc.newSearch;
            $http.jsonp(sc.url)
                .success(function (data) {
                    sc.walData = data;
                    console.log(data);
                });
        };
    }
}());