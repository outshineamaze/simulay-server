var server = require('socket.io');
var pty = require('pty.js');

const initWetty = (httpserv)  => {
process.on('uncaughtException', function(e) {
    console.error('Error: ' + e);
});

var io = server(httpserv,{path: '/wetty/socket.io'});
io.on('connection', function(socket){

    var request = socket.request;
    console.log((new Date()) + ' Connection accepted.');

    var term;
    if (process.getuid() == 0) {
        //term = pty.spawn('docker', ['run','-i','-t','--rm', 'outshine/octave:1.0', 'octave', '--no-gui'], {
          term = pty.spawn('/bin/bash', [], {
            name: 'xterm-256color',
            cols: 80,
            rows: 30
        });
    } else {
        //term = pty.spawn('docker', ['run' , '-i', '-t', '--rm', 'outshine/octave:1.0','octave', '--no-gui'], {
        term = pty.spawn('/bin/bash', [], {
            name: 'xterm-256color',
            cols: 80,
            rows: 30
        });
    }
    console.log((new Date()) + " PID=" + term.pid + " STARTED on behalf")
    term.on('data', function(data) {
        socket.emit('output', data);
    });
    term.on('exit', function(code) {
        console.log('exit:' + (new Date()) + " PID=" + term.pid + " ENDED")
    });
    socket.on('resize', function(data) {
        term.resize(data.col, data.row);
    });
    socket.on('input', function(data) {
        term.write(data);
    });
    socket.on('disconnect', function() {
        term.write('\u0004');
	    console.log('disconnet:' + (new Date()) + " PID=" + term.pid + " ENDED")
        term.end();
    });
})
}
module.exports = initWetty
