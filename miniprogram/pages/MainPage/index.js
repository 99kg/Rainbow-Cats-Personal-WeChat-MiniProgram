/* Main page of the app */
Page({
    data: {
        creditA: 0,
        creditB: 0,

        userA: '',
        userB: '',
        user: '',

        days: 0,
        leaveDays: 0,

        text: '',

        lastTimeA: '',
        lastTimeB: '',
    },

    async onShow(){
        await wx.cloud.callFunction({name: 'getOpenId'}).then(async res => {
            await wx.cloud.callFunction({name: 'getElementByOpenId', data: {
                list: getApp().globalData.collectionStorageList,
                _openid: res.result
            }}).then(async data => {
            })
        })

        this.getCreditA()
        this.getCreditB()
        this.getUser()
        this.setData({
            userA: getApp().globalData.userA,
            userB: getApp().globalData.userB,
        })
        this.setData({
            days: this.getDate('2022-03-13 00:00:00', this.getNowTime()),
            //text: this.getText(this.data.textArr),
            leaveDays: this.getHour('2022-08-14 18:00:00', this.getNowTime()),
        })
        this.getLastTimeA()
        this.getLastTimeB()
        this.setTime()
        this.getApi()
    },

    getCreditA(){
        wx.cloud.callFunction({name: 'getElementByOpenId', data: {list: getApp().globalData.collectionUserList, _openid: getApp().globalData._openidA}})
        .then(res => {
          this.setData({creditA: res.result.data[0].credit})
        })
    },

    getCreditB(){
        wx.cloud.callFunction({name: 'getElementByOpenId', data: {list: getApp().globalData.collectionUserList, _openid: getApp().globalData._openidB}})
        .then(res => {
            this.setData({creditB: res.result.data[0].credit})
        })
    },
    
    getLastTimeA(){
        wx.cloud.callFunction({name: 'getElementByOpenId', data: {list: getApp().globalData.collectionUserList, _openid: getApp().globalData._openidA}})
        .then(res => {
            this.setData({lastTimeA: this.timeTransfer(res.result.data[0].date)})
        })
    },

    getLastTimeB(){
        wx.cloud.callFunction({name: 'getElementByOpenId', data: {list: getApp().globalData.collectionUserList, _openid: getApp().globalData._openidB}})
        .then(res => {
            this.setData({lastTimeB: this.timeTransfer(res.result.data[0].date)})
        })
    },

    async getUser(){
        await wx.cloud.callFunction({name: 'getOpenId'}).then(res => {
            if(res.result === getApp().globalData._openidA){
                this.setData({
                    user: getApp().globalData.userA,
                })
            }else if(res.result === getApp().globalData._openidB){
                this.setData({
                    user: getApp().globalData.userB,
                })
            }
        })
    },
    
    async setTime(){
        await wx.cloud.callFunction({name: 'getOpenId'}).then(async openid => {
            if(getApp().globalData._openidA === openid.result){
                wx.cloud.callFunction({name: 'editTime', data: {_openid: openid.result, value: new Date(), list: getApp().globalData.collectionUserList}})
            } else {
                wx.cloud.callFunction({name: 'editTime', data: {_openid: openid.result, value: new Date(), list: getApp().globalData.collectionUserList}})
            }
        })
    },

    getDate: function(startTime,endTime) {
        //日期格式化
        var start_date = new Date(startTime.replace(/-/g, "/"));
        var end_date = new Date(endTime.replace(/-/g, "/"));
        //转成毫秒数，两个日期相减
        var ms = end_date.getTime() - start_date.getTime();
        //转换成天数
        var days = parseInt(ms / (1000 * 60 * 60 * 24));
        return days;
   },

   getHour: function(startTime,endTime) {
    //日期格式化
    var start_date = new Date(startTime.replace(/-/g, "/"));
    var end_date = new Date(endTime.replace(/-/g, "/"));
    //转成毫秒数，两个日期相减
    var ms = end_date.getTime() - start_date.getTime();
    //转换成小时
    var hours = parseInt(ms / (1000 * 60 * 60));
    return hours;
},
    getNowTime: function() {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        if(month < 10) {
            month = '0' + month;
        };
        if(day < 10) {
            day = '0' + day;
        };
        var h = now.getHours();
        var m = now.getMinutes();
        var s = now.getSeconds();
        var formatDate = year + '-' + month + '-' + day + ' ' + h + ':' + m + ':' + s;
        return formatDate;
    },

    getText: function(textArr){
        return textArr[Math.floor(Math.random() * (textArr.length - 1))];
    },

    timeTransfer: function(utc_datetime){
        // 转为正常的时间格式 年-月-日 时:分:秒
        let new_datetime = utc_datetime.split("T")[0] + " " + utc_datetime.split("T")[1].split(".")[0];

        // 处理成为时间戳
        let timestamp = new Date(new_datetime.replace(/-/g, '/')).getTime();
        timestamp = timestamp / 1000;
        // 增加8个小时，北京时间比utc时间多八个时区
        timestamp = timestamp + 8 * 60 * 60;

        // 时间戳转为时间
        let date = new Date(parseInt(timestamp) * 1000);
        let YY = date.getFullYear() + '-';
        let MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
        let hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        let mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        let ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return YY + MM + DD + " " + hh + mm + ss;
    },

    getApi: function(){
        var that = this;
        let textResult = '';
        let textArr = ['山河浩瀚，宇宙浪漫，值得一看️', '只要有想见的人，就不是孤身一人', '妄想开始，爱情就来了', '放弃不难，但坚持一定很酷😋', '四季有春春有朝晨，朝晨有你方显珍贵🥹', '不要质疑前路，你要去的地方春暖花开🥰', '错过了落日余晖，还可以期待满天繁星🤩', '要可可爱爱，要逍遥自在🥳', '怀揣希望去努力，静待美好的出现🤗', '漫天星光沿途散播，长路尽处有灯火🤡', '爱的不是沿途风景，而是风景里有你🫰', '时间从来不语，却回答了所有问题🤟', '心存阳光，必有诗和远方', '时间是日久见人心的唯一见证者', '最好的心态是平静，最好的状态是简单❣️', '人不能白白活着，要白白胖胖地活着🤞', '总会相逢的，就像山川河流，万河归海‍️‍', '只要看到你的笑，世界就没有那么糟🐽', '平淡的日子装着最美的回忆', '我最近好像盐吃多了，咸得总是想你🍗', '愿往后余年，不负流年，不负自己', '万物皆缘，只有惜缘才能续缘', '♡ 愿你遍历山河，觉得人间值得 ♡', '愿你生活有惊喜，喜欢有回应🤗', '光怪陆离都经历，山川湖海放心里', '万物经过你，都变成柔软的样子', '🍑 ʜᴀ͟ᴘ͟ᴘ͟ʏ ᴇᴠᴇʀʏᴅᴀʏ̆̈ ', '🐈ིྀ 𝙃𝙖𝙥𝙥𝙮 𝙈𝙤𝙢𝙚𝙣𝙩 ◡̈°', '*    ˶⍤⃝˶ʜᴀᴘᴘʏ ᴅᴀʏs', '♬ ♬ ♩ ♡ ♪ ♪ ♫ ♭ ♫ ♡', '✐.ɴɪᴄᴇ ᴅᴀʏ 〰︎', '️ 今天天气是晴，心情是想你๑⃙⃘´༥`๑⃙⃘', 'ʜᴀᴠᴇ ᴀ ɴɪᴄᴇ ᴅᴀʏ︎', '𝙝𝙖𝙫𝙚 𝙖 𝙣𝙞𝙘𝙚 𝙙𝙖𝙮 𖠚ᐝ', '♡ Life+u＝sweet ♡', 'ɴɪᴄᴇ ᴛᴏ ᴍᴇᴇᴛ ʏᴏᴜ ◡̈⃝', '˙Ⱉ˙ฅ 你还真是当地小有名气的可爱鬼！', '🧏‍♀️我的小皮筋持有者上线啦ෆ⃛', '𝙸 𝚕𝚘𝚟𝚎 𝚢𝚘𝚞 𝚝𝚘 𝚝𝚑𝚎 𝚖̴𝚘̴𝚘̴𝚗̴ 𝚊𝚗𝚍 𝚋𝚊𝚌𝚔 🌕', '𝙅𝙪𝙨𝙩 𝙬𝙖𝙣𝙣𝙖 𝙠͇𝙞͇𝙨͇𝙨͇ 🅨🅞🅤', '♡ 𝙂𝙞𝙫𝙚 𝙮𝙤𝙪 𝙩𝙝𝙚 𝙗𝙚𝙨𝙩 ིྀ', '𝒽𝑜𝓃𝑒𝓎 𓆡你在身边 在你身边', '˗ˏˋˎˊ˗一屋两人三餐四季💞', 'ʚ◡̈⃝ɞ 整个夏天想和你环游全世界', '—❥.°ʚ ι ℓσиɛ ʏσʋ ɞ°. ❥—', '-🌼🏻🏻ɴɪᴄᴇ ᴅᴀʏ︎',];
        var re = new RegExp("[\\u4E00-\\u9FFF]+", "g")
        wx.request({
          url: 'https://api.tianapi.com/caihongpi/index?key=9bf290c0e07a7ed64ed4cb4ff6b07562',
          method: 'GET',
          success: function(res) {
            if (res.statusCode == 200) {
                textResult = res.data.newslist[0].content;
                if (re.test(textResult.charAt(textResult.length - 1))) {
                    textResult = textResult.concat('。');
                }
                if (textResult.length <= 30) {
                    that.setData({text: textResult})
                } else {
                    that.setData({text: textArr[Math.floor(Math.random() * (textArr.length - 1))]})
                }
            }
          },
          fail: function() {
            textResult = textArr[Math.floor(Math.random() * (textArr.length - 1))];
            if (re.test(textResult.charAt(textResult.length - 1))) {
                textResult = textResult.concat('。');
            }
            that.setData({text: textResult})
          },
        })
    },
})