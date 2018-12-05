;(function($, window, document, undefined){
    $(document).ready(function(){
    	var socket = io();
        var html='';
        var userid = $('.myid').val();
        var groupid = $('.id').val();
        var imgurl = $('.imgurl').val();
        var myimgurl = $('.myimgurl').val();
        var myname = $('.myname').val();
        var name = $('.name').html();

        var time =0;
        var room = {};
        var j =1;
        room[0]=0;

        //定位到区域最下方
        function scrollToBottom(){
            var $msgout = $('.msgout');
            var $message = $('#message');
            var toHeight = $message.outerHeight()-$msgout.height()+30;
            $msgout.scrollTop(toHeight);
        }

        //时间转换
        function changeTime(date){
            var d = new Date(date);
            var tiems = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
             + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds(); 
            return tiems;
        }

        function showGroupMessage(){
            $.ajax({
                url: '/showGroupMessage',
                type: 'POST',
                data: {groupid:groupid},
                success: function(data){
                    if(data.success){
                        var aa = data.result.vacation;
                        console.log(aa);
                        
                        var tt = aa.map(function(i){
                            time = i.timeInt;
                            room[j] =time;
                            if(time>(room[j-1]+4*60*1000)){
                                html+="<p class='time'>"+i.dateTime+"</p>";
                            }
                            j++;

                            if(i.id==userid){
                                html+='<div class="my message"><p><img src="/vacation-photo/'+ 
                                myimgurl+'"/>'+i.message+'</p></div>';
                            }else{
                                html+='<div class="to message"><p><img src="/vacation-photo/'+ 
                                i.imgurl+'"/>'+name+':'+i.message+'</p></div>';
                            }                           

                    })
                    $('#message').append(html);
                    scrollToBottom();
                    }
                    else{
                        console.log('出现问题1');
                    }
                },
                error: function(){
                    console.log('出现问题2');
                }
            });
        }
        showGroupMessage();

        //加入群申请
        socket.emit('group',groupid);
        //发送消息
    	$('.but').on('click',function(evt){
            evt.preventDefault();
            var message = $('.text').val();
            var mesg = {
                name:myname,
                groupid:groupid,
                message: message,
                userid: userid,
                imgurl: myimgurl,
            }
            socket.emit('groupmessage',mesg);

            //获取时间点
            var nowTime= new Date();
            var changetime = changeTime(nowTime);
            room[j] =nowTime;
            if(nowTime>(room[j-1]+4*60*1000)){
                html+="<p class='time'>"+changetime+"</p>";
            }
            j++;

            html+='<div class="my message"><p><img src="/vacation-photo/'+ 
            myimgurl+'"/>'+message+'</p></div>';
            $('#message').append(html); 
            html='';
            $('.text').val("");
            scrollToBottom();

        });
        //接收信息
        socket.on('sendGroupMsg',function(msg,uname,img,fromid){

            //获取时间点
            var nowTime= new Date();
            var changetime = changeTime(nowTime);
            room[j] =nowTime;
            if(nowTime>(room[j-1]+4*60*1000)){
                html+="<p class='time'>"+changetime+"</p>";
            }
            j++;

            html+='<div class="to message"><p><a href="/search-detail?id='+fromid+'"><img src="/vacation-photo/'+ 
            img+'"/></a>'+uname+':'+msg+'</p></div>';
            $('#message').append(html);
            html='';
            scrollToBottom();
        });

        //获取群成员列表
        function showUsers(){
        	 $.ajax({
                url: '/showUser',
                type: 'POST',
                data: {groupid:groupid},
                success: function(data){
                	if(data.success){
                		var html='';
                		var aa = data.result.vacation;
                        //console.log(aa);
                        var tt = aa.map(function(i){
                        	html += '<li><a href="/search-detail?id='+i.id+'"><div class="img"><img src="/vacation-photo/'
                        	+i.imgurl+'"/>'+'</div><span>'+i.name+'</span></a>';
                        });
                        $('.groupmsg .user').append(html);
	                }else{
	                	console.log('出现问题1');
	                }
                },
                error: function(){
                    console.log('出现问题2');
                }
            });
        }
        showUsers();
    })
})(jQuery,window,document);


