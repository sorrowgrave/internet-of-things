/**
 * Created by Kenny on 10/05/2016.
 */
(function () {
    'use strict';

    angular.module('gatewayApp').service('ClientService', function () {

        function ReceivedMsg(msg) {
            this.msg = msg;
            this.content = msg.payloadString;
            this.destination = msg.destinationName;
            this.receivedTime = Date.now();
        }

        function ClientService(client, logs) {
            this.client = client;
            this.topicName = 'temp';
            this.message = null;
            //this.msgs = [];
            this.msg = {};
            this.data = [];
            this.logs = logs;
            var self = this;

            this.client.on('connectionLost', function () {
                self.logs.logError('Connection lost');
            });
            this.client.on('messageArrived', function (msg) {
                self.logs.log('messageArrived in ' + self.id);
                self.msg = new ReceivedMsg(msg);
                self.data[0].push(msg);
            });
            this.client.on('connected', function () {
                self.logs.log('connected');
            });
            this.client.on('subscribeFailed', function (e) {
                self.logs.logError('subscribeFailed ' + e);
            });
            this.client.on('subscribeSuccess', function () {
                self.logs.log('subscribeSuccess');
            });
            this.client.on('publishFailed', function (e) {
                self.logs.log('publishFailed');
            });
        }

        ClientService.prototype.subscribe = function () {
            this.client.subscribe(this.topicName);
        };

        ClientService.prototype.publish = function () {
            this.client.publish(this.topicName, this.message);
        };

        ClientService.prototype.msgInputKeyUp = function ($event) {
            if ($event.keyCode === 13) {
                this.publish();
            }
        };

        return ClientService;

    });
})();