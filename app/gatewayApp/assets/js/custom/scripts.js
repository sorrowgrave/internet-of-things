/**
 * Created by Kenny on 3/05/2016.
 */

$(document).ready(function() {

/*    $(document).on('click','div.bhoechie-tab-menu>div.list-group>a',function() {
        //e.preventDefault();
        $(this).siblings('a.active').removeClass("active");
        $(this).addClass("active");
        var index = $(this).index();
        $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
        $("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");
    });*/


});

function rotate(element)
{
    var index = $(element).index();

    $(element).siblings('.active').removeClass("active");
    $(element).addClass("active");

    $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
    $("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");
}