/**
 * Created by Kenny on 23/05/2016.
 */
// export function for listening to the socket
module.exports = function (io) {
    console.log("check");
    var clients = [];
    var randomClient;

    io.on('connection', function(socket){
        console.log('a user connected');

        clients.push(socket);

        socket.on('disconnect', function(){
            console.log('user disconnected');
            var index = clients.indexOf(socket);
            if (index != -1) {
                clients.splice(index, 1);
                console.info('Client gone (id=' + socket.id + ').');
            }
        });
    });

    // send the new user their name and a list of users
    io.emit('azure:message', 'lololol');

    // clean up when a user leaves
    io.on('disconnect', function(){
        console.log('user disconnected');
        var index = clients.indexOf(socket);
        if (index != -1) {
            clients.splice(index, 1);
            console.info('Client gone (id=' + socket.id + ').');
        }
    });

    io.send = function (message){

        if (clients.length > 0) {
            randomClient = Math.floor(Math.random() * clients.length);
            clients[randomClient].emit('azure:message', message);
        }

    }
};