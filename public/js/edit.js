// var path = getPath();

$(function(){
    var mode = $.getUrlVar("mode");

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
	    		url: "./save_json",
	    		dataType: "json",
	    		data: {mode: "save", date: date_val, weight: weight_val},
	    		success: function(json_data) { // result:success で成功
                    $("#sendingTextArea").fadeIn();
                    console.log(json_data);
                    console.log(json_data.result);
                    // 返ってきたjson_dataのresultがsuccessの場合に保存完了メッセージ
                    if (json_data.result != "success") { // サーバが失敗を返した場合
                       alert("Transaction error.");
                       return;
                    }
                    // 成功時処理
                    /*if(mode == "retrieve" && former_date !== current_date){ // 日付変更してデータ更新する場合
                        deleteDay(former_day);
                    }*/
                    $("#loader_div").remove();
                },
                error: function() { // HTTPエラー時
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

function getPath(){
    var path = window.location.href;
    if(path.match(/app\.psgi/)){
        path = path.replace(/(app\.psgi)(\/)(.*)/, "$1");
    }else if(path.match(/localhost/)){
        path = ".";
    }
    // console.log(path);
    return path;
}

// 今日の日付を最初から「日付：」に入力
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

// ref: http://jquery-howto.blogspot.jp/2009/09/get-url-parameters-values-with-jquery.html
$.extend({
  getUrlVars: function(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },
  getUrlVar: function(name){
    return $.getUrlVars()[name];
  }
});