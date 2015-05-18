/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = function(){
    // Application Constructor
    self = this;
    this.initialize = function() {
		setHighChart();
		getJsonFromWeb();
    };
	this.initialize();
};
	var hammertime = new Hammer(document.getElementById('innercarousel'), {
			drag_block_horizontal: true,
			drag_min_distance: 0
		});
		hammertime.on('pan', function(ev) {
			manageMultitouch(ev);
		});
		function manageMultitouch(ev){
			
			switch(ev.type) {

				case 'pan':
						if(ev.deltaX > 20){
							$('.carousel').carousel('prev');
						}
						if(ev.deltaX < -20){
							$('.carousel').carousel('next');
						}
						if(ev.deltaX == 0){
							return;
						}
					break;
				default:
					return;
			}
		}
	
function setHighChart() {
    $('#container').highcharts({
        chart: {
            type: 'areaspline'
        },
        title: {
            text: 'Tides'
        },
        subtitle: {
            text: 'Carquet'
        },
        xAxis: {
            categories: ['3', '6', '9', '12 AM', '3', '6', '9', '12 PM'],
            tickmarkPlacement: 'on',
            title: {
                enabled: false
            }
        },
        yAxis: {
            title: {
                text: 'Tide Height (m)'
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}m</b><br/>',
            shared: true
        },
        plotOptions: {
            area: {
                lineColor: '#ffffff',
                lineWidth: 1,
                marker: {
                    lineWidth: 1,
                    lineColor: '#ffffff'
                }
            }
        },
        series: [{
            name: 'Hour',
            data: [0.65, 0.635, 0.809, 0.947, 0.402, 0.3634, 0.5268, 0.923]
        }],
		credits:{
			enabled:false
		}
    });
};

//Knockout function to bind objects
  function WeatherViewModel() {
    var self = this;
	self.windTable1 = [
		{date:"Tue", time:"10 am", windSpeed:"NE5", windGust:"-", rain: "-", pop:"60%",temp:"0",feelsLike:"-5",color:"lowspeed"},
		{date:"Tue", time:"11 am", windSpeed:"E8", windGust:"-", rain: "-", pop:"50%",temp:"0",feelsLike:"-5",color:"lowspeed"},
		{date:"Tue", time:"12 pm", windSpeed:"E9", windGust:"-", rain: "-", pop:"40%",temp:"0",feelsLike:"-5",color:"lowspeed"},
		{date:"Tue", time:"1 pm", windSpeed:"E10", windGust:"-", rain: "-", pop:"40%",temp:"0",feelsLike:"-5",color:"lowspeed"}
	];
	self.windTable2 = [
		{date:"Tue", time:"2 pm", windSpeed:"E10", windGust:"-", rain: "-", pop:"40%",temp:"0",feelsLike:"-5",color:"lowspeed"},
		{date:"Tue", time:"3 pm", windSpeed:"E10", windGust:"-", rain: "-", pop:"40%",temp:"0",feelsLike:"-5",color:"lowspeed"},
		{date:"Tue", time:"4 pm", windSpeed:"E11", windGust:"16", rain: "-", pop:"40%",temp:"0",feelsLike:"-5",color:"medspeed"},
		{date:"Tue", time:"5 pm", windSpeed:"E11", windGust:"17", rain: "-", pop:"40%",temp:"0",feelsLike:"-5",color:"medspeed"}
	];
	self.windTable3 = [
		{date:"Tue", time:"6 pm", windSpeed:"E12", windGust:"19", rain: "-", pop:"40%",temp:"0",feelsLike:"-6",color:"medspeed"},
		{date:"Tue", time:"7 pm", windSpeed:"E13", windGust:"19", rain: "-", pop:"40%",temp:"0",feelsLike:"-6",color:"medspeed"},
		{date:"Tue", time:"8 pm", windSpeed:"E13", windGust:"21", rain: "-", pop:"60%",temp:"0",feelsLike:"-6",color:"medspeed"},
		{date:"Tue", time:"9 pm", windSpeed:"E13", windGust:"21", rain: "-", pop:"60%",temp:"0",feelsLike:"-6",color:"medspeed"}
	];
	self.windTable4 = [
		{date:"Tue", time:"10 pm", windSpeed:"E13", windGust:"21", rain: "-", pop:"60%",temp:"1",feelsLike:"-5",color:"medspeed"},
		{date:"Tue", time:"11 pm", windSpeed:"E13", windGust:"21", rain: "-", pop:"60%",temp:"1",feelsLike:"-5",color:"medspeed"},
		{date:"Wed", time:"12 am", windSpeed:"E13", windGust:"21", rain: "-", pop:"40%",temp:"1",feelsLike:"-5",color:"medspeed"},
		{date:"Wed", time:"1 am", windSpeed:"E13", windGust:"21", rain: "-", pop:"40%",temp:"1",feelsLike:"-5",color:"medspeed"}
	];
	self.colorWindGust = function(color){
		if(color == "medspeed"){
			return color;
		}
		else{
			return "";
		}
	}
	self.temperature = ko.observable();
    self.feelsLike = ko.observable();
	self.humidity = ko.observable();
	self.sunrise = ko.observable();
	self.sunset = ko.observable();
	self.pressure = ko.observable();
	self.visibility = ko.observable();
	self.windDirection = ko.observable();
	self.windSpeed = ko.observable();

	self.setTemp = function(temp){
		self.temperature(temp);
	}
  };

  function getJsonFromWeb(){
	var jsonUrl = "http://appframework.pelmorex.com/api/appframework/WeatherData/getData/iPad?location=CANB2160&dataType=Observation&deviceLang=en&deviceLocale=en-CA&tempUnit=C&measurementUnit=metric&appVersion=3.0.38.414&configVersion=2&resourceVersion=0&resourceCommonVersion=0&GUID=72518A11-98B5-4BAD-B3E0-CCBB1C6405FD&Random=2145625372&callback=?";
	var weatherVM = weather.viewModel;
console.log(jsonUrl);
	function success(data){
	    //console.log("success!!!!");
		observation = data["Observation"];
		  weatherVM.temperature(observation["Temperature"]["Text"][0]);
		  weatherVM.feelsLike(observation["FeelsLike"]["Text"][0]);
		  weatherVM.humidity(observation["Humidity"]["Text"][0]);
		  weatherVM.sunrise(observation["Sunrise"]["Text"][0]);
		  weatherVM.sunset(observation["Sunset"]["Text"][0]);
		  weatherVM.pressure(observation["Pressure"]["Text"][0]);
		  weatherVM.visibility(observation["Visibility"]["Text"][0]);
		  weatherVM.windDirection(observation["WindDirection"]["Text"][0]);
		  weatherVM.windSpeed(observation["WindSpeed"]["Text"][0]);
	}
	function error(jqxhr, textStatus, error){
		readFromFile();
		console.log(textStatus+", "+error);
	}
	$.getJSON( jsonUrl)
      .done(function( data ) {
         console.log("success!!!!");
        		observation = data["Observation"];
        		  weatherVM.temperature(observation["Temperature"]["Text"][0]);
        		  weatherVM.feelsLike(observation["FeelsLike"]["Text"][0]);
        		  weatherVM.humidity(observation["Humidity"]["Text"][0]);
        		  weatherVM.sunrise(observation["Sunrise"]["Text"][0]);
        		  weatherVM.sunset(observation["Sunset"]["Text"][0]);
        		  weatherVM.pressure(observation["Pressure"]["Text"][0]);
        		  weatherVM.visibility(observation["Visibility"]["Text"][0]);
        		  weatherVM.windDirection(observation["WindDirection"]["Text"][0]);
        		  weatherVM.windSpeed(observation["WindSpeed"]["Text"][0]);
      })
      .fail(function( jqxhr, textStatus, error ) {
        var err = textStatus + ", " + error;
        console.log( "Request Failed: " + err );
    });
	$.ajax({
		dataType: "json",
		url: jsonUrl,
		success:success,
		error:error
	});
  }


weather = { viewModel: new WeatherViewModel() };
ko.applyBindings(weather.viewModel);
app();

