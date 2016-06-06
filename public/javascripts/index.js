$(document).ready(function(){
	init();
})

var modal = $("#statistics_modal");

function init(){

	$(".i_menu_button").click(function(){
		modal.show();
	});

	modal.click(function(){
		modal.hide();
	}).children().click(function(e) {
		return false;
	});

	$(".close_modal_button").click(function(){
		modal.hide();
	});

}

