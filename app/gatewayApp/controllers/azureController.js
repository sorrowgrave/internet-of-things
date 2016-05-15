/**
 * Created by Kenny on 4/05/2016.
 */
var Client = require('azure-iot-device').Client;
var AMQPClient = require('amqp10').Client;
var Policy = require('amqp10').Policy;
var translator = require('amqp10').translator;
var Promise = require('bluebird');
var crypto = require('crypto');

(function () {
    'use strict';
    angular.module('gatewayApp').controller('azureController', ['$scope', 'LogService', 'ClientControllerCache', 'settingsFactory', azureController]);

    function azureController() {

        var vm = this;

        var protocol = 'amqps';
        var eventHubHost = 'ihsuprodamres015dednamespace.servicebus.windows.net/';
        var sasName = 'iothubowner';
        var sasKey = 'qsrJ7NU3y0BWLfT9bh2CQPseIU9qrko/woj8k+eTeks=';
        var eventHubName = 'iothub-ehub-raspberry-33653-472e0fb3b7';
        var numPartitions = 2;

        var filterOffset = new Date().getTime();
        var filterOption;
        if (filterOffset) {
            filterOption = {
                attach: { source: { filter: {
                    'apache.org:selector-filter:string': translator(
                        ['described', ['symbol', 'apache.org:selector-filter:string'], ['string', "amqp.annotation.x-opt-enqueuedtimeutc > " + filterOffset + ""]])
                } } }
            };
        }


        var uri = protocol + '://' + encodeURIComponent(sasName) + ':' + encodeURIComponent(sasKey) + '@' + eventHubHost;
        var recvAddr = eventHubName + '/ConsumerGroups/$default/Partitions/';

        var client = new AMQPClient(Policy.EventHub);

        var messageHandler = function (partitionId, message) {
            console.log('Received(' + partitionId + '): ', message.body);
        };

        var errorHandler = function(partitionId, err) {
            console.warn('** Receive error: ', err);
        };

        var createPartitionReceiver = function(partitionId, receiveAddress, filterOption) {
            return client.createReceiver(receiveAddress, filterOption)
                .then(function (receiver) {
                    console.log('Listening on partition: ' + partitionId);
                    receiver.on('message', messageHandler.bind(null, partitionId));
                    receiver.on('errorReceived', errorHandler.bind(null, partitionId));
                });
        };

        client.connect(uri)
            .then(function () {
                console.log("connected");
                var partitions = [];
                for (var i = 0; i < numPartitions; ++i) {
                    partitions.push(createPartitionReceiver(i, recvAddr + i, filterOption));
                }
                return Promise.all(partitions);
            })
            .error(function (e) {
                console.warn('Connection error: ', e);
            });


    }
})();