Page({
    //保存正在编辑的任务
    data: {
      title: '',
      desc: '',
      credit: 0,

      maxCredit: getApp().globalData.maxCredit,
      presetIndex: 0,
      presets: [{
        name:"无预设",
        title:"",
        desc:"",
        credit: 0,
      },{
        name:"早睡早起",
        title:"晚上要早睡，明天早起",
        desc:"熬夜对身体很不好，还是要早点睡觉第二天才能有精神！",
        credit: 1,
      },{
        name:"大郎吃药",
        title:"吃药💊！",
        desc:"大郎醒醒，吃药啦！",
        credit: 1,
      },{
        name:"勤奋学习",
        title:"书山有路勤为径，学海无涯苦作舟",
        desc:"劝君莫惜金缕衣,劝君惜取少年时。",
        credit: 10,
      },{
        name:"打扫房间",
        title:"清扫房间，整理整理",
        desc:"有一段时间没有打扫房间了，一屋不扫，何以扫天下？",
        credit: 5,
      },{
        name:"制作饭菜",
        title:"这道美食由我完成",
        desc:"做点可口的饭菜，或者专门被指定的美食。我这个大厨，随便下，都好吃。",
        credit: 5,
      },{
        name:"健康运动",
        title:"做些运动，注意身体",
        desc:"做一些健身运动吧，跳绳，跑步，训练动作什么的。",
        credit: 1,
      },{
        name:"局部按摩",
        title:"劳累一天，按个摩吧",
        desc:"娴熟的手法，让人回味无穷！欢迎光临！",
        credit: 2,
      },{
        name:"洗碗洗碟",
        title:"这碗碟我洗了",
        desc:"有我洗碗洗碟子，有你吃饭无它事。",
        credit: 5,
      },{
        name:"清洗衣物",
        title:"洗完芳香扑鼻",
        desc:"竹喧归浣女，莲动下渔舟。",
        credit: 5,
      },{
        name:"请客吃饭",
        title:"请客吃点好的",
        desc:"一生大笑能几回,斗酒相逢须醉倒！",
        credit: 5,
      },{
        name:"买小礼物",
        title:"整点小礼物",
        desc:"买点小礼物，惊喜随处可见。",
        credit: 10,
      }],
      list: getApp().globalData.collectionMissionList,
    },
  
    //数据输入填写表单
    onTitleInput(e) {
      this.setData({
        title: e.detail.value
      })
    },
    onDescInput(e) {
      this.setData({
        desc: e.detail.value
      })
    },
    onCreditInput(e) {
      this.setData({
        credit: e.detail.value
      })
    },
    onPresetChange(e){
      this.setData({
        presetIndex: e.detail.value,
        title: this.data.presets[e.detail.value].title,
        desc: this.data.presets[e.detail.value].desc,
        credit: this.data.presets[e.detail.value].credit,
      })
    },
  
    //保存任务
    async saveMission() {
      // 对输入框内容进行校验
      if (this.data.title === '') {
        wx.showToast({
          title: '标题未填写',
          icon: 'error',
          duration: 2000
        })
        return
      }
      if (this.data.title.length > 20) {
        wx.showToast({
          title: '标题过长',
          icon: 'error',
          duration: 2000
        })
        return
      }
      if (this.data.desc.length > 100) {
        wx.showToast({
          title: '描述过长',
          icon: 'error',
          duration: 2000
        })
        return
      }
      if (this.data.credit <= 0) {
        wx.showToast({
          title: '一定要有积分',
          icon: 'error',
          duration: 2000
        })
        return
      }else{
          await wx.cloud.callFunction({name: 'addElement', data: this.data}).then(
              () => {
                  wx.showToast({
                      title: '添加成功',
                      icon: 'success',
                      duration: 1000
                  })
              }
          )
          setTimeout(function () {
              wx.navigateBack()
          }, 1000)
      }
    },
  
    // 重置所有表单项
    resetMission() {
      this.setData({
        title: '',
        desc: '',
        credit: 0,
        presetIndex: 0,
        list: getApp().globalData.collectionMissionList,
      })
    }
  })