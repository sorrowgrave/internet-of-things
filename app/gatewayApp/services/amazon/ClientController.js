/**
 * Created by Kenny on 10/05/2016.
 */
(function () {
    'use strict';

    angular.module('gatewayApp').service('ClientController', function () {

        function ReceivedMsg(msg) {
            this.msg = msg;
            this.content = msg.payloadString;
            this.destination = msg.destinationName;
            this.receivedTime = Date.now();
        }

        function ClientController(client, logs) {
            this.client = client;
            this.topicName = 'temp';
            this.message = null;
            //this.msgs = [];
            this.msg = {};
            this.logs = logs;
            var self = this;

            this.client.on('connectionLost', function () {
                self.logs.logError('Connection lost');
            });
            this.client.on('messageArrived', function (msg) {
                self.logs.log('messageArrived in ' + self.id);
                self.msg = new ReceivedMsg(msg);
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

        ClientController.prototype.subscribe = function () {
            this.client.subscribe(this.topicName);
        };

        ClientController.prototype.publish = function () {
            this.client.publish(this.topicName, this.message);
        };

        ClientController.prototype.msgInputKeyUp = function ($event) {
            if ($event.keyCode === 13) {
                this.publish();
            }
        };

        return ClientController;

    });
})();