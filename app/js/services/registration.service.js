(function() {

    'use strict';

    mbApp.services.factory('RegistrationService', ['AuthService', 'MicroBank', RegistrationService]);

    function RegistrationService(authService, microBank) {

        var registration = {
            creditor: registerCreditor,
            debtor: registerDebtor
        };


        return {
            register: register,
            test1: test1
        };

        function register(accountType, auth, accountData) {
            var mb = microBank.withCtx({
                client: auth,
                tx: {
                    from: auth.address
                }
            });
            
            return registration[accountType](accountData, mb)
                .then(function() {
                    authService.autologin(auth);
                });
        }

        function test1(accountType, auth, accountData) {
            var mb = microBank.withCtx({
                client: auth,
                tx: {
                    from: auth.address
                }
            });
            
            var promise = mb.getContact().then(function(contact) {
                console.log( ">>> contact ", contact);
            });
            console.log( ">>> promise ", promise);
        }

        function registerCreditor(creditor, mb) {
            return mb.creditorUpdateNick(creditor.nickname)
                .then(function() {
                    return mb.creditorUpdateInfo('firstName', creditor.firstName);
                })
                .then(function() {
                    return mb.creditorUpdateInfo('lastName', creditor.lastName);
                })
                .then(function() {
                    return mb.creditorUpdateInfo('desc', creditor.desc);
                });
        }

        function registerDebtor(debtor, mb) {
            return mb.debtorRegister(debtor.nickname)
                .then(function() {
                    return mb.debtorUpdateInfo('firstName', debtor.firstName);
                })
                .then(function() {
                    return mb.debtorUpdateInfo('lastName', debtor.lastName);
                })
                .then(function() {
                    return mb.debtorUpdateInfo('facebook', debtor.facebook);
                })
                .then(function() {
                    return mb.debtorUpdateInfo('email', debtor.email);
                });
        }
    }

})();