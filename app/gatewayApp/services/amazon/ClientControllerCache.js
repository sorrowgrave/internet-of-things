/**
 * Created by Kenny on 9/05/2016.
 */


(function () {
    'use strict';

    angular.module('gatewayApp').service('ClientControllerCache',['MQTTClient', 'ClientController', function (MQTTClient, ClientController) {

        function ClientControllerCache(scope, logs) {
            this.scope = scope;
            this.logs = logs;
            this.val = [];
        }


        ClientControllerCache.prototype.getClient = function (options) {
            var id = options.accessKey + '>' + options.clientId + '@' + options.endpoint;
            for (var i = 0; i < this.val.length; i++) {
                var ctr = this.val[i];
                if (ctr.id === id) {
                    return ctr.client;
                }
            }
            var client = new MQTTClient(options, this.scope);
            var clientController = new ClientController(client, this.logs);
            clientController.id = id;
            this.val.push(clientController);
            return client;
        };

        ClientControllerCache.prototype.removeClient = function (clientCtr) {
            clientCtr.client.disconnect();
            var index = this.val.indexOf(clientCtr);
            this.val.splice(index, 1);
        };

        return ClientControllerCache;

    }]);

})();