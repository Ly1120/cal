Page({

  /**
   * 页面的初始数据
   */
  data: {
    id1: "back",
    id2: "clear",
    id3: "megative",
    id4: "+",
    id5: "7",
    id6: "8",
    id7: "9",
    id8: "-",
    id9: "4",
    id10: "5",
    id11: "6",
    id12: "×",
    id13: "1",
    id14: "2",
    id15: "3",
    id16: "÷",
    id17: "0",
    id18: ".",
    id19: "history",
    id20: "=",
    screenData: "0",//显示出来的式子
    lastIsOperator:false,//用来控制加减乘除不能连续点击且不能出现在第一位
    spot: false,//用来控制小数点不能连续点击
    arr:[],//定义数组
    logs:[]//存放计算记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  clickButton: function (event) {
    console.log(event.target.id);//在控制台打印所点击id对应的值
    var id = event.target.id;

    if (id == this.data.id1) {//退格
      var data = this.data.screenData;
      if (data == 0) {
        return;
      }//如果是0，不需要退格
      data = data.substring(0, data.length - 1);//如果不是0，就把长度减一位      
      if (data == "" || data == "-") {//如果为空或者是符号，就变成0
        data = 0;
      }
      this.setData({ screenData: data });
      this.data.arr.pop();
    } else if (id == this.data.id2) {//清屏
      this.setData({ screenData: "0" });
      this.data.arr.length=0;
    } else if (id == this.data.id3) {//正负号
      var data = this.data.screenData;
      if (data == 0) {
        return;
      }//如果是0，不需要正负号
      var firstWorld = data.substring(0, 1);//substring:截取字符
      if(firstWorld=="-"){
        data=data.substring(1,data.length);//如果原来是负号，变为正号
        this.data.arr.shift();
      }else{
        data = "-" + data;//否则变为负号
        this.data.arr.upshift("-");
      }
      this.setData({screenData:data});
    } else if (id == this.data.id20){//等号
      var data = this.data.screenData;//获取要计算的式子
      if(data==0){//如果为0，不做处理
        return;
      }
      var lastWord = data.substring(data.length-1,data.length);//获取到最后一个字符（应该为数字）
      if(isNaN(lastWord)){//如果不是数字，不做处理
        return;
      }

      var num="";
      var lastOperator;
      var arr = this.data.arr;//定义数组来依次获取到式子中每个字符的值。
      var optarr = [];

      for(var i in arr){
        if (isNaN(arr[i]) == false || arr[i] == this.data.id18 || arr[i] == this.data.id3) {
          //将连续的数字组成一个多位数，如果遇到小数点或者正负号，不中断
          num+=arr[i];//将多位数记为num
        }else{//遇到运算符号，执行以下操作
          lastOperator = arr[i];//将运算符号记为lastOperator
          optarr.push(num);//将num放进optarr数组
          optarr.push(arr[i]);//将运算符号也放进optarr数组
          num="";//将num清空，便于下次运算
        }
      }

      optarr.push(Number(num));
      var result = Number(optarr[0]) * 1.0;//定义结果为第一个运算数字
      console.log(result)
      for(var i=1;i<optarr.length;i++){
        if(isNaN(optarr[i])){
          if(optarr[1]==this.data.id4){
            result+=Number(optarr[i+1]);
          } else if (optarr[1] == this.data.id8){
            result -= Number(optarr[i + 1]);
          } else if (optarr[1] == this.data.id12){
            result *= Number(optarr[i + 1]);
          } else if (optarr[1] == this.data.id16){
            result /= Number(optarr[i + 1]);
          }
        }
      }
      this.data.logs.push(data+"="+result)
      wx.setStorageSync('callog', this.data.logs);
      this.data.arr.length=0;//计算完成后数组清空
      this.data.arr.push(result);
      this.setData({screenData:result+""});
    }


     else {
      if (id == this.data.id4 || id == this.data.id8 || id == this.data.id12 || id == this.data.id16){//控制操作符不能重复点击
        if(this.data.lastIsOperator==true||this.data.screenData==0){
          return;
        }
      }

      if(id ==this.data.id18){
        if(this.data.spot==true){
          return;
        }
      }
      var sd = this.data.screenData;//定义当前显示的值为sd
      var data;
      if (sd == 0) {
        data = id;
      } else {
        data = sd + id;
      }
      this.setData({ screenData: data });
      this.data.arr.push(id);

      if (id == this.data.id4 || id == this.data.id8 || id == this.data.id12 || id == this.data.id16){//判断最后一位字符是否为加减乘除
        this.setData({lastIsOperator:true});
      }else{
        this.setData({ lastIsOperator:false});
      }

      if(id == this.data.id18){
        this.setData({spot:true});
      }else{
        this.setData({spot:false});
      }
    }
  },

  history: function () {
    wx.navigateTo({
      url: '../list/list'
    })
  }
})

