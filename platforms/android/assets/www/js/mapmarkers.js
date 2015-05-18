var map = undefined;
var snd = new Audio("lightningmap/lightning.mp3"); // buffers automatically when created
function initialize() {
	var myLatlng = new google.maps.LatLng(49.083513, -61.820369);
	var mapOptions = {
		zoom: 5,
		center: myLatlng
	}
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	var drawablel = new lightningfeed();
	var pin = "img/offshore_pin.png";
	placeMarker(49.357411, -67.326166,pin);
	placeMarker(49.025915, -68.565975,pin);
	placeMarker(50.263646, -62.853084,pin);
	placeMarker(49.270246, -66.127010,pin);
	placeMarker(50.122977, -61.380916,pin);
	placeMarker(48.344133, -64.632869,pin);
	placeMarker(48.765898, -59.029842,pin);
	placeMarker(46.817660, -61.051326,pin);
	placeMarker(51.756556, -56.151424,pin);
}

google.maps.event.addDomListener(window, 'load', initialize);

var markers = [];
function placeMarker(lat, lng, pictureUrl){
	var newLatLng = new google.maps.LatLng(lat,lng);
	var image = {
    url: pictureUrl,
    // This marker is 20 pixels wide by 32 pixels tall.
    size: new google.maps.Size(32, 32),
    // The origin for this image is 0,0.
    origin: new google.maps.Point(0,0),
    // The anchor for this image is the base of the flagpole at 0,32.
    anchor: new google.maps.Point(0, 32)
  };
	var marker = new google.maps.Marker({
		position: newLatLng,
		icon: image,
		map: map,
		title: "Port"
	});
	markers.push(marker);
}
// Sets the map on all markers in the array.
function setAllMap(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}
// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setAllMap(null);
}
// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}