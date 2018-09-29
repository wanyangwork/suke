from django.db import models
from django.contrib.auth.models import User,AbstractBaseUser,PermissionsMixin,BaseUserManager
from shortuuidfield import ShortUUIDField
# Create your models here.

class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, telephone, username, password, **kwargs):
        if not telephone:
            raise ValueError('請輸入手機號')
        if not username:
            raise ValueError('請輸入用戶名')
        if not username:
            raise ValueError('請輸入密碼')
        user = self.model(username=username, telephone=telephone, **kwargs)
        user.set_password(password)
        user.save()
        return user

    def create_user(self, telephone, username, password, **kwargs):
        kwargs['is_superuser'] = False
        return self._create_user(telephone, username, password, **kwargs)

    def create_superuser(self, telephone, username, password, **kwargs):
        kwargs['is_superuser'] = True
        kwargs['is_staff'] = True
        return self._create_user(telephone, username, password, **kwargs)






class User(AbstractBaseUser,PermissionsMixin):
    #主鍵不選用自增長的id 防止到了101 之後 沒數據
    #選擇uuid  uuid 太長佔據空間  所有選擇 shortuuid
    uid = ShortUUIDField(primary_key=True)
    telephone = models.CharField(max_length=11,unique=True)
    email = models.EmailField(unique=True,null=True)
    username = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    data_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'telephone'
    #雖然下面只有一個username 但是默認會驗證 username telephone password
    REQUIRED_FIELDS = ['username']
    EMAIL_FIELD = 'email'

    objects = UserManager()

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username
