
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var xfzajax = {
    'get': function (args) {
        args['method'] = 'get';
        this.ajax(args);
    },
    'post': function (args) {
        args['method'] = 'post';
        this._ajaxSetup();
        this.ajax(args);
    },
    'ajax': function (args) {
        var success = args['success'];
        args['success'] = function (result) {
            if(result['code'] === 200){
                if(success){
                    success(result);
                }
            }else{
                var messageObject = result['message'];
                if(typeof messageObject == 'string' || messageObject.constructor == String){
                    window.messageBox.showError(messageObject);
                }else{
                    // {"password":['密码最大长度不能超过20为！','xxx'],"telephone":['xx','x']}
                    for(var key in messageObject){
                        var messages = messageObject[key];
                        var message = messages[0];
                        window.messageBox.showError(message);
                    }
                }
                if(success){
                    success(result);
                }
            }
        };
        args['fail'] = function (error) {
            console.log(error);
            window.messageBox.showError('服务器内部错误！');
        };
        $.ajax(args);
    },
    '_ajaxSetup': function () {
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!/^(GET|HEAD|OPTIONS|TRACE)$/.test(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                }
            }
        });
    }
};
// 错误消息提示框

function Message() {
    var self = this;
    self.isAppended = false;
    self.wrapperHeight = 48;
    self.wrapperWidth = 300;
    self.initStyle();
    self.initElement();
    self.listenCloseEvent();
}

Message.prototype.initStyle = function () {
    var self = this;
    self.errorStyle = {
        'wrapper':{
            'background': '#f2dede',
            'color': '#993d3d'
        },
        'close':{
            'color': '#993d3d'
        }
    };
    self.successStyle = {
        'wrapper':{
            'background': '#dff0d8',
            'color': '#468847'
        },
        'close': {
            'color': "#468847"
        }
    };
    self.infoStyle = {
        'wrapper': {
            'background': '#d9edf7',
            'color': '#5bc0de'
        },
        'close': {
            'color': '#5bc0de'
        }
    }
};

Message.prototype.initElement = function () {
    var self = this;
    self.wrapper = $("<div></div>");
    self.wrapper.css({
        'padding': '10px',
        'font-size': '14px',
        'width': '300px',
        'position': 'fixed',
        'z-index': '10000',
        'left': '50%',
        'top': '-48px',
        'margin-left':'-150px',
        'height': '48px',
        'box-sizing': 'border-box',
        'border': '1px solid #ddd',
        'border-radius': '4px',
        'line-height': '24px',
        'font-weight': 700
    });
    self.closeBtn = $("<span>×</span>");
    self.closeBtn.css({
        'font-family': 'core_sans_n45_regular,"Avenir Next","Helvetica Neue",Helvetica,Arial,"PingFang SC","Source Han Sans SC","Hiragino Sans GB","Microsoft YaHei","WenQuanYi MicroHei",sans-serif;',
        'font-weight': '700',
        'float': 'right',
        'cursor': 'pointer',
        'font-size': '22px'
    });

    self.messageSpan = $("<span class='xfz-message-group'></span>");

    self.wrapper.append(self.messageSpan);
    self.wrapper.append(self.closeBtn);
};

Message.prototype.listenCloseEvent = function () {
    var self = this;
    self.closeBtn.click(function () {
        self.wrapper.animate({"top":-self.wrapperHeight});
    });
};

Message.prototype.showError = function (message) {
    this.show(message,'error');
};

Message.prototype.showSuccess = function (message) {
    this.show(message,'success');
};

Message.prototype.showInfo = function (message) {
    this.show(message,'info');
};

Message.prototype.show = function (message,type) {
    var self = this;
    if(!self.isAppended){
        $(document.body).append(self.wrapper);
        self.isAppended = true;
    }
    self.messageSpan.text(message);
    if(type === 'error') {
        self.wrapper.css(self.errorStyle['wrapper']);
        self.closeBtn.css(self.errorStyle['close']);
    }else if(type === 'info'){
        self.wrapper.css(self.infoStyle['wrapper']);
        self.closeBtn.css(self.infoStyle['close']);
    }else{
        self.wrapper.css(self.successStyle['wrapper']);
        self.closeBtn.css(self.successStyle['close']);
    }
    self.wrapper.animate({"top":0},function () {
        setTimeout(function () {
            self.wrapper.animate({"top":-self.wrapperHeight});
        },3000);
    });
};

window.messageBox = new Message();