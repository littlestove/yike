;(function($,window){

    var training = {
        init : function(){
            this._friendDelete();
            this._markname();
            this._upmarkName();
            this._addfriend();
            this._addApply();
            this._deletefriend();
            this._userMore();
            this._length = 0;
      },
       
        // 判断用户删除确定弹框
        _friendDelete : function(){
            $('.delete').on('click',function(ev){
                ev = ev || window.event;
                if(confirm("是否删除好友?")){
                    //alert ("点击了确定");
                }else{
                    return false;
                }
            });
        },
        
        //设置备注
        _markname : function(){
            var that = this, _link = '';
            $('body').on('click','.mark',function(){
                $('.addmark').toggle();      
            });
        },
        //备注提交
        _upmarkName : function(){
            $('body').on('click','.addmark .upmark',function(){
                var cont  = $('.markname').val();
                if(cont){
                    //异步添加用户备注
                    var _id = $(this).attr('data-id');
                    $.ajax({
                        url: '/detail/markname',
                        type: 'POST',
                        data: {cont:cont,id:_id},
                        success: function(data){
                            if(data.success){
                                //刷新当前页面
                                window.location.reload();
                            }else{
                            console.log('取回数据问题');
                            }
                        },
                        error: function(){
                            console.log('没实现异步');
                        }
                    });
                }
            });
        },
        //添加好友
        _addfriend : function(){
            $('body').on('click','.add',function(){
                //异步添加好友
                var _id,reason = '';
                _id = $(this).attr('data-id');
                reason = $('.apply-main .reason').val();
                console.log(reason);
                $.ajax({
                    url: '/add',
                    type: 'POST',
                    data: {id:_id,reason:reason},
                    success: function(data){
                        if(data.success){
                            //返回上一页
                            alert('添加成功');
                            window.history.back(-1); 
                           // window.location.reload();
                        }else{
                        console.log('取回数据问题');
                        }
                    },
                    error: function(){
                        console.log('没实现异步');
                    }
                });
            });
        },
        //显示添加好友项
        _addApply : function(){
            var nom = false;
            $('body').on('click', '.apply',function(){
                if(!nom){
                    $('.apply-main').show();
                    $(this).html('取消添加');
                    nom = true;
                }else{
                    $('.apply-main').hide();
                    $(this).html('添加好友');
                    nom = false;
                }
            })
        },
        //删除好友
        _deletefriend : function(){
            $('body').on('click','.delete',function(){
                var id = $(this).attr('data-id');
                $.ajax({
                    url: '/delete-friend',
                    type: 'POST',
                    data: {id:id},
                    success: function(data){
                        if(data.success){
                            //跳回首页
                            $(window).attr('location','/yike');
                        }else{
                            console.log('查询失败');
                        }
                    }
                })
            })
        },
        //基本信息展示
        _userMore : function(){
            $('body').on('click','.head2 .more',function(){
                $('.user-more').animate({ left: "0px"}, "fast");
            })
            $('body').on('click','.user-more .back',function(){
                // alert('a')
                $('.user-more').animate({ left: "100%"}, "fast");
            })
        }
    }

    $(document).ready(function(){
        training.init();
    })

    window.training = training;
    // 滚动条
    sideMenuScroll(1,1);

}(jQuery,window));