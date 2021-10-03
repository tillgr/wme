$(document).ready(function () {
    //ajax call which triggers select fields
    $.ajax({
        type: "GET",
        url: "/properties",
        async: true,
        success: function (data) {
            getProperties(data);
        }, error: function (jqXHR, text, err) {

        }
    });

    //ajax call which triggers Diagrams
    $.ajax({
        type: "GET",
        url: "/items",
        async: true,
        success: function (data) {
            getDiagrams(data, 0);
        }, error: function (jqXHR, text, err) {

        }
    });


    $.ajax({
        type: "GET",
        url: "/items/",
        async: true,
        success: function (data) {
            for (let item of data){
                let lat = item['gps_lat'];
                let long = item['gps_long'];


            }
        }, error: function (jqXHR, text, err) {

        }
    });


});