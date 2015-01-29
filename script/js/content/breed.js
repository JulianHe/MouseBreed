$(document).ready(function() {
	$("[data-toggle]").click(function() {
    	var toggle_el = $(this).data("toggle");
    	$(toggle_el).toggleClass("open-sidebar");
  	});
  	$(".testButton").click(function() {
    	$.notify("Eine Maus ist schwanger ","warn");
	});    
});

$(".swipe-area").swipe({
    swipeStatus:function(event, phase, direction, distance, duration, fingers)
        {
            if (phase=="move" && direction =="right") {
                 $(".container").addClass("open-sidebar");
                 return false;
            }
            if (phase=="move" && direction =="left") {
                 $(".container").removeClass("open-sidebar");
                 return false;
            }
        }
});

