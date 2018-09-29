$(function () {
    var smsCaptcha = $(".sms-captcha-btn");
    var telephoneInput = $(".signup-group input[name='telephone']");
    smsCaptcha.click(function () {

        var telephone = telephoneInput.val();
        if(!telephone){
            messageBox.showInfo('请输入手机号码！');
        }
        xfzajax.get({
            'url': '/account/sms_captcha/',
            'data':{
                'telephone': telephone
            },
            'success': function (result) {
                if(result['code'] == 200){
                     messageBox.showSuccess('短信验证码发送成功！');
                     smsCaptcha.addClass('disabled');
                     var count = 10;
                     smsCaptcha.unbind('click');
                     var timer = setInterval(function () {
                     smsCaptcha.text(count+'s');
                     count -= 1;
                            if(count <= 0){
                            clearInterval(timer);
                            smsCaptcha.removeClass('disabled');
                            smsCaptcha.text('发送验证码');
                            sms();

                             }
                             },1000);
                         }
                     },
                'fail': function (error) {
                console.log(error);
            }
        });
    });



    $(".signin_btn").click(function () {
        $(".mask-wrapper").show();

    })
    var img_captcha = $(".img_captcha")
    img_captcha.click(function () {
            img_captcha.attr("src","/account/img_captcha"+"?num="+Math.random())
    })
    $(".close-btn").click(function () {
        $(".mask-wrapper").hide();
    })
    
    $('.registers').click(function () {
        alert("123456")
        var signupGroup = $('.signup-group')
        var telephone = signupGroup.find("input[name='telephone']").val();
        var username = signupGroup.find("input[name='username']").val();
        var password1 = signupGroup.find("input[name='password1']").val();
        var password2 = signupGroup.find("input[name='password2']").val();
        var img_captcha = signupGroup.find("input[name='img_captcha']").val();
           xfzajax.post({
            'url': '/account/register/',
            'data': {
                'telephone': telephone,
                'password1': password1,
                'password2': password2,
                'username': username,
                'img_captcha':img_captcha

            },
            'success': function (result) {
                if(result['code'] == 200){
                    $(".mask-wrapper").hide();
                    window.location.reload();
                }else{
                    var messageObject = result['message'];
                    if(typeof messageObject == 'string' || messageObject.constructor == String){
                        window.messageBox.show(messageObject);
                    }else{
                        // {"password":['密码最大长度不能超过20为！','xxx'],"telephone":['xx','x']}
                        for(var key in messageObject){
                            var messages = messageObject[key];
                            var message = messages[0];
                            window.messageBox.show(message);
                        }
                    }
                }
            },
            'fail':function (error) {
                alert(error)
            }
        });




    })
    
    
     $('.submit-btn1').click(function() {
        // var d = {};
        // var t = $('.signin-group .form-control').serializeArray();
        //  $.each(t, function() {
        //     d[this.name] = this.value;
        // });
        //  alert(JSON.stringify(d));
         var signinGroup = $('.signin-group');
         var telephoneInput = signinGroup.find("input[name='telephone']").val();
        var passwordInput = signinGroup.find("input[name='password']").val();
        var rememberInput = signinGroup.find("input[name='remember']").prop("checked");
          xfzajax.post({
            'url': '/account/login/',
            'data': {
                'telephone': telephoneInput,
                'password': passwordInput,
                'remember': rememberInput?1:0
            },
            'success': function (result) {
                if(result['code'] == 200){
                    $(".mask-wrapper").hide();
                    window.location.reload();
                }else{
                    var messageObject = result['message'];
                    if(typeof messageObject == 'string' || messageObject.constructor == String){
                        window.messageBox.show(messageObject);
                    }else{
                        // {"password":['密码最大长度不能超过20为！','xxx'],"telephone":['xx','x']}
                        for(var key in messageObject){
                            var messages = messageObject[key];
                            var message = messages[0];
                            window.messageBox.show(message);
                        }
                    }
                }
            },
            'fail':function (error) {
                alert(error)
            }
        });


  });
})

$(function () {
    $(".switch").click(function () {
        var scrollWrapper = $(".scroll-wrapper");
        var currentLeft = scrollWrapper.css("left")
        currentLeft = parseInt(currentLeft)
        if(currentLeft < 0){
            //小于0 说明这是显示的注册页面
            scrollWrapper.animate({"left":"0"})
            //让距离左边的距离为0 说明显示的是 登录页面
        }else{
            //说明这是显示的登录页面
             scrollWrapper.animate({"left":"-400px"})
            //往左移动400个单位说明 这是为了显示注册页面
        }
    })
})

function sms() {
    var smsCaptcha = $(".sms-captcha-btn");
    var telephoneInput = $(".signup-group input[name='telephone']");
    smsCaptcha.click(function () {
        var telephone = telephoneInput.val();
        if(!telephone){
            messageBox.showInfo('请输入手机号码！');
        }
        xfzajax.get({
            'url': '/account/sms_captcha/',
            'data':{
                'telephone': telephone
            },
            'success': function (result) {
                if(result['code'] == 200){
                        messageBox.showSuccess('短信验证码发送成功！');
                     smsCaptcha.addClass('disabled');
                     var count = 60;
                     smsCaptcha.unbind('click');
                     var timer = setInterval(function () {
                     smsCaptcha.text(count+'s');
                     count -= 1;
                            if(count <= 0){
                            clearInterval(timer);
                            smsCaptcha.removeClass('disabled');
                            smsCaptcha.text('发送验证码');
                            sms();

                             }
                             },1000);
                }
            },
            'fail': function (error) {
                console.log(error);
            }
        });
    });
}


