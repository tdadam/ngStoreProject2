(function () {
    'use strict';

    angular.module('basicApp', [
            "angular-loading-bar",
            "ui.router",
            "home",
            "homeService",
            "firebase",
            "ngStorage",
            "authController",
            "navController",
            "firebase.utils",
            "authSetup",
            "cartController",
            "cartService",
            "accountController",
            "select",
            "facebookService",
            "toaster"
    ])

        .config(["$stateProvider", "$urlRouterProvider",
            function ($stateProvider, $urlRouterProvider) {

                // define all app states (pages)
                $stateProvider
                    .state("home", {
                        url: "/home",
                        templateUrl: "templates/home.html",
                        controller: "homeController as hc"
                    })
                    .state("SearchResult", {
                        url: "/SearchResult",
                        params: {
                            searchQuery: "mouse"
                        },
                        templateUrl: "templates/SearchResult.html",
                        controller: "SearchResultController as sc",
                        resolve: {
                            searchResult: function ($http, $stateParams, $localStorage) {
                                var url = "http://api.walmartlabs.com/v1/search?query=" + $localStorage.searchQuery + "&format=json&apiKey=evyfdf3gs4svd5vx3zs9br4w&callback=JSON_CALLBACK";
                                return $http.jsonp(url)
                                    .success(function (data) {
                                        return data;
                                    });
                            }
                        }
                    })
                    .state("select", {
                        url: "/select",
                        templateUrl: "templates/selectedProduct.html",
                        controller: "selectCtrl as se",
                        resolve: {
                            user: ['authSetup', function (authSetup) {
                                return authSetup.$waitForAuth();
                            }]
                        }
                    })
                    .state("contact", {
                        url: "/contact",
                        templateUrl: "templates/contact.html"
                    })
                    .state("login", {
                        url: "/login",
                        templateUrl: "templates/login.html",
                        controller: "authController as authC"
                    })
                    .state("cart", {
                        url: "/cart",
                        templateUrl: "templates/cart.html",
                        controller: "cartController as cartC",
                        resolve: {
                            searchResult: function ($http, $stateParams, $localStorage) {
                                var url = "http://api.walmartlabs.com/v1/search?query=" + $localStorage.searchQuery + "&format=json&apiKey=evyfdf3gs4svd5vx3zs9br4w&callback=JSON_CALLBACK";
                                return $http.jsonp(url)
                                    .success(function (data) {
                                        return data;
                                    });
                            },
                            user: ['authSetup', function (authSetup) {
                                return authSetup.$waitForAuth();
                            }]
                        }
                    })
                    .state("account", {
                        url: "/account",
                        templateUrl: "templates/account.html",
                        controller: "accountController as acctC",
                        resolve: {
                            user: ['authSetup', function (authSetup) {
                                return authSetup.$waitForAuth();
                            }]
                        }
                    });

                // if none of the above states are matched, use this as the fallback
                $urlRouterProvider.otherwise("/home");
            }])

        .run(['$rootScope', 'authSetup', function ($rootScope, authSetup) {
            // track status of authentication
            authSetup.$onAuth(function (user) {
                $rootScope.loggedIn = !!user;
            });
        }]);
}());