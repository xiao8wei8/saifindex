var Message = {
    page : 1,
    cate: 'all',
    uid: 0,
    ids:[],
    newData:[],

    init:function(cate, uid){
        var that = this;
        this.cate = cate || "xueqiu";
        this.uid = uid;
        $(".post-row").each(function(){
            var val = $(this).attr("data-id");
            if($.inArray(val, that.ids) == -1){
                that.ids.push(parseInt(val));
            }
        });
        this.showOrHide(this.ids, true);
    },

    template:function(data, newCate, newUid){
        var html = "";
        for(var i =0; i< data.length; i++){
            html += '<div class="post-row" data-id="'+ data[i]['id'] +'"><p class="post-title">';
            if(newCate == 'all'){
                html += '<a href="/v/index">['+data[i]['cate'] +']</a> ';
            }
            if(newUid == 0){
                html += '<a href="/v/index/'+data[i]['vid']+'">['+ data[i]['vname']+']</a> ';
            }
            html += '<a class="visited-a" target="_blank" href="'+ data[i]['url'] +'">'+data[i]['title']+'</a></p>';
            html += '<p class="post-time">'+data[i]['add_time']+'</p></div>';
        }
        return html;
    },

    makeHtml:function(data, newCate, newUid){
        this.showOrHide(data, false);
        var newData = [];
        for(var i=0; i < data.length; i++){
            if($.inArray(data[i]['id'], this.ids)  == -1){
                this.ids.push(data[i]['id']);
                newData.push(data[i]);
            }
        }
        var html = this.template(newData, newCate, newUid);
        $('.render-box').append(html);
    },

    showOrHide:function(data, flag){
        if(data.length < 20){
            if(flag == true){
                $('#add-more').hide();
                $('#no-more').hide();
            }else{
                $('#add-more').hide();
                $('#no-more').show();
            }
        }
    },

    getDataFromServer:function(){
        var that = this;
        var newPage = this.page + 1;
        var newCate = this.cate;
        var newUid = this.uid;

        $.get("/v/ajax/posts",{page:newPage, cate:newCate,uid:newUid}, function(resp){
            if(resp.data.length > 0){
                that.page = newPage;
            }
            that.makeHtml(resp.data, newCate, newUid);
        })
    },
};