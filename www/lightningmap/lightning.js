 
function lightningfeed(listenOnly){

	var client = null;
	//var host= "10.10.14.187";
	var host= "dev.pelmorex.com";
	//var host="66.252.159.32"
	//var host="10.10.202.33"

	var r = Math.round(Math.random()*Math.pow(10,5));
	var d = new Date().getTime();
	var cid = r.toString() + "-" + d.toString()

	var centerIcon = null;
	var centerMarker = null;
	var circle = null;

	var systemLag = 5000.0;

	var maxSoundDistance = 20000.0; // 20 KM
	var speedOfSoundMetersPerSec = 340.2;

	// Fake values, to test.
//	var maxSoundDistance = 500000.0;
//	var speedOfSoundMetersPerSec = 34020.0;
	
	
	initializeLightning();
	
	function initializeLightning(){
		if(!listenOnly)
		{
			if(centerMarker == null)
			{
				centerIcon = {
					url: 'lightningmap/center.png',
					scaledSize: new google.maps.Size(16, 16),
					origin: new google.maps.Point(0,0),
					anchor: new google.maps.Point(16/2, 16/2)
				  };
			
				centerMarker = new google.maps.Marker({
				  position: map.getCenter(),
				  map: map,
				  icon: centerIcon,
				  opacity: 1
				});
				
				circle = new google.maps.Circle({
					center : centerMarker.getPosition(),
					radius : maxSoundDistance,
					fillColor : 'blue',
					fillOpacity : 0.1,
					strokeColor : 'blue',
					strokeOpacity : 0.7,
					strokeWeight : 0.5,
					map: map
				});
				
			}

			google.maps.event.addListener(map, 'center_changed', centerChanged);
		}
		
		client = new Messaging.Client(host, 52169, cid);

		client.onConnect = onConnect;
	  
		client.onMessageArrived = onMessageArrived;
		client.onConnectionLost = onConnectionLost;            

		client.connect({onSuccess:onConnect, onFailure:onFailure}); 
	}

	
	function centerChanged(){
		centerMarker.setPosition(map.getCenter());
		circle.setCenter(centerMarker.getPosition());
	}


	function onConnect(frame) {
	  console.log("connected to MQTT");
	  client.subscribe("Pelmorex.WeatherData.Lightning");
	};  

	function calcDistance(p1, p2){
		  return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2);
	}

	function onMessageArrived(message) {
		jsonMessage = JSON.parse(message.payloadString);
		if(!listenOnly)
		{
			if (map != undefined)
			{
		//		console.log(message.payloadString);
				var strikeLatLng = new google.maps.LatLng(jsonMessage.Strike.Lat, jsonMessage.Strike.Long);

				var mapBounds = map.getBounds();

				var center = map.getCenter();

				var dist = calcDistance(strikeLatLng, center);
				
				if(mapBounds.contains(strikeLatLng))
				{
					if(dist <= (maxSoundDistance/1000.0))
					{
						displayDelayedStrike(jsonMessage, strikeLatLng, dist);
					}
					else
						displaySilentStrike(jsonMessage, strikeLatLng, dist);
						

				}
			}
		}
		return(true);
	}

	function distToTime(dist)
	{
		return((dist*1000.0) / speedOfSoundMetersPerSec * 1000.0);
	}

	function displayDelayedStrike(jsonMessage, strikeLatLng, dist)
	{
		
		var iconSize = (Math.abs(jsonMessage.Strike.Magnitude) * 64 / 256) + 12;
		var lightningImageSeen = {
			url: 'lightningmap/icon_lightning_red.png',
			scaledSize: new google.maps.Size(iconSize, iconSize),
			origin: new google.maps.Point(0,0),
			anchor: new google.maps.Point(iconSize/2, iconSize/2)
		  };
		var strikeMarker = new google.maps.Marker({
		  position: strikeLatLng,
		  map: map,
		  icon: lightningImageSeen,
		  animation: google.maps.Animation.DROP,
		  opacity: 1
		});
		
		var time = distToTime(dist) - systemLag;
		if (time >= -0.1) // Tolerate up to 100ms to play a sound "in the past"
		{
			if (time < 0.0)
				time = 0.0;
			
			//console.log(time);
			setTimeout(function() 
			{
				var lightningImageSound = {
				url: 'lightningmap/icon_lightning_black_snd.png',
				scaledSize: new google.maps.Size(iconSize*2, iconSize*2),
				origin: new google.maps.Point(0,0),
				anchor: new google.maps.Point(iconSize, iconSize)
				};
				strikeMarker.setIcon(lightningImageSound);
				strikeMarker.setAnimation(google.maps.Animation.BOUNCE);

				var snd = new Audio("lightningmap/lightning.mp3");
				snd.volume = (Math.abs(jsonMessage.Strike.Magnitude) / 256.0)+0.1;
				snd.play();
			
				setTimeout(function()
				{
					removeMarker(strikeMarker);
				}, 2000);
			}, time);
		}
		else
		{
			// If the system lag was greater than the time it took for the sound to travel,
			// then just fade out the strike and don't play any sound (since it was already heard)
			setTimeout(function()
			{
				removeMarker(strikeMarker);
			}, 2000);
		}
	}

	function displaySilentStrike(jsonMessage, strikeLatLng)
	{
		var iconSize = (Math.abs(jsonMessage.Strike.Magnitude) * 64 / 256) + 12;
		var lightningImageFar = {
			url: 'lightningmap/icon_lightning_orange.png',
			scaledSize: new google.maps.Size(iconSize, iconSize),
			origin: new google.maps.Point(0,0),
			anchor: new google.maps.Point(iconSize/2, iconSize/2)
		  };
		var strikeMarker = new google.maps.Marker({
		  position: strikeLatLng,
		  map: map,
		  icon: lightningImageFar,
		  animation: google.maps.Animation.DROP,
		  opacity: 1
		});

		var snd = new Audio("lightningmap/lightning.mp3");
		snd.volume = (Math.abs(jsonMessage.Strike.Magnitude) / 256.0)+0.1;
		snd.play();
				
		setTimeout(function() {
			removeMarker(strikeMarker);
			}, 2000);

	}
	function onConnectionLost(responseObject) {
		console.log(responseObject);
		setTimeout(function()
		{
			initializeLightning();
		}, 2000);
	}

	function onFailure(failure) {
		host="dev.pelmorex.com"
		console.log(failure);
		setTimeout(function() {
			initializeLightning();
				}, 2000);
	}  
	function removeMarker(strikeMarker){
		var newOpac = strikeMarker.getOpacity()-0.1;
		
		if(newOpac<=0.1)
		{
			strikeMarker.setMap(null);
		}
		else
		{
			strikeMarker.setOpacity(newOpac);
			setTimeout(function() {
				removeMarker(strikeMarker);
				}, 50);			
		}
	}
}

	