/**
 * Created by Kenny on 10/05/2016.
 */
(function () {
    'use strict';

    angular.module('gatewayApp').service('ClientService', ['SensorService', function (SensorService) {

        function ReceivedMsg(msg) {
            this.msg = msg;
            this.content = JSON.parse(msg.payloadString);
            this.destination = msg.destinationName;
            this.receivedTime = Date.now();
        }

        function ClientService(client, logs) {
            this.client = client;
            this.topicName = 'temp';
            this.message = null;
            //this.msgs = [];
            this.msg = {};
            this.logs = logs;
            this.sensorService = new SensorService();

            var self = this;

            this.client.on('connectionLost', function () {
                self.logs.logError('Connection lost');
            });
            this.client.on('messageArrived', function (msg) {

                self.msg = new ReceivedMsg(msg);
                self.logs.log('Message Arrived in ' + self.id);

                if(!self.sensorService.check(self.msg.content.sensor))
                {
                    self.sensorService.add(self.msg.content.sensor, self.msg.content.hardware, self.msg.content.data)
                }
                else
                {
                    self.sensorService.update(self.msg.content.sensor, self.msg.content.data);
                }

                //self.data[0].push(msg);
            });
            this.client.on('connected', function () {
                self.logs.log('connected');
            });
            this.client.on('subscribeFailed', function (e) {
                self.logs.logError('Subscribe Failed ' + e);
            });
            this.client.on('subscribeSuccess', function () {
                self.logs.log('Subscribe Success');
            });
            this.client.on('publishFailed', function (e) {
                self.logs.log('Publish Failed');
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

    }]);
})();