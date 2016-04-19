//jQuery.fn.extend({
//			slideRight: function(type, speed) {
//				return this.each(function() {
//					switch (type) {
//						case "show":
//							$(this).animate({
//							width: 150
//							});
//							break;
//						case "hide":
//							$(this).animate({
//							width: 10
//							});
//							break;
//						};
//
//				});
//			}
//			});
//$(document).on("mouseenter",".classify li",function(){
//	$(this).slideRight("show");
//});
//$(document).on("mouseleave",".classify li",function(){
//	$(this).slideRight("hide");
//});

$(document).ready(function(){
   $('.menu-dropleft').on('click',function(){
       $('.leftbox').animate({width:"0px"},300,function(){
           $('.leftbox').addClass('hide');
           $('.content').css('marginLeft','50px');
           $('.leftbox_2').removeClass('hide');
           $('.leftbox_2').animate({width:"50px"},300);
       });

   });
    $('.menu-dropright').on('click',function(){
        $('.leftbox_2').animate({width:"0px"},300,function(){
            $('.leftbox_2').addClass('hide');
            $('.leftbox').removeClass('hide');
            $('.leftbox').animate({width:"25%"},300);
            $('.content').css('marginLeft','25%');
        });

    });

});
function pageScroll(){
    //把内容滚动指定的像素数（第一个参数是向右滚动的像素数，第二个参数是向下滚动的像素数）
    window.scrollBy(0,-100);
    //延时递归调用，模拟滚动向上效果
    scrolldelay = setTimeout('pageScroll()',10);
    var sTop=document.documentElement.scrollTop+document.body.scrollTop;
    //判断当页面到达顶部，取消延时代码（否则页面滚动到顶部会无法再向下正常浏览页面）
    if(sTop==0) clearTimeout(scrolldelay);
}
$(window).scroll(function() {
    if ($(window).scrollTop() == 0) {
        $('.returnTop').addClass('hide');
    } else {
        $('.returnTop').removeClass('hide');
    }
});