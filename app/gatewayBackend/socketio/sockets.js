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

    // clean up when a user leaves
    io.on('disconnect', function(){
        console.log('user disconnected');
        var index = clients.indexOf(socket);
        if (index != -1) {
            clients.splice(index, 1);
            console.info('Client gone (id=' + socket.id + ').');
        }
    });

};