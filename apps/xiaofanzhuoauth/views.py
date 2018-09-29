from django.shortcuts import render,redirect,reverse
from django.views.decorators.http import require_POST
from django.contrib.auth  import authenticate,login,logout
from .forms import LoginForm,RegisterForm
from utils import restful
from .models import User
from django.http import HttpResponse,JsonResponse
from utils.captcha.xfzcaptcha import Captcha
from io import BytesIO
from django.core.cache import cache
from utils.aliyunsdk import demo_sms_send
# Create your views here.

# {"code":500,"message":"服務器錯誤","data":""}
def index_view(request):
    #user = User.objects.create_user(telephone="13888888888",username="haha",password="123456")
    return HttpResponse("成功")
@require_POST
def login_view(request):
    form = LoginForm(request.POST)
    if form.is_valid():
        telephone = form.cleaned_data.get('telephone')
        password = form.cleaned_data.get('password')
        remember = form.cleaned_data.get('remember')
        print(telephone)
        print(password)
        print(remember)
        user = authenticate(request,username=telephone,password=password)
        if user:
            if user.is_active:
                login(request,user)
                if remember:
                    request.session.set_expiry(None)
                else:
                    request.session.set_expiry(0)
                return restful.success()
            else:
                return restful.unauth(message="您的账号被冻结")
        else:
            return restful.paramerror(message="手机号或者密码错误")

    else:
        errors = form.get_errors()

        return restful.paramerror(message=errors)


def logout_view(request):
    logout(request)
    return redirect(reverse('news:index'))
@require_POST
def register_view(request):
    form = RegisterForm(request.POST)
    if form.is_valid():
        telephone = form.cleaned_data.get('telephone')
        username = form.cleaned_data.get('username')
        password = form.cleaned_data.get('password1')
        user = User.objects.create_user(telephone=telephone,username=username,password=password)
        login(request,user)
        return restful.success()
    else:
        return restful.paramerror(message=form.get_errors())





def img_captcha(request):
    #第一步 实例化对象 调用
    text,image = Captcha.gene_code()
    #因为 图片不能直接放到  HttpResponse 直接返回

    out = BytesIO() #可以先放到管道中 BytesIO相当于一个管道 存放图片流数据
    image.save(out,'png')#调用image save方法 将图片流数据保存在BytesIO中 指定图片为png


    out.seek(0) #将指针回0
    response = HttpResponse(content_type="image/png") #指定返回内容的类型
    response.write(out.read()) #从管道中读取数据  放到 HttpResponse中
    #这个地方如果 管道指针 不回  0 它会从最后的位置开始往后读  会反回空
    #所以上一步将指针回0
    response['Content-length'] = out.tell() #也就是返回指针的位置

    cache.set(text.lower(),text.lower(),300) #把图形验证码放到缓存中
    return response

def sms_captcha(request):
    # result = demo_sms_send.send_sms('15313921315','666666')
    # print(result)
    #http://127.0.0.1:9000/sms_captcha?telephone=13777777777
    telephone = request.GET.get('telephone') #接收手机号
    code = Captcha.gene_text() #生成随机的字符
    cache.set(telephone, code, 5 * 60) #然后放到了混存中
    print('短信验证码：', code)
    result = demo_sms_send.send_sms(telephone,code)#发送给用户
    return restful.success()
