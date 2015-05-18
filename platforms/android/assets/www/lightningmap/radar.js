 
function radarlayer(){

    var features_lr, features_hr;
    var pending;
    var lastRequestBoundingBox;
    var overscanratio;
    var lastUpdate;
    
	initiatlizeRadarLayer();
	
    function getLayerURL(layertype){
        b = map.getBounds();
        width = b.getNorthEast().lng() - b.getSouthWest().lng();
        height = b.getNorthEast().lat() - b.getSouthWest().lat();
        overscanw = width * overscanratio;
        overscanh = height * overscanratio;
        sw = new google.maps.LatLng(b.getSouthWest().lat()-overscanh, b.getSouthWest().lng()-overscanw,false);
        ne = new google.maps.LatLng(b.getNorthEast().lat()+overscanh, b.getNorthEast().lng()+overscanw, false);
//        console.debug(sw + ne);        
        lastRequestBoundingBox = new google.maps.LatLngBounds(sw, ne);
        return 'http://dev.pelmorex.com/api/searchgis/radargeojson?xmin='+sw.lng()+'&ymin='+sw.lat()+'&xmax='+ne.lng()+'&ymax='+ne.lat()+'&layertype='+layertype;
    }
    
	function initiatlizeRadarLayer(){
        map.data.setStyle(styleFeature);
        lastUpdate = (new Date).getTime();
        overscanratio = 0.10;
        pending = 0;
        lastRequestBoundingBox = undefined;
        google.maps.event.addListener(map, 'bounds_changed', centerChanged);

        setTimeout(monitorData, 1000);

	}

    function monitorData(){
        if(((new Date).getTime() - lastUpdate) >= 60000)
        {
            console.debug('Requesting new data since current one may be old.');
            requestNewRadarData();
        }
    

        setTimeout(monitorData, 1000);
    }
    
    function styleFeature(feature) {
        if (feature.getProperty('layertype') == 'lr') 
            return {
            strokeWeight: 0,
            strokeColor: '#ffffff',
            zIndex: 2,
            fillColor: 'rgb(' + 0 + ',' + 100 + ',' + 255 + ')',
            fillOpacity: 0.5,
            visible: true
          };
        else if (feature.getProperty('layertype') == 'hr') 
            return {
            strokeWeight: 0,
            strokeColor: '#ffffff',
            zIndex: 3,
//            fillColor: 'rgb(' + 255 + ',' + 0 + ',' + 0 + ')',
            fillColor: 'rgb(' + 0 + ',' + 0 + ',' + 100 + ')',
            fillOpacity: 0.4,
            visible: true
          };
        else 
            return {
            strokeWeight: 0,
            strokeColor: '#ffffff',
            zIndex: 4,
            fillColor: 'rgb(' + 5 + ',' + 5 + ',' + 5 + ')',
            fillOpacity: 0.50,
            visible: true
          };
        
       
    }
    
    
	function requiresNewBounding()
    {
        if(lastRequestBoundingBox == undefined)
            return true;
        else
        {
            b = map.getBounds();
            if(lastRequestBoundingBox.contains(b.getNorthEast()) && lastRequestBoundingBox.contains(b.getSouthWest()))
            {
                request_width = lastRequestBoundingBox.getNorthEast().lng() - lastRequestBoundingBox.getSouthWest().lng();
                request_height = lastRequestBoundingBox.getNorthEast().lat() - lastRequestBoundingBox.getSouthWest().lat(); 
                current_width = (b.getNorthEast().lng() - b.getSouthWest().lng()) * (1+(overscanratio*2.0));
                current_height = (b.getNorthEast().lat() - b.getSouthWest().lat()) * (1+(overscanratio*2.0)); 
                /*
                console.debug('Overscan width ratio: ' + (current_width / request_width));
                console.debug('Overscan height ratio: ' + (current_height / request_height));
                */
                if((current_width / request_width < 0.95) || (current_height / request_height < 0.95))
                    return true;
                else
                    return false;
            }
            else
                return true;
        }
    }
    
    function requestNewRadarData(){
        lastUpdate = (new Date).getTime();
        pending = 2;
        setTimeout(
            function()
            {
                $.getJSON(getLayerURL('lr'), 
                    function (data)
                    {
                        if (features_lr != undefined)
                        {
                            for (var i = 0; i < features_lr.length; i++)
                                  map.data.remove(features_lr[i]);
                        }
                        features_lr = map.data.addGeoJson(data);
                        setTimeout(function(){pending = pending - 1;}, 100);
                    }
                );
                $.getJSON(getLayerURL('hr'), 
                    function (data)
                    {
                        if (features_hr != undefined)
                        {
                            for (var i = 0; i < features_hr.length; i++)
                                  map.data.remove(features_hr[i]);
                        }
                        features_hr = map.data.addGeoJson(data);
                        setTimeout(function(){pending = pending - 1;}, 100);
                    }
                );
            }
            ,100);
    }
    
	function centerChanged(){
        if((pending == 0) && requiresNewBounding())
        {
            console.debug('New data needed because map has moved out of bounding box.');
            requestNewRadarData();
        }
	}

}

	