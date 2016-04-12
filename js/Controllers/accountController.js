(function () {
  "use strict";

  angular.module('accountController', [])
      .controller('accountController', accountController);

  accountController.$inject = ['$scope', 'authSetup', 'fbutil', 'user', '$location', '$firebaseObject', 'toaster', 'facebookService'];

    function accountController($scope, authSetup, fbutil, user, $location, $firebaseObject, toaster, facebookService) {
      var unbind;
      // create a 3-way binding with the user profile object in Firebase
      var profile = $firebaseObject(fbutil.ref('users', user.uid));
      $scope.saveBtn = false;
      $scope.changeBtn = true;
      $scope.readChanged = true;
      $scope.color = "white";

      $scope.saveName = function () {
        $scope.color = "white";
        toaster.pop('success', "Successfully Changed Your User Name: ", profile.name);
        $scope.saveBtn = false;
        $scope.changeBtn = true;

      };
      $scope.readChange = function () {
        $scope.changeBtn = false;
        $scope.readChanged = false;
        $scope.color = "yellow";
        $( "#in1" ).focus();
      };
      profile.$bindTo($scope, 'profile').then(function(ub) { unbind = ub; });

      $scope.change = function () {
        $scope.saveBtn = true;
      };

      // expose logout function to scope
      $scope.logout = function() {
        if( unbind ) { unbind(); }
        profile.$destroy();
        authSetup.$unauth();
        $location.path('/login');
      };

      $scope.changePassword = function(pass, confirm, newPass) {
        resetMessages();
        if( !pass || !confirm || !newPass ) {
          $scope.err = 'Please fill in all password fields';
        }
        else if( newPass !== confirm ) {
          $scope.err = 'New pass and confirm do not match';
        }
        else {
          authSetup.$changePassword({email: profile.email, oldPassword: pass, newPassword: newPass})
            .then(function() {
              $scope.msg = 'Password changed';
            }, function(err) {
              if (err.code === 'INVALID_PASSWORD') {
                $scope.err = 'Incorrect Password';
              }
            });
        }
      };

      $scope.clear = resetMessages;

      $scope.changeEmail = function(pass, newEmail) {
        resetMessages();
        var oldEmail = profile.email;
        authSetup.$changeEmail({oldEmail: oldEmail, newEmail: newEmail, password: pass})
          .then(function() {
            // store the new email address in the user's profile
            return fbutil.handler(function(done) {
              fbutil.ref('users', user.uid, 'email').set(newEmail, done);
            });
          })
          .then(function() {
            $scope.emailmsg = 'Email changed';
          }, function(err) {
              if (err.code === 'EMAIL_TAKEN') {
                  $scope.emailerr = 'The Email you entered has been taken.';
              }
              else if( !oldEmail || !newEmail || !pass ) {
                  $scope.emailerr = 'Please fill in all fields';
              }
              else if (err.code === 'INVALID_PASSWORD') {
                  $scope.emailerr = 'Incorrect Password';
              }
          });
      };

      function resetMessages() {
        $scope.err = null;
        $scope.msg = null;
        $scope.emailerr = null;
        $scope.emailmsg = null;
      }
    }
}());