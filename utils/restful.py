from  django.http import JsonResponse

class HttpCode(object):
    success = 200
    paramerror = 400
    unauth = 401
    methoderror = 405
    servererror = 500

#{"code":400,"message":"",data:"" }

def result(code=HttpCode.success,message="",data=None,kwargs=None):

    json_dict = {"code":code,"message":message,"data":data}
    if kwargs and kwargs.keys():
        json_dict.update(kwargs)

    return JsonResponse(json_dict)

def success():
    return result()
def paramerror(message="",data=None):
    return result(code=HttpCode.paramerror,message=message,data=data)

def unauth(message="",data=None):
    return result(code=HttpCode.unauth,message=message,data=data)

def methoderror(message="",data=None):
    return result(code=HttpCode.methoderror,message=message,data=data)

def servererror(message="",data=None):
    return result(code=HttpCode.servererror,message=message,data=data)
