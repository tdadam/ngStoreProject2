(function() {
    'use strict';

    angular.module('authSetup', [])
        .factory('authSetup', authSetup);

    authSetup.$inject = ['$firebaseAuth', 'fbutil'];

    function authSetup($firebaseAuth, fbutil) {
        return $firebaseAuth(fbutil.ref());
    }
}());