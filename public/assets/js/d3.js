
// load on page load
let select1 = document.getElementById('select1');
let select2 = document.getElementById('select2');
let diagram1 = document.getElementById('diagram1');
let diagram2 = document.getElementById('diagram2');
let property1 = 2;
let property2 = 3;
let lastProperty = property1;

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

    //event handlers for change on select fields
    select1.onchange = function () {
        property1 = select1.options[select1.selectedIndex].value;
        lastProperty = property1;

        $.ajax({
            type: "GET",
            url: "/properties",
            async: true,
            success: function (data) {
                getProperties(data);
            }, error: function (jqXHR, text, err) {

            }
        });

        diagram1.innerHTML = "";

        $.ajax({
            type: "GET",
            url: "/items",
            async: true,
            success: function (data) {
                getDiagrams(data, 2);
            }, error: function (jqXHR, text, err) {

            }
        });
    };

    select2.onchange = function () {
        property2 = select2.options[select2.selectedIndex].value;
        lastProperty = property2;

        $.ajax({
            type: "GET",
            url: "/properties",
            async: true,
            success: function (data) {
                getProperties(data);
            }, error: function (jqXHR, text, err) {

            }
        });

        diagram2.innerHTML = "";

        $.ajax({
            type: "GET",
            url: "/items",
            async: true,
            success: function (data) {
                getDiagrams(data, 1);
            }, error: function (jqXHR, text, err) {

            }
        });
    };


});

//render properties as option list in html
function getProperties(data) {
    let result1 = '';
    let result2 = '';

    for (let key in data) {
        if (key > 1) {
            if (key !== property2) {
                result1 += '<option value="' + key + '">';
                result1 += data[key];
                result1 += '</option>';
            }
            if (key !== property1) {
                result2 += '<option value="' + key + '">';
                result2 += data[key];
                result2 += '</option>';
            }
        }
    }

    select1.innerHTML = result1;
    select2.innerHTML = result2;

    if (property1 < property2) {
        select1.selectedIndex = property1 - 2;
        select2.selectedIndex = property2 - 3;
    } else {
        select1.selectedIndex = property1 - 3;
        select2.selectedIndex = property2 - 2;
    }
}

//creates diagram with d3.js
function createDiagram(propertyName, diagramName, data) {

    let x = d3.scaleBand().range([0, 400]).padding(0.1).domain(data.map(function (d) {
        return d["name"];
    }));
    let y = d3.scaleLinear().range([0, 200]);

    let svg = d3.select(diagramName)
        .append("g").attr("transform", "translate(50, 10)");

    let yMin = d3.min(data, function (d) {
        return parseFloat(d[propertyName]);
    });
    let yMax = d3.max(data, function (d) {
        return parseFloat(d[propertyName]);
    });


    if (yMin >= 0) {
        y.domain([1.05 * yMax, 0]);

        svg.selectAll(".bar").data(data).enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) {
                return x(d["name"]);
            })
            .attr("width", x.bandwidth())
            .attr("y", function (d) {
                return y(d[propertyName]);
            })
            .attr("height", function (d) {
                return 200 - y(d[propertyName]);
            });

        svg.append("g").attr("transform", "translate(0, 200)").call(d3.axisBottom(x))
            .selectAll("text").attr("transform", "rotate(90), translate(55, -15)");
        svg.append("g").call(d3.axisLeft(y));
    } else {
        y.domain([1.05 * yMax, 1.05 * yMin]);

        svg.selectAll(".bar").data(data).enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) {
                return x(d["name"]);
            })
            .attr("width", x.bandwidth())
            .attr("y", function (d) {
                if (d[propertyName] >= 0) {
                    return y(d[propertyName]);
                }
                return y(0);
            })
            .attr("height", function (d) {
                if (d[propertyName] >= 0) {
                    return y(0) - y(d[propertyName]);
                }
                return y(d[propertyName]) - y(0);
            });

        svg.append("g").attr("transform", "translate(0, 200)").call(d3.axisBottom(x))
            .attr('transform', 'translate(0, ' + y(0) + ')')
            .selectAll("text").attr('transform', 'rotate(90), translate(55, -15), translate(' + (y(yMin) - y(0)) + ', 0)');
        svg.append("g").call(d3.axisLeft(y));
    }
}

//handles diagram input and creation calls
function getDiagrams(data, id) {
    if (id !== 1) {
        $.ajax({
            type: "GET",
            url: "/properties/" + property1,
            async: true,
            success: function (propertyName) {
                createDiagram(propertyName, "#diagram1", data)
            },
            error: function (jqXHR, text, err) {

            }
        });
    }
    if (id !== 2) {
        $.ajax({
            type: "GET",
            url: "/properties/" + property2,
            async: true,
            success: function (propertyName) {
                createDiagram(propertyName, "#diagram2", data)
            },
            error: function (jqXHR, text, err) {

            }
        });
    }
}
