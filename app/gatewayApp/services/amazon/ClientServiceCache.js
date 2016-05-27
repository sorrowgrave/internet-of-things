/**
 * Created by Kenny on 9/05/2016.
 */


(function () {
    'use strict';

    angular.module('gatewayApp').service('ClientServiceCache',['MQTTClient', 'ClientService', function (MQTTClient, ClientService) {

        function ClientServiceCache(scope, logs) {
            this.scope = scope;
            this.logs = logs;
            this.val = [];
        }


        ClientServiceCache.prototype.getClient = function (options) {
            var id = options.accessKey + '>' + options.clientId + '@' + options.endpoint;
            for (var i = 0; i < this.val.length; i++) {
                var ctr = this.val[i];
                if (ctr.id === id) {
                    return ctr.client;
                }
            }
            var client = new MQTTClient(options, this.scope);
            var clientService = new ClientService(client, this.logs);
            clientService.id = id;
            this.val.push(clientService);
            return client;
        };

        ClientServiceCache.prototype.removeClient = function (clientCtr) {
            clientCtr.client.disconnect();
            var index = this.val.indexOf(clientCtr);
            this.val.splice(index, 1);
        };

        return ClientServiceCache;

    }]);

})();