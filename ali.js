const ali = {
    rulePath: 'hiker://files/rules/icy/ali.js',
    searchFetch: function(url, keyword, page, sort){
        const link = url.replace('**', keyword).replace('fypage', (((page||1) - 1) * 20)).replace('fysort', sort);
        return fetch(link, {headers: {"Referer": link}});
    },
    activeModel: function() {
        let model_search = getVar('icy_ali_model');
        const {searchModel} = this;
        return searchModel.find(item => item.val == model_search) || searchModel[0];
    },

    searchModel: [
        {
            name: '阿里盘搜',
            val: 'https://aliyunshare.cn',
            forHome: true,
            searchUrl: 'https://alixiaozhan.net/api/discussions?include=user%2ClastPostedUser%2CmostRelevantPost%2CmostRelevantPost.user%2Ctags%2Ctags.parent%2CfirstPost&filter%5Bq%5D=**%20tag%3Avideo&filter%5Btag%5D=video&sort=fysort&page%5Boffset%5D=fypage',
            filterTags: [12, 16,17,18,19,20,21,79,89, 1,73,74,75,76,77,78,90, 80,81,82,83,84, 85,  9,28,29,30,31],
            cats: [{
                name: '剧集',
                val: 'tv',
                sub: [
                    {
                        name: '全部',
                        val: '',
                    },
                    {
                        name: '华语',
                        val: 'china-tv',
                    },
                    {
                        name: '港台',
                        val: 'hongkong-tv',
                    },
                    {
                        name: '欧美',
                        val: 'usa-tv',
                    },
                    {
                        name: '英法',
                        val: 'english-tv',
                    },
                    {
                        name: '日韩',
                        val: 'japan-tv',
                    },
                    {
                        name: '印度',
                        val: 'india-tv',
                    },
                    {
                        name: '纪录片',
                        val: 'documentary-tv',
                    },
                    {
                        name: '其它',
                        val: 'other-tv',
                    },
                ]
            },{
                name: '电影',
                val: 'movie',
                sub: [
                    {
                        name: '全部',
                        val: '',
                    },
                    {
                        name: '华语',
                        val: 'china-f',
                    },
                    {
                        name: '港台',
                        val: 'hk-f',
                    },
                    {
                        name: '欧美',
                        val: 'usa-f',
                    },
                    {
                        name: '英法',
                        val: 'english-f',
                    },
                    {
                        name: '日韩',
                        val: 'japan-f',
                    },
                    {
                        name: '印度',
                        val: 'india-f',
                    },
                    {
                        name: '其它',
                        val: 'other-f',
                    },
                ]
            },{
                name: '综艺',
                val: 'variety',
                sub: [
                    {
                        name: '全部',
                        val: '',
                    },
                    {
                        name: '内地',
                        val: 'china-v',
                    },
                    {
                        name: '港台',
                        val: 'hk-v',
                    },
                    {
                        name: '欧美',
                        val: 'usa-v',
                    },
                    {
                        name: '日韩',
                        val: 'japan-v',
                    },
                    {
                        name: '其它',
                        val: 'other-v',
                    },
                ]
            },{
                name: '动漫',
                val: 'comic',
                sub: [
                    {
                        name: '全部',
                        val: '',
                    },
                    {
                        name: '国产',
                        val: 'china-c',
                    },
                    {
                        name: '欧美',
                        val: 'usa-c',
                    },
                    {
                        name: '日韩',
                        val: 'Japan-c',
                    },
                    {
                        name: '其它',
                        val: 'other-c',
                    },
                ]
            }],
            sorts: [{
                name: '最新回复',
                val: ''
            },{
                name: '热门主题',
                val: '-commentCount'
            },{
                name: '新鲜出炉',
                val: '-createdAt'
            },{
                name: '陈年旧帖',
                val: 'createdAt'
            },{
                name: '最多人看',
                val: '-view_count'
            },{
                name: '最少人看',
                val: 'view_count'
            },{
                name: '精华',
                val: '-frontdate'
            }],
        },
        {
            name: '阿里小站',
            val: 'https://alixiaozhan.net',
            forHome: true,
            searchUrl : 'https://alixiaozhan.net/api/discussions?include=user%2ClastPostedUser%2CmostRelevantPost%2CmostRelevantPost.user%2Ctags%2Ctags.parent%2CfirstPost&filter%5Bq%5D=**%20tag%3Avideo&filter%5Btag%5D=video&sort=fysort&page%5Boffset%5D=fypage',
            cats: [{
                name: '影视',
                val: 'video',
            }],
            sorts: [{
                name: '相关推荐',
                val: ''
            },{
                name: '最新回复',
                val: '-lastPostedAt'
            },{
                name: '热门主题',
                val: '-commentCount'
            },{
                name: '新鲜出炉',
                val: '-createdAt'
            },{
                name: '陈年旧帖',
                val: 'createdAt'
            }],
        },
        {
            name: '阿里盘搜',
            val: '3',
            cats: [{
                name: '目录+文件',
                val: '',
            },{
                name: '目录',
                val: '1',
            },{
                name: '文件',
                val: '2',
            }],
            sorts: [{
                name: '线路一',
                val: ''
            },{
                name: '线路二',
                val: '2'
            }],
        }
    ],
    emptyRule: $("#noLoading#").lazyRule(()=>{return "toast://Emmm~~!"}),
    preRule: function(){
        if(!getVar('icy_ali_model')) {
            putVar('icy_ali_model', 'https://alixiaozhan.net');
            // putVar('icy_ali_model', 'https://aliyunshare.cn');
            // putVar('icy_ali_model_search', '3');
            const {cats, sorts} = ali.activeModel();
            putVar('icy_ali_cat', cats ? cats[0].val : '');
            putVar('icy_ali_subcat', (!!cats && !!cats[0].sub) ? cats[0].sub.val : '');
            putVar('icy_ali_sort', sorts ? sorts[0].val : '');
            putVar("icy_ali_search", '');
        };
        evalPrivateJS('dqg3cSAIVNdEZ893gpP1/5dh3XUO1Pw8rmt0L5mCIaV9Q5fRzoR5y5NqMUzNpEyUgaUso/qwD0Bj0srFSIo59iptCv1nuZhi6WpQ2tB3gYe9PComS2eqyBzY1jrUdo4fwx7BbkfGOW57/0Ie69EJ6jmtKp1QhTzupUJtElvspiUMhhRp7UeYi1tyFA+lz/EOE3JYphFhDacNfdXSxZx7CbMBj6I0ozXKTZLYLK8Badpubt9HKO6lkNuvJQQbXW71hYOyBGozpzD4P2QEiE4HOMwUvwAL/CWzgjwyMTy250LlCTtJlJd9s/1zGckyRGMUKDFguFje+rToQ9KPljs0hDTGDnf+hhusbUF6H44lGcrEperlktf7AXKaIe5I3b6EgIFy2F/cWBMZd5ifsmA57Y+bkqMahEtYrb1YudWd7niVx7ZmV/fMkkcfCSEIxtOSNDorppTt6TkZHN2zbLtkiKZ6m0jwaGFhhOsCRy07dAOK8cbQRk+owFBAuRNiYvOknvDor6WSebb4q+NQYs5melZEcIV2p0cfFnfuLJrorKYcMJqBE1NGoKBAw1pOasoM27V1gkOmSXSK++h0G4s6BdENQ5xbOC+ECiHSiKHN19FwTRkRdA/ag/FwYvon6BMKJlU/lJT80HhFvH+/X4eU13zBIiJ4u0Ky6ZgLg1vMgVNaCypJ4xt5/y7aJkoYcEuo');
    },
    homePage: function() {
        var d = [];
        var page = Number(MY_URL.split('$$$')[1]);
        if(page == 1) {
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
            this.rendererSuggest(d);

            const {cats, sorts} = this.activeModel();
            this.rendererFilter(d, this.searchModel.filter(item => !!item.forHome), 'icy_ali_model', () => {
                // callback
                eval(fetch('hiker://files/rules/icy/ali.js'));
                const {cats, sorts} = ali.activeModel();
                putVar('icy_ali_cat', cats ? cats[0].val : '');
                putVar('icy_ali_subcat', (!!cats && !!cats[0].sub) ? cats[0].sub.val : '');
                putVar('icy_ali_sort', sorts ? sorts[0].val : '');
            });
            if(!!cats && cats.length) {
                this.rendererFilter(d, cats, 'icy_ali_cat');
                const activeCat = getVar('icy_ali_cat') || 'tv';
                const cat = cats.find(item => item.val === activeCat);
                if(cat && cat.sub && cat.sub.length) {
                    this.rendererFilter(d, cat.sub, 'icy_ali_subcat');
                }
            }
            this.rendererFilter(d, sorts, 'icy_ali_sort');
    
        }

        d.push({
            col_type: "line_blank"
        });

        this.homeData(d);

        d.push({
            col_type: "blank_block"
          });
        setResult(d);
    },
    rendererFilter: function(d, data, key, cb){
        if(!data || !data.length || data.length == 1) {
            return false;
        }
        data.forEach(item => {
            var title = item.val == getVar(key) ? "““””<b>"+'<span style="color: #f47983">'+item.name+'</span></b>' : item.name;
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
            const hotquery = JSON.parse(fetch('https://www.360kan.com/hotquery?fmt=json').replace('__jsonp0__(', '').replace(');', ''));
            d.push({
                title: '大家都在搜：',
                url: this.emptyRule,
                col_type: 'scroll_button'
            });
            hotquery.forEach(item => {
                if(atSearchPage) {
                    d.push({
                        title: item,
                        url: $("#noLoading#").lazyRule((item)=>{
                            putVar("icy_ali_search",item);
                            refreshPage(false);
                            return "hiker://empty"
                        }, item),
                        col_type: 'scroll_button'
                    });
                } else {
                    d.push({
                        title: item,
                        url: $("#noLoading#").lazyRule((item)=>{
                            putVar("icy_ali_search",item);
                            var link = 'hiker://empty$$$' + item + '$$$fypage$$$';
                            return $(link).rule(()=> {
                                eval(fetch('hiker://files/rules/icy/ali.js'));
                                ali.searchPage();
                            })
                        }, item),
                        col_type: 'scroll_button'
                    });
                }
            })
            d.push({
                col_type: "blank_block"
            });
          } catch (e) {
            //   log(JSON.stringify(e))
            // d.push({
            //     title: JSON.stringify(e),
            //     col_type: "long_text"
            // });
          }
    },
    homeData: function(d) {
        const {val, cats} = this.activeModel();
        var cat = getVar('icy_ali_cat') || cats[0].val;
        var subcat = getVar('icy_ali_subcat') || '';
        var sort = getVar('icy_ali_sort') || '';
        var page = Number(MY_URL.split('$$$')[1]);
        var url = val + '/api/discussions?include=user%2ClastPostedUser%2Ctags%2CfirstPost%2CfirstPost%2ClastPost&filter%5Btag%5D='+(subcat || cat)+'&sort='+sort+'&page%5Boffset%5D=' + (page - 1) * 20;
        const res = fetch(url, {headers: {"Referer": url, 'User-Agent': MOBILE_UA,}});
        if(res.includes('complete a CAPTCHA')) {
            d.push({
                title: '<div style="height: 100vh; display:flex; align-items: center;justify-content: center;"><a href="web://'+url+'"><b><span style="color: #f47983">验证码</span></b>才能继续</a></div>',
                url: url + "@lazyRule=.js:'x5WebView://"+url+"'",
                col_type: 'rich_text'
            })
        }
        var result = {
            data: [],
            included: []
        };
        try {
            if(res) {

                result = JSON.parse(res);
                const {data, included} = result;
                this.itemData(data, included, d, page);
            } else {
                d.push({
                    title: '页面失联了💔',
                    col_type: "text_1"
                });
            }
        } catch (e) {
            d.push({
                title: JSON.stringify(e),
                col_type: "long_text"
            });
        }
    },
    itemData: function(_data, included, d, page, keyword){
        var data = _data;
        const {filterTags} = this.activeModel();
        if(filterTags && _data) {
            data = _data.filter(item => !!item.relationships.tags.data.filter(_item => filterTags.includes(Number(_item.id))).length);
        }
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
                const post = included.find(_post => _post.id === postid);
                const {attributes: {contentHtml}} = post;
                const contentDome = '<div class="fortext">' + contentHtml || '' + '</div>';
                const pic = parseDomForHtml(contentDome, '.fortext&&img&&src') || '';
                d.push({
                    title: attributes.title,
                    pic_url: pic,
                    desc: parseDomForHtml(contentDome, '.fortext&&Text'),
                    // 优化速度， 直接打开，不再远程取数据
                    // url: 'https://aliyunshare.cn/api/discussions/'+attributes.slug+'?bySlug=true&page%5Bnear%5D=0' + lazy,
                    url: $('hiker://empty' + postid).rule((dataitem, post) => {
                        var items = [];
                        eval(fetch('hiker://files/rules/icy/ali.js'));
                        ali.detailData(dataitem, post, items);
                        setHomeResult({
                            data: items
                        })
                    }, dataitem, post),
                    col_type: pic ? "movie_1_left_pic" : 'text_1'
                })
            });
        } else if(page == 1){
            if(keyword) {
                d.push({
                    title: '““””😞 暂时没有搜索到<b><span style="color: #f47983">'+ keyword+'</span></b>有关资源',
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
            } else {
                d.push({
                    title: '““””😞 没有找到数据，切换分类试试吧！',
                    col_type: 'text_1'
                })
            }
        }
    },
    searchPage: function(fromHikerSearch){
        var res = {};
        var d = [];
        const [, _keyword, _page] = MY_URL.split('$$$');
        if(!getVar('icy_ali_model_search')) {
            putVar('icy_ali_model_search', getVar('icy_ali_model'))
        };
        let keyword = getVar('icy_ali_search') || _keyword || '';
        var links = keyword.match(/https:\/\/(www\.aliyundrive\.com\/s|alywp\.net)\/\w*/g) || [];
        if(links.length) {
            // 如果直接是链接
            setPageTitle('网盘链接');
            links.forEach((link, index) => {
                d.push({
                    title: '🔗 ' + (links.length > 1 ? '链接'+(index+1)+'：' : '')  + link,
                    url: 'hiker://page/detail?url=' + link,
                    col_type: "text_1"
                });
            })
        } else {

            setPageTitle(keyword + '的搜索结果');
            let page = _page;
            let model_search = getVar('icy_ali_model_search') || getVar('icy_ali_model');
            const {searchModel} = this;
            const activeModel = searchModel.find(item => item.val == model_search);
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
                
                const {sorts, cats} = activeModel;
                this.rendererSuggest(d, true);
                this.rendererFilter(d, searchModel, 'icy_ali_model_search', () => {
                    // callback
                    eval(fetch('hiker://files/rules/icy/ali.js'));
                    const {sorts} = ali.activeModel()
                    putVar('icy_ali_sort_search' , !!sorts.length ? sorts[0].val : '')
                });
                if(sorts && sorts.length) {
                    this.rendererFilter(d, sorts, 'icy_ali_sort_search');
                }
                if(model_search == 3 && cats) {
                    this.rendererFilter(d, cats, 'icy_ali_cat_search');
                }
                d.push({
                    col_type: "line_blank"
                });
                
            }
            try {
                if(model_search == 3) {
                    this.otherSearch(keyword, page, d, getVar('icy_ali_sort_search') || '1', getVar('icy_ali_cat_search') || '0');
                } else {
                    const {data, included} = JSON.parse(this.searchFetch(activeModel.searchUrl,keyword, page, getVar('icy_ali_sort_search')));
                    this.itemData(data, included, d, page, keyword);
                }
            } catch(e) {
                d.push({
                    title: JSON.stringify(e),
                    col_type: "long_text"
                });
            }
        }

        res.data = d;
        setHomeResult(res);
    },
    detailPage: function() {
        var res = {};
        var d = [];
        const {data, included} = JSON.parse(getResCode());
        const postid = relationships.posts.data[0].id;
        const post = included.find(_post => _post.id === postid);
        this.detailData(data, post, d);
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
    detailData: function(data, post,d) {
        const {attributes: {title},relationships} = data;
        d.push({
            title: "““””<b>"+'<span style="color: #f47983">'+title+'</span></b>\n' + "““””<small>"+'<span style="color: #999999">请点击下列资源访问，\n如果有误请自行查看影片简介链接！</span></small>'+'\n请点击下列资源访问，如果有误请自行查看影片简介链接！',
            url: this.emptyRule,
            col_type: "text_1"
        });
        const {attributes: {contentHtml}} = post;
        const contentDome = '<div class="fortext">' + contentHtml || '' + '</div>';
        const texts = parseDomForHtml(contentDome, '.fortext&&Text');
        const links = texts.match(/https:\/\/(www\.aliyundrive\.com\/s|alywp\.net)\/\w*/g) || [];
        const codes = texts.split(/https:\/\/(www\.aliyundrive\.com\/s|alywp\.net)\/\w*/g) || [];
        links.forEach((link, index) => {
            let code = '';
            if(codes[index]) {
                const code_match = codes[index].match(/提取码|访问码/);
                if(code_match && code_match[0]) {
                    code = code_match[0].split(/提取码|访问码/)[1].match(/[a-zA-z0-9]+/)[0];
                }
            }
            d.push({
                title: '🔗 ' + (links.length > 1 ? '链接'+(index+1)+'：' : '')  + link + (code ? '  提取码：' + code : ''),
                url: 'hiker://page/detail?url=' + link + (code ? '?share_pwd=' + code: ''),
                col_type: "text_1"
            });
        })
        d.push({
            col_type: "line_blank"
        });
        d.push({
            title: '✨ 影片简介',
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
    lazyAli: function(shareId, sharetoken, input){

        var json = JSON.parse(fetch('https://api.aliyundrive.com/v2/file/get_share_link_video_preview_play_info', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getVar("aliaccessTk"),
                'X-Share-Token': sharetoken
            },
            body: '{"share_id":"' + shareId + '","category":"live_transcoding","file_id":"' + input + '","template_id":""}',
            method: 'POST'
        }));
        var tid = ["FHD", "HD", "SD", "LD"];
        if(json.code && json.message) {
            if(json.code.includes('AccessTokenInvalid')) {
                eval(fetch('hiker://files/rules/icy/ali.js'));
                ali.preRule();
                return "toast://TOKEN失效了， 请重新播放试试！错误信息：" + json.message;
            } else {
                return "toast://" + json.message;
            }
        }
        var link = "";
        var result = {urls: [], names: []};
        try {
            var playList = json.video_preview_play_info.live_transcoding_task_list;
            tid.forEach(value => {
                var links = playList.find(e => e.template_id == value);
                if (!!links) {
                    // result.urls.push(links.url);
                    // result.names.push(value);
                    throw links.url
                }
            });
        } catch (err) {
            // log(err);
            link = err
        }
        if(!!result.urls.length) {
            result.urls = result.urls.map(_url => {
                return $(_url).lazyRule(() => {
                    // TODO 多线路不支持 lazyRule ？
                    const _play = JSON.parse(fetch(input, {
                        headers: {
                            'User-Agent': MOBILE_UA,
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Referer': 'https://www.aliyundrive.com/'
                        },
                        redirect: false,
                        withStatusCode: true
                    })).headers;
                    if(_play && _play.location) {
                        return _play.location[0] + ';{Referer@https://www.aliyundrive.com/}'
                    } else {
                        return "toast://" + _play.body;
                    }
                });
            })
            return JSON.stringify(result);
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
            return _play.location[0] + ';{Referer@https://www.aliyundrive.com/}'
        } else {
            return "toast://" + _play.body;
        }
    },
    aliRule: function(share_pwd) {
        var link = MY_URL;
        var shareId = '';
        var share_pwd = share_pwd || '';
        if (/aliyundrive/.test(link)) {
            shareId = link.split('com/s/')[1];
        } else if (/alywp/.test(link)) {
            var result_link = JSON.parse(fetch(link, {
                headers: {
                    'User-Agent': MOBILE_UA,
                },
                redirect: false,
                withHeaders: true
            })).headers.location[0];
            shareId = result_link.split('com/s/')[1];
        }
        if(shareId.includes('?share_pwd=')) {
            let share_link = shareId.split('?share_pwd=');
            shareId = share_link[0];
            share_pwd = share_link[1];
        }
        var sharetoken = '';
        var sharetoken_res = JSON.parse(fetch('https://api.aliyundrive.com/v2/share_link/get_share_token', {
            headers: {
                'Content-Type': 'application/json'
            },
            body: '{"share_pwd":"'+share_pwd+'","share_id":"' + shareId + '"}',
            method: 'POST'
        }));
        if(!!sharetoken_res.share_token) {
            sharetoken = sharetoken_res.share_token;
        } else if(sharetoken_res.code.includes('Cancelled')) {
            var d = [];
            d.push({
                title: "““””<center style='height: 100vh; display:flex; align-items: center;justify-content: center;'><small>"+'<span style="color: #999999">来晚啦，该分享已失效!</span></small></center>',
                url: this.emptyRule,
                col_type: "text_1"
            });
            setHomeResult({
                data: d
            });
        }
        const getFileList = (sharetoken, shareId, pfileid) => {
            return fetch('https://api.aliyundrive.com/adrive/v3/file/list', {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Share-Token': sharetoken
                },
                body: '{"share_id":"' + shareId + '","parent_file_id":"' + (pfileid ? pfileid : 'root') + '","limit":100,"image_thumbnail_process":"image/resize,w_160/format,jpeg","image_url_process":"image\/resize,w_1920/format,jpeg","video_thumbnail_process":"video/snapshot,t_1000,f_jpg,ar_auto,w_300","order_by":"name","order_direction":"DESC"}',
                method: 'POST'
            });
        }

        var rescod = JSON.parse(getFileList(sharetoken, shareId));

        const rendererList = (rescod, getFileList, rendererList, sharetoken, shareId) => {
            var conts = rescod.items;
            var d = [];
            for (var i in conts) {
                var listyp = conts[i].type;
                var title = conts[i].name;
                var isVideo = /(mkv|mp4|m3u8|flv|avi|wmv|mpeg|rmvb|mov|ogg|3gp)$/i.test(title);
                if (listyp != 'folder') {
                    title = isVideo ? '🎬 ' + title : '🌇 ' + title;
                    if(isVideo) {
                        d.push({
                            title: title,
                            url: $(conts[i].file_id).lazyRule((shareId, sharetoken) => {
                                eval(fetch('hiker://files/rules/icy/ali.js'));
                                return ali.lazyAli(shareId, sharetoken, input);
                            }, shareId, sharetoken),
                            col_type: 'text_1'
    
                        });
                    } else {
                        d.push({
                            title: title,
                            url: $(conts[i].file_id).lazyRule((shareId, sharetoken) => {
                                return "toast://暂不支持查看该文件！"
                            }, shareId, sharetoken),
                            col_type: 'text_1'

                        });
                    }
                } else {
                    // 如果只包含一个文件夹， 直接取内容
                    if(conts.length === 1) {
                        var result = getFileList(sharetoken,shareId, conts[i].file_id);
                        rendererList(JSON.parse(result), getFileList,rendererList, sharetoken,shareId)
                    } else {
                        d.push({
                            title: '🦑 ' +conts[i].name,
                            url: $('hiker://empty' + conts[i].file_id).rule((shareId, sharetoken, getFileList, rendererList) => {
                                var rescod = getFileList(sharetoken,shareId, getResCode());
                                rendererList(JSON.parse(rescod), getFileList,rendererList, sharetoken,shareId)
                            }, shareId, sharetoken, getFileList, rendererList),
                            col_type: 'text_1'
    
                        });
                    }

                }
            }
            if(!conts || !conts.length) {
                d.push({
                    title: "““””<center style='height: 100vh; display:flex; align-items: center;justify-content: center;'><small>"+'<span style="color: #999999">空文件夹，或者分享已经失效了！</span></small></center>',
                    url: this.emptyRule,
                    col_type: "text_1"
                });
            }
            setHomeResult({
                data: d
            });

        }
        if(rescod.code && rescod.code.includes('AccessTokenInvalid')) {
            var d = [];
            d.push({
                url: $('').input((link)=> {
                    if(input.trim()) {
                        return 'hiker://page/detail?url=' + link + '?share_pwd=' + input;
                    } else {
                        return 'toast://请输入提取码';
                    }
                }, link),
                title: '““””🔑 <b><span style="color: #f47983">请输入提取码</span></b>',
                col_type: "text_1"
            })
            setHomeResult({
                data: d
            });
        }
        rendererList(rescod, getFileList, rendererList, sharetoken, shareId);
    },
    otherSearch: function(keyword, page, d, search_model, search_folder_or_file){
        var url = 'https://www.alipanso.com/search.html?page='+page+'&keyword='+keyword+'&search_folder_or_file='+search_folder_or_file+'&is_search_folder_content=1&is_search_path_title=1&category=all&file_extension=all&search_model='+ search_model;
        var res = fetch(url, {headers: {"Referer": 'https://www.alipanso.com', 'User-Agent' : 'PostmanRuntime/7.26.8'}});
        const items = parseDomForArray(res, 'body&&.resource-item');
        // var lazy = $('').rule(() => {
        //     eval(fetch('hiker://files/rules/icy/ali.js'));
        //     ali.otherDetail();
        // })
        
        items.forEach(item => {
            var href = parseDomForHtml(item, 'a&&href') || '';
            if(href && href.startsWith('http') && !href.includes('alipanso.com')) {
                return false;
            }
            var url = 'https://www.alipanso.com/' + href;
            var lazy = $('').lazyRule(() => {
                const res = fetch(input); 
                var link = parseDomForHtml(res, 'a&&href').match(/https:\/\/(www\.aliyundrive\.com\/s|alywp\.net)\/\w*/g)[0];
                if(link) {
                    return 'hiker://page/detail?url=' + link;
                } else {
                    return "toast://好像出错了！"
                }
            })
            d.push({
                title: parseDomForHtml(item, 'h1&&Text'),
                url: url + lazy,
                desc:  parseDomForHtml(item, '.resource-meta&&Text') + '\n' + parseDomForHtml(item, '.resource-meta,1&&.meta-item&&Text'),
                col_type: 'text_1'
            })
        })
    },
    otherDetail: function() {
        var res = {};
        var d = [];
        setPageTitle('网盘链接');
        var link = parseDomForHtml(getResCode(), 'a&&href').match(/https:\/\/(www\.aliyundrive\.com\/s|alywp\.net)\/\w*/g)[0];
        d.push({
            title: '🔗 '+link,
            url: 'hiker://page/detail?url=' + link,
            col_type: 'text_1'
        })
        res.data = d;
        setHomeResult(res);
    }
}