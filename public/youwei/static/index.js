var pan={
    "code": 0,
    "errMsg": "",
    "data": {
      "stock1": {
        "current": 3323.85,
        "percent": -0.21,
        "chg": -6.88,
        "name": "上证指数"
      },
      "stock2": {
        "current": 10544.02,
        "percent": -1.91,
        "chg": -204.95,
        "name": "深证成指"
      },
      "stock3": {
        "current": 2190.95,
        "percent": -2.35,
        "chg": -52.67,
        "name": "创业板指"
      },
      "volume": 16.13,
      "amount": 17533.47,
      "capital": 84.96,
      "new_volume": 1612.61,
      "new_capital": 849643.4,
      "float_capital": 359584.35,
      "main": -809.88,
      "waizi": "0.00",
      "neizi": "840.00",
      "update": 1731913213,
      "open": 0
    }
  }
var Message = {
    page : 1,
    ids:[],
    newData:[],
    init:function(){
        var that = this;
        $(".index-row").each(function(){
            var val = $(this).attr("data-id");
            if($.inArray(val, that.ids) == -1){
                that.ids.push(parseInt(val));
            }
        });
        this.heartBeat();
    },
    template:function(data){
        var html = "";
        for(var i =0; i< data.length; i++){
            html += '<div class="index-row" data-id="'+ data[i]['id'] +'">' +
                '<div class="index-row-title">'+ data[i]['create_time'] +'</div>' +
                '<div class="index-row-content font-color'+ data[i]['color'] +'">'+
                data[i]['content'] +'</div></div>';
        }
        return html;
    },

    makeHtml:function(data, page){
        var newData = [];
        var html = "";
        for(var i=0; i < data.length; i++){
            if($.inArray(data[i]['id'], this.ids)  == -1){
                this.ids.push(data[i]['id']);
                newData.push(data[i]);
            }
        }
        if((page === 1)){
            if((newData.length == 0)){
                return;
            }
            this.newData = newData.concat(this.newData);
            html = "有<span>"+ this.newData.length +"</span>条新信息";
            $('.index-tips').show().empty().append(html);
        }else{
            html = this.template(newData);
            $('.index-body').append(html);
        }
    },

    appendNewContent:function(){
        $('.index-tips').empty().hide();
        if(this.newData.length > 0){
            var html = this.template(this.newData);
            $('.index-body').prepend(html);
            this.newData = [];
        }
    },

    getDataFromServer:function(page){
        var that = this;
        $.get("/msg",{'page':page}, function(resp){
            that.makeHtml(resp.data, page);
        })
    },

    heartBeat:function(){
        var that = this;
        setTimeout(function(){
            that.getNewPage();
        }, 30000);
    },

    getNewPage:function(){
        this.getDataFromServer(1);
        this.heartBeat();
    },

    getNextPage:function(){
        this.page += 1;
        this.getDataFromServer(this.page);
    }
};

var DaPan = {
    init:function(){
        this.getDataFromServer();
        this.heartBeat();
    },

    makeHtml: function (data) {
        //var isOpen = parseInt(data.open) || 0;
        //this.makePanelHtml(".dapan", isOpen, data.stock1);
        //if(isOpen){}
        this.makeStockHtml("#pan-stock1", data.stock1);
        this.makeStockHtml("#pan-stock2", data.stock2);
        this.makeStockHtml("#pan-stock3", data.stock3);
        this.makeOtherHtml("#pan-capital", data.capital, true);
        this.makeOtherHtml("#pan-volume", data.volume, true);
        this.makeOtherHtml("#pan-amount", data.amount, true);
        this.makeOtherHtml("#pan-main", data.main, false);
        this.makeOtherHtml("#pan-waizi", data.waizi, false);
        this.makeOtherHtml("#pan-neizi", data.neizi, false);

    },

    makePanelHtml:function(nodeId, isOpen, stock1){
        if(isOpen){
            $(nodeId).removeClass('xiupan');
            if(stock1.chg > 0){
                $(nodeId).css('background', '#fcebe8');
            }else if(stock1.chg == 0){
                $(nodeId).css('background', '#ffffff');
            }else{
                $(nodeId).css('background', '#e8f6ec');
            }
        }else{
            $(nodeId).addClass('xiupan');
            $(nodeId).find("span").each(function(){
                $(this).css('color', '#093');
            })
        }
    },

    makeOtherHtml:function(nodeId, data, flag){
        if(flag === true){
            $(nodeId +" span:nth-child(2)").css('color', '#111').html(data);
        }else{
            if(data >= 0){
                $(nodeId +" span:nth-child(2)").css('color', '#d20').html(data);
            }else{
                $(nodeId +" span:nth-child(2)").css('color', '#093').html(data);
            }
        }
    },

    makeStockHtml:function(nodeId, data){
        if(data.chg >= 0){
            $(nodeId +" span:nth-child(2)").css('color', '#d20').html(data.current);
            $(nodeId +" span:nth-child(3)").css('color', '#d20').html(data.chg + '(' + data.percent +'%)');
        }else{
            $(nodeId +" span:nth-child(2)").css('color', '#093').html(data.current);
            $(nodeId +" span:nth-child(3)").css('color', '#093').html(data.chg + '(' + data.percent +'%)');
        }
    },

    getDataFromServer:function(){
        var that = this;
        // $.get("https://upsort.com/pan", function(resp){
        //     that.makeHtml(resp.data);
        // })
      
            that.makeHtml(pan.data);
       
    },

    heartBeat:function(){
        var that = this;
        setTimeout(function(){
            that.getDataFromServer();
            that.heartBeat();
        }, 20000);
    }
};