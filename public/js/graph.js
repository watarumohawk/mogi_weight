$(function(){
    // グラフ
    $("#graph_area").attr("style", "height: 500px; width: 97%;");

    renderGraph( $("#graph_area").attr("id") );

});

function renderGraph(chartId){
    // 通信実行
    var path = getPath();

    $.ajax({
        type:"POST",
        url: path + "/weight_history_json",
        data: {mode:"weight_history_json", bookvalue: 0},
        dataType: "json",
        success: function(json_data){
            putDataInjqplot(chartId, json_data);
                console.log(json_data);
        },
        error: function(){
            alert("Server Error. Pleasy try again later.");
        }
    });
}

function putDataInjqplot(chart, data, data2){
    var graph_data = [];
    for(var i = 0; i<data.date.length; i++){
        graph_data[i] = [ data.date[i], data.weight[i] ];
    }

    var plot1 = $.jqplot(chart, [graph_data], {
        title:'茂木健一郎の体重推移',
        // Show the legend and put it outside the grid, but inside the
        // plot container, shrinking the grid to accomodate the legend.
        // A value of "outside" would not shrink the grid and allow
        // the legend to overflow the container.
        legend:{
            // show:true,
        },
        // Custom labels for the series are specified with the "label"
        // option on the series option.  Here a series option object
        // is specified for each series.
        axes:{
            // Use a category axis on the x axis and use our custom ticks.
            xaxis:{
                renderer: $.jqplot.DateAxisRenderer,
                tickOptions:{
                    formatString:'%y.%m.%d'
                },
            },
            // Pad the y axis just a little so bars can get close to, but
            // not touch, the grid boundaries.  1.2 is the default padding.
            yaxis:{
                tickOptions:{
                    formatString:'%.1fkg'
                }
            }
        },
        highlighter: {
            show: true,
            sizeAdjust: 7.5,
            tooltipLocation: 'n',
            tooltipAxes: 'both',
            tooltipFormatstring: '<strong>%d</strong>'
        },
        cursor: {
            show: true,
            zoom: true,
            constrainZoomTo: 'x',
        }
    });
}