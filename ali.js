const ali = {
    rulePath: 'hiker://files/rules/icy/ali.js',
    urls: {
        settingPath: 'hiker://files/rules/icy/icy-settings-ali.json',
        customerSettingPath: 'hiker://files/rules/icy/icy-ali-customer.json',
        tokenPath: 'hiker://files/rules/icy/icy-ali-token.json',
    
        settingHtmlPath: 'file:///storage/emulated/0/Android/data/com.example.hikerview/files/Documents/rules/icy/icy-settings-ali.html',

        remoteConfig: ['https://gitee.com/fly1397/hiker-icy/raw/master/settings-ali.json', 'https://cdn.jsdelivr.net/gh/fly1397/hiker-icy/settings-ali.json', 'http://lficy.com:30000/mrfly/hiker-icy/raw/master/settings-ali.json'],
    },
    version: '2021112502',
    randomPic: 'https://api.lmrjk.cn/mt', //二次元 http://api.lmrjk.cn/img/api.php 美女 https://api.lmrjk.cn/mt
    // dev 模式优先从本地git获取
    isDev: false,

    // 强制更新config
    forceConfigUpdate: false,
    // 阿里共享账号设置
    usePublicToken: false,
    publicToken: '',
    //开起热搜榜
    useSuggestQuery: true,

    // 颜色
    primaryColor: '#f47983',
    
    formatBytes: function(a, b) { 
        if (0 == a) return "0 B"; 
        var c = 1024, d = b || 2, e = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], f = Math.floor(Math.log(a) / Math.log(c)); 
        return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
    },
    getEmptyTitle: function(_title, desc){
        // 修复部分贴没有标题，提取「分享主题」作为标题
        let title = _title;
        if(!title){
            const maDesc = desc.match(/「(.*)」，/);
            if(maDesc) {
                title = maDesc[1].split('」')[0];
            } else {
                if(desc.includes('，')){
                    title = desc.split(/，/)[0];
                } else {
                    title = desc.split(/\s/)[0];
                }
            }
        }
        const titleDom = '<div class="fortext">' + title || '' + '</div>';
        return parseDomForHtml(titleDom, '.fortext&&Text');
    },
    formatDate: function(_date, _fmt) {
        let fmt = _fmt || "yyyy-MM-dd HH:mm:ss";
        const date = !isNaN(_date) ? new Date(_date*1000) : new Date(_date);
        const o = {
            "M+": date.getMonth() + 1, //月份 
            "d+": date.getDate(), //日 
            "h+": date.getHours()%12 == 0 ? 12 : date.getHours()%12,
            "H+": date.getHours(), //小时 
            "m+": date.getMinutes(), //分 
            "s+": date.getSeconds(), //秒 
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
            "S": date.getMilliseconds() //毫秒 
        };
        if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
        }
        for(let k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt; 
    },
    searchFetch: function(host, url, keyword, page){
        const {fyarea, fyclass, fyyear, fysort} = this.getFilter(true);
        const link = url.replace('**', keyword).replace('fypage', (((page||1) - 1) * 20)).replace('fyarea', fyarea).replace('fyclass', fyclass).replace('fyyear', fyyear).replace('fysort', fysort);
        const headers = {"Referer": link, 'User-Agent': MOBILE_UA,};
        const cookie = this.activeModel().cookie || '';
        if(cookie) {
            headers['cookie'] = cookie;
        }
        return fetch(link, {headers: headers});
    },
    activeModel: function() {
        let model_search = getVar('icy_ali_model');
        this.getConfig();
        const {searchModel} = this;
        return searchModel ? searchModel.find(item => item.val == model_search) || searchModel[0] : null;
    },
    objData: function(obj, path){
        let _obj = obj;
        path.split('&&').forEach(_path => {
            _obj = _obj[_path];
        })
        return _obj;
    },
    strData: function(obj, path){
        let _obj = obj;
        path.split('&&').forEach(_path => {
            _obj = _obj[_path];
        })
        return _obj;
    },
    searchModel: [],
    emptyRule: $("#noLoading#").lazyRule(()=>{return "toast://Emmm~~!"}),
    getConfig: function(){
        const {settingPath, remoteConfig, customerSettingPath} = this.urls;
        const haveSetting = fileExist(settingPath) == 'true' || fileExist(settingPath) == true;
        let json = haveSetting ? fetch(settingPath) : '';
        const firstConfigPath = this.isDev ? remoteConfig[2] : remoteConfig[0];
        if(!json) {
            json = fetch(firstConfigPath);
          if(!json || !json.includes('name')) {
            json = fetch(remoteConfig[1]);
          }
          if(!json || !json.includes('name')) {
            json = fetch(remoteConfig[2]);
          }
        }
        if(!haveSetting && json) {
          writeFile(settingPath, json);
        }
        if(json) {
            this.searchModel = JSON.parse(json).sort((a,b) => a.index - b.index);
            const haveCustomerSetting = fileExist(customerSettingPath) == 'true' || fileExist(customerSettingPath) == true;
            
            this.searchModel = JSON.parse(json).sort((a,b) => a.index - b.index);
            if(haveCustomerSetting) {
                const customerSetting = JSON.parse(fetch(getVar('icy_ali_customer')));
                if(customerSetting.customerResouce) {
                    this.searchModel = JSON.parse(json).map(item => {
                        const customer = customerSetting.customerResouce.find(_customer => _customer.key == item.key);
                        this.mergeObj(customer || {},item);
                        return item;
                    }).sort((a,b) => a.index - b.index);
                }
                this.usePublicToken = customerSetting.usePublicToken;
                this.publicToken = customerSetting.publicToken;
                this.useSuggestQuery = customerSetting.useSuggestQuery;
                this.primaryColor = customerSetting.primaryColor;
            }
        }
    },
    initConfig: function(forceConfigUpdate){
        const {settingPath, remoteConfig, customerSettingPath, settingHtmlPath} = this.urls;
        putVar('icy_ali_customer', customerSettingPath);
        const haveSettingHtml = fileExist(settingHtmlPath) == 'true' || fileExist(settingHtmlPath) == true;
        if(haveSettingHtml) {
            deleteFile(settingHtmlPath);
        }

        const firstConfigPath = this.isDev ? remoteConfig[2] : remoteConfig[0];
        const haveSetting = fileExist(settingPath) == 'true' || fileExist(settingPath) == true;
        let json = haveSetting ? fetch(settingPath) : '';
        if(!json || forceConfigUpdate) {
            json = fetch(firstConfigPath);
          if(!json || !json.includes('name')) {
            json = fetch(remoteConfig[1]);
          }
          if(!json || !json.includes('name')) {
            json = fetch(remoteConfig[2]);
          }
        }
        if(json) {
            writeFile(settingPath, json);            
            this.searchModel = JSON.parse(json).sort((a,b) => a.index - b.index);
        }
        
    },
    mergeObj: function(targt, source){
        Object.keys(targt).forEach(key => {
            source[key] = targt[key];
        })
    },
    update: function(){
        const version = getItem('icy_ali_version');
        if(!version || version != this.version) {
            var js = $.toString(() => {
                eval(fetch("hiker://files/rules/icy/ali.js"));
                ali.initConfig(true);
                setItem("icy_ali_version", ali.version);
                refreshPage();
                confirm({
                    title:"更新成功",
                    content:"最新版本：" + ali.version
                })
            })
            // eval(js)
            confirm({
                title: '版本更新 ',
                content: (version || 'N/A') +'=>'+ this.version + '\n1,增加优聚搜站点\n2,增加个人设置页面，更新规则版本\n3,增加共享阿里账号代码输入\n4,优化阿里账号设置页面',
                confirm: 'eval(fetch("hiker://files/rules/icy/ali.js"));ali.initConfig(true);setItem("icy_ali_version", ali.version);refreshPage();confirm({title:"更新成功",content:"最新版本：" + ali.version})'
            })
        }
    },
    updateRule: function(){
        let ruleCode = "海阔视界规则分享，当前分享的是：小程序￥home_rule_v2￥base64://@云盘汇影@eyJsYXN0X2NoYXB0ZXJfcnVsZSI6IiIsInRpdGxlIjoi5LqR55uY5rGH5b2xIiwiYXV0aG9yIjoiTXJGbHkiLCJ1cmwiOiJoaWtlcjovL2VtcHR5JCQkZnlwYWdlIiwidmVyc2lvbiI6NCwiY29sX3R5cGUiOiJ0ZXh0XzEiLCJjbGFzc19uYW1lIjoiIiwiY2xhc3NfdXJsIjoiIiwiYXJlYV9uYW1lIjoiIiwiYXJlYV91cmwiOiIiLCJzb3J0X25hbWUiOiIiLCJ5ZWFyX25hbWUiOiIiLCJzb3J0X3VybCI6IiIsInllYXJfdXJsIjoiIiwiZmluZF9ydWxlIjoianM6XG5ldmFsKGZldGNoKCdoaWtlcjovL2ZpbGVzL3J1bGVzL2ljeS9hbGkuanMnKSk7XG5hbGkuaG9tZVBhZ2UoKTsiLCJzZWFyY2hfdXJsIjoiaGlrZXI6Ly9lbXB0eSQkJCoqJCQkZnlwYWdlJCQkIiwiZ3JvdXAiOiLikaDmjqjojZAiLCJzZWFyY2hGaW5kIjoianM6XG5ldmFsKGZldGNoKCdoaWtlcjovL2ZpbGVzL3J1bGVzL2ljeS9hbGkuanMnKSk7XG5hbGkuc2VhcmNoUGFnZSh0cnVlKTtcbiIsImRldGFpbF9jb2xfdHlwZSI6Im1vdmllXzEiLCJkZXRhaWxfZmluZF9ydWxlIjoianM6XG5ldmFsKGZldGNoKCdoaWtlcjovL2ZpbGVzL3J1bGVzL2ljeS9hbGkuanMnKSk7XG5hbGkuZGV0YWlsUGFnZSgpOyIsInNkZXRhaWxfY29sX3R5cGUiOiJtb3ZpZV8xIiwic2RldGFpbF9maW5kX3J1bGUiOiIiLCJ1YSI6Im1vYmlsZSIsInByZVJ1bGUiOiIvKlxu6YOo5YiG5Luj56CB5Y+C6ICD5LqGWVlEU++8jOaEn+iwoummmeS9rFxuKi9cbnZhciBhbGlqcyA9IGZldGNoKCdodHRwczovL2dpdGVlLmNvbS9mbHkxMzk3L2hpa2VyLWljeS9yYXcvbWFzdGVyL2FsaS5qcycpO1xuaWYoIWFsaWpzIHx8ICFhbGlqcy5pbmNsdWRlcygnYWxpJykpe1xuXHRhbGlqcyA9IGZldGNoKCdodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvZ2gvZmx5MTM5Ny9oaWtlci1pY3kvYWxpLmpzJylcbn1cbmlmKCFhbGlqcyB8fCAhYWxpanMuaW5jbHVkZXMoJ2FsaScpKXtcblx0YWxpanMgPSBmZXRjaCgnaHR0cDovL2xmaWN5LmNvbTozMDAwMC9tcmZseS9oaWtlci1pY3kvcmF3L21hc3Rlci9hbGkuanMnKVxufVxuaWYoYWxpanMpIHtcblx0d3JpdGVGaWxlKFwiaGlrZXI6Ly9maWxlcy9ydWxlcy9pY3kvYWxpLmpzXCIsYWxpanMpO1xuXHRldmFsKGFsaWpzKTtcblx0YWxpLnByZVJ1bGUoKTtcbn1cbiIsInBhZ2VzIjoiW3tcImNvbF90eXBlXCI6XCJtb3ZpZV8zXCIsXCJuYW1lXCI6XCLnvZHnm5jor6bmg4VcIixcInBhdGhcIjpcImRldGFpbFwiLFwicnVsZVwiOlwianM6XFxuZXZhbChmZXRjaCgnaGlrZXI6Ly9maWxlcy9ydWxlcy9pY3kvYWxpLmpzJykpO1xcbmFsaS5hbGlSdWxlKCk7XCJ9LHtcImNvbF90eXBlXCI6XCJtb3ZpZV8xX2xlZnRfcGljXCIsXCJuYW1lXCI6XCLotYTmupDnvZHpobXor6bmg4VcIixcInBhdGhcIjpcInNpdGUtZGV0YWlsXCIsXCJydWxlXCI6XCJqczpcXG5ldmFsKGZldGNoKCdoaWtlcjovL2ZpbGVzL3J1bGVzL2ljeS9hbGkuanMnKSk7XFxuYWxpLmRldGFpbFBhZ2UoKTtcIn1dIiwiaWNvbiI6Imh0dHBzOi8vZ2l0ZWUuY29tL2ZseTEzOTcvaGlrZXItaWN5L3Jhdy9tYXN0ZXIvYWxpeXVuLnBuZyJ9";
        let importUrl = "rule://" + base64Encode(ruleCode);
        return importUrl;
    },
    getRefreshToken: function() {
        const {tokenPath} = this.urls;
        const haveToken = fileExist(tokenPath) == 'true' || fileExist(tokenPath) == true;
        setPageTitle('阿里云盘');
        let d = [];
        let url = 'https://www.aliyundrive.com/sign/in';
        if(!getItem('haveShared', '') && !haveToken) {
            url = 'https://www.aliyundrive.com/s/BFiLLN5Uu58';
            setItem('haveShared', '1')
        }
        var js = $.toString(()=> {
            var click = false;
            var isShare = location.href.startsWith('https://www.aliyundrive.com/s/');
            var token_timer= function(){
                setTimeout(()=>{
                    try{
                        if(!click && isShare){
                            var btn = document.querySelector('.btn--2uN28');
                            if(btn) {
                                btn.click(); 
                            }
                            click=true;
                        }
                    } catch(e){};
                    var saved = false;
                    var savetext = document.querySelector('.title--lRzap');
                    if(savetext) {
                        saved = savetext.innerText=='转存成功';
                    } 
                    var token=JSON.parse(localStorage.getItem('token'));
                    if(
                        token && 
                        (
                            (saved && isShare) ||
                            (!isShare)
                        )
                    ){
                        fy_bridge_app.writeFile('hiker://files/rules/icy/icy-ali-token.json',JSON.stringify({
                            access_token:token.access_token,
                            refresh_token:token.refresh_token,
                            nick_name: token.nick_name,
                            avatar: token.avatar,
                        }));
                        if(isShare) {
                            location.href = 'https://www.aliyundrive.com/drive#token';
                        }
                        if(!location.href.includes('#token')) {
                            alert('TOKEN获取成功，感谢支持！请勿泄漏个人隐私!退出该页面后刷新重试！');
                        }
                    }else{
                        token_timer();
                    }},500)
            };
            token_timer();

        })
        d.push({
            url: url,
            col_type: 'x5_webview_single',
            desc: '100%&&float',
            extra: {
                canBack: true,
                js: "var click=false;var isShare=location.href.startsWith('https://www.aliyundrive.com/s/');var token_timer=function(){setTimeout(()=>{try{if(!click&&isShare){var btn=document.querySelector('.btn--2uN28');if(btn){btn.click()}click=true}}catch(e){};var saved=false;var savetext=document.querySelector('.title--lRzap');if(savetext){saved=savetext.innerText=='转存成功'}var token=JSON.parse(localStorage.getItem('token'));if(token&&((saved&&isShare)||(!isShare))){fy_bridge_app.writeFile('hiker://files/rules/icy/icy-ali-token.json',JSON.stringify({access_token:token.access_token,refresh_token:token.refresh_token,nick_name:token.nick_name,avatar:token.avatar,}));if(isShare){location.href='https://www.aliyundrive.com/drive#token'}if(!location.href.includes('#token')){alert('TOKEN获取成功，感谢支持！请勿泄漏个人隐私!退出该页面后刷新重试！')}}else{token_timer()}},500)};token_timer();"
            }
        })
        setHomeResult({
            data: d
        })
    },
    getAliToken: function(needRefresh) {
        this.getConfig();
        if(this.usePublicToken && this.publicToken) {
            try {
                eval('function tokenFunction(){\n'+this.publicToken+'\n};');
                return tokenFunction().replace('Bearer ', '');
            } catch(e){
                return 'toast://共享TOKEN代码运行失败了'
            }
        }
        const {tokenPath} = this.urls;
        const haveToken = fileExist(tokenPath) == 'true' || fileExist(tokenPath) == true;
        
        if(haveToken) {
            let token = JSON.parse(fetch(tokenPath));
            if(!!needRefresh) {
                const tokenRes = JSON.parse(fetch('https://api.aliyundrive.com/token/refresh', {
                    headers: {
                        "Content-Type": "application/json",
                        "User-Agent": MOBILE_UA,
                    },
                    method: 'POST',
                    body: '{"refresh_token":"'+token.refresh_token+'"}',
                }));
                var access_token = tokenRes.access_token;
                var refresh_token = tokenRes.refresh_token;
                putVar("access_token", access_token);
                writeFile(tokenPath,JSON.stringify({access_token: access_token, refresh_token: refresh_token}));
                return access_token;
            } else {
                putVar("access_token", token.access_token);
                return token.access_token || token.token;
            }
        } else {
            // log('get Token')
            let d = []
            setPageTitle('账号设置')
            d.push({
                title: '还没有设置阿里云盘账号信息',
                desc: '阿里云盘在线观看需要设置登录信息，\n您可以选择登录/注册账号，或者他人共享的账号！',
                url: this.emptyRule,
                col_type: 'text_1'
            })
            d.push({
                col_type: "line_blank"
            });
            d.push({
                title: '登录/注册阿里云盘',
                desc: '后面会加入个人云盘文件功能，\n注册账号转存文件，开发者需要你的支持！',
                url: $('hiker://empty').rule(() => {
                    eval(fetch('hiker://files/rules/icy/ali.js'));
                    ali.getRefreshToken();
                }),
                col_type: 'text_1'
            })
            d.push({
                col_type: "line_blank"
            });
            d.push({
                title: '去启用共享账号',
                desc: '随时可以在设置页面启用或关闭共享账号',
                url: $('hiker://empty').rule(() => {
                    eval(fetch('hiker://files/rules/icy/ali.js'));
                    ali.settingPage();
                }),
                col_type: 'text_1'
            })
            setResult({data: d})

        }

    },
    preRule: function(){
        this.initConfig(this.forceConfigUpdate);
        this.getConfig();
        this.update();
        const activeModel = this.activeModel();
        if(!getVar('icy_ali_model') && activeModel) {
            const {areas, cats, years, sorts, val} = activeModel;
            putVar('icy_ali_model', val || '');
            if(areas) {
                const _areas = areas.filter(item => item.withType != -1);
                putVar('icy_ali_area', _areas[0] ? _areas[0].val : '');
            }
            if(cats) {
                const _cats = cats.filter(item => item.withType != -1);
                putVar('icy_ali_cat', _cats[0] ? _cats[0].val : '');
            }
            if(years) {
                const _years = years.filter(item => item.withType != -1);
                putVar('icy_ali_year', _years[0] ? _years[0].val : '');
            }
            if(sorts) {
                const _sorts = sorts.filter(item => item.withType != -1);
                putVar('icy_ali_sort' , _sorts[0] ? _sorts[0].val : '')
            }
            putVar("icy_ali_search", '');
        };
    },
    login: function (key){
        const { customerSettingPath} = this.urls;
        let activeModel = this.activeModel();
        const haveCustomerSetting = fileExist(customerSettingPath) == 'true' || fileExist(customerSettingPath) == true;
        if(haveCustomerSetting) {
            const customerSetting = JSON.parse(fetch(getVar('icy_ali_customer')));
            if(customerSetting.customerResouce) {
                activeModel = customerSetting.customerResouce.find(item => item.key == activeModel.key) || activeModel;
            }
        } else {
            this.getConfig();
        }

        const {username, password, val} = activeModel;
        var host = val;
        if(!username || !password) {
            confirm({
                title: '请设置用户名密码',
                content: '输入对应的账号和密码！',
            });
            return false;
        }
        const pageResult = JSON.parse(fetch(host, {
            headers: {'User-Agent': MOBILE_UA,},
            withHeaders: true
        }));
        const cookie = pageResult.headers['set-cookie'].join(';');
        const _token = pageResult.headers['x-csrf-token'].join(';');
        const token = pageResult.body.match(/csrfToken":"([\w|\d]*)"/);
        if(!token || !token[1] || !cookie) {
            return false;
        }
        const login = JSON.parse(fetch(host + '/login', {
            headers: {
                "Content-Type": "application/json",
                "User-Agent": MOBILE_UA,
                "cookie": cookie,
                "X-CSRF-Token": token[1],
            },
            method: 'POST',
            body: '{"identification": "'+username+'","password": "'+password+'","remember":true}',
            withHeaders: true
        }));
        if(JSON.parse(login.body).errors) {
            confirm({
                title: '登录失败',
                content: '需要配置正确的账号和密码！',
            });
            activeModel.loginError = true;
        } else if(login.headers['set-cookie'] && login.headers['set-cookie'].length) {
            activeModel.loginError = false;
            activeModel.cookie = login.headers['set-cookie'].join(';');
        }
            
        
        writeFile(customerSettingPath, JSON.stringify(customerSetting));
    },
    settingPage: function(key){
        addListener('onClose', $.toString((params) => {
            params.forEach(item => {
                clearVar(item)
            })
        }, ["select_index", "login", "publicToken"]))
        const {settingPath, customerSettingPath} = this.urls;
        var d = [];
        setPageTitle('设置');
        const haveCustomerSetting = fileExist(customerSettingPath) == 'true' || fileExist(customerSettingPath) == true;
        let customerSettings = null;
        if(!haveCustomerSetting || (haveCustomerSetting && !JSON.parse(fetch(customerSettingPath)).customerResouce)) {
            const customer = [];
            const settings = JSON.parse(fetch(settingPath)).sort((a,b) => a.index - b.index);
            settings.forEach(item => {
                const config = {
                    name: item.name,
                    key: item.key,
                    index: item.index,
                }
                if(item.needKey) {
                    config.val = item.val;
                    config.needKey = item.needKey;
                    config.username = item.username;
                    config.password = item.password;
                    config.cookie = item.cookie;
                }
                customer.push(config)
            })
            customerSettings = {customerResouce:customer, usePublicToken: false, publicToken: '', useSuggestQuery: true, primaryColor: '#f47983'};
            writeFile(getVar('icy_ali_customer'), JSON.stringify(customerSettings));
        }

        customerSettings = JSON.parse(fetch(getVar('icy_ali_customer')));

        let primaryColor = customerSettings.primaryColor;
        const customerResouce = customerSettings.customerResouce.sort((a,b) => a.index - b.index)
        const loginList = customerResouce.filter(item => item.needKey).map(item => item.name);
        const selectLoginName = customerResouce.find(item => item.key == key) ? customerResouce.find(item => item.key == key).name : getVar("login", '');
        const selectLogin = customerResouce.filter(item => item.needKey).find(item => item.name == selectLoginName);
        d.push({
            title: '💘 排序',
            desc: '先点一个资源站，再点另外一个，会与目标对换位置',
            url: this.emptyRule,
            col_type: 'text_1'
        })
        const selectIndex = getVar('select_index', '');
        customerResouce.forEach(item => {
            var title = String(item.index) === selectIndex ? "““””<b>"+'<span style="color: '+primaryColor+'">'+item.name+'</span></b>' : item.name;
            d.push({
                title: title,
                url: $("#noLoading#").lazyRule((key, index, _customerSettings)=>{
                    const customerSettings = JSON.parse(JSON.stringify(_customerSettings));
                    var selectIndex = getVar('select_index', '');
                    if(!selectIndex) {
                        putVar('select_index', String(index));
                        refreshPage(false);
                        return "hiker://empty"
                    }
                    let source = null;
                    let source_index = null;
                    let target = customerSettings.customerResouce.find(item => item.key == key);
                    let targetIndex = JSON.parse(JSON.stringify(target)).index;
                    if(selectIndex && selectIndex != index) {
                        source = customerSettings.customerResouce.find(item => item.index == selectIndex);
                        source_index = JSON.parse(JSON.stringify(source)).index;
                        target.index = source_index;
                        source.index = targetIndex;
                    }
                    writeFile(getVar('icy_ali_customer'), JSON.stringify(customerSettings));
                    putVar('select_index', '');
                    refreshPage(false);
                    return selectIndex != index ? 'toast://保存成功' : "hiker://empty";
                }, item.key, item.index, customerSettings),
                col_type: 'text_3'
            })
        })
        d.push({
            col_type: "line_blank"
        });
        d.push({
            title: '🔍 海阔搜索设置 hiker://search',
            desc: '默认为当前资源网站, 可以多选',
            url: 'hiker://search',
            col_type: 'text_1'
        })
        const activeModel = this.activeModel();
        customerResouce.forEach(item => {
            var title = (!!item.forHikerSearch) ? "““””<b>"+'<span style="color: '+ primaryColor +'">'+item.name+'</span></b>' : item.name;
            d.push({
                title: title,
                url: $("#noLoading#").lazyRule((key, _customerSettings, activeModelKey)=>{
                    const customerSettings = JSON.parse(JSON.stringify(_customerSettings));
                    // if(key == activeModelKey && customerSettings.customerResouce.filter(item => item.forHikerSearch).length < 2) {
                    //     return 'toast://这个是当前资源站，不能排除哦！';
                    // }
                    let target = customerSettings.customerResouce.find(item => item.key == key);
                    if(target) {
                        target.forHikerSearch = !target.forHikerSearch;
                    }
                    writeFile(getVar('icy_ali_customer'), JSON.stringify(customerSettings));
                    refreshPage(false);
                    return 'toast://保存成功';
                }, item.key, customerSettings, activeModel.key),
                col_type: 'text_3'
            })
        })
        d.push({
            col_type: "line_blank"
        });
        const loginlazy = $(loginList, 2)
            .select(() => {
                putVar("login",input);
                refreshPage(false);
        });
        d.push({
            title: '🔓 资源网站登录设置',
            desc: selectLoginName || '请选择资源网站',
            url: loginlazy,
            col_type: 'text_1'
        })
        if(selectLogin) {
            d.push({
                title: "用户名",
                desc: "请输入用户名",
                col_type: 'input',
                extra: {
                    titleVisible: false,
                    defaultValue: selectLogin.username,
                    type: '',
                    onChange: 'putVar("' + selectLogin.key + '_username", input)'
                }
            })
            d.push({
                title: "密码",
                desc: "请输入密码",
                col_type: 'input',
                extra: {
                    titleVisible: false,
                    defaultValue: selectLogin.password,
                    type: '',
                    onChange: 'putVar("' + selectLogin.key + '_password", input)'
                }
            })
            d.push({
                title: '保存',
                col_type: 'text_center_1',
                url: $()
                    .lazyRule((key, customerSettings) => {
                    const item = customerSettings.customerResouce.find(item => item.key == key);
                    item.username = getVar(key + '_username','');
                    item.password = getVar(key + '_password','');
                    writeFile(getVar('icy_ali_customer'), JSON.stringify(customerSettings));
                    return 'toast://保存成功'
                }, selectLogin.key, customerSettings)
            })
            d.push({
                col_type: "blank_block"
            });
            d.push({
                title: '““””<small><span style="color:#4395FF;">资源站账号注册 >></span></small>',
                url: 'web://' + selectLogin.val,
                col_type: 'text_center_1'
            })
        }
        d.push({
            col_type: "line_blank"
        });
        d.push({
            title: '““””🔥 热门搜索词  <b><span style="color: '+ primaryColor +'">' + (customerSettings.useSuggestQuery ? '启用' : '不启用') + '</span></b>',
            desc: '数据来源：360影视',
            url: $("#noLoading#").lazyRule((useSuggestQuery, customerSettings)=>{
                customerSettings.useSuggestQuery = !useSuggestQuery;
                writeFile(getVar('icy_ali_customer'), JSON.stringify(customerSettings));
                refreshPage(false);
                return 'toast://'+ (customerSettings.useSuggestQuery ? '启用' : '关闭') +'热门搜索词成功';
            }, customerSettings.useSuggestQuery, customerSettings),
            col_type: 'text_1'
        })
        d.push({
            title: '““””' + '🎨 自定义主要颜色, 当前颜色 <b><span style="color:' + primaryColor+ '">'+primaryColor+'</span></b>',
            col_type: 'text_1',
            url: $(primaryColor, '别忘了#')
                .input(() => {
                if(!!input && !/^#[\w|\d]{6}$/i.test(input)) {
                    return "toast://颜色代码不对哦";
                }
                let customerSettings = JSON.parse(fetch(getVar('icy_ali_customer')));
                customerSettings.primaryColor = input || '#f47983';
                writeFile(getVar('icy_ali_customer'), JSON.stringify(customerSettings));
                refreshPage();
                return "toast://保存成功";
            })
        })
        d.push({
            title: '♻️ 重新导入最新规则',
            desc: '部分修改可能会涉及规则更改，保持最新规则吧！',
            col_type: 'text_1',
            url: this.updateRule(),
        })
        
        d.push({
            col_type: "line_blank"
        });
        d.push({
            title: '““””😬 阿里云盘共享账号  <b><span style="color: '+ primaryColor +'">' + (customerSettings.usePublicToken ? '启用' : '不启用') + '</span></b>',
            desc: '最好用自己的账号哦',
            url: $("#noLoading#").lazyRule((usePublicToken, customerSettings)=>{
                customerSettings.usePublicToken = !usePublicToken;
                writeFile(getVar('icy_ali_customer'), JSON.stringify(customerSettings));
                refreshPage(false);
                return 'toast://'+ (customerSettings.usePublicToken ? '启用' : '关闭') +'共享账号成功';
            }, customerSettings.usePublicToken, customerSettings),
            col_type: 'text_1'
        })
        if(customerSettings.usePublicToken) {
            d.push({
                title: "共享代码",
                desc: "请输入js代码，需要return <access_token>",
                col_type: 'input',
                extra: {
                    titleVisible: false,
                    defaultValue: customerSettings.publicToken,
                    type: 'textarea',
                    height: -1,
                    onChange: 'putVar("publicToken", input)'
                }
            })
            d.push({
                title: '保存',
                col_type: 'text_center_1',
                url: $()
                    .lazyRule((customerSettings) => {
                    customerSettings.publicToken = getVar('publicToken','');
                    writeFile(getVar('icy_ali_customer'), JSON.stringify(customerSettings));
                    return 'toast://保存成功'
                }, customerSettings)
            })
        }
        d.push({
            col_type: "line_blank"
        });
        d.push({
            title: '☢️ 恢复默认设置',
            desc: '清楚所有用户设置，包括用户名密码等',
            url: $("确定要恢复？")
                .confirm(() => {
                deleteFile(getVar('icy_ali_customer'));
                refreshPage();
                return "toast://已恢复默认设置";
            }),
            col_type: 'text_1'
        })
        setResult(d);
    },
    homePage: function() {
        var d = [];
        var page = Number(MY_URL.split('$$$')[1]);
        const {cats, sorts, val, name, key, dataType} = this.activeModel();
        if(page == 1) {
            if (getItem("ali-accept", "") == "") {
                setItem("ali-accept", "1");
                confirm({
                    title: '温馨提示',
                    content: '以上数据来源于网络\n如喜欢，请支持官方\n\n此规则仅限学习交流使用\n请于导入后24小时内删除!\n\n任何组织或个人不得以任何方式方法\n传播此规则的整体或部分！!\n\n感谢大佬们提供的技术支持!!!',
                    confirm: '',
                    cancel: ''
                })
            }
            d.push({
                title: '<b><span style="color: '+ this.primaryColor +';">云盘汇影</span></b>&nbsp;&nbsp;&nbsp;<small>👉👉<span style="color:#999999;">个人设置</span>👈👈</small>',
                img: 'http://lficy.com:30000/mrfly/hiker-icy/raw/master/aliyun.png',
                col_type: 'avatar',
                url: $('hiker://empty').rule(() => {
                    eval(fetch('hiker://files/rules/icy/ali.js'));
                    ali.settingPage();
                }),
            })
            d.push({
                url: $.toString(()=> {
                    if(input.trim()) {
                        putVar("icy_ali_search",input);
                        var link = 'hiker://empty$$$' + input + '$$$fypage$$$';
                        return $(link).rule(()=> {
                            eval(fetch('hiker://files/rules/icy/ali.js'));
                            ali.searchPage();
                        })
                    } else {
                        return 'toast://请输入影片名称，或者网盘链接';
                    }
                }),
                title: '搜索',
                col_type: "input"
            });
            this.rendererFilterList(d);
        }

        if(key == 'rjiang') {
            this.homeDataR(d);
        } else if(dataType == 'html') {
            this.homeDataHTML(d);
        } else if(dataType == 'json') {
            this.homeDataJSON(d);
        } else {
            this.homeData(d);
        }


        d.push({
            col_type: "blank_block"
        });
        setResult(d);
    },
    getFilter: function(isSearchPage){
        const suffix = isSearchPage ? '_search' : '';
        return {
            fyarea: getVar('icy_ali_area'+suffix),
            fyclass: getVar('icy_ali_cat'+suffix),
            fyyear: getVar('icy_ali_year'+suffix),
            fysort: getVar('icy_ali_sort'+suffix),
        }
    },
    rendererFilterList: function(d, isSearchPage){
        const {searchModel} = this;
        const activeModel = this.activeModel();
        const withoutType = isSearchPage ? 1 : -1;
        const suffix = isSearchPage ? '_search' : '';
        const {areas, cats, years, sorts} = activeModel;
        if(this.useSuggestQuery) {
            this.rendererSuggest(d, isSearchPage);
        }
        if(!isSearchPage) {
            // home page
            this.rendererFilter(d, searchModel, 'icy_ali_model', () => {
                // callback
                eval(fetch('hiker://files/rules/icy/ali.js'));
                const {areas, cats, years, sorts} = ali.activeModel();
                if(areas) {
                    const _areas = areas.filter(item => item.withType != -1);
                    putVar('icy_ali_area', _areas[0] ? _areas[0].val : '');
                }
                if(cats) {
                    const _cats = cats.filter(item => item.withType != -1);
                    putVar('icy_ali_cat', _cats[0] ? _cats[0].val : '');
                }
                if(years) {
                    const _years = years.filter(item => item.withType != -1);
                    putVar('icy_ali_year', _years[0] ? _years[0].val : '');
                }
                if(sorts) {
                    const _sorts = sorts.filter(item => item.withType != -1);
                    putVar('icy_ali_sort' , _sorts[0] ? _sorts[0].val : '')
                }
            });
        } else {
            // search page
            this.rendererFilter(d, searchModel, 'icy_ali_model', () => {
                // callback
                eval(fetch('hiker://files/rules/icy/ali.js'));
                const {areas, cats, years, sorts} = ali.activeModel();
                if(areas) {
                    const _areas = areas.filter(item => item.withType != 1);
                    putVar('icy_ali_area_search', _areas[0] ? _areas[0].val : '');
                }
                if(cats) {
                    const _cats = cats.filter(item => item.withType != 1);
                    putVar('icy_ali_cat_search', _cats[0] ? _cats[0].val : '');
                }
                if(years) {
                    const _years = years.filter(item => item.withType != 1);
                    putVar('icy_ali_year_search', _years[0] ? _years[0].val : '');
                }
                if(sorts) {
                    const _sorts = sorts.filter(item => item.withType != 1);
                    putVar('icy_ali_sort_search' , _sorts[0] ? _sorts[0].val : '')
                }
            });
        }
        if(areas) {
            const _areas = areas.filter(item => item.withType != withoutType);
            this.rendererFilter(d, _areas, 'icy_ali_area'+ suffix);
        }
        if(cats) {
            const _cats = cats.filter(item => item.withType != withoutType) || [];
            this.rendererFilter(d, _cats, 'icy_ali_cat'+ suffix, () => {
                putVar('icy_ali_subcat' , '');
            });
            const activeCat = getVar('icy_ali_cat'+ suffix) || '';
            const cat = _cats.find(item => item.val === activeCat);
            if(cat && cat.sub && cat.sub.length) {
                this.rendererFilter(d, cat.sub, 'icy_ali_subcat'+ suffix);
            }
        }
        if(years) {
            const _years = years.filter(item => item.withType != withoutType);
            this.rendererFilter(d, _years, 'icy_ali_year'+ suffix);
        }
        if(sorts) {
            const _sorts = sorts.filter(item => item.withType != withoutType);
            this.rendererFilter(d, _sorts, 'icy_ali_sort'+ suffix);
        }

        d.push({
            col_type: "line_blank"
        });
    },
    rendererFilter: function(d, data, key, cb){
        if(!data || !data.length || data.length == 1) {
            return false;
        }
        data.forEach(item => {
            var title = item.val == getVar(key) ? "““””<b>"+'<span style="color: '+ this.primaryColor +'">⭐ '+item.name+'</span></b>' : item.name;
            d.push({
                title: title,
                url: $("#noLoading#").lazyRule((key, val, cb)=>{
                    putVar(key,val);
                    if(cb) {
                        cb();
                    }
                    refreshPage(false);
                    return "hiker://empty"
                }, key, item.val, cb),
                col_type:'scroll_button'
            })
        })
        d.push({
            col_type: "blank_block"
        });
    },
    rendererSuggest: function(d, atSearchPage) {
        try {
            const {data} = JSON.parse(fetch('https://api.web.360kan.com/v1/query/addef?ver=2&fmt=json'));
            d.push({
                title: '大家都在搜：',
                url: this.emptyRule,
                col_type: 'scroll_button'
            });
            data.forEach(item => {
                if(atSearchPage) {
                    d.push({
                        title: item.title,
                        url: $("#noLoading#").lazyRule((item)=>{
                            putVar("icy_ali_search",item);
                            refreshPage(false);
                            return "hiker://empty"
                        }, item.title),
                        col_type: 'scroll_button'
                    });
                } else {
                    d.push({
                        title: item.title,
                        url: $("#noLoading#").lazyRule((item)=>{
                            putVar("icy_ali_search",item);
                            var link = 'hiker://empty$$$' + item + '$$$fypage$$$';
                            return $(link).rule(()=> {
                                eval(fetch('hiker://files/rules/icy/ali.js'));
                                ali.searchPage();
                            })
                        }, item.title),
                        col_type: 'scroll_button'
                    });
                }
            })
            d.push({
                col_type: "blank_block"
            });
          } catch (e) {}
    },
    homeData: function(d) {
        const activeModel = this.activeModel();
        const {val, cats, key, cookie, username, password, loginError, filterTags} = activeModel;

        var cat = getVar('icy_ali_cat') || cats[0].val;
        var subcat = getVar('icy_ali_subcat') || '';
        var sort = getVar('icy_ali_sort') || '';
        var page = Number(MY_URL.split('$$$')[1]);
        var url = val + '/api/discussions?include=user%2ClastPostedUser%2Ctags%2CfirstPost%2CfirstPost%2ClastPost&filter%5Btag%5D='+(subcat || cat)+'&sort='+sort+'&page%5Boffset%5D=' + (page - 1) * 20;
        const headers = {"Referer": url, 'User-Agent': MOBILE_UA,};
        const _cookie = cookie || '';
        if(_cookie) {
            headers['cookie'] = _cookie
        }
        const res = fetch(url, {headers: headers});
        if(res.includes('complete a CAPTCHA')) {
            d.push({
                title: '<div style="height: 100vh; display:flex; align-items: center;justify-content: center;"><a href="web://'+url+'">需要<b><span style="color: '+ this.primaryColor +'">验证码</span></b>才能继续</a></div>',
                url: url + "@lazyRule=.js:'x5WebView://"+url+"'",
                col_type: 'rich_text'
            })
        }
        if(page == 1 && res.includes('l2sp')) {
            if(username && password && !loginError) {
                d.push({
                    title: '““””需要登录才能查看链接<b><span style="color: '+ this.primaryColor +'">🔑 点击登录</span></b>',
                    url: $("hiker://empty").lazyRule((key)=>{
                        eval(fetch('hiker://files/rules/icy/ali.js'));
                        ali.login(key);
                        refreshPage(false);
                        
                        return 'hiker://empty';
                    }, key),
                    col_type: 'text_1'
                })
            } else {
                let loginTitle = loginError ? '用户名密码错误' : '需要登录才能查看链接';
                d.push({
                    title: '““””'+loginTitle+'<b><span style="color: '+ this.primaryColor +'">🔒 点击配置用户名密码</span></b>',
                    url: $("hiker://empty").rule((key)=>{
                        eval(fetch('hiker://files/rules/icy/ali.js'));
                        ali.settingPage(key);
                    }, key),

                    col_type: 'text_1'
                })
            }
        }
        var result = {
            data: [],
            included: []
        };
        try {
            if(res) {

                result = JSON.parse(res);
                const {data, included, links} = result;
                const host = links.first.match(/https:\/\/(\w+\.?)+/)[0];
                let _data = data;
                if(filterTags && data) {
                    _data = data.filter(item => !!item.relationships.tags.data.filter(_item => filterTags.includes(Number(_item.id))).length);
                }
                this.itemData(activeModel, false, data, included, host, d, page);
            } else {
                d.push({
                    title: '页面失联了💔',
                    col_type: "text_1"
                });
            }
        } catch (e) {
            d.push({
                title: 'home page error: ' + JSON.stringify(e),
                col_type: "long_text"
            });
        }
    },
    itemData: function(activeModel, fromHikerSearch, data, included, host, d, page, keyword){
        const {name} = activeModel;
        if(data && data.length) {
            data.forEach((dataitem) => {
                const {attributes, relationships} = dataitem;
                let postid = '';
                if(relationships.firstPost) {
                    postid = relationships.firstPost.data.id;
                } else if(relationships.lastPost) {
                    postid = relationships.lastPost.data.id;
                } else if(relationships.post) {
                    postid = relationships.post.data.id;
                } else if(relationships.posts) {
                    postid = relationships.posts.data[0].id;
                }
                const post = included.find(_post => _post.id == postid && _post.type == 'posts');
                const {attributes: {contentHtml}} = post;
                const contentDome = '<div class="fortext">' + contentHtml || '' + '</div>';
                const pic = parseDomForHtml(contentDome, '.fortext&&img&&src') || '';
                const descStr = parseDomForHtml(contentDome, '.fortext&&Text');
                const comment = (!fromHikerSearch && attributes.commentCount > 1) ? '  <small><span style="color: #999999">💬 ' + (attributes.commentCount - 1) + '</span></small>' : '';
                d.push({
                    title: fromHikerSearch ? this.getEmptyTitle(attributes.title, descStr) : '““””' + this.getEmptyTitle(attributes.title, descStr) + comment,
                    pic_url: pic,
                    content: descStr,
                    desc: fromHikerSearch ? name : descStr,
                    url: $('hiker://empty' + postid).rule((dataitem, post, host) => {
                        var d = [];
                        eval(fetch('hiker://files/rules/icy/ali.js'));
                        ali.detailData(dataitem, post, host, d);
                        setHomeResult({
                            data: d
                        })
                    }, dataitem, post, host),
                    col_type: pic ? "movie_1_left_pic" : 'text_1'
                })
            });
        } else if(page == 1){
            this.rendererEmpty(d, keyword, fromHikerSearch);
        }
    },
    rendererEmpty: function(d, keyword, fromHikerSearch) {
        if(keyword) {
            if(!fromHikerSearch) {
                d.push({
                    title: '““””😞 暂时没有搜索到<b><span style="color: '+ this.primaryColor +'">'+ keyword+'</span></b>有关资源',
                    url: this.emptyRule,
                    col_type: 'text_1'
                })
                d.push({
                    title: '““””<small>✔️ <span style="color: #999999">请尽量搜索影片全称，如果没有找到你想要的结果，可以尝试更改关键词搜索！</span></small>',
                    url: this.emptyRule,
                    col_type: 'text_1'
                }) 
                d.push({
                    col_type: "line_blank"
                });
            }
        } else {
            d.push({
                title: '““””😞 没有找到数据，试试其他分类吧！',
                url: this.emptyRule,
                col_type: 'text_1'
            })
        }
    },
    searchPage: function(fromHikerSearch){
        var res = {};
        var d = [];
        const [, _keyword, _page] = MY_URL.split('$$$');
        if(fromHikerSearch) {
            putVar('icy_ali_search', _keyword);
        }
        this.getConfig();
        const activeModel = this.activeModel();

        let keyword = getVar('icy_ali_search') || _keyword || '';
        var _links = keyword.match(/https:\/\/(www\.aliyundrive\.com\/s|alywp\.net)\/\w*/g) || [];
        if(_links.length) {
            // 如果直接是链接
            setPageTitle('网盘链接');
            _links.forEach((link, index) => {
                d.push({
                    title: '🔗 ' + (_links.length > 1 ? '链接'+(index+1)+'：' : '')  + link,
                    url: 'hiker://page/detail?url=' + link + '$$fypage',
                    col_type: "text_1"
                });
            })
        } else {

            setPageTitle(keyword + '的搜索结果');
            let page = _page;
            if(page == 1 && !fromHikerSearch) {
                d.push({
                    url: $.toString(()=>{
                        if(input.trim()) {
                            putVar("icy_ali_search", input);
                            refreshPage(false);
                        } else {
                            return 'toast://请输入影片名称，或网盘链接';
                        }
                    }),
                    title: '搜索',
                    col_type: "input",
                    extra: {
                        defaultValue: keyword
                    }
                });
                
                this.rendererFilterList(d, true);
                
            }
            const search = (activeModel,fromHikerSearch,keyword, page, d ) => {
                try {
                    const {username, password, loginError, key, dataType, filterTags, name} = activeModel;
                    if(dataType == 'html') {
                        this.searchHTML(activeModel, fromHikerSearch, keyword, page, d);
                    } else if(dataType == 'json') {
                        this.searchJSON(activeModel, fromHikerSearch, keyword, page, d)
                    } else if(key == 'rjiang') {
                        this.searchR(activeModel, fromHikerSearch ,keyword, page, d);
                    } else {
                        const searchResult = this.searchFetch(activeModel.val, activeModel.searchUrl,keyword, page);
                        if(page == 1 && searchResult.includes('l2sp')) {
                            if(username && password && !loginError) {
                                d.push({
                                    title: !fromHikerSearch ? '““””需要登录才能查看链接<b><span style="color: '+ this.primaryColor +'">🔑 点击登录</span></b>' : '需要登录才能查看链接 🔑 点击登录',
                                    url: $("hiker://empty").lazyRule((key)=>{
                                        eval(fetch('hiker://files/rules/icy/ali.js'));
                                        ali.login(key);
                                        refreshPage(false);
                                        
                                        return 'hiker://empty';
                                    }, key),
                                    col_type: 'text_1'
                                })
                            } else {
                                let loginTitle = loginError ? '用户名密码错误' : '需要登录才能查看链接';
                                d.push({
                                    title: !fromHikerSearch ? '““””'+loginTitle+'<b><span style="color: '+ this.primaryColor +'">🔒 点击配置用户名密码</span></b>' : loginTitle + '🔒 点击配置用户名密码',
                                    url: $("hiker://empty").rule((key)=>{
                                        eval(fetch('hiker://files/rules/icy/ali.js'));
                                        ali.settingPage(key);
                                    }, key),
                
                                    col_type: 'text_1'
                                })
                            }
                        }
                        if(searchResult.includes('complete a CAPTCHA')) {
                            const link = activeModel.searchUrl.replace('**', keyword).replace('fypage', (((page||1) - 1) * 20)).replace('fysort', getVar('icy_ali_sort_search'));
                            d.push({
                                title: '<div style="height: 100vh; display:flex; align-items: center;justify-content: center;"><a href="web://'+link+'">需要<b><span style="color: '+ this.primaryColor +'">验证码</span></b>才能继续</a></div>',
                                url: link + "@lazyRule=.js:'x5WebView://"+link+"'",
                                col_type: 'rich_text'
                            })
                        } else {
                            const {data, included, links} = JSON.parse(searchResult);
                            const host = links.first.match(/https:\/\/(\w+\.?)+/)[0];
                            let _data = data;
                            if(filterTags && data) {
                                _data = data.filter(item => !!item.relationships.tags.data.filter(_item => filterTags.includes(Number(_item.id))).length);
                            }
                            this.itemData(activeModel, fromHikerSearch, _data, included, host, d, page, keyword);
                        }
    
                    }
                } catch(e) {
                    d.push({
                        title: name + '搜索失败，错误: ' + JSON.stringify(e),
                        col_type: "long_text"
                    });
                }
            }
            const hikerSearchModel = this.searchModel.filter(item => !!item.forHikerSearch);
            if(fromHikerSearch && hikerSearchModel.length) {
                hikerSearchModel.forEach((model) => {
                    search(model,fromHikerSearch,keyword, page, d)
                })
            } else {
                search(activeModel,fromHikerSearch,keyword, page, d)
            }
        }

        res.data = d;
        setHomeResult(res);
    },
    // 资源站点详细页面
    detailPage: function() {
        const {cookie, val} = this.activeModel();
        const [host, _query] = MY_URL.split('?host=')[1].split('/d/');
        const [,slug, page] = _query.split(/[##|$$]/).filter(item => !!item);
        const headers = {"Referer": host, 'User-Agent': MOBILE_UA,};
        if(cookie) {
            headers['cookie'] = cookie;
        }

        var res = {};
        var d = [];
        let url = host + '/api/discussions/'+slug;
        let resCode = null;
        let pageRes = null;
        if(page == 1) {
            resCode = JSON.parse(fetch(url, {headers: headers}));
            if(resCode.errors) {
                d.push({
                    title: '页面失联了💔',
                    col_type: "text_1"
                });
            } else {
                const {data, included, links} = resCode;
                const {relationships, attributes: {title, createdAt}} = data;
                setPageTitle(title);
                const postid = relationships.posts.data[0].id;
                const posts = included.filter(_post => _post.type === 'posts' && !!relationships.posts.data.find(_p => _p.id == _post.id && _p.type == 'posts'));
                const post = included.find(_post => _post.id === postid);
                const {attributes: {contentHtml}} = post;
                const contentDome = '<div class="fortext">' + contentHtml || '' + '</div>';
                const texts = parseDomForHtml(contentDome, '.fortext&&Text');
                let _title = this.getEmptyTitle(title, texts);
                d.push({
                    title: "““””<b>"+'<span style="color: '+ this.primaryColor +'">'+_title+'</span></b>\n' + "““””<small>"+'<span style="color: #999999">创建于：'+this.formatDate(createdAt)+'</span></small>',
                    url: host + '/d/' + slug,
                    col_type: "text_1"
                });
                this.detailPostPageData(posts, d, page);
            }
        } else {
            resCode = JSON.parse(fetch(url, {headers: headers}));
            if(resCode.errors) {
                d.push({
                    title: '页面失联了💔',
                    col_type: "text_1"
                });
            } else {
                let start = (page-1)*20;
                if(resCode.data.relationships.posts.data.length > 20) {
                    const postIds = resCode.data.relationships.posts.data.map(item => item.id).slice(start, start+20); 
                    url = host + '/api/posts?filter[id]='+postIds.join(',');
                    pageRes = JSON.parse(fetch(url, {headers: headers}));
                    this.detailPostPageData(pageRes.data, d, page);
                }
            }
        }
        res.data = d;
        setHomeResult(res);
    },
    // TODO
    detailRule: function(url) {
        return $.toString(()=> {
            var link = 'hiker://empty?url=' + url;
            return $(link).rule(() => {
                eval(fetch('hiker://files/rules/icy/ali.js'));
                ali.aliRule();
            })
        })
    },
    // 详细页面数据
    detailData: function(data, post, host,d) {
        const {attributes: {title, commentCount, slug},relationships} = data;
        const {attributes: {contentHtml}} = post;
        const contentDome = '<div class="fortext">' + contentHtml || '' + '</div>';
        const texts = parseDomForHtml(contentDome, '.fortext&&Text');
        let _title = this.getEmptyTitle(title, texts);
        let expand = !!Number(getVar('icy_ali_expand'+slug , ''));
        d.push({
            title: "““””<b>"+'<span style="color: '+ this.primaryColor +'">'+_title+'</span></b>\n' + "““””<small>"+'<span style="color: #999999">请点击下面资源链接访问，\n如果有误请点这里查看帖子内容或原始页面！</span></small>',
            url: host + '/d/' + slug,
            col_type: "text_1"
        });

        let _linksArr = texts.match(/https:\/\/(www\.aliyundrive\.com\/s|alywp\.net)\/\w*/g) || [];
        let _links = [];
        const codes = texts.split(/https:\/\/(www\.aliyundrive\.com\/s|alywp\.net)\/\w*/g) || [];
        const siteReg = new RegExp('href="('+host+'\/d\/(-|\\w|\\d)*)"', 'ig');
        if(!expand && _linksArr.length > 5) {
            _links = _linksArr.slice(0, 5);
        } else {
            _links = _linksArr;
        }
        _links.forEach((link, index) => {
            let code = '';
            if(codes[index]) {
                const code_match = codes[index].match(/提取码|访问码/);
                if(code_match && code_match[0]) {
                    code = codes[index].split(/提取码|访问码/)[1].match(/[a-zA-z0-9]+/)[0];
                }
            }
            d.push({
                title: '🔗 ' + (_links.length > 1 ? '链接'+(index+1)+'：' : '')  + link + (code ? '  提取码：' + code : ''),
                url: 'hiker://page/detail?url=' + link + (code ? '?share_pwd=' + code: '') + '$$fypage',
                col_type: "text_1"
            });
        })
        if(!_links.length && !contentDome.match(/https:\/\/(www\.aliyundrive\.com\/s|alywp\.net)\/\w*/g)) {
            d.push({
                title: '““””<small><span style="color: #999999">没有匹配到链接？点击查看原网页内容！</span></small>',
                url: host + '/d/' + slug,
                col_type: "text_1"
            });
        } else if(_linksArr.length > 5){
            d.push({
                title: expand ? '收起' : '展开',
                url: $("#noLoading#").lazyRule((slug)=>{
                    putVar('icy_ali_expand'+slug, Number(!Number(getVar('icy_ali_expand'+slug))));
                    refreshPage(false);
                    return "hiker://empty"
                }, slug),
                col_type: "text_center_1"
            });
        }
        d.push({
            col_type: "line_blank"
        });
        d.push({
            title: '✨ 帖子内容',
            url: this.emptyRule,
            col_type: "text_1"
        });
        d.push({
            title: contentHtml.replace(/href="https:\/\/(www\.aliyundrive\.com\/s|alywp\.net)(\/|\w|\d)*/ig, function(e,t) {
                return 'href="hiker://page/detail?url=' + e.split('href="')[1] + '$$fypage';
            }).replace(siteReg, function(e,t) {
                return 'href="hiker://page/site-detail?host=' + t+'$$'+t.split('/d/')[1].split('-')[0] +'$$fypage"';
            }),
            col_type: "rich_text"
        })
        if(commentCount > 1) {
            d.push({
                col_type: "line_blank"
            });
            let urlMore = 'hiker://page/site-detail?host='+host+'/d/'+slug+'$$'+slug+'$$fypage';
            d.push({
                title: '✨ 点击查看全部帖子内容, 共' + (commentCount - 1) + '条回帖',
                url: urlMore,
                col_type: 'text_1'
            })
        }
    },
    // 详细帖子列表
    detailPostPageData: function(posts, d, page){
        if(page == 1) {
            d.push({
                title: '✨ 全部帖子内容',
                url: this.emptyRule,
                col_type: "text_1"
            });
        }
        const {val} = this.activeModel();
        const host = val.match(/https:\/\/(\w+\.?)+/)[0];
        const siteReg = new RegExp('href="('+host+'\/d\/(-|\\w|\\d)*)"', 'ig');
        posts.forEach(post => {
            const { contentHtml } = post.attributes
            if(contentHtml) {
                // log(contentHtml.replace(/href="https:\/\/(www\.aliyundrive\.com\/s|alywp\.net)(\/|\w|\d)*/ig, function(e,t) {
                //     return 'href="hiker://page/detail?url=' + e.split('href="')[1] + '$$fypage';
                // }).replace(siteReg, function(e,t) {
                //     return 'href="hiker://page/site-detail?host=' + t+'$$'+t.split('/d/')[1] +'$$fypage"';
                // }))
                d.push({
                    title: contentHtml.replace(/href="https:\/\/(www\.aliyundrive\.com\/s|alywp\.net)(\/|\w|\d)*/ig, function(e,t) {
                        return 'href="hiker://page/detail?url=' + e.split('href="')[1] + '$$fypage';
                    }).replace(siteReg, function(e,t) {
                        return 'href="hiker://page/site-detail?host=' + t+'$$'+t.split('/d/')[1].split('-')[0] +'$$fypage"';
                    }),
                    col_type: "rich_text"
                })
                d.push({
                    col_type: "line_blank"
                });
            }
        })
    },

    // 云盘规则
    lazyOneDriver: function(link) {
        var _play = JSON.parse(fetch(link, {
            headers: {
                'User-Agent': MOBILE_UA,
            },
            redirect: false,
            withStatusCode: true
        })).headers;

        if(_play && _play.location && _play.location[0]) {
            const cookie = _play['set-cookie'].join(';')
            var pageUrl = _play.location[0];
            const _page_query = {};
            const [pageHost ,pageQuery] = pageUrl.split('?');
            const user = pageHost.split('personal/')[1].split('/_layouts')[0];
            pageQuery.split('&').forEach(query => {
                const [key, val] = query.split('=');
                _page_query[key] = val;
            })
            const graphql = {
                "query": "query (\n        $listServerRelativeUrl: String!,$renderListDataAsStreamParameters: RenderListDataAsStreamParameters!,$renderListDataAsStreamQueryString: String!,$spoSuiteLinksQueryString: String!\n        )\n      {\n      \n      legacy {\n      spoSuiteLinks(\n      queryString: $spoSuiteLinksQueryString\n      )          \n      renderListDataAsStream(\n      listServerRelativeUrl: $listServerRelativeUrl,\n      parameters: $renderListDataAsStreamParameters,\n      queryString: $renderListDataAsStreamQueryString\n      )\n    }\n      \n      \n  perf {\n    executionTime\n    overheadTime\n    parsingTime\n    queryCount\n    validationTime\n    resolvers {\n      name\n      queryCount\n      resolveTime\n      waitTime\n    }\n  }\n    }",
                "variables": {
                    "listServerRelativeUrl": "/personal/tammybrown_autoseed_tk/Documents",
                    "renderListDataAsStreamParameters": {
                        "renderOptions": 12295,
                        "addRequiredFields": true,
                        "folderServerRelativeUrl": "/personal/tammybrown_autoseed_tk/Documents/iNpaSSwbjmgx/[Sakurato] 86—Eitishikkusu— [12][AVC-8bit 1080p@60FPS AAC][CHT].mp4"
                    },
                    "renderListDataAsStreamQueryString": "@a1='%2Fpersonal%2Ftammybrown%5Fautoseed%5Ftk%2FDocuments'&RootFolder=%2Fpersonal%2Ftammybrown%5Fautoseed%5Ftk%2FDocuments%2FiNpaSSwbjmgx%2F%5BSakurato%5D%2086%E2%80%94Eitishikkusu%E2%80%94%20%5B12%5D%5BAVC%2D8bit%201080p%4060FPS%20AAC%5D%5BCHT%5D%2Emp4&TryNewExperienceSingle=TRUE",
                    "spoSuiteLinksQueryString": "Locale=en-US&v=2&mobilereq=0&msajax=1"
                }
            }
            const document = _page_query.id.split('Documents')[0] + 'Documents';
            graphql.variables.listServerRelativeUrl = decodeURIComponent(document);
            const _names = _page_query.id.split('.');
            const folder = _names.slice(0, _names.length - 1).join('.');
            graphql.variables.renderListDataAsStreamParameters.folderServerRelativeUrl = decodeURIComponent(_page_query.id);
            graphql.variables.renderListDataAsStreamQueryString = "@a1='"+document+"'&RootFolder="+_page_query.id+"&TryNewExperienceSingle=TRUE";
            const graphqlUrl = "https://dbdc-my.sharepoint.com/personal/"+user+"/_api/v2.1/graphql";
            const pageResult = JSON.parse(fetch(graphqlUrl, {
                headers: {
                    'User-Agent': MOBILE_UA,
                    'Referer': pageHost,
                    'Content-Type': 'application/json',
                    'cookie': cookie,
                },
                body: JSON.stringify(graphql),
                method: 'POST',
                withStatusCode: true
            }));
            const correlationid = pageResult.headers['sprequestguid'];
            const json = JSON.parse(pageResult.body);
            // const Row = json.data.legacy.renderListDataAsStream.ListData.Row;
            const {rootFolder, ListData: {Row}} = json.data.legacy.renderListDataAsStream;
            var res = {};
            var d = [];
            let _folders = rootFolder.split('/');
            let folderName = _folders[_folders.length - 1];
            setPageTitle(folderName);
            if(_page_query.parent || (!!Row && !Row.length)) {
                let _link = "https://dbdc-my.sharepoint.com/personal/"+user+"/_layouts/15/download.aspx?SourceUrl="+_page_query.id+"&ccat=0&correlationid=" + correlationid + '&memoryPosition=full#isVideo=true#';
                d.push({
                    title: '🎬 '+ folderName,
                    url: encodeURI(decodeURIComponent(_link)) + ';{cookie@'+cookie.split(';')[0]+'}',
                    col_type: 'text_1'
                })
                // return encodeURI(decodeURIComponent(_link)) + ';{cookie@'+cookie.split(';')[0]+'}';
            } else {
                Row.forEach((item) => {
                    let _link = "https://dbdc-my.sharepoint.com/personal/"+user+"/_layouts/15/download.aspx?SourceUrl="+item.FileRef+"&ccat=0&correlationid=" + correlationid + '&memoryPosition=full#isVideo=true#';
                    d.push({
                        title: '🎬 '+ item.FileLeafRef,
                        url: encodeURI(decodeURIComponent(_link)) + ';{cookie@'+cookie.split(';')[0]+'}',
                        col_type: 'text_1'
                    })
                })
            }

            res.data = d;
            setHomeResult(res);
        }
    },
    videoProxy: function(file_id, share_id, share_token){
        var access_token = this.getAliToken();
        if(access_token.startsWith('toast')) {
            return access_token;
        }
        if(!access_token) {
            return 'toast://还没登录？';
        }
        var json = JSON.parse(fetch('https://api.aliyundrive.com/v2/file/get_share_link_video_preview_play_info', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': access_token,
                'X-Share-Token': share_token
            },
            body: '{"share_id":"' + share_id + '","category":"live_transcoding","file_id":"' + file_id + '","template_id":""}',
            method: 'POST',
        }));
        var tid = ["FHD", "HD", "SD", "LD"];
        var tidName = ["全高清", "高清", "标清", "流畅"];
        if(json.code && json.message) {
            if(json.code.includes('AccessTokenInvalid')) {
                eval(fetch('hiker://files/rules/icy/ali.js'));
                var access_token = ali.getAliToken(true);
                // confirm({
                //     title: 'TOKEN失效了',
                //     content: '重新刷新规则或页面再试试！',
                // });
                refreshPage();
                return "toast://token 失效了，再点击试试！";
            } else if(json.code.includes('NotFound.VideoPreviewInfo')) {
                const result_link = this.get_share_link_download_url(share_id, share_token, file_id);
                if(result_link.includes('.wmv')) {
                    return 'toast://WMV格式暂时不支持播放！'
                }
                return result_link + '#isVideo=true#;{Referer@https://www.aliyundrive.com/}';
            } else {
                return "toast://" + json.message;
            }
        }
        var link = "";
        var result = {urls: [], names: []};
        try {
            var playList = json.video_preview_play_info.live_transcoding_task_list;
            tid.forEach((value, index) => {
                var _link = playList.find(e => e.template_id == value);
                if (!!_link) {
                    // 多线路
                    const playLink = 'http://116.85.31.19:3000/apis/yun-play/'+file_id+'/'+share_id+'/'+access_token+'/'+share_token+'/'+value+'/index.m3u8';
                    result.urls.push(playLink);
                    result.names.push(tidName[index]);
                }
            });
        } catch (err) {
            link = err
        }
        return JSON.stringify(result);
    },
    lazyAli: function(shareId, sharetoken, input){
        var access_token = this.getAliToken();
        if(!access_token) {
            return '';
        }
        var json = JSON.parse(fetch('https://api.aliyundrive.com/v2/file/get_share_link_video_preview_play_info', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': access_token,
                'X-Share-Token': sharetoken
            },
            body: '{"share_id":"' + shareId + '","category":"live_transcoding","file_id":"' + input + '","template_id":""}',
            method: 'POST',
        }));
        var tid = ["FHD", "HD", "SD", "LD"];
        var tidName = ["全高清", "高清", "标清", "流畅"];
        var bfArr = [];
        if(json.code && json.message) {
            if(json.code.includes('AccessTokenInvalid')) {
                eval(fetch('hiker://files/rules/icy/ali.js'));
                var access_token = ali.getAliToken();
                confirm({
                    title: 'TOKEN失效了',
                    content: '重新刷新规则或页面再试试！',
                });
                refreshPage();
                return false;
            } else {
                return "toast://" + json.message;
            }
        }
        var link = "";
        var result = {urls: [], names: [], headers: []};
        try {
            var playList = json.video_preview_play_info.live_transcoding_task_list;
            tid.forEach((value, index) => {
                var _link = playList.find(e => e.template_id == value);
                if (!!_link) {
                    // 多线路
                    result.urls.push(_link.url);
                    result.names.push(tidName[index]);
                    result.headers.push({'Referer': 'https://www.aliyundrive.com/'});
                    bfArr.push({
                        url: _link.url,
                        options: {
                            headers: {
                                'User-Agent': MOBILE_UA,
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Referer': 'https://www.aliyundrive.com/'
                            },
                            redirect: false,
                            withStatusCode: true
                        }
                    })
                    // throw _link.url
                }
            });
        } catch (err) {
            link = err
        }
        // const time = Math.ceil(new Date().getTime() / 1000) + 3600*3; // 有效期 10天
        if(!!result.urls.length) {
            const arrResult = batchFetch(bfArr);
            const bcmArr = [];
            arrResult.forEach((_item, index) => {
                const arrItemData = JSON.parse(_item);
                if(arrItemData.headers && arrItemData.headers.location) {
                    // log(arrItemData.headers.location[0])
                    // const _playUrl = arrItemData.headers.location[0].replace(/x-oss-expires=(\d+)/, 'x-oss-expires=' + time)
                    result.urls[index] = arrItemData.headers.location[0];
                    bcmArr.push({
                        url: arrItemData.headers.location[0],
                        options: {
                            headers: {
                                'Referer': 'https://www.aliyundrive.com/'
                            }
                        }
                    })
                }
            })
            try {
                const m3u8List = batchCacheM3u8(bcmArr);
                result.urls = m3u8List;
            } catch(e) {

            }
            return JSON.stringify(result);
        }

        // 播放原始视频， 无法投屏
        // var json = JSON.parse(fetch('https://api.aliyundrive.com/v2/file/get_share_link_download_url', {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': getVar("access_token"),
        //         'X-Share-Token': sharetoken
        //     },
        //     body: '{"share_id":"' + shareId + '","file_id":"' + input + '","expire_sec":600}',
        //     method: 'POST',
        // }));
        // if(json.code && json.message) {
        //     if(json.code.includes('AccessTokenInvalid')) {
        //         log('TOKEN过期了，重新获取TOKEN');
        //         this.lazyAli(shareId, sharetoken, input);
        //     } else {
        //         return "toast://" + json.message;
        //     }
        // }
        // var _play = JSON.parse(fetch(json.url, {
        //     headers: {
        //         'User-Agent': MOBILE_UA,
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //         'Referer': 'https://www.aliyundrive.com/'
        //     },
        //     redirect: false,
        //     withStatusCode: true
        // }));
        // if(_play && _play.headers && _play.headers.location) {
        //     return _play.headers.location[0] + '#isVideo=true#;{Referer@https://www.aliyundrive.com/}'
        // } else {
        //     return "toast://" + _play.body;
        // }
    },
    lazyAliImage: function(shareId, sharetoken, input){
        var access_token = this.getAliToken();
        if(!access_token) {
            return '';
        }
        var json = JSON.parse(fetch('https://api.aliyundrive.com/v2/file/get_share_link_download_url', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': access_token,
                'X-Share-Token': sharetoken
            },
            body: '{"share_id":"' + shareId + '","expire_sec":600,"file_id":"' + input + '"}',
            method: 'POST'
        }));
        if(json.code && json.message) {
            if(json.code.includes('AccessTokenInvalid')) {
                eval(fetch('hiker://files/rules/icy/ali.js'));
                var access_token = ali.getAliToken(true);
                refreshPage();
                return "toast://TOKEN失效了， 请重新试试！错误信息：" + json.message;
            } else {
                return "toast://" + json.message;
            }
        }
        var link = json.url;
        var _play = JSON.parse(fetch(link, {
            headers: {
                'User-Agent': MOBILE_UA,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': 'https://www.aliyundrive.com/'
            },
            redirect: false,
            withStatusCode: true
        })).headers;
        if(_play && _play.location) {
            return 'pics://'+_play.location[0]
        } else {
            return "toast://" + _play.body;
        }
    },
    lazyAliDoc: function(shareId, sharetoken, input){
        var access_token = this.getAliToken(true);
        if(!access_token) {
            return '';
        }
        var json = JSON.parse(fetch('https://api.aliyundrive.com/v2/file/get_office_preview_url', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': access_token,
                'X-Share-Token': sharetoken
            },
            body: '{"share_id":"' + shareId + '","file_id":"' + input + '"}',
            method: 'POST'
        }));
        if(json.code && json.message) {
            if(json.code.includes('AccessTokenInvalid')) {
                eval(fetch('hiker://files/rules/icy/ali.js'));
                var access_token = ali.getAliToken(true);
                refreshPage();
                return "toast://TOKEN失效了， 请重新试试！错误信息：" + json.message;
            } else {
                return "toast://" + json.message;
            }
        }
        let d = [];
        d.push({
            url: json.preview_url + '$$' +json.access_token,
            col_type: 'x5_webview_single',
            desc: '100%&&float',
            extra: {
                canBack: true,
                js: "var token =location.href.split('$$')[1]; if(!document.cookie.includes(token)) {document.cookie = 'wwo_token=' + location.href.split('$$')[1];location.reload();}"
            }
        })
        setHomeResult({
            data: d
        })
    },
    get_share_link_download_url: function(shareId, sharetoken, file_id){
        var access_token = this.getAliToken();
        if(!access_token) {
            return '';
        }
        const data = {"expire_sec":600,"file_id":file_id ,"share_id": shareId};
        var json = JSON.parse(fetch('https://api.aliyundrive.com/v2/file/get_share_link_download_url', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': access_token,
                'X-Share-Token': sharetoken
            },
            body: JSON.stringify(data),
            method: 'POST'
        }));
        if(json.code && json.message) {
            if(json.code.includes('AccessTokenInvalid')) {
                eval(fetch('hiker://files/rules/icy/ali.js'));
                var access_token = ali.getAliToken(true);
                refreshPage();
                return "toast://TOKEN失效了， 请重新试试！错误信息：" + json.message;
            } else {
                return "toast://" + json.message;
            }
        }
        var link = json.download_url;
        var _play = JSON.parse(fetch(link, {
            headers: {
                'User-Agent': MOBILE_UA,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': 'https://www.aliyundrive.com/'
            },
            redirect: false,
            withStatusCode: true
        })).headers;
        if(_play && _play.location) {
            return _play.location[0]
        } else {
            return "toast://" + _play.body;
        }
    },
    lazyAliAudio: function(shareId, sharetoken, input){
        var access_token = this.getAliToken();
        if(!access_token) {
            return '';
        }
        var json = JSON.parse(fetch('https://api.aliyundrive.com/v2/file/get_share_link_download_url', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': access_token,
                'X-Share-Token': sharetoken
            },
            body: '{"share_id":"' + shareId + '","get_audio_play_info":true,"file_id":"' + input + '"}',
            method: 'POST'
        }));
        if(json.code && json.message) {
            if(json.code.includes('AccessTokenInvalid')) {
                eval(fetch('hiker://files/rules/icy/ali.js'));
                var access_token = ali.getAliToken(true);
                refreshPage();
                return "toast://TOKEN失效了， 请重新试试！错误信息：" + json.message;
            } else {
                return "toast://" + json.message;
            }
        }

        var link = json.download_url;
        if(json.audio_template_list) {
            link = json.audio_template_list[json.audio_template_list.length-1].url
        }
        var _play = JSON.parse(fetch(link, {
            headers: {
                'User-Agent': MOBILE_UA,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': 'https://www.aliyundrive.com/'
            },
            redirect: false,
            withStatusCode: true
        })).headers;
        if(_play && _play.location) {
            return _play.location[0] + '#isMusic=true#;{Referer@https://www.aliyundrive.com/}'
        } else {
            return "toast://" + _play.body;
        }
    },
    aliRule: function() {
        const [shareLink, _page] = MY_URL.split('$$');
        const [link, _share_pwd] = shareLink.split('?share_pwd=');
        const [_link, _folderID] = link.split('/folder/');
        var shareId = '';
        var share_pwd = _share_pwd || '';
        var folderID = _folderID || '';
        var page = _page || 1;
        if(page == 1) {
            putVar('icy_ali_next_marker', '');
            putVar('icy_ali_folder', '');
        } else {
            folderID = getVar('icy_ali_folder', '')
        }

        var next_marker = getVar('icy_ali_next_marker', '');
        if(page != 1 && !next_marker) {
            setHomeResult({
                data: [{title: "““””<center><small>"+'<span style="color: #999999">～～～我是有底线的～～～</span></small></center>', url: this.emptyRule, col_type: 'text_center_1'}]
            });
            return 'toast://到底了！';
        }
        if (/aliyundrive/.test(_link)) {
            shareId = _link.split('com/s/')[1];
        } else if (/alywp/.test(_link)) {
            var result_link = JSON.parse(fetch(_link, {
                headers: {
                    'User-Agent': MOBILE_UA,
                },
                redirect: false,
                withHeaders: true
            })).headers.location[0];
            shareId = result_link.split('com/s/')[1];
        }
        var saveLink = 'smartdrive://share/browse?shareId='+shareId+'&sharePwd='+share_pwd;
        var sharetoken = '';
        var expiration = undefined;
        var shareInfo_res = JSON.parse(fetch('https://api.aliyundrive.com/adrive/v3/share_link/get_share_by_anonymous?share_id=' + shareId, {
            headers: {
                'Content-Type': 'application/json'
            },
            body: '{"share_id":"' + shareId + '"}',
            method: 'POST'
        }));

        var sharetoken_res = JSON.parse(fetch('https://api.aliyundrive.com/v2/share_link/get_share_token', {
            headers: {
                'Content-Type': 'application/json'
            },
            body: '{"share_pwd":"'+share_pwd+'","share_id":"' + shareId + '"}',
            method: 'POST'
        }));
        var getDateDiff = (expiration) => {
            var minute = 1000 * 60;
            var hour = minute * 60;
            var day = hour * 24;
            var month = day * 30;
    
            var now = new Date().getTime();
            var diffValue = new Date(expiration).getTime() - now;
            var monthC =diffValue/month;
            var dayC =diffValue/day;
            var hourC =diffValue/hour;
            var minC =diffValue/minute;
            if(minC<=60){
                result = Math.ceil(minC) + '分钟内有效';
            } else if(hourC<=24){
                 result = Math.ceil(hourC) + '小时内有效';
             } else if(dayC<=30){
                 result = Math.ceil(dayC) +"天内有效";
             } else {
                result = Math.ceil(monthC) +"月内有效";
             }
            return result;
        }
        if(shareInfo_res && !!shareInfo_res.display_name) {
            expiration = shareInfo_res.expiration;
            setPageTitle(shareInfo_res.display_name);
        }
        if(!!sharetoken_res.share_token) {
            sharetoken = sharetoken_res.share_token;
        } else if(sharetoken_res.code == 'InvalidResource.SharePwd') {
            this.needSharePWD(link);
            return false;
        } else if(sharetoken_res.code.includes('Cancelled') || sharetoken_res.code.includes('Expired')) {
            var d = [];
            d.push({
                title: "““””<center><small>"+'<span style="color: #999999">来晚啦，该分享已失效!</span></small></center>',
                url: this.emptyRule,
                col_type: "text_center_1"
            });
            setHomeResult({
                data: d
            });
            return false;
        } else if(sharetoken_res.code.includes('Forbidden')) {
            var d = [];
            d.push({
                title: "““””<center><b>"+'<span style="color: '+ this.primaryColor +'">文件违规\n根据相关法律法规要求，该文件已禁止访问</span></b></center>',
                url: this.emptyRule,
                col_type: "text_center_1"
            });
            setHomeResult({
                data: d
            });
            return false;
        }
        if(!sharetoken) {
            confirm({
                title: '稍等一会儿',
                content: 'TOKEN还没有获取到，重新刷新再试试！'
            });
            return false;
        }
        const getFileList = (sharetoken, shareId, folderID, next_marker) => {
            var order_by = getVar('icy_ali_order_by', 'name');
            var order_direction = getVar('icy_ali_order_direction', 'DESC');
            var folderRes = null;
            if(folderID) {
                let [_myUrl, _fypage] = MY_URL.split('$$');
                MY_URL = _myUrl.split('/folder')[0] + '/folder/' + folderID + '$$' +_fypage;
                // MY_URL = MY_URL.split('/folder')[0] + '/folder/' + folderID;
                folderRes = fetch('https://api.aliyundrive.com/v2/file/get', {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Share-Token': sharetoken
                    },
                    body: '{"share_id": "'+shareId+'","file_id": "'+folderID+'","fields":"*","image_thumbnail_process":"image/resize,w_400/format,jpeg","image_url_process":"image/resize,w_375/format,jpeg","video_thumbnail_process":"video/snapshot,t_1000,f_jpg,ar_auto,w_375"}',
                    method: 'POST'
                });
                setPageTitle(JSON.parse(folderRes).name);
            }
            const data = {"share_id": shareId,"parent_file_id": (folderID ? folderID : 'root'),"limit":100,"image_thumbnail_process":"image/resize,w_160/format,jpeg","image_url_process":"image/resize,w_1920/format,jpeg","video_thumbnail_process":"video/snapshot,t_1000,f_jpg,ar_auto,w_300","order_by": order_by,"order_direction": order_direction}
            if(next_marker) {
                data.marker = next_marker;
            }
            if(page > 1 && next_marker && folderRes) {
                data.parent_file_id = JSON.parse(folderRes).file_id;
            }
            return fetch('https://api.aliyundrive.com/adrive/v3/file/list', {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Share-Token': sharetoken
                },
                body: JSON.stringify(data),
                method: 'POST'
            });
        }

        var viewName = Number(getVar('icy_ali_view', ''));
        if(!getVar('icy_ali_order_by')) {
            putVar('icy_ali_order_by', 'name');
        }
        if(!getVar('icy_ali_order_direction')) {
            putVar('icy_ali_order_direction', 'DESC');
        }
        var d = [];
        if(page == 1) {
            var order_by_arr = [{name: '名称', val: 'name'},{name: '修改时间', val: 'updated_at'}];
            var order_direction_arr = [{name: '升序', val: 'ASC'},{name: '降序', val: 'DESC'}];
            this.rendererFilter(d, order_by_arr, 'icy_ali_order_by');
            this.rendererFilter(d, order_direction_arr, 'icy_ali_order_direction');
            d.push({
                title: !viewName ? '列表' : '图文',
                url: $("#noLoading#").lazyRule(()=>{
                    putVar('icy_ali_view', Number(!Number(getVar('icy_ali_view'))));
                    refreshPage(false);
                    return "hiker://empty"
                }),
                col_type: 'text_1'
            })
            if(typeof saveLink != 'undefined' && !!saveLink) {
                let expiration_text = '';
                if(typeof expiration != 'undefined') {
                    expiration_text = '有效期限：' + (expiration ? getDateDiff(expiration) +'，请尽快保存！' : '永久有效');
                }
                d.push({
                    title: '““””<b>✨✨✨✨<span style="color: '+ this.primaryColor +'">保存到我的阿里云盘</span>✨✨✨✨</b>\n' + "““””<small>"+'<span style="color: #999999">'+expiration_text+'</span></small>',
                    url: saveLink,
                    col_type: "text_center_1"
                });
            }
        }

        var rescod = null;
        try {
            rescod = JSON.parse(getFileList(sharetoken, shareId, folderID, next_marker));
        } catch (e){
            confirm({
                title: '出错了',
                content: '获取数据出了点问题, 刷新页面试试！',
                confirm: 'refreshPage()'
            })
        }
        // if((page != 1 && !next_marker) || !rescod) {
        //     setHomeResult({
        //         data: d
        //     });
        //     return 'toast://到底了！';
        // }
        if(rescod.code && rescod.code.includes('AccessTokenInvalid')) {
            this.needSharePWD(link);
        }

        
        if(!!rescod && (!rescod.items || !rescod.items.length)) {
            d.push({
                title: "““””<center><small>"+'<span style="color: #999999">空文件夹</span></small></center>',
                url: this.emptyRule,
                col_type: "text_center_1"
            });
        }
        const col_type = !viewName ? 'avatar' : 'movie_3_marquee';
        // 如果只包含一个文件夹， 直接取内容
        if(rescod.items.length === 1 && rescod.items[0].type == 'folder') {
            const folderItem = rescod.items[0];
            try {
                rescod = JSON.parse(getFileList(sharetoken, shareId, folderItem.file_id, next_marker));

                putVar('icy_ali_folder', folderItem.file_id);
            } catch (e){
                confirm({
                    title: '出错了',
                    content: '获取数据出了点问题, 刷新页面试试！',
                    confirm: 'refreshPage()'
                })
            }
            
        }
        putVar('icy_ali_next_marker', rescod.next_marker || '');

        if(rescod.punished_file_count) {
            d.push({
                title: "““””<center><small>"+'<span style="color: #999999">⚠️ 部分文件由于违规，已封禁</span></small></center>',
                url: this.emptyRule,
                col_type: "text_center_1"
            });
        }

        
        rescod.items.forEach((_item, index) => {
            const {type, category, name, file_id, thumbnail, updated_at} = _item;
            let title = name
            let desc = this.formatDate(updated_at, 'MM/dd HH:mm');
            let pic_url = thumbnail || this.randomPic +'?t='+new Date().getTime() + '' +index;
            const fnName = (fileExist(this.urls.tokenPath) == 'true' || fileExist(this.urls.tokenPath) == true || this.usePublicToken) ? 'lazyRule' : 'rule';
            switch(category || type){
                case 'video':
                    d.push({
                        title: title,
                        pic_url: pic_url,
                        desc: desc,
                        url: $('hiker://empty' + file_id)[fnName]((shareId, sharetoken, file_id, fnName) => {
                            eval(fetch('hiker://files/rules/icy/ali.js'));
                            var access_token = ali.getAliToken();
                            if(access_token) {
                                if(fnName == 'rule') {
                                    back(true);
                                }
                                return ali.videoProxy(file_id, shareId, sharetoken);
                            } else {
                                return "toast://登录后需要重新刷新页面哦！"
                            }
                        }, shareId, sharetoken, file_id, fnName),
                        extra: {
                            id: shareId + file_id
                        },
                        col_type: col_type

                    });
                break;
                case 'image':
                    d.push({
                        title: title,
                        desc: desc,
                        pic_url: pic_url,
                        url: $('hiker://empty'+ file_id)[fnName]((shareId, sharetoken, file_id, fnName) => {
                            eval(fetch('hiker://files/rules/icy/ali.js'));
                            var access_token = ali.getAliToken();
                            if(access_token) {
                                if(fnName == 'rule') {
                                    back(true);
                                }
                                return ali.lazyAliImage(shareId, sharetoken, file_id);
                            } else {
                                return "toast://登录后需要重新刷新页面哦！"
                            }
                        }, shareId, sharetoken, file_id, fnName),
                        col_type: col_type

                    });
                break;
                case 'folder':
                    d.push({
                        title: title,
                        desc: desc,
                        pic_url: 'https://img.alicdn.com/imgextra/i3/O1CN01qSxjg71RMTCxOfTdi_!!6000000002097-2-tps-80-80.png',
                        url: 'hiker://page/detail?url=https://www.aliyundrive.com/s/'+shareId+'/folder/'+file_id + '?share_pwd='+share_pwd+'$$fypage',
                        col_type: col_type

                    });
                break;
                case 'audio':
                    d.push({
                        title: title,
                        desc: desc,
                        pic_url: pic_url || 'https://img.alicdn.com/imgextra/i4/O1CN01LPrGLP1IMAPWurM3w_!!6000000000878-2-tps-512-512.png',
                        url: $('hiker://empty'+ file_id)[fnName]((shareId, sharetoken, file_id, fnName) => {
                            eval(fetch('hiker://files/rules/icy/ali.js'));
                            var access_token = ali.getAliToken();
                            if(access_token) {
                                if(fnName == 'rule') {
                                    back(true);
                                }
                                return ali.lazyAliAudio(shareId, sharetoken, file_id);
                            } else {
                                return "toast://登录后需要重新刷新页面哦！"
                            }
                        }, shareId, sharetoken, file_id, fnName),
                        col_type: col_type

                    });
                break;
                default: 
                    pic_url = category == 'doc' ? 'https://img.alicdn.com/imgextra/i2/O1CN01kHskgT2ACzipXL4Ra_!!6000000008168-2-tps-80-80.png' : 'https://img.alicdn.com/imgextra/i1/O1CN01mhaPJ21R0UC8s9oik_!!6000000002049-2-tps-80-80.png';
                    const docLazy = $('hiker://empty'+file_id).lazyRule((shareId, sharetoken, file_id) => {
                        eval(fetch('hiker://files/rules/icy/ali.js'));
                        return ali.get_share_link_download_url(shareId, sharetoken, file_id);
                    }, shareId, sharetoken, file_id);
                    d.push({
                        title: title,
                        pic_url: thumbnail || pic_url,
                        desc: desc,
                        url: category != 'doc' ? 'toast://该文件不支持在线预览！' : $('hiker://empty'+file_id).rule((shareId, sharetoken, file_id) => {
                            eval(fetch('hiker://files/rules/icy/ali.js'));
                            ali.lazyAliDoc(shareId, sharetoken, file_id);
                        }, shareId, sharetoken, file_id),
                        col_type: col_type

                    });
            }

        });
        setHomeResult({
            data: d
        });
    },
    needSharePWD: function(link) {
        var d = [];
        d.push({
            url: $('').input((link)=> {
                if(input.trim()) {
                    return 'hiker://page/detail?url=' + link + '?share_pwd=' + input + '$$fypage';
                } else {
                    return 'toast://请输入提取码';
                }
            }, link),
            title: '““””🔑 <b><span style="color: '+ this.primaryColor +'">请输入提取码</span></b>',
            col_type: "text_1"
        })
        setHomeResult({
            data: d
        });
    },
    // 匹配 dataType = json的模式
    homeDataJSON: function(d) {

        const activeModel = this.activeModel();
        const {val, homeDataPath} = activeModel;
        var page = Number(MY_URL.split('$$$')[1]);
        
        try {
            const [listPath, , , ] = homeDataPath.split(';')
            const {fyarea, fyclass, fyyear, fysort} = this.getFilter();
            const items = this.objData(JSON.parse(fetch(val.replace('fyarea', fyarea).replace('fyclass', fyclass).replace('fyyear', fyyear).replace('fysort', fysort).replace('fypage', page))), listPath);
            this.listPageJSON(items, homeDataPath, d, activeModel, page);
        } catch(e) {}
    },
    searchJSON: function(activeModel, fromHikerSearch, keyword, page, d) {
        try {
            const {searchUrl, searchDataPath} = activeModel;
            const [listPath, , , ] = searchDataPath.split(';')
            const {fyarea, fyclass, fyyear, fysort} = this.getFilter(true);
            const items = this.objData(JSON.parse(fetch(searchUrl.replace('**', keyword).replace('fyarea', fyarea).replace('fyclass', fyclass).replace('fyyear', fyyear).replace('fysort', fysort).replace('fypage', page))), listPath);
            this.listPageJSON(items, searchDataPath, d, activeModel, page, keyword, fromHikerSearch);
        } catch(e) {
            d.push({
                title: '页面失联了💔',
                col_type: "text_1"
            });
        }
    },
    listPageJSON: function(items, dataPath, d, activeModel, page, keyword, fromHikerSearch) {
        const {name, detailLinkPre} = activeModel;
        const [, titlePath, linkPath, descPath] = dataPath.split(';')
        if(!!items && !!items.length) {
            items.forEach((dataitem) => {
                let title = this.objData(dataitem, titlePath) || '';
                const link = (detailLinkPre || '') + (this.objData(dataitem, linkPath) || '');
                const desc = this.objData(dataitem, descPath) || '';
                const contentDome = '<div class="fortext">' + desc || '' + '</div>';
                const pic = parseDomForHtml(contentDome, '.fortext&&img&&src') || '';
                const descStr = parseDomForHtml(contentDome, '.fortext&&Text');
                title = this.getEmptyTitle(title, descStr);
                const isShareLink = link.startsWith('https://www.aliyundrive.com/s/');
                d.push({
                    title: title,
                    pic_url: pic,
                    desc: fromHikerSearch ? name : descStr,
                    content: descStr,
                    url: isShareLink ? 'hiker://page/detail?url=' + link + '$$fypage' : $('hiker://empty' + link).rule((title, link, desc) => {
                        var d = [];
                        eval(fetch('hiker://files/rules/icy/ali.js'));
                        ali.detailDataJSON(title, link , desc, d);
                        setHomeResult({
                            data: d
                        })
                    }, title, link, desc),
                    col_type: pic ? "movie_1_left_pic" : 'text_1'
                })
            })
        } else if(page == 1) {
            this.rendererEmpty(d, keyword, fromHikerSearch);
        }
    },
    detailDataJSON: function(title, realLink, contentHtml, d) {
        d.push({
            title: "““””<b>"+'<span style="color: '+ this.primaryColor +'">'+title+'</span></b>\n' + "““””<small>"+'<span style="color: #999999">请点击下面资源链接访问，\n如果有误请点这里查看帖子内容或原始页面！</span></small>',
            url: realLink,
            col_type: "text_1"
        });
        const contentDome = '<div class="fortext">' + contentHtml || '' + '</div>';
        const texts = parseDomForHtml(contentDome, '.fortext&&Text');

        const _links = texts.match(/https:\/\/(www\.aliyundrive\.com\/s|alywp\.net)\/\w*/g) || [];
        const codes = texts.split(/https:\/\/(www\.aliyundrive\.com\/s|alywp\.net)\/\w*/g) || [];
        _links.forEach((link, index) => {
            let code = '';
            if(codes[index]) {
                const code_match = codes[index].match(/提取码|访问码/);
                if(code_match && code_match[0]) {
                    code = codes[index].split(/提取码|访问码/)[1].match(/[a-zA-z0-9]+/)[0];
                }
            }
            d.push({
                title: '🔗 ' + (_links.length > 1 ? '链接'+(index+1)+'：' : '')  + link + (code ? '  提取码：' + code : ''),
                url: 'hiker://page/detail?url=' + link + (code ? '?share_pwd=' + code: '') + '$$fypage',
                col_type: "text_1"
            });
        })
        if(!_links.length && !contentDome.match(/https:\/\/(www\.aliyundrive\.com\/s|alywp\.net)\/\w*/g)) {
            d.push({
                title: '““””<small><span style="color: #999999">没有匹配到链接？点击查看原网页内容！</span></small>',
                url: realLink,
                col_type: "text_1"
            });
        }
        d.push({
            col_type: "line_blank"
        });
        d.push({
            title: '✨ 帖子内容',
            url: this.emptyRule,
            col_type: "text_1"
        });
        d.push({
            title: contentHtml.replace(/href="https:\/\/(www\.aliyundrive\.com\/s|alywp\.net)(\/|\w|\d)*/ig, function(e,t) {
                return 'href="hiker://page/detail?url=' + e.split('href="')[1];
            }),
            col_type: "rich_text"
        })
    },
    // 匹配 dataType = html的模式
    homeDataHTML: function(d) {
        const activeModel = this.activeModel();
        const {val, homeDataPath} = activeModel;
        var page = Number(MY_URL.split('$$$')[1]);
        
        try {
            const [listPath, , , ] = homeDataPath.split(';')
            const {fyarea, fyclass, fyyear, fysort} = this.getFilter();
            const items = parseDomForArray(fetch(val.replace('fyarea', fyarea).replace('fyclass', fyclass).replace('fyyear', fyyear).replace('fysort', fysort).replace('fypage', page)), listPath);
            this.listPageHTML(items, homeDataPath, d, page, activeModel);
        } catch(e) {
            d.push({
                title: '页面失联了💔',
                col_type: "text_1"
            });
        }
    },
    searchHTML: function(activeModel, fromHikerSearch, keyword, page, d) {
        try {
            const {searchUrl, searchDataPath , homeDataPath} = activeModel;
            const _path = searchDataPath || homeDataPath;
            const [listPath, , , ] = _path.split(';');
            const {fyarea, fyclass, fyyear, fysort} = this.getFilter(true);
            const searchResult = fetch(searchUrl.replace('**', keyword).replace('fyarea', fyarea).replace('fyclass', fyclass).replace('fyyear', fyyear).replace('fysort', fysort).replace('fypage', page));
            const items = parseDomForArray(searchResult, listPath);
            this.listPageHTML(items, _path, d, page, activeModel, keyword, fromHikerSearch);
        } catch(e) {
            d.push({
                title: '页面失联了💔',
                col_type: "text_1"
            });
        }
    },
    listPageHTML: function(items, dataPath, d, page, activeModel, keyword, fromHikerSearch) {
        const {name, detailLinkPre, itemsExcloudByLink, detailPath} = activeModel;
        const [, titlePath, linkPath, descPath] = dataPath.split(';')
        if(items && items.length) {
            items.forEach((dataitem) => {
                const title = parseDomForHtml(dataitem, titlePath);
                const _link = parseDomForHtml(dataitem, linkPath);
                let link = detailLinkPre + _link;
                if(itemsExcloudByLink) {
                    if(new RegExp(itemsExcloudByLink).test(_link)) {
                        return false;
                    }
                }
                let descArr = []
                descPath.split('+').forEach(_p => {
                    descArr.push(parseDomForHtml(dataitem, _p) || '')
                })
                let desc = descArr.join('\n');
                const contentDome = '<div class="fortext">' + desc || '' + '</div>';
                const pic = parseDomForHtml(contentDome, '.fortext&&img&&src') || '';
                var lazy = $('').lazyRule(() => {
                    const res = fetch(input); 
                    var link = parseDomForHtml(res, 'a&&href').match(/https:\/\/(www\.aliyundrive\.com\/s|alywp\.net)\/\w*/g)[0];
                    if(link) {
                        return 'hiker://page/detail?url=' + link + '$$fypage';
                    } else {
                        return "toast://好像出错了！"
                    }
                })
                if(!!detailPath) {
                    link += '$$' + title + '$$' + detailPath + '$$';
                    lazy = $('').rule(() => {
                        const [_url, title,detailPath,] = MY_URL.split('$$');
                        const res = fetch(_url); 
                        const content = parseDomForHtml(res, detailPath).split('<div class="card-body">')[0].replace(/<style.*\/style>/g, '').replace(/<script.*\/script>/g, '').replace(/\s*fr\s*om\s*w\s*ww\.yun\s*pan\s*zi\s*yuan\.co\s*m/g, '');
                        var d = [];
                        eval(fetch('hiker://files/rules/icy/ali.js'));
                        ali.detailPageHTML(title, _url, content, d);
                        setHomeResult({data: d});
                    })
                }
                d.push({
                    title: title,
                    pic_url: pic,
                    url: link + lazy,
                    content: desc,
                    desc:  fromHikerSearch ? name : desc,
                    col_type: pic ? "movie_1_left_pic" : 'text_1'
                })
            })
        } else if(page == 1) {
            this.rendererEmpty(d, keyword, fromHikerSearch);
        }
    },
    // 详细页面数据
    detailPageHTML: function(title, link, contentHtml,d) {
        setPageTitle(title);
        d.push({
            title: "““””<b>"+'<span style="color: '+ this.primaryColor +'">'+title+'</span></b>\n' + "““””<small>"+'<span style="color: #999999">请点击下面资源链接访问，\n如果有误请点这里查看帖子内容或原始页面！</span></small>',
            url: link,
            col_type: "text_1"
        });
        const contentDome = '<div class="fortext">' + contentHtml || '' + '</div>';
        const texts = parseDomForHtml(contentDome, '.fortext&&Text');

        const _links = texts.match(/https:\/\/(www\.aliyundrive\.com\/s|alywp\.net)\/\w*/g) || [];
        const codes = texts.split(/https:\/\/(www\.aliyundrive\.com\/s|alywp\.net)\/\w*/g) || [];
        _links.forEach((link, index) => {
            let code = '';
            if(codes[index]) {
                const code_match = codes[index].match(/提取码|访问码/);
                if(code_match && code_match[0]) {
                    code = codes[index].split(/提取码|访问码/)[1].match(/[a-zA-z0-9]+/)[0];
                }
            }
            d.push({
                title: '🔗 ' + (_links.length > 1 ? '链接'+(index+1)+'：' : '')  + link + (code ? '  提取码：' + code : ''),
                url: 'hiker://page/detail?url=' + link + (code ? '?share_pwd=' + code: '') + '$$fypage',
                col_type: "text_1"
            });
        })
        if(!_links.length && !contentDome.match(/https:\/\/(www\.aliyundrive\.com\/s|alywp\.net)\/\w*/g)) {
            d.push({
                title: '““””<small><span style="color: #999999">没有匹配到链接？点击查看原网页内容！</span></small>',
                url: link,
                col_type: "text_1"
            });
        }
        d.push({
            col_type: "line_blank"
        });
        d.push({
            title: '✨ 帖子内容',
            url: this.emptyRule,
            col_type: "text_1"
        });
        d.push({
            title: contentHtml.replace(/href="https:\/\/(www\.aliyundrive\.com\/s|alywp\.net)(\/|\w|\d)*/ig, function(e,t) {
                return 'href="hiker://page/detail?url=' + e.split('href="')[1] + '$$fypage';
            }),
            col_type: "rich_text"
        })
    },
    // onedriver  R酱
    homeDataR: function(d) {
        const {val} = this.activeModel();
        var page = Number(MY_URL.split('$$$')[1]);
        try {
            const {code, data} = JSON.parse(fetch(val.replace('fypage', (page - 1) *50)));
            if(code == 200 && data && data.length) {
                data.forEach((_item) => {
                    const {title, id, add_at, size} = _item;
                    d.push({
                        title: title,
                        url: $('https://share-api.rhilip.info/items/'+id).rule(() => {
                            const _play = JSON.parse(fetch(MY_URL, {
                                headers: {
                                    'User-Agent': MOBILE_UA,
                                },
                            }));
                            eval(fetch('hiker://files/rules/icy/ali.js'));
                            ali.lazyOneDriver(_play.data.raw_link);
                        }),
                        desc:  '添加时间：'+this.formatDate(add_at)+'  大小：'+ this.formatBytes(size),
                        col_type: 'text_1'
                    })
                })
            } else {
                this.rendererEmpty(d);
            }
        } catch(e) {}
    },
    searchR: function(activeModel, fromHikerSearch, keyword, page, d) {
        try {
            const {name, searchUrl} = activeModel;
            const {code, data} = JSON.parse(fetch(searchUrl.replace('**', keyword).replace('fypage', (page - 1) *50)));
            if(code == 200 && data && data.length) {
                data.forEach((_item) => {
                    const {title, id, add_at, size} = _item;
                    const desc = '添加时间：'+this.formatDate(add_at)+'  大小：'+ this.formatBytes(size);
                    d.push({
                        title: title,
                        url: $('https://share-api.rhilip.info/items/'+id).rule(() => {
                            const _play = JSON.parse(fetch(MY_URL, {
                                headers: {
                                    'User-Agent': MOBILE_UA,
                                },
                            }));
                            eval(fetch('hiker://files/rules/icy/ali.js'));
                            ali.lazyOneDriver(_play.data.raw_link);
                        }),
                        content: desc,
                        desc:  fromHikerSearch ? name : desc,
                        col_type: 'text_1'
                    })
                })
            } else {
                this.rendererEmpty(d, keyword, fromHikerSearch);
            }
        } catch(e) {}
    },
}
