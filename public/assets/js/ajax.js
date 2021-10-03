let enabledProperties = undefined;
let normalizedSizes = [];
let colors = [];
let lats = [];
let longs = [];

$(document).ready(function(){
	function onInit(){
		//render property options
		$.ajax({
			type: "GET",
			url: "/properties",
			async: true,
			success: function(data) {
				renderProperties(data);
			}, error: function(jqXHR, text, err) {

			}
		});

		//pre select options
		$('#prop_selection').val('2');
		$('#time_selection').val('1');

		//render globe
		$.ajax({
			type: "GET",
			url: "items",
			async: true,
			success: function(data) {
				if(String(data).includes("No such property")){
					errorMessage(data);
				}
				getGlobeData(data);
				createGlobe();

			}, error: function(jqXHR, text, err) {

			}
		});
	}
	onInit()

	//get Globe data
	function getGlobeData(data){
		normalizedSizes = [];
		colors = [];
		lats = [];
		longs = [];

		let selectedProperty = $('#prop_selection option:selected').text();
		let properties = [];

		for (let object of data){
			properties.push(object[selectedProperty]);

			//split lats and longs
			lats.push(object['gps_lat']);
			longs.push(object['gps_long']);
		}
		//prepare for color selection
		//move to positive
		let min = Math.min.apply(Math, properties);
		let translated;

		if (min < 0){
			translated = properties.map(value => +value + Math.abs(min));
		}
		else if (min > 0){
			translated = properties.map(value => +value - min);
		}
		else {
			translated = properties;
		}

		//normalize values
		let max = Math.max.apply(Math, translated);
		normalizedSizes = translated.map(value => +value/max);

		//select color
		let palette = ['#ffffb2','#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#b10026'];
		for (let size of normalizedSizes){
			let color = palette[Math.floor(size*6)]
			colors.push(color)
		}

	}


	//on changed properties: call getGlobeData, trigger createGlobe
	$('#prop_selection').on('change', function(e){
		$.ajax({
			type: "GET",
			url: "items",
			async: true,
			success: function(data) {
				if(String(data).includes("No such property")){
					errorMessage(data);
				}
				getGlobeData(data);
				createGlobe();

			}, error: function(jqXHR, text, err) {

			}
		});
	});

	//renders properties in select
	function renderProperties(data){
		enabledProperties = new Array();
		let result = '';
		let i=0;
		
		for(let key in data){
			i++;
			enabledProperties[data[key]] = true;
			if(i>2 && i<13) {
				result += '<option value="' + key + '">';
				result += data[key];
				result += '</option>';
			}
		}
		let selectProperties = document.getElementById('prop_selection');
		selectProperties.innerHTML = result;
	}
});