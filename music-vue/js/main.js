/*
  1:歌曲搜索接口
    请求地址:https://autumnfish.cn/search
    请求方法:get
    请求参数:keywords(查询关键字)
    响应内容:歌曲搜索结果

  2:歌曲url获取接口
    请求地址:https://autumnfish.cn/song/url
    请求方法:get
    请求参数:id(歌曲id)
    响应内容:歌曲url地址
  3.歌曲详情获取
    请求地址:https://autumnfish.cn/song/detail
    请求方法:get
    请求参数:ids(歌曲id)
    响应内容:歌曲详情(包括封面信息)
  4.热门评论获取
    请求地址:https://autumnfish.cn/comment/hot?type=0
    请求方法:get
    请求参数:id(歌曲id,地址中的type固定为0)
    响应内容:歌曲的热门评论
  5.mv地址获取
    请求地址:https://autumnfish.cn/mv/url
    请求方法:get
    请求参数:id(mvid,为0表示没有mv)
    响应内容:mv的地址
*/
var app = new Vue({
  el: '#app',
  data: {
    //查询关键字
    query: '',
    //歌曲数组
    musicList: [],
    //歌曲地址
    musicUrl: '',
    //封面地址
    musicCover: "",
    //评论数组
    commentList: [],
    //歌曲是否播放
    isPlay: false,
    //切换当前播放样式
    isIndex: -1,
    //遮罩层显示状态
    isShow: false,
    //mv地址
    mvUrl: '',
    //歌曲数组的长度
    len: -1,
    //当前歌曲的id
    nowid: -1,
    //音乐总时间
    total: '00:00',
    //进度条的width
    w: 0,
    //当前音量
    currentVolume:0,
    //静音标志
    muteFlag:true
  },

  methods: {
    //歌曲信息
    musicMessage: function (nowid) {
      var that = this;
      that.isIndex = this.len;
      axios
        .get("https://autumnfish.cn/song/url?id=" + this.nowid)
        .then(function (response) {
          // console.log(response);
          that.musicUrl = response.data.data[0].url;

        }, function (err) { alert('哈哈哈');})

      //歌曲详情获取
      axios
        .get("https://autumnfish.cn/song/detail?ids=" + this.nowid)
        .then(function (response) {
          // console.log(response);
          that.musicCover = response.data.songs[0].al.picUrl;
        }, function (err) { alert('嘿嘿嘿');})
      //歌曲评论  
      axios
        .get("https://autumnfish.cn/comment/hot?type=0&id=" + this.nowid)
        .then(function (response) {
          // console.log(response.data.hotComments);

          that.commentList = response.data.hotComments;
        }, function (err) { alert('哇哇哇');})


    },


    //歌曲搜索
    searchMusic: function () {
      var that = this;
      
      axios
        .get("https://autumnfish.cn/search?keywords=" + this.query)
        .then(function (response) {
          console.log(response); /*测试是否收到数据*/
          that.musicList = response.data.result.songs;
          // console.log(that.musicList[4]);
   
        }, function (err) { })
    },
    //歌曲播放
    playMusic: function (musicId, index) {
      var that = this;
      //  console.log(musicId);
      that.isIndex = index;
      //获取当前的歌曲下标
      that.len = index;

      axios
        .get("https://autumnfish.cn/song/url?id=" + musicId)
        .then(function (response) {
          // console.log(response);
          that.musicUrl = response.data.data[0].url;

        }, function (err) { });

      //歌曲详情获取
      axios
        .get("https://autumnfish.cn/song/detail?ids=" + musicId)
        .then(function (response) {
          // console.log(response);
          that.musicCover = response.data.songs[0].al.picUrl;
        }, function (err) { })
      //歌曲评论  
      axios
        .get("https://autumnfish.cn/comment/hot?type=0&id=" + musicId)
        .then(function (response) {
          // console.log(response.data.hotComments);

          that.commentList = response.data.hotComments;
        }, function (err) { })
    },
    //audio的play和pause事件
    playAid: function () {
      var audio = document.querySelector('.myaudio');
      if (!this.isPlay) {
        audio.play();
        this.isPlay = !this.isPlay;
      } else {
        audio.pause();
        this.isPlay = !this.isPlay;
      }

    },
    //播放mv
    playMv: function (mvid) {
      var that = this;
      axios
        .get('https://autumnfish.cn/mv/url?id=' + mvid)
        .then(function (response) {
          // console.log(response.data.data.url);
          that.isShow = !that.isShow;
          that.mvUrl = response.data.data.url;


        }, function (err) { })
    },
    //隐藏
    hide: function () {
      this.isShow = !this.isShow;
    },
    //上一首
    prev: function () {
      this.len = this.len - 1;
      this.nowid = this.musicList[this.len].id;
      this.musicMessage(this.nowid);
      if (this.isPlay) {
        this.isPlay = !this.isPlay;
      } else { }
    },
    //下一首
    next: function () {
      this.len = this.len + 1;
      this.nowid = this.musicList[this.len].id;
      this.musicMessage(this.nowid);

      if (this.isPlay) {
        this.isPlay = !this.isPlay;
      } else { }

    },
    //歌曲总时间和当前时间
    musicTime: function () {
      var audio = document.querySelector('.myaudio');
      var Times = parseInt(audio.duration);//歌曲总时间

      var m = parseInt(Times / 60);
      m = m < 10 ? '0' + m : m;
      var s = parseInt(Times - m * 60);
      s = s < 10 ? '0' + s : s;
      this.total = m + ':' + s;
    },
    //进度条
    progressBar: function () {
      var audio = document.querySelector('.myaudio');
      var line = document.querySelector('.line');
      audio.ontimeupdate = function () {
        // console.log(11);
        // console.log(audio.currentTime);//当前时间
        //进度条 = 当前时间 / 总的时间 *100 + %
        this.w = audio.currentTime / audio.duration * 100 + '%';
        line.style.width = this.w;
        // console.log(this.w);
      }
    },
    //点击跃进效果
    hitJump: function (event) {
      var rate = document.querySelector('rate');
      var audio = document.querySelector('.myaudio');
      //点击位置 / bar的长度 * 总的时长 = 当前的播放位置
      var offset = event.offsetX;//获取点击的位置
      //播放位置
      var location = offset / 430 * audio.duration;
      // console.log(location);
      audio.currentTime = location;

    },
    //控制音量
    musicVolume:function(event){
      var audio = document.querySelector('.myaudio');
      var offset = event.offsetX;//获取点击的位置
      var bar1   = document.querySelector(".bar1");
      bar1.style.width = offset + 'px';
      audio.volume = offset / 100  ;
      // console.log(offset);
      
      // audio.volume = 1.0;

      
    },
    //静音
    muted:function(){
      var audio = document.querySelector('.myaudio');
      var bar1 = document.querySelector('.bar1');
      audio.muted = this.muteFlag;
      this.muteFlag = !this.muteFlag;
      // bar1.style.width = 0 + 'px';
    }
    // //默认音量
    // defaultMute:function(){
    //   var audio = document.querySelector('.myaudio');
    //   var bar1 = document.querySelector('.bar1');
    //   // console.log(audio.volume);
      
    //   bar1.style.width = (audio.volume / 10) * 100 +'px';
    // }
    


  }
})