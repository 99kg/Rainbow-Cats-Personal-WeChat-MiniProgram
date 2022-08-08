/* Main page of the app */
Page({
    data: {
        creditA: 0,
        creditB: 0,

        userA: '',
        userB: '',
        user: "",
        days: 0,
    },

    async onShow(){
        this.getCreditA()
        this.getCreditB()
        this.getUser()
        this.setData({
            userA: getApp().globalData.userA,
            userB: getApp().globalData.userB,
        })
        this.setData({
            days: this.getDate('2022-03-13 00:00:00', this.getNowTime())
        })
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
        //  如果需要时分秒，就放开
        var h = now.getHours();
        var m = now.getMinutes();
        var s = now.getSeconds();
        var formatDate = year + '-' + month + '-' + day + ' ' + h + ':' + m + ':' + s;
        return formatDate;
  },

})