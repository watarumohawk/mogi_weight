var path = getPath();
var former_date;
var current_date;

$(function(){
    var mode = $.url().param("mode");

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

    if(mode == "retrieve") {
        retrieveData( $.url().param("date") );
        $("#date_input").datepicker("option", "disabled", true);
        $("#lock_img").attr("src", "../assets/img/locked.png");
        $("#lock_img").addClass("locked_key");
        $(".locked_key").on("click", function(){
            var result = confirm("日付を変更しますか？");
            if(result){
                $("#date_input").datepicker("option", "disabled", false);
                $("#lock_img").attr("src", "../assets/img/open.png");
                // $("#lock_img").attr("class", "open_key");
                $("#lock_img").removeClass("locked_key");
                $("#lock_img").addClass("open_key");
            }
        });
    }


    $("#new_data_submit").click(function() {
        var weight_val = $("#weight_input").val();
    	var date_val = $("#date_input").val();

        var data = {
            date: $("#date_input").val(),
            weight: $("#weight_input").val()
        };

    	if ( date_val !== "" && weight_val !== "") {
    		// 値が両方入力されている時に通信
	    	$.ajax({
	    		type: "GET",
	    		url: path + "/save_json",
	    		dataType: "json",
	    		data: {mode: "save", date: date_val, weight: weight_val, packed_data:JSON.stringify(data)},
	    		success: function(json_data) {
                    $("#sendingTextArea").fadeIn();
                    console.log(json_data);
                    // 返ってきたjson_dataのresultがsuccessの場合に保存完了メッセージ
                    if (json_data.result != "success") { // サーバが失敗を返した場合
                       alert("Transaction error.");
                       return;
                    }
                    // 成功時処理
                    if(mode == "retrieve" && former_date !== current_date){ // 日付変更してデータ更新する場合
                        deleteDay(former_day);
                    }
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

    former_date = $.url().param("date");
    // 日付変更無い場合用
    current_date = $.url().param("date");
});

function retrieveData(date){
    // 変更後の日付
    $("#date_input").change(function(){
        current_date = $(this).val();
    });

    $.ajax({
        type:"POST",
        url: path + "/retrieve_json",
        data: { mode: "retrieve", date: date },
        dataType: "json",
        success: function(json_data) {
            $("#weight_input").val(json_data[2].weight);
        },
        error: function() { // HTTPエラー時
            alert("Server Error. Pleasy try again later. edit.js retrieve");
        }
    });
}

function getPath(){
    var path = window.location.href;
    if(path.match(/app\.psgi/)){
        path = path.replace(/(app\.psgi)(\/)(.*)/, "$1");
    }else if(path.match(/localhost/)){
        path = ".";
    }
    return path;
}

// 今日の日付を表示
function showToday(){
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth();
    var day = now.getDate();
    var this_month = month + 1;
    $(".datepicker").val( sprintf("%04d/%02d/%02d", year, this_month, day) );
}