/*
 *hichat v0.4.2
 *Wayou Mar 28,2014
 *MIT license
 *view on GitHub:https://github.com/wayou/HiChat
 *see it in action:http://hichat.herokuapp.com/
 */
window.onload = function() {
    var hichat = new HiChat();
    hichat.init();
};
var HiChat = function() {
    this.socket = null;
};

var Users=[];



// prototype原型链多个子类复用同一个，不会新建。
HiChat.prototype={
    init: function(){
        var that=this;
        this.socket=io.connect();
        this.socket.on('connect',function(){
        document.getElementById('info').textContent = '请输入你的昵称 *_*  ';
        document.getElementById('nickWrapper').style.display = 'block';
        document.getElementById('nicknameInput').focus();      
        })
        this.socket.on('loginSuccess',function () {
            document.title='嗨聊|'+document.getElementById('nicknameInput').value;
            document.getElementById('loginWrapper').style.display = 'none';
            document.getElementById('messageInput').focus();
        })
        this.socket.on('nickNull',function () {
            document.getElementById('info').style.color='red';
        })
        // 接收用户登录事件
        this.socket.on('system',function (nickname,users,nowTime,type) {
             // +++++++++++++++++测试内容，待修改+++++++++++++++++++
            var StatusDom=document.getElementById('status')
            var infoclasslist=StatusDom.classList;
            infoclasslist.add('fadeOutUp');
            Users=users;
            setTimeout(function(){
                StatusDom.style.display='none';
                infoclasslist.remove('fadeInUp','fadeOutUp');
                StatusDom.innerHTML="<font color='#fff065'>"+nickname+"</font>"+type+'&nbsp'+nowTime;
                infoclasslist.add('fadeInUp');
                StatusDom.style.display='inline-block';
                setTimeout(function () {
                infoclasslist.add('fadeOutUp');
            },5000);
            },400);

            setInterval(function(){
                StatusDom.style.display='none';
                infoclasslist.remove('fadeInUp','fadeOutUp');
                StatusDom.innerHTML='当前在线人数'+"<font color='#f17c67'>"+Users.length+'</font>'+'人';
                infoclasslist.add('fadeInUp');
                StatusDom.style.display='inline-block';
                setTimeout(function () {
                infoclasslist.add('fadeOutUp');
            },5000);
            },20000);


        })
        // 接收新消息
        this.socket.on('newMsg',function(username,nowTime,msg){
            // +++++++++++++++++测试内容，待修改+++++++++++++++++++
            document.getElementById('historyMsg').innerHTML+="<div>\
                <a class='a-success'>"+username+"&nbsp"+nowTime+"<a>\
              </div> \
            <!-- 内容 -->\
              <div class='mseeagepop alert-success' > \
              <strong>"+msg+"</strong></div>";

        })
        // 登陆
        document.getElementById('loginBtn').addEventListener('click',function(){
            var nickName=document.getElementById('nicknameInput').value;
            if(nickName.trim().length!=0){
                that.socket.emit('login',nickName);
            }else{
                document.getElementById('nicknameInput').focus();
            }
        },false);
        // 发送消息,
        document.getElementById('sendBtn').addEventListener('click',function(){
            var message=document.getElementById('messageInput').value;
            if(message.trim().length!=0){
                that.socket.emit('send',message)
                // 防止重复提交表单，还可以加入确认消息是否成功发送++++++++++
                document.getElementById('messageInput').value='';
                // ++++++++++测试内容，需要加入当前的消息到页面++++++++++++
                document.getElementById('historyMsg').innerHTML+="<div class='flexcontainer'> \
                            <div class='mymseeagepop alert-danger ' >"+message+"</div></div>"
            }
        })
    }
}


