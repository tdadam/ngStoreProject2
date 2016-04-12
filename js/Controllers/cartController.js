(function () {
    'use strict';

    angular.module('cartController', [])
        .controller('cartController', cartController);

    cartController.$inject = ['$scope', '$rootScope', '$state', 'user', 'fbutil', 'cartService', '$firebaseObject', '$timeout', '$localStorage', 'homeService', '$sessionStorage'];

    function cartController($scope, $rootScope, $state, user, fbutil, cartService, $firebaseObject, $timeout, $localStorage, homeService, $sessionStorage) {
        var cC = this;

        cC.setProfile = setProfile;
        cC.loadItems = loadItems;
        cC.selectedItem = selectedItem;
        cC.profile = {};
        cC.total = 0;
        cC.cartTotal = 0;
        cC.items = [];

        cC.clickEnter = function (keyEvent, search) {
            if (keyEvent.which === 13) {
                homeService.addSearch(search);
                $localStorage.searchQuery = search;
                $state.go("SearchResult", {searchQuery: $localStorage.searchQuery});
            }
        };

        cC.search = function () {
            homeService.addSearch(cC.newSearch);
            $localStorage.searchQuery = cC.newSearch;
            $state.go("SearchResult", {searchQuery: $localStorage.searchQuery});
            console.log(cC.cartItemsNum);
        };

        function setProfile() {
            if ($rootScope.loggedIn) {
                var unbind;
                cC.profile = $firebaseObject(fbutil.ref('users', user.uid));
                cC.profile.$bindTo($scope, 'profile').then(function (ub) {
                    unbind = ub;
                });
            }
        }

        function loadItems() {
            var profile = cC.profile;
            cC.items = cartService.loadItems(profile);

            $timeout(function () {
                cC.cartTotal = 0;
                for (var i = 0; i < cC.items.length; i++) {
                    cC.cartTotal += cC.items[i].salePrice;
                }
            }, 750);
        }

        if (!$rootScope.loggedIn) {
            $state.go("login");
        }

        function selectedItem(object) {
            $sessionStorage.object = object;
        }

        setProfile();
        loadItems();

    }
}());