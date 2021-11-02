var icyPlayer = {
  playRule: '@lazyRule=.js:eval(fetch("hiker://files/rules/icy/hiker-icy.js"));var config=fetch("hiker://files/cache/MyParseSet.json");var userParse=!!Number(getVar("icy_userParse"));if(userParse){if(config==""||!fetch(JSON.parse(config).cj)){"toast://解析失败，没有找到插件或者还没有配置过插件!"}else{var jsUrl=JSON.parse(config).cj;eval(fetch(jsUrl));aytmParse(input)}}else{var result=icyPlayer.getPlayUrls([input]);if(result&&result.length){result[0].play_url}else{"toast://解析失败，开起插件解析试试吧!"}};',
  emptyRule: $("#noLoading#").lazyRule(()=>{return "toast://Emmm~~!"}),
  icon: {
    appset: `data:image/svg+xml;charset=utf-8;base64,PHN2ZyBzdHlsZT0nd2lkdGg6IDFlbTtoZWlnaHQ6IDFlbTt2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO2ZpbGw6IGN1cnJlbnRDb2xvcjtvdmVyZmxvdzogaGlkZGVuOycgdmlld0JveD0nMCAwIDEwMjQgMTAyNCcgdmVyc2lvbj0nMS4xJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxwYXRoIGQ9J003MjQuMTE0Mjg2IDUyNi42Mjg1NzFjLTg3Ljc3MTQyOSAwLTE2OC4yMjg1NzEgNjUuODI4NTcxLTE4Mi44NTcxNDMgMTQ2LjI4NTcxNUgxNjguMjI4NTcxYy0yMS45NDI4NTcgMC00My44ODU3MTQgMjEuOTQyODU3LTQzLjg4NTcxNCA0My44ODU3MTRzMjEuOTQyODU3IDQzLjg4NTcxNCA0My44ODU3MTQgNDMuODg1NzE0aDM3My4wMjg1NzJjMjEuOTQyODU3IDg3Ljc3MTQyOSA5NS4wODU3MTQgMTQ2LjI4NTcxNCAxODIuODU3MTQzIDE0Ni4yODU3MTUgMTAyLjQgMCAxOTAuMTcxNDI5LTg3Ljc3MTQyOSAxOTAuMTcxNDI4LTE5MC4xNzE0MjlzLTg3Ljc3MTQyOS0xOTAuMTcxNDI5LTE5MC4xNzE0MjgtMTkwLjE3MTQyOXogbTAgMjkyLjU3MTQyOWMtNTguNTE0Mjg2IDAtMTAyLjQtNDMuODg1NzE0LTEwMi40LTEwMi40czQzLjg4NTcxNC0xMDIuNCAxMDIuNC0xMDIuNCAxMDIuNCA0My44ODU3MTQgMTAyLjQgMTAyLjQtNDMuODg1NzE0IDEwMi40LTEwMi40IDEwMi40ek0yOTkuODg1NzE0IDQ5Ny4zNzE0MjljODcuNzcxNDI5IDAgMTY4LjIyODU3MS02NS44Mjg1NzEgMTgyLjg1NzE0My0xNDYuMjg1NzE1aDM3My4wMjg1NzJjMjEuOTQyODU3IDAgNDMuODg1NzE0LTIxLjk0Mjg1NyA0My44ODU3MTQtNDMuODg1NzE0cy0yMS45NDI4NTctNDMuODg1NzE0LTQzLjg4NTcxNC00My44ODU3MTRoLTM2NS43MTQyODZjLTIxLjk0Mjg1Ny04Ny43NzE0MjktOTUuMDg1NzE0LTE0Ni4yODU3MTQtMTgyLjg1NzE0My0xNDYuMjg1NzE1LTEwMi40IDAtMTkwLjE3MTQyOSA4Ny43NzE0MjktMTkwLjE3MTQyOSAxOTAuMTcxNDI5LTcuMzE0Mjg2IDEwOS43MTQyODYgODAuNDU3MTQzIDE5MC4xNzE0MjkgMTgyLjg1NzE0MyAxOTAuMTcxNDI5eiBtMC0yOTIuNTcxNDI5YzU4LjUxNDI4NiAwIDEwMi40IDQzLjg4NTcxNCAxMDIuNCAxMDIuNCAwIDU4LjUxNDI4Ni00My44ODU3MTQgMTAyLjQtMTAyLjQgMTAyLjQtNTguNTE0Mjg2IDAtMTAyLjQtNDMuODg1NzE0LTEwMi40LTEwMi40IDAtNTguNTE0Mjg2IDQzLjg4NTcxNC0xMDIuNCAxMDIuNC0xMDIuNHonIGZpbGw9JyNGRjU3NTcnPjwvcGF0aD48L3N2Zz4=`,
    plugin: 'data:image/svg+xml;charset=utf-8;base64,PHN2ZyBzdHlsZT0nd2lkdGg6IDNlbTtoZWlnaHQ6IDNlbTt2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO2ZpbGw6IGN1cnJlbnRDb2xvcjtvdmVyZmxvdzogaGlkZGVuOycgdmlld0JveD0nMCAwIDEwMjQgMTAyNCcgdmVyc2lvbj0nMS4xJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxwYXRoIGQ9J005MjQuNTIyNjA2IDQ5MS42MjY1OXYtMTY0LjkxMzUxMWExMjQuNjQzOTMyIDEyNC42NDM5MzIgMCAwIDAtMTI0LjY0MzkzMi0xMjQuNjQzOTMyaC0xNTkuODc5ODEzbDEuNjc3ODk5LTc1LjAyNjA1OXYtMy41OTU0OThBMTI0LjE2NDUzMiAxMjQuMTY0NTMyIDAgMCAwIDUxNi43OTMxMjggMC4wMDIxNTdhMTI4LjQ3OTEzIDEyOC40NzkxMyAwIDAgMC0xMjcuNzYwMDMgMTI4LjIzOTQzMXY3My44Mjc1NTlIMjI0LjExOTU4OGExMjQuNjQzOTMyIDEyNC42NDM5MzIgMCAwIDAtMTI0LjY0MzkzMyAxMjQuNjQzOTMydjE1MS4yNTA2MThoODYuNzcxMzUzYTEzMS44MzQ5MjggMTMxLjgzNDkyOCAwIDEgMSAwIDI2My42Njk4NTdIOTkuNDc1NjU1djE1Ny43MjI1MTRhMTI0LjY0MzkzMiAxMjQuNjQzOTMyIDAgMCAwIDEyNC42NDM5MzMgMTI0LjY0MzkzMmgxNTMuNDA3OTE2di03OC4xNDIxNTdhMTMzLjUxMjgyNyAxMzMuNTEyODI3IDAgMSAxIDI2Ni43ODU5NTUgMHY3OC4xNDIxNTdoMTU1LjU2NTIxNWExMjQuNjQzOTMyIDEyNC42NDM5MzIgMCAwIDAgMTI0LjY0MzkzMi0xMjQuNjQzOTMydi0xNjEuNzk3NDEyeicgZmlsbD0nIzEzQ0U4QSc+PC9wYXRoPjxwYXRoIGQ9J002NDcuOTA4OTU3IDUxMi4wMDEwNzltLTEzNS45MDk4MjYgMGExMzUuOTA5ODI2IDEzNS45MDk4MjYgMCAxIDAgMjcxLjgxOTY1MiAwIDEzNS45MDk4MjYgMTM1LjkwOTgyNiAwIDEgMC0yNzEuODE5NjUyIDBaJyBmaWxsPScjNjhGOEEwJz48L3BhdGg+PC9zdmc+'
  },
  urls: {
    referer: 'https://quark.sm.cn/api/rest?method=movieRec.index&format=html#',
    rest: 'https://quark.sm.cn/api/rest?',
    setting: 'hiker://files/rules/icy/settings.json',
    rules: 'hiker://files/rules/icy/rules.js',
    settingHtml: 'file:///storage/emulated/0/Android/data/com.example.hikerview/files/Documents/icy-settings.html',
  },
  forceUpdate: false,

  havePlugin: function() {
    return fileExist('hiker://files/cache/Parse_Dn.js') == 'true' || fileExist('hiker://files/cache/Parse_Dn.js') == true;
  },
  /**
   * 返回选中的规则，如果为空，则用海阔app来搜索
   * @returns null || rule
   */
  config: function(){
    const haveSetting = fileExist(this.urls.setting) == 'true' || fileExist(this.urls.setting) == true;
    if(haveSetting) {
      var json = fetch(this.urls.setting);
      return (!!json && json != 'undefined'  && json != 'null' ) ? JSON.parse(json) : null;
    } else {
      return null;
    }
  },
  /**
   * 渲染 配置页面
   */
  initConfig: function(){
    const haveSettingHtml = fileExist(this.urls.settingHtml) == 'true' || fileExist(this.urls.settingHtml) == true;
    let html = haveSettingHtml ? fetch(this.urls.settingHtml) : '';
    if(this.forceUpdate || !html) {
      html = fetch('https://gitee.com/fly1397/hiker-icy/raw/master/settings.html');
      if(!html || !html.includes('MrFly')) {
        html = fetch('https://cdn.jsdelivr.net/gh/fly1397/hiker-icy/settings.html');
      }
      if(!html || !html.includes('MrFly')) {
        html = fetch('http://lficy.com:30000/mrfly/hiker-icy/raw/master/settings.html');
      }
    }
    if(html) {
      const rules = getLastRules(16).filter(item => !!item.search_url);
      const script = `<script>var rules=`+JSON.stringify(rules)+`;function initRuleConfig(){try{var jsonfile=fy_bridge_app.fetch('hiker://files/rules/icy/settings.json');var config=(!!jsonfile&&jsonfile!='undefined'&&jsonfile!='null')?JSON.parse(jsonfile):null;var options='';var active=null;for(var i=0;i<rules.length;i++){var item=rules[i];var canSearch=!!item.search_url;options+='<option value="'+item.title+'" '+(canSearch?'':'disabled')+' >'+item.title;if(config&&config.title&&config.title==item.title){active=item;options+='--当前选择'}options+='</option>'}if(!active&&config&&config.title){options='<option value="'+config.title+'">'+config.title+'--当前选择</option>'+options}var ruleName=(active?active.title:((config&&config.title)?config.title:''));if(ruleName){document.getElementById('result').innerHTML='当前选择的小程序是：<strong id="active">'+ruleName+'</strong>'}options='<option value="">使用海阔视界搜索</option>'+options;document.getElementById('list').innerHTML=options;document.getElementById('list').value=ruleName}catch(e){document.getElementById('log').innerHTML=JSON.stringify(e)}}initRuleConfig();</script>`;
      writeFile(this.urls.settingHtml, html + script);
    }
    
  },
  /**
   * 初始化断插， 返回配置url
   */
  initPlugin: function() {
    var config = fetch('hiker://files/cache/MyParseSet.json');
    if(config == '' || !fetch(JSON.parse(config).cj)){
        var jsUrl = 'https://code.aliyun.com/AI957/Hiker/raw/master/v/CloudParse-V2_Dn.js';
    }else{
        var jsUrl = JSON.parse(config).cj;
    } 
    eval(fetch(jsUrl));
    return setUrl;
  },
  /**
     * 传入 youku，bilibili 等地址
     * @param {string[]} links 
     * @returns {url: string, play_url: string}[]; url: 原始视频页面地址; play_url: m3u8等格式视频地址
     */
   getPlayUrls: function(links) {
    var querys = 'method=quarkdahanghai.getPlayUrlByUrls';
    links.forEach((item, index) => {
      querys += '&urls['+index+']=' + item;
    })
    const res = this.fetch(querys);
    return JSON.parse(res).data;
  },
  /**
   * 
   * @param {string} pic 
   * @returns string
   */
  formatPic: function(pic){
    return pic.startsWith('//') ? 'https:' + pic : pic;
  },
  /**
   * 
   * @param {string} vid 
   * @param {string} sid 
   * @param {number} start 
   * @param {number} count 
   * @returns {url: string, duration: string, period: string, title: string}[]
   */
  changeSource: function(vid, sid, start, count){
    querys = 'method=ent.video&act=get_item&isQuark&vid='+vid+'&format=json&start='+start+'&count='+count+'&sid='+sid;
    const response = JSON.parse(this.fetch(querys));
    const result = [];
    for(var key in response){
      result.push(response[key])
    }
    return result;
  },
  /**
   * 
   * @param {string} vid 
   * @param {string} name 
   * @returns string //模板字符串
   */
  getVideoByTpl: function(vid, name) {
    const querys = 'method=max.getdata&mkey=yisou|'+vid+'&q='+name+'&tab=index';
    const response = JSON.parse(this.fetch(querys));
    return (response.data && response.data.tpl) ? response.data.tpl : '';
  },
  fetch(param){
    const link = param.startsWith('http') ? param : this.urls.rest + param;
    return fetch(link, {headers: {"Referer": this.urls.referer}});
  },
  /**
   * 首页
   */
  homePage: function() {
    var d = [];
    const query = MY_URL.split('##')[1];
    const querys = "format=json&from=&method=movieRec.filmNewHome&"+ query;
    if(query.indexOf('page=1&') > 0) {
      d.push({
        url: "input.trim() ? 'hiker://empty?search=' + input.trim() : 'toast://请输入影片名称'",
        col_type: "input"
      });
      try {
        const hotquery = JSON.parse(fetch('https://www.360kan.com/hotquery?fmt=json').replace('__jsonp0__(', '').replace(');', ''));
        d.push({
          title: '大家都在搜：',
          url: this.emptyRule,
          col_type: 'flex_button'
        });
        hotquery.forEach(item => {
          d.push({
            title: item,
            url: 'hiker://empty?search='+item,
            col_type: 'flex_button'
          });
        })
      } catch (e) {}

      const fitures = [{
        icon: 'https://sm01.alicdn.com/L1/272/6837/static/wap/img/ky/cag.png',
        url: 'hiker://empty##fypage',
        title: '分类'
      },{
        icon: 'https://sm01.alicdn.com/L1/272/6837/static/wap/img/ky/kol-recommend.png',
        url: this.urls.rest +'format=json&from=&method=movieRec.filmRec&source=',
        title: '推荐'
      },{
        icon: 'https://sm01.alicdn.com/L1/272/6837/static/wap/img/ky/movie-list.png',
        url: this.urls.rest +'format=json&from=&method=movieRec.filmMenu&source=',
        title: '片单'
      }];
      fitures.forEach(function(item){
        d.push({
          title: item.title,
          url: item.url,
          pic_url: item.icon,
          col_type: "icon_small_3"
        }); 
      })
      d.push({
        col_type: "line_blank"
      });
    }
    const indesRes = this.fetch(querys);
    try {
      const indexItems = JSON.parse(indesRes).data.data;
      indexItems.forEach((item) => {
        d.push({
          title: '‘‘’’' + item.list_name + "<small><small><font color='#f47983'>更多></font></small></small>",
          url: this.urls.rest + "format=json&from=&method=movieRec.filmMenuList&source=&id="+item.id+"&page=fypage&limit=15",
          col_type: "text_1"
        }); 
        item.video_list.forEach((video) => {
          d.push({
            title: video.name,
            desc: Number(video.score_avg/100).toFixed(1)+'分',
            pic_url: this.formatPic(video.pic),
            url: 'https://quark.sm.cn/s?q=' + video.name+'在线播放' + "@rule=js:eval(fetch('hiker://files/rules/icy/hiker-icy.js'));icyPlayer.searchVideoByName();",
            col_type: "movie_3_marquee"
          }); 
        })
        d.push({
        col_type: "line_blank"
        });
      })
    } catch(e) {}
    setResult(d);
  },
  //二级页面
  listPage: function() {
    const keyword = MY_URL.split('?search=')[1];
    // 判断是否是搜索来的页面
    if(!!keyword) {
      this.searchVideoByName(keyword);
    } else {
      this.rendererListPage();
    }
    
  },
  rendererListPage: function() {
    var res = {};
    var d = [];
    if(MY_URL.startsWith('hiker')) {
      this.categoryPage(d);
    } else {
      var method = MY_URL.match(/method=movieRec\.(.*)&/)[1];
      
      const rendererList = (list_title,list) => {
        if(list && list.length) {
          list.forEach((item) => {
            d.push({
              title: item.list_name,
              pic_url: this.formatPic(item.images[0]),
              desc: '共'+item.video_count+'部',
              url: this.urls.rest + 'format=json&from=&method=movieRec.filmMenuList&source=&id='+item.id+"&page=fypage&limit=15@rule=js:eval(fetch('hiker://files/rules/icy/hiker-icy.js')); icyPlayer.listPage();",
              col_type: "movie_3_marquee"
            })
          })
        }
      }
      var json=JSON.parse(getResCode()).data;
      if(json.video_list) {
        json.video_list.forEach((video) => {
          var searchRule = 'https://quark.sm.cn/s?q=' + video.name+'在线播放' + "@rule=js:eval(fetch('hiker://files/rules/icy/hiker-icy.js'));icyPlayer.searchVideoByName();";
          d.push({
            title: video.name,
            desc: Number(video.score_avg/100).toFixed(1)+'分',
            pic_url: this.formatPic(video.pic),
            url: searchRule,
            col_type: "movie_3_marquee"
          }); 
        })
      } else if(method === 'filmRec') {
        // 推荐
        json.forEach((video) => {
          var searchRule = 'https://quark.sm.cn/s?q=' + video.name+'在线播放' + "@rule=js:eval(fetch('hiker://files/rules/icy/hiker-icy.js'));icyPlayer.searchVideoByName();";
          d.push({
            title: video.name,
            desc: video.score_avg+'分',
            pic_url: this.formatPic(video.pic),
            url: searchRule,
            col_type: "movie_3_marquee"
          }); 
        })
      } else if(method === 'filmSearch') {
        
      } else if(method === 'filmMenu'){
        // 片单
        var list_titles = [
          {name: '最近更新片单',val: 4},
          {name: '电影片单',val: 0},
          {name: '美剧片单',val: 1},
          {name: '韩剧片单',val: 3},
          {name: '日剧片单',val: 2}
        ];
        const active_list_val = Number(getVar('icy_active_list') || 0);
        const active_list = list_titles.find(item => item.val == active_list_val);
        d.push({
          title: list_titles[0].name,
          url: this.emptyRule,
          col_type: "text_1"
        })
        if(json) {
          rendererList(list_titles[0].name, json[list_titles[0].val]);
        }

        list_titles.forEach(list_title => {
          if(list_title.val != 4) {
            d.push({
              title: active_list_val == list_title.val ?'““””<b><span style="color: #f47983">'+ list_title.name+'</span></b>' : list_title.name,
              url: $("#noLoading#").lazyRule((val)=>{
                    putVar("icy_active_list",val);
                    refreshPage(false);
                    return "hiker://empty"
                }, list_title.val),
              col_type: 'flex_button'
            });
          }
        });
        if(json) {
          rendererList(active_list.name, json[active_list.val]);
        }
      }
      
    }
    res.data = d;
    setHomeResult(res);
  },
  // 分类页面
  categoryPage: function(d) {
    var page = MY_URL.split('##')[1];
    if(page == 1) {
      const filters = [
        {
          cat: [{"name":"全部类型","val":""},{"name":"喜剧","val":"喜剧"},{"name":"爱情","val":"爱情"},{"name":"动作","val":"动作"},{"name":"科幻","val":"科幻"},{"name":"犯罪","val":"犯罪"},{"name":"惊悚","val":"惊悚"},{"name":"恐怖","val":"恐怖"},{"name":"悬疑","val":"悬疑"},{"name":"动画","val":"动画"},{"name":"家庭","val":"家庭"},{"name":"战争","val":"战争"},{"name":"传奇","val":"传奇"},{"name":"冒险","val":"冒险"},{"name":"历史","val":"历史"},{"name":"纪录片","val":"纪录片"},{"name":"灾难","val":"灾难"},{"name":"其他","val":"其他"}],
          area: [{"name":"全部地区","val":""},{"name":"大陆","val":"大陆"},{"name":"港台","val":"港台"},{"name":"美国","val":"美国"},{"name":"韩国","val":"韩国"},{"name":"日本","val":"日本"},{"name":"欧洲","val":"欧洲"},{"name":"其他","val":"其他"}],
          year: [{"name":"年份不限","val":""},{"name":"2021","val":"2021"},{"name":"2020","val":"2020"},{"name":"2019","val":"2019"},{"name":"2018","val":"2018"},{"name":"2017","val":"2017"},{"name":"2016","val":"2016"},{"name":"2010-2015","val":"2010-2015"},{"name":"2000-2009","val":"2000-2009"},{"name":"90年代","val":"90年代"},{"name":"80年代","val":"80年代"},{"name":"其他","val":"其他"}],
          sort: [{"name": "综合排序", val: "default"},{"name": "豆瓣评分", val: "score"},{"name": "最新上线", val: "pub_time"}]
        }
      ]
      const channels = ["电影","电视剧","综艺","动漫"];
      const defaultChannel = (getVar('icy_channel') || "电影");
      const rendererFilter = (d, data, key) => {
        data.forEach(item => {
          var title = item.val == getVar(key) ? "““””<b>"+'<span style="color: #f47983">'+item.name+'</span></b>' : item.name;
          d.push({
            title: title,
            url: $("#noLoading#").lazyRule((key, val)=>{
              putVar(key,val);
              refreshPage(false);
              return "hiker://empty"
              }, key, item.val),
            col_type:'scroll_button'
          })
        })
        d.push({
          col_type: "blank_block"
        });
      }
      channels.forEach((channel, index) => {
        var title= channel== defaultChannel ? "““””<b>"+'<span style="color: #f47983">'+channel+'</span></b>' : channel;
        d.push({
          title: title,
          url: $("#noLoading#").lazyRule((val)=>{
              putVar("icy_channel",val);
              putVar('icy_cat', '');
              putVar('icy_area', '');
              putVar('icy_year', '');
              putVar('icy_sort', 'default');
              refreshPage(false);
              return "hiker://empty"
            }, channel),
          col_type:'scroll_button'
        });
      })
      d.push({
        col_type: "blank_block"
      });
      const filter = filters[0];
      rendererFilter(d, filter.cat, 'icy_cat');
      rendererFilter(d, filter.area, 'icy_area');
      rendererFilter(d, filter.year, 'icy_year');
      rendererFilter(d, filter.sort, 'icy_sort');
    }
    this.categoryListpage(d);
  },
  // 分类数据列表页面
  categoryListpage: function(d) {
    var cat = getVar('icy_cat') || '';
    var area = getVar('icy_area') || '';
    var year = getVar('icy_year') || '';
    var channel = getVar('icy_channel') || '电影';
    var page = Number(MY_URL.split('##')[1]);
    var sort = getVar('icy_sort') || 'default';
    var url = this.urls.rest + 'format=json&from=true&method=movieRec.filmSearch&source=true&area='+area+'&cat='+cat+'&page='+page+'&limit=30&year='+year+'&sort='+sort+'&channel='+channel;
    const res = fetch(url, {headers: {"Referer": this.urls.referer}});
    var result = [];
    try {
      result = JSON.parse(res).data.hits;
    } catch (e) {}
    result.forEach((video) => {
      d.push({
        title: video.title,
        desc: !!Number(video.score) ? Number(video.score/100).toFixed(1)+'分' : '',
        pic_url: this.formatPic(video.image_url),
        url: this.urls.rest + 'method=yisou.getMaxData&vid=' + video.vid+ "@rule=js:eval(fetch('hiker://files/rules/icy/hiker-icy.js'));icyPlayer.getVideoByID('"+video.vid+"','"+ video.title+"');",
        col_type: "movie_3_marquee"
      }); 
    })
  },
  // 分类=> 详细页面
  getVideoByID: function(vid, title){
    var video_data = null;
    if(vid) {
      video_data = JSON.parse(this.fetch('method=yisou.getMaxData&vid=' + vid));
    } else {
      video_data = JSON.parse(getResCode())
    }
    if(!video_data ||(!!video_data && !video_data.id) ) {
      // 如果没有数据，则进行标题搜索
      this.searchVideoByName(title);
    } else {
      this.rendererVideoByID(video_data, title);
    }
  },
  rendererVideoByID: function(data , keyword){
    var res = {};
    var d = [];
    if(data) {
      var defaultSrc = !!data.source_list.length ? data.source_list[0].src_id : '';
      if(!getVar("icy_src_id") || (getVar("icy_vid") != data.id)) {
        putVar("icy_src_id", defaultSrc);
        putVar("icy_vid", data.id);
      }
      var pic = this.formatPic(data.pic_path);
      d.push({
        title: data.name,
        desc: data.channel + ' ' + data.area + ' ' + data.category.join('  ') + ' ' + data.pub_time,
        img: pic,
        url: pic,
        col_type: 'movie_1_vertical_pic'
      });
      d.push({
        col_type: "line_blank"
      });
      this.rendererSummary(d, data.brief);
      this.rendererVideoResult(d, keyword || data.name);

      const source = data.source_list.find(item => item.src_id == getVar("icy_src_id"));
      if(source) {
        if(this.havePlugin()) {
          const userParse = Number(getVar('icy_userParse'));
          d.push({
              title: '““””解析切换 - 当前采用： <b><span style="color: #f47983">'+ (!userParse ? '默认地址' : '断插')+'</span></b>',
              url: $("#noLoading#").lazyRule((val)=>{
                    putVar("icy_userParse",val);
                    refreshPage(false);
                    return "hiker://empty"
                }, Number(!userParse)),
              col_type: 'flex_button'
          });
        } else {
          putVar("icy_userParse",0);
          d.push({
            title: '““””解析切换 - 当前采用： <b><span style="color: #f47983">默认地址</span></b>',
            url: $("#noLoading#").lazyRule(()=>{
                  return "toast://还没有插件可用，先导入插件吧！"
              }),
            col_type: 'flex_button'
          });
        }
        d.push({
          title: '选择线路' + (!!Number(getVar('icy_video_sort')) ? ' - 倒序' : ' - 正序'),
          url: `@lazyRule=.js:let sort = getVar('icy_video_sort');putVar('icy_video_sort', Number(!Number(sort)));refreshPage(false);'toast://切换排序成功'`,
          col_type: "scroll_button"
        });
        data.source_list.forEach(item => {
          var title= (source && item.src_id == source.src_id) ? "““””<b>"+'<span style="color: #f47983">'+item.src_name+'</span></b>' : item.src_name;
          d.push({
            title: title,
            url: $("#noLoading#").lazyRule((val)=>{
              putVar("icy_src_id",val);
              refreshPage(false);
              return "hiker://empty"
              }, item.src_id),
            col_type: "scroll_button"
          });
        })
        if(data.channel == '电影') {
          var isVip = data.video_type == 'vip';
          var color = isVip ? '#E6A23C' : '#67C23A';
          var title= "““””<b>"+'<span style="color: '+color+'">正片</span></b>';
          d.push({
            title: title,
            url: source.url+'##isVip='+ isVip + this.playRule,
            col_type: "text_3"
          });
        } else {
          var col_type = data.channel == '综艺' ? 'text_1' : 'text_3';
          const urls = this.changeSource(data.id, source.src_id, 1, source.item_total);
          let _d = [];
          urls.forEach((item, index) => {
            var title = item.title.replace(data.name, '');
            if(data.channel !== '综艺') {
              title = '第'+ (index + 1) +'集'
            }
            var isVip = item.free != 1;
            var color = isVip ? '#E6A23C' : '#67C23A';
            title = "““””<b>"+'<span style="color: '+color+'">'+title+'</span></b>';
            _d.push({
              title: title,
              url: item.url +'##isVip='+(item.free != '1') + this.playRule,
              col_type: col_type
            });
          })
          if(!!Number(getVar('icy_video_sort'))) {
            _d.reverse();
          }
          d = d.concat(_d);
        }
        d.push({
          col_type: "blank_block"
        });

      }
    }
    res.data = d;
    setHomeResult(res);
  },
  searchByHikerRule: function(){
    const icy_settings = this.config();
    const {searchFind, find_rule, search_url, detail_find_rule, sdetail_find_rule, } = icy_settings;
    try {
      const ruleSearch = (searchFind == '*' || !searchFind) ? find_rule : searchFind;
      const forSearchRule = (sdetail_find_rule == '*' || !sdetail_find_rule) ? detail_find_rule : sdetail_find_rule;
      // 判断搜索解析规则是js 还是css
     if(ruleSearch.startsWith('js:')) {
       /**
        * 解决 js规则下打开详细页面需要用 详细规则 才可以正常打开。
        * @param {Object|Array} res 需要渲染的对象，包含data
        */
       const formatResult = function(res) {
        if(res.data) {
          res.data = res.data.forEach(item => {
            if(item.url && !item.url.includes('@rule')) {
              item.url += (forSearchRule.startsWith('js') ? '@rule='+forSearchRule : '')
            }
            return item;
          })
        } else if(res instanceof Array){
          res = res.forEach(item => {
            if(item.url && !item.url.includes('@rule')) {
              item.url += (forSearchRule.startsWith('js') ? '@rule='+forSearchRule : '')
            }
            return item;
          })
        }
        setHomeResult(res);
       }
       if(ruleSearch.match(/set[Home|Search]*Result/)) {
         // 小程序采用行内js渲染结果 -- 返回setResult | setHomeResult | setSearchResult
        eval(ruleSearch.replace('js:', '').replace(/set[Home|Search]*Result/, 'formatResult'));
       } else {
        // 小程序引用js文件，由js文件里的 function 去渲染结果
        newRule = ruleSearch.replace(/(\w*)\(\)/g, '');
        eval(newRule);
        ruleSearch.match(/(\w*)\(\)/g).forEach(fnName => {
          let fnStr = eval(fnName.replace('()', '')+'.toString()');
          if(fnStr.match(/set[Home|Search]*Result/)) {
            eval(fnStr.replace(/set[Home|Search]*Result/, 'formatResult'));
          }
          eval(fnName);
        })
       }
     } else {
       // 如果是css规则
       const match = search_url.match(/https?:\/\/([^/]+)/i);
       let host = (search_url.startsWith('http') && match) ? match[0] : '';
       this.rendererSearchResult(ruleSearch, host, forSearchRule)
     }
    } catch(e) {
      this.rendererEmptyRule(JSON.stringify(e));
    }
  },
  rendererSearchResult: function(ruleSearch, host, rule) {
    var res = {};
    var d = [];
    const [list_css, title_css, link_css, hint_css, desc_css, pic_css] = ruleSearch.split(';')
    const html = getResCode();
    const list = parseDomForArray(html, list_css);
    if(list && list.length) {
      list.forEach(item => {
        let _url = parseDomForHtml(item, link_css);
        let _pic = parseDomForHtml(item, pic_css);
        let url = (_url.startsWith('/') && host) ? host + _url : _url;
        let pic = (_pic.startsWith('/') && host) ? host + _pic : _pic;
        d.push({
          title: parseDomForHtml(item, title_css) + '\r\n' + parseDomForHtml(item, hint_css),
          desc: parseDomForHtml(item, desc_css),
          pic_url: pic,
          url: url + (rule.startsWith('js') ? '@rule='+rule : ''),
          col_type: "movie_1_vertical_pic"
        }); 
      })
    } else {
      d.push({
        title: '没有结果',
        col_type: "long_text"
      });
    }
    res.data = d;
    setHomeResult(res);
  },
  rendererEmptyRule: function(error) {
    var res = {};
    var d = [];
    d.push({
      title: '小程序不存在或者有错误',
      url: '',
      col_type: "long_text"
    });
    if(error) {
      d.push({
        title: error,
        col_type: "long_text"
      });
    }
    res.data = d;
    setHomeResult(res);
  },
  searchVideoByName: function(keyword){
    let response = null;
    if(MY_URL.startsWith('http')){
      response = getResCode();
    }
    if(!response && !!keyword) {
      response = this.fetch('https://quark.sm.cn/s?q=' + keyword+'在线播放')
    }
    let name = '';
    if(keyword) {
      name = keyword;
    } else {
      name = MY_URL.split('?q=')[1].split('在线播放')[0];
    }
    var vid = response.match(/sc_kg_guid"?:\s?"?(\d*)"?/);
    let title = '';
    try{
      title = parseDomForHtml(response, '.c-header-title&&em,0&&Text').trim();
    } catch (e) {

      title = parseDomForHtml(response, '.c-header-title,0&&span,0&&Text').trim();
    }
    var result = null;
    // setError(name + '##'+ title)
    /**
     * 按名称搜索，存在可能有数据的情况， sc_kg_guid 存在
     * 如果id存在，优先按id查询后渲染
     */

    if(vid && vid[1]){
      result = JSON.parse(this.fetch('method=yisou.getMaxData&vid=' + vid[1]));
      //排除空对象情况
      if(!result ||(!!result && !result.id) ) {
        this.rendererVideoByName(response, name);
      } else {
        this.rendererVideoByID(result, name || title);
      }
    } else {
      this.rendererVideoByName(response, name);
    }
    
  },
  rendererVideoByName: function(response, keyword) {
    var video_data = null;
    let name = '';
    if(keyword) {
      name = keyword;
    } else {
      name = MY_URL.split('?q=')[1].split('在线播放')[0];
    }
    var vid = response.match(/sc_kg_guid"?:\s?"?(\d*)"?/);
    let tpl = null;
    if(vid && vid[1]){
      tpl = this.getVideoByTpl(vid[1], name);
    }
    let html_0 = response.split('source:[{');
    if(html_0 && html_0[1]) {
      var html = html_0[1].split('}],')[0];
      var text = '[{' +html.trim()+'}]';
      video_data = JSON.parse(text);
    }
    var res = {};
    var d = [];
    try {
      /**
       * 直接通过页面渲染
       * 一般情况下会有限寻找tpl 然后渲染
       */
      var desc = parseDomForArray(response, '.M_Video_Common_Dilu_header&&.c-subtitle-dark&&span').map(item => parseDomForHtml(item,'Text')).join('   ');
      try {
        var rate = parseDomForHtml(response, '.c-e-rating-span&&Text');
          if(rate) {
            desc += "\r\n豆瓣评分:" + rate;
          }
      } catch(e) {};
      var pic = this.formatPic(decodeURIComponent(parseDomForHtml(response, '.M_Video_Common_Dilu_header&&.cover&&data-load')));
      d.push({
        title: parseDomForHtml(response, '.M_Video_Common_Dilu_header&&.c-header-title&&Text'),
        desc: desc,
        img: pic,
        url: pic,
        col_type: 'movie_1_vertical_pic'
      });
      d.push({
        col_type: "line_blank"
      });
      
      this.rendererSummary(d, parseDomForHtml(response, '.M_Video_Common_Dilu_brief&&.js-c-clamp-wrapper&&.js-c-paragraph-text&&Text'));
      // this.rendererVideoResult(d, name);
    } catch(e) {
      if(tpl) {
        const dom = '<html><body>'+tpl+'</body>';
        var desc = parseDomForArray(dom, '.ys-type&&span').map(item => parseDomForHtml(item,'Text')).join('   ');
        try {
          var rate = parseDomForHtml(dom, '.ys-rating-text&&Text');
          if(rate) {
            desc += "\r\n豆瓣评分:" + rate;
          }
          var time = parseDomForHtml(dom, '.ys-time&&Text');
          if(rate) {
            desc += " " + time;
          }
        } catch(e) {}
        var pic = this.formatPic(decodeURIComponent(parseDomForHtml(dom, '.ys-header-smallimg-img&&data-image')));
        d.push({
          title: parseDomForHtml(dom, '.ys-tle&&Text'),
          desc: desc,
          img: pic,
          url: pic,
          col_type: 'movie_1_vertical_pic'
        });
        d.push({
          col_type: "line_blank"
        });
        try {
          this.rendererSummary(d, parseDomForHtml(dom, '.ys-film-info&&.ys-film-info&&Text'));
        } catch (e) {
          this.rendererSummary(d, parseDomForHtml(dom, '.ys-summary-text&&Text'));
        }
      }
    }

    if(video_data) {
      /**
       * video_data 为播放数据， 一般情况下会走id渲染路径
      */
       video_data.forEach(item => {
        d.push({
          title: item.src_name,
          url: this.emptyRule,
          col_type: "text_1"
        });
        d.push({
          title: '第'+item.platform+'集',
          url: item.url + this.playRule,
          col_type: "text_3"
        });
      })
    } else {
      d.push({
        title: '““””暂时没有搜索到<b><span style="color: #f47983">'+ name+'</span></b>有关资源',
        url: this.emptyRule,
        col_type: 'text_1'
      })
      d.push({
        title: '请尽量搜索影片全称，如果没有找到你想要的结果，可以尝试点击 搜索设置 采用小程序进行搜索！',
        col_type: 'long_text'
      })
      d.push({
        col_type: "line_blank"
      });
      this.rendererVideoResult(d, name);
    }
    d.push({
      col_type: "blank_block"
    });
    res.data = d;
    setHomeResult(res);
  },
  rendererVideoResult(d, name){
    this.initConfig();
    const icy_settings = this.config();
    d.push({
      title: '搜索设置',
      pic_url: this.icon.appset,
      url: 'hiker://empty@rule=js:var res={}; var d = []; d.push({desc:"100%&&float",col_type:"x5_webview_single", url:"'+this.urls.settingHtml+'"}); res.data = d;setHomeResult(res);',
      col_type: 'icon_2'
    })
    let setUrl = 'copy://https://paste.yuchen.tech/3072';
    if(this.havePlugin()) {
      setUrl = this.initPlugin();
    }
    d.push({
      title: this.havePlugin() ? '插件设置' : '导入插件',
      pic_url: this.icon.plugin,
      url: setUrl,
      col_type: 'icon_2'
    })
    d.push({
      col_type: "line_blank"
    });
    if(icy_settings && icy_settings.title && icy_settings.search_url) {
      let _search_url = icy_settings.search_url;
      // 排除 hiker://$$ 类似这样后面不接empty的url
      if(!_search_url.match(/^hiker:\/\/[a-z]/)) {
        _search_url = _search_url.replace('hiker://', 'hiker://empty');
      }
      d.push({
        title: '““””搜索<b><span style="color: #f47983">'+ name+'</span></b> -- By '+ icy_settings.title,
        url: _search_url.replace('**', name) + "@rule=js:eval(fetch('hiker://files/rules/icy/hiker-icy.js'));icyPlayer.searchByHikerRule();",
        col_type: 'text_1'
      })
    } else {
      d.push({
        title: '““””搜索<b><span style="color: #f47983">'+ name+'</span></b> -- By 海阔视界',
        url: 'hiker://search?s='+name,
        col_type: 'text_1'
      })
    }
    d.push({
      col_type: "line_blank"
    });
    d.push({
      title: '““””查看网页搜索结果：<b><span style="color: #f47983">'+ name+'</span></b>',
      url: 'https://quark.sm.cn/s?q=' + name+'在线播放',
      col_type: 'text_1'
    })
    d.push({
      col_type: "line_blank"
    });
  },
  rendererSummary: function(d, text){
    const expandSummary = Number(getVar('icy_expandSummary'));
    text = text.replace('概述','');
    let title = text.length < 30 ? '简介' : '““””简介  <small><small><font color="#f47983">'+(expandSummary ? '收起>' : '展开>' )+'</font><small><small>'
    d.push({
      title: title,
      url: $("#noLoading#").lazyRule((val)=>{
        putVar("icy_expandSummary",val);
        refreshPage(false);
        return "hiker://empty"
    }, Number(!expandSummary)),
      col_type: 'text_1'
    })
    let summary = (!!Number(expandSummary) || text.length < 30) ? text : text.substring(0, 30) + '...'
    d.push({
      title: summary,
      col_type: 'long_text'
    })
    d.push({
      col_type: "line_blank"
    });
  }
}
