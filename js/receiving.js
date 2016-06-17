/**
 * Created by chenshaoting on 16/05/07.
 */
/*+function ($){
    var ReceivingMenu = function(element,options){
        this.$element = $(element);
        this.options = $.extend({},ReceivingMenu.DEFAULTS,options);
        //当前页
        this.$pageNo=this.options.pagination.pageNo;
        //页数 = 总条数 / 每页显示条数
        this.$pages= Math.ceil(this.options.pagination.total / this.options.pagination.pageSize);
        //console.log(this.$pageNo +'----'+this.$pages);

        this.init();
    };*/
	
	+function ($){
    var ReceivingMenu = function(element,options){
        this.$element = $(element);
        this.options = $.extend({},ReceivingMenu.DEFAULTS,options);
        this.pageNo = 0;//当前页
        this.pages = 0;//总页数
        this.init();
    };

    /*格默认属性*/
   /* ReceivingMenu.DEFAULTS = {
        pagination:{
            total:0,   // 总记录数
            pageNo: 1,               // 当前页
            pageSize: 5     // 每页五条数据
        },
        tostaff: null,
        staff: null
	   
    };*/
	ReceivingMenu.DEFAULTS = {
        pagination: null,
        tostaff: null,
        staff: null
    };

    /*表格初始化*/
    ReceivingMenu.prototype.init = function() {

        this.createDom();
		/*右侧数据*/

        this.sdata(this.options.staff);//tostaff对应html上的
        /*左侧数据*/
        this.data(this.options);
		/*默认选中初始化*/
		/*this.current(this.options.current);*/
		
		/*事件初始化*/
		this.initEvent();
    };


    ReceivingMenu.prototype.createDom = function() {
        var html='<div class="my_all">'+
                    '<div class="staff_all">'+
                        '<div class="jiantou"></div>'+
                        '<div class="dingwei">'+
                            '<div class="search"><i class="iconfont icon-sousuo"></i><input type="text" value="" placeholder="搜索姓名" /></div>'+
                            '<ul class="staff_ul"> </ul>'+
                            '<div class="footer">'+
                                '<div class="quanxuan"><label><input class="inp mychkboxAlle" name="" type="checkbox" value="" style=" margin-right: 6px" />全选</label></div>'+
                                '<div class="pages"></div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                    '<div class="staff_selected">'+
                        '<div class="tit">已选收信人</div>'+
                        '<ul class="staff_sel"></ul>'+
                    '</div>'+
                  '</div>';
                 this.$element.html(html);
    }




	/*左侧数据/样式初始化  */
	ReceivingMenu.prototype.data = function(data) {
		var $tostaff = data.tostaff;
        html='';
        $tostaff > 0 && this.$element.find(".quanxuan").show();//左侧不为空，显示全选按钮
		for (var i = 0, lens = $tostaff.length; i < lens; i += 1) {
             html += '<li pid="'+ $tostaff[i].id +'" college="'+ $tostaff[i].college +'">' +
                         '<label>' ;
                         //console.log(this.$element.find(".staff_sel li[pid="+ $tostaff[i].id +"]").length);
                         if(this.$element.find(".staff_sel li[pid="+ $tostaff[i].id +"]").length === 1){
                             html +=  '<input class="inp mychkboxe" type="checkbox" checked="checked" />';
                         }else{
                             html +=  '<input class="inp mychkboxe" type="checkbox" />';
                         }
                    html += ' '+ $tostaff[i].name +' <span>('+ $tostaff[i].num +')</span></label>' +
                     '</li>';
        };
        this.$element.find(".staff_ul").html(html);
        data.pagination && this.pagination(data.pagination); //设置分页
    };

    /*右侧侧数据/样式初始化   */
    ReceivingMenu.prototype.sdata = function($selected) {
        //console.log($selected);
        //var $staff = data.staff;
        var html='';
        //console.log($selected.length);
        for (var i = 0, lens = $selected.length; i < lens; i += 1) {
            html += '<li class="cs-selected__item" pid="'+ $selected[i].id +'"><div class="names">'+$selected[i].name +'<span>('+ $selected[i].num +')</span></div><div class="education">'+ $selected[i].college +'</div><div class="delete">删除</div></li> ';
        };
        this.$element.find(".staff_sel").html(html);
		this.pagination(this.options.pagination); //设置分页
    };


 /*分页初始化*/
    ReceivingMenu.prototype.pagination = function(pagination) {
		this.pageNo = Math.ceil(pagination.pageNo);
        this.pages =  Math.ceil(pagination.total / pagination.pageSize);
        this.$element.find('.fenye').remove();
        //当前页小于页数
        if(this.pageNo < this.pages) {
            var html = '<div class="fenye">' +
                            '<div>' +
                                '<a href="#" class="previous pag_li disabled" data-action="previous"><i class="iconfont icon-navigatebefore icon_zt"></i></a>' +
                                '<div class="pag_con">' +
                                    '<input class="pag_con_input" type="text" value="'+ (this.pageNo) +'">' +
                                    '<span class="pag_xue">／</span>' +
                                    '<span class="pag_zong">'+ this.pages +'</span>' +
                                '</div>' +
                                '<a href="#" class="next pag_li" data-action="next"><i class="iconfont icon-navigatenext icon_zt"></i></a>' +
                            '</div>' +
                      '</div>';
            this.$element.find(".pages").html(html);
        }
    }







	/*默认选中初始化*/
    ReceivingMenu.prototype.current = function(current) {
        
    };
	
	/*事件初始化*/
    ReceivingMenu.prototype.initEvent = function() {
        var self = this;

        /*单选*/
        this.$element.on('click',"ul.staff_ul li input[type='checkbox']", function(){
            //alert(123);
            $(this).is(":checked") ? appendhtml($(this)) : removehtml($(this)) ;
            //console.log($(this).is(":checked"));
            chkAll();
        });
        /*全选*/
        $(".mychkboxAlle").on('click', function(){
            if($(this).is(":checked")){
                $("ul.staff_ul li input[type='checkbox']").each(function(){
                    var $pid = $(this).parents("li").attr("pid"); //当前pid
                    $("ul.staff_sel li[pid="+$pid+"]").length === 0 && appendhtml($(this)); //不存在则添加
                });
                //checkbox全部选中
                $("ul.staff_ul li").find("input[type='checkbox']").prop("checked", true);
            }else{
                $("ul.staff_ul li input[type='checkbox']").each(function(){
                    var $pid = $(this).parents("li").attr("pid"); //当前pid
                    $("ul.staff_sel li[pid="+$pid+"]").length === 1 && removehtml($(this)); //存在则移除
                });
                //checkbox全部取消选中
                $("ul.staff_ul li").find("input[type='checkbox']").prop("checked", false);
            }

        });
        //是否全选
        function chkAll(){
            var $chklen = $("ul.staff_ul li input[type='checkbox']:checked");  //选中个数
            var $len = $("ul.staff_ul li input[type='checkbox']");  //总个数
            if($chklen.length === $len.length){
                $(".mychkboxAlle").prop("checked", true);
            }else{
                $(".mychkboxAlle").prop("checked", false);
            }
        }





        /*删除当前一行数据*/
        this.$element.on('click', 'ul.staff_sel .delete', function(){
            removehtml($(this));
            chkAll();
        });




        //添加信息
        function appendhtml(elm){
            var $this = elm.parent(),
                html = '<li class="cs-selected__item" pid="'+$this.parent().attr("pid")+'"><div class="names">'+$("label",$this.parent()).eq(0).text()+'</div><div class="education">'+$this.parent().attr("college")+'</div><div class="delete">删除</div></li>';
            //alert($this.parent().attr("pid")+"--"+$("label",$this.parent()).eq(0).text());
            $("ul.staff_sel").append(html); //将条目自动添加到右侧(已选收信人)中
        }
        //删除条目
        function removehtml(elm){
            var $pid = elm.parents("li").attr("pid");
            $("ul.staff_sel li[pid="+$pid+"]").remove(); //移除删除的条目
            $("ul.staff_ul li[pid="+$pid+"]").find("input").prop("checked", false); //取消checkbox选中
            //alert($pid);

        }

        /*分页 下一页*/
        this.$element.on('click', '.next', function(){
            if($(this).hasClass("disabled")) return; //最后页不可点
            self.pageNo = self.pageNo+ 1;  //更新当前页
            self.$element.find(".fenye input").val(self.pageNo); //给文本框赋值
            
            //删除上一页的上不可点效果
            self.$element.find(".fenye .previous").removeClass("disabled");  
            if(self.pageNo=== self.pages) $(this).addClass("disabled");  //给最后一页加上不可点效果
            self.options.topage.call(self, self.pageNo);
        });
		
		
        /*分页 上一页*/
        this.$element.on('click', '.previous', function(){
            if($(this).hasClass("disabled")) return; //第一页不可点
            self.pageNo = self.pageNo-1;  //更新当前页
            self.$element.find(".fenye input").val(self.pageNo); //给文本框赋值

            //删除下一页的上不可点效果
            self.$element.find(".next").removeClass("disabled");  
            if(self.pageNo === 1) $(this).addClass("disabled");  //给上一页加上不可点效果
            self.options.topage.call(self, self.pageNo);
        });
		
		
		/*搜索*/
		$(self.$element).on("click",".icon-sousuo",function(){		
            var keyword = $(".search input").val();
   			self.options.search.call(self,keyword);
        });
		
		/*回车键进行查询*/
		$(self.$element).on('change',".search input", function(event){
			var keyword = $(".search input").val();
   			self.options.search.call(self,keyword);
		});

        



    };


    function Plugin(option){
        var args = Array.prototype.slice.call(arguments, 1);
        var returnValue = this;
        this.each(function(){
            var $this = $(this),
                data = $this.data('mg.receivingmenu'),
                options = typeof option === 'object' && option;

            if(!data){
                $this.data('mg.receivingmenu',(data = new ReceivingMenu(this,options)));
            }

            if(typeof option === 'string'){
                returnValue = data[option].apply(data, args) || returnValue;
            }
        });
        return returnValue;
    }

    var old = $.fn.receivingmenu;

    $.fn.receivingmenu = Plugin;
    $.fn.receivingmenu.Constructor = ReceivingMenu;

    $.fn.receivingmenu.noConflict = function(){
        $.fn.receivingmenu = old;
        return this;
    }
}(jQuery);