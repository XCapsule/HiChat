var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users=[]
// 绑定到服务器
app.use('/',express.static(__dirname+'/www'));
server.listen(80);

// socket部分
io.on('connection',function(socket){
    socket.on('foo',function(data){
        console.log(data);
    })
    // 响应前台登陆界面
    socket.on('login',function (nickname) {
        // 后台一定要判断用户输入是否是正确的
        if(nickname.trim().length!=0){
        if(users.indexOf(nickname)>-1){
            socket.emit('nickExisted');
        }else{
            socket.userIndex=users.length;
            socket.nickname=nickname;
            users.push(nickname);
            socket.emit('loginSuccess');
            var second = new Date().getMinutes();
                if(parseInt(second)<10){
                    second='0'+second;
                }else{}
            var nowTime=new Date().getHours()+':'+second ;
            io.sockets.emit('system',nickname,users,nowTime,'进入房间');
        }}else{
            socket.emit('nickNull')
        }
    })

    //user leaves
    socket.on('disconnect', function() {
        if (socket.nickname != null) {
            //users.splice(socket.userIndex, 1);
            var second = new Date().getMinutes();
                if(parseInt(second)<10){
                    second='0'+second;
                }else{}
            var nowTime=new Date().getHours()+':'+second ;
            users.splice(users.indexOf(socket.nickname), 1);
            socket.broadcast.emit('system', socket.nickname, users,nowTime, '离开房间');
        }
    });

    socket.on('send',function(message){
        var second = new Date().getMinutes();
                if(parseInt(second)<10){
                    second='0'+second;
                }else{}
        var nowTime=new Date().getHours()+':'+second ;
        socket.broadcast.emit('newMsg',socket.nickname,nowTime,message);
    })

})

