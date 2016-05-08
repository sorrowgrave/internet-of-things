/**
 * Created by Kenny on 4/05/2016.
 */

(function () {
    'use strict';
    angular.module('gatewayApp').controller('featuresController', featuresController);

    function featuresController(client, logs) {

        var vm = this;

        vm.client = client;
        vm.topicName = 'seattle/traffic';
        vm.message = null;
        vm.msgs = [];
        vm.logs = logs;

        vm.client.on('connectionLost', function(){
            vm.logs.logError('Connection lost');
        });
        vm.client.on('messageArrived', function(msg){
            vm.logs.log('messageArrived in ' + self.id);
            vm.msgs.push(new ReceivedMsg(msg));
        });
        vm.client.on('connected', function(){
            self.logs.log('connected');
        });
        vm.client.on('subscribeFailed', function(e){
            self.logs.logError('subscribeFailed ' + e);
        });
        vm.client.on('subscribeSucess', function(){
            self.logs.log('subscribeSucess');
        });
        vm.client.on('publishFailed', function(e){
            self.logs.log('publishFailed');
        });

        vm.prototype.subscribe = function() {
            vm.client.subscribe(this.topicName);
        };

        vm.prototype.publish = function() {
            vm.client.publish(this.topicName, this.message);
        };

        vm.prototype.msgInputKeyUp = function($event) {
            if ($event.keyCode === 13) {
                this.publish();
            }
        };

    }
})();