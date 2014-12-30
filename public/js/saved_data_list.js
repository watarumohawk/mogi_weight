var path = getPath();

$(function(){
    //ページを開いたら入力済み日一覧がでるようにする
    getDaysList();
});

function deleteDay(btn){
    var delete_msg = confirm("本当に削除しますか？");
        if(delete_msg == true){
            $.ajax({
                type:"POST",
                url: path + "/delete_json",
                data: {mode:"delete", date: btn.val() },
                dataType: "json",
                success: function(json_data) {
                    // console.log(json_data);
                        btn.parent().remove();
                },
                error: function() {
                    alert("Server Error. Pleasy try again later. list.js delete");
                }
            });
        }
}

function getDaysList(){
    $.ajax({
        type:"POST",
        url: path + "/saved_data_list_json",
        data: {mode:"saved_data_list", bookvalue: 0},
        dataType: "json",
        success: function(json_data) {
            console.log(json_data);
            for(var i=0; i < json_data.length; i++){
                // var atag = $('<a >', { href: "./edit.html?mode=retrieve&date="+json_data[i], text: json_data[i]});
                var atag = $('<a >', { href: "./retrieve?mode=retrieve&date="+json_data[i], text: json_data[i]});
                var li = $('<li >');
                atag.appendTo( li );
                li.appendTo($("#saved_data_list"));
                $("#saved_data_list > li:eq(" + i + ")").append("<button id='btn_"+ json_data[i] +"' class='delete_date_btn btn btn-info btn-sm' value='" + json_data[i] + "'>削除</button>");
            }
            $(".delete_date_btn").click(function(){
                deleteDay( $(this) );
            });
        },
        error: function() {
            alert("Server Error. Pleasy try again later.");
        }
    });
}