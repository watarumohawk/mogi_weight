$(function(){

	/* DatePicker */
    // ボタン表示と月曜始まり
    $(".datepicker").datepicker({
        showButtonPanel: true,
        firstDay: 1
    });
    // 今日ボタンをクリック時に今日の日付入力
    $.datepicker._gotoToday = function(id) {
        var today = new Date();
        var dateRef = $("<td><a>" + today.getDate() + "</a></td>");
        this._selectDay(id, today.getMonth(), today.getFullYear(), dateRef);
    };

    showToday();

    $("#new_data_submit").click(function() {
    	var date_val = $("#date_input").val();
    	var weight_val = $("#weight_input").val();
    	if ( date_val !== "" && weight_val !== "") {
    		// 値が両方入力されている時に通信
	    	$.ajax({
	    		type: "GET",
	    		url: "",
	    		dataType: "json",
	    		data: {param1: 'value1'},
	    		success: function() {

	    		},
	    		error: function() {
		            alert("Server Error. Pleasy try again later. edit.js save");
	    		}
	    	});
    	} else if ( date_val == "" ) {
    		alert("日付を入力して下さい。");
    	} else if ( weight_val == "" ) {
    		alert("体重を入力して下さい。");
    	} else {
    		alert("日付と体重を入力して下さい。");
    	}
    });

});

//今日の日付を最初から「日付：」に入力
function showToday(){
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth();
    var day = now.getDate();
    var pattern = /^\d{1}$/;
    var this_month = month + 1;

    // 1桁の場合に0を追加
    if( pattern.test( sprintf("%d", this_month) ) == true && pattern.test( sprintf("%d", day) ) == true ){
        $(".datepicker").val(year + "/0" + (this_month)   + "/0" + day);
    }else if( pattern.test( sprintf("%d", this_month) ) == false && pattern.test( sprintf("%d", day) ) == true ){
        $(".datepicker").val(year + "/" + (this_month)   + "/0" + day);
    }else if( pattern.test( sprintf("%d", this_month) ) == true && pattern.test( sprintf("%d", day) ) == false ){
        $(".datepicker").val(year + "/0" + (this_month)   + "/" + day);
    }else{
        $(".datepicker").val(year + "/" + (this_month)  + "/" + day);
    }
}


