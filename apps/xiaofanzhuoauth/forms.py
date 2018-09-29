from django import forms
from .models import User
from django.core.cache import cache
from apps.forms import AllForm


class LoginForm(forms.Form,AllForm):
    telephone = forms.CharField(max_length=11)
    password = forms.CharField(max_length=20,min_length=6,error_messages={"max_length":"密碼最多20位","min_length":"密碼最短6位數"})
    remember = forms.IntegerField(required=False)

class RegisterForm(forms.Form,AllForm):
    telephone = forms.CharField(max_length=11)
    username = forms.CharField(max_length=20)
    password1 = forms.CharField(max_length=20,min_length=6,error_messages={"max_length":"密码最常不能超过20","min_length":"密码最短不能少于6位"})
    password2 = forms.CharField(max_length=20,min_length=6,error_messages={"max_length":"密码最常不能超过20","min_length":"密码最短不能少于6位"})
    img_captcha = forms.CharField(max_length=4,min_length=4)

    def clean(self):
        cleaned_data = super(RegisterForm,self).clean()
        password1 = cleaned_data.get("password1")
        password2 = cleaned_data.get("password2")
        if password1 != password2:
            raise forms.ValidationError("两次密码输入不一致")
        telephone = cleaned_data.get("telephone")
        img_captcha = cleaned_data.get("img_captcha")
        cache_img_captcha = cache.get(img_captcha.lower())

        if not cache_img_captcha or cache_img_captcha.lower() != img_captcha.lower():
            raise forms.ValidationError("图形验证码输入错误")

        sms_captcha = cleaned_data.get('sms_captcha')
        cache_sms_captcha = cache.get(telephone)

        if not cache_sms_captcha or cache_sms_captcha.lower() != sms_captcha.lower():
            raise forms.ValidationError("短信验证码输入有误")


        exists = User.objects.filter(telephone=telephone).exists()
        if exists:
            raise forms.ValidationError("该手机号已经存在")
        return cleaned_data