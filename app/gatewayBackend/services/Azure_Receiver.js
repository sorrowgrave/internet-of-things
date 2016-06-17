/**
 * Created by Kenny on 28/05/2016.
 */

var AMQPClient = require('amqp10').Client;
var Policy = require('amqp10').Policy;
var translator = require('amqp10').translator;
var Promise = require('bluebird');

var amqpClient = new AMQPClient(Policy.EventHub);
var io = require('socket.io-emitter')({ host: 'localhost', port: 6379 });
var data = {};

var config = require('../data/settings.json').configuration.cloud.azure;

var protocol = 'amqps';
var eventHubHost = config.eventHubHost;
var sasName = config.sasName;
var sasKey = config.sasKey;
var eventHubName = config.eventHubName;
var numPartitions = config.numPartitions;

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

var messageHandler = function (partitionId, message) {
    console.log('Received(' + partitionId + '): ', message.body);
    data.message = message;
    data.host = eventHubHost;
    io.emit('azure:message', data);

};

var errorHandler = function(partitionId, err) {
    console.warn('** Receive error: ', err);
};

var createPartitionReceiver = function(partitionId, receiveAddress, filterOption) {
    return amqpClient.createReceiver(receiveAddress, filterOption)
        .then(function (receiver) {
            console.log('Listening on partition: ' + partitionId);
            receiver.on('message', messageHandler.bind(null, partitionId));
            receiver.on('errorReceived', errorHandler.bind(null, partitionId));
        });
};

amqpClient.connect(uri)
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
