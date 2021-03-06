/**
 * @author 作者: laynezhou
 * @copyright laynezhou@tencent.com
 * @version 版本 2017/5/8
 */
var server = require('socket.io');
var Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});
var fs = require("fs");


const initWetty = (httpserv)  => {
    process.on('uncaughtException', function(e) {
        console.error('Error: ' + e);
    });

    var io = server(httpserv,{path: '/wetty/socket.io'});
    console.log((new Date()) + ' new socket');
    io.on('connection', function(socket){
        console.log((new Date()) + ' Connection accepted.');
        var optsc = {
            'AttachStdin': true,
            'AttachStdout': true,
            'AttachStderr': true,
            'Tty': true,
            'OpenStdin': true,
            'StdinOnce': false,
            'Cmd': ['octave', '--no-gui', '--silent'],
            'Image': 'outshine/octave:1.0',
            'WorkingDir': "/data/simulay_image",
        };

        var previousKey,
            CTRL_P = '\u0010',
            CTRL_Q = '\u0011',
            CTRL_D = '\u0004';

        function handler(err, container) {
            var attach_opts = {stream: true, stdin: true, stdout: true, stderr: true};
            console.log('handler')
            container.attach(attach_opts, function handler(err, stream) {
                var isRaw = process.isRaw;
                container.start(function(err, data) {
                    stream.setEncoding('utf8');
                    console.log('start')
                    container.resize({h:80,w:70}, function() {});
                    socket.on('resize', function(data) {
                        var dimensions = {
                            h: data.row,
                            w: data.col
                        };
                        if (data.col != 0 &&  data.row!=0) {
                            console.log("resize: " + JSON.stringify(data))
                            container.resize(dimensions, function() {

                            });
                        }
                    });

                    socket.on('input', function(data) {
                        console.log('input: ' + data)
                        if (previousKey === CTRL_P && key === CTRL_D ) {
                            stream.removeAllListeners();
                            stream.end();
                        };
                        previousKey = data;
                        stream.write(data);
                    });
                    stream.on('data', function(output) {
                        if ((typeof output) === 'string'){
                            socket.emit('output', output);
                        }
                    });

                    stream.on('exit', function () {
                        container.remove({
                            force: true
                        }, function() {
                            return console.log('container  removed');
                        });
                    })

                    socket.on('disconnect', function() {
                        stream.write('\u0004');
                        console.log('disconnet:' + (new Date()) + " PID=" + stream.pid + " ENDED")
                        stream.removeAllListeners();
                        stream.end();
                        return container.remove({
                            force: true
                        }, function() {
                            return console.log('container  removed');
                        });

                    });

                    container.wait(function(err, data) {
                        stream.removeAllListeners();
                        stream.end();
                    });
                });
            });
        }
        docker.createContainer(optsc, handler);
    })
}

const runCode = (runCodeStruct, res, handle) => {
    let response = {
        "stdout": "Number from stdin: 42\n",
        "stderr": "",
        "error": ""
    }

    let workingDir = '/data/simulay_image/default/';
    if (runCodeStruct.hash) {
        workingDir  = '/data/simulay_image/' + runCodeStruct.hash + '/';
        fs.exists(workingDir, function (exists) {
            console.log(exists ? "it's there" : "no file!");
            if (!exists) {
                fs.mkdirSync(workingDir,0755);
            }
        });
    }
    function walkerHashDir(workingDir) {
        var files = fs.readdirSync(workingDir);
        var fileList = files.map(function (filename) {
            return runCodeStruct.hash + "/" + filename;
        });
        return fileList;
    }



    function runExec(container) {
        var options = {
            Cmd: ['octave','--silent', '--eval', runCodeStruct.content],

            //Cmd: ['/bin/bash', '-c', "echo $(pwd) && for k in $( seq 1 5 ); do sleep 1; done |sh"],
            AttachStdout: true,
            AttachStderr: true,
        };
        console.log('runExec')
        container.exec(options, function(err, exec) {
            if (err) return;

            console.log('run exec')
            exec.start(function(err, stream) {
                if (err) return;
                console.log('exec start')
                let data = ''
                stream.on('data', function(chunk) {
                    data +=  chunk;
                });
                stream.on('end',function(){
                    response.stdout = data;
                    runCodeStruct.stdout = data;
                    let images = walkerHashDir(workingDir);
                    response.images = images;
                    runCodeStruct.images = images;
                    console.log(runCodeStruct);
                    handle(runCodeStruct);
                    res.send(response);
                });
            });
        });
    }
    docker.createContainer({
        Image: 'outshine/octave:1.0',
        Tty: false,
        WorkingDir: workingDir,
        HostConfig: {
        "Binds": [
            "/data/simulay_image:/data/simulay_image"
        ],},
        //Cmd: ['/bin/sh', '-c', "for k in $( seq 1 5 ); do sleep 1; done"],
        Cmd: ['/bin/bash', '-c', "echo $(pwd) > /data/simulay_image/hello.txt && for k in $( seq 1 5 ); do sleep 1; done |sh"],

    }, function(err, container) {
        container.start({}, function(err, data) {
            runExec(container);
        });
    });
}
module.exports = {
    docker,
    initWetty,
    runCode
}


