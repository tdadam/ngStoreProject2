(function () {
    'use strict';

    angular.module('cartService', [])
        .service('cartService', cartService);

    cartService.$inject = ['$firebaseArray'];

    function cartService($firebaseArray) {
        var cS = this;
        cS.addToCart = addToCart;
        cS.loadItems = loadItems;

        var ref = new Firebase("https://store-project.firebaseio.com");

        function addToCart(item, user) {
            var cartRef = new Firebase(ref + "/cartItems/" + user.$id);
            var cartItems = new $firebaseArray(cartRef);
            cartItems.$add(item);
        }

        function loadItems(user) {
            var loadCart = new Firebase(ref + "/cartItems/" + user.$id);
            var loadView = $firebaseArray(loadCart);
            return loadView;
        }
    }
}());