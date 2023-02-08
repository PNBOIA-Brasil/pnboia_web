import mapboxgl from 'mapbox-gl';
import spotterIconYellow from '../images/spotter_icon_yellow.png';
import spotterIconGreen from '../images/spotter_icon_green.png';
import spotterIconBlue from '../images/spotter_icon_blue.png';
import criosIcon from '../images/crios_buoy.png';
import tideIcon from '../images/maregrafo.png';
import weatherIcon from '../images/weather.png';
import buoyRed from '../images/buoy_red.png';
import buoyGreen from '../images/buoy_green.png';


const initMapboxSofar = () => {

	const fitMapToMarkers = (map, markers) => {
		const bounds = new mapboxgl.LngLatBounds();
		markers.forEach(marker => bounds.extend([ marker.lon, marker.lat ]));
		map.fitBounds(bounds, { padding: 70, maxZoom: 8, duration: 0 });
	};
  
	const mapElement = document.getElementById('newmap-drift');

	if (mapElement) { // only build a map if there's a div#map to inject into
		mapboxgl.accessToken = mapElement.dataset.mapboxApiKey;
		const map = new mapboxgl.Map({
			container: 'newmap-drift',
			style: 'mapbox://styles/mapbox/outdoors-v11'
		});

		const markers = JSON.parse(mapElement.dataset.markers);
		markers.forEach((mark) => {
			var marker = document.createElement('div');
			marker.className = 'marker';
			marker.style.backgroundImage = `url('${spotterIconYellow}')`;
			marker.style.backgroundSize = 'contain';
			marker.style.width = '40px';
			marker.style.height = '31px';
			const markerAlmirantadoInt = new mapboxgl.Marker(marker)
			.setLngLat([ mark.lon, mark.lat ])
			.setPopup(new mapboxgl.Popup().setHTML(`<div class='pop-up'>
			  <p class='m-0 p-0'><strong>LAT:</strong> ${Math.round(mark.lat*100)/100}, <strong>LON:</strong> ${Math.round(mark.lon*100)/100}</p>
			  <p class='m-0 p-0'><strong>DATA:</strong> ${mark.date_time.slice(0,10)}</p>
			  <p class='m-0 p-0'><strong>HORA:</strong> ${mark.date_time.slice(11,16)}</p>
			  <p class='m-0 p-0'><strong>Altura Onda:</strong> ${mark.swvht} m</p>
			  <p class='m-0 p-0'><strong>Dir. Onda:</strong> ${mark.wvdir} °</p>
			  <p class='m-0 p-0'><strong>Tp Onda:</strong> ${mark.tp} s</p>
			  <p class='m-0 p-0'><strong>Vel. Vento:</strong> ${mark.wspd} nós</p>
			  <p class='m-0 p-0'><strong>Dir. Vento:</strong> ${mark.wdir} °</p>
			  <p class='m-0 p-0'><strong>Temp. Água:</strong> ${mark.sst} °C</p></div>`))
			.addTo(map);
		});

		fitMapToMarkers(map, markers);
	}
};


const initMapboxNew = (lat=-30.9639, lon=-32.5835, zoom=2) => {

	const fitMapToMarkers = (map, lat, lon, zoom) => {
		const bounds = new mapboxgl.LngLatBounds();
		bounds.extend([ lat, lon ]);
		map.fitBounds(bounds, { padding: 70, maxZoom: zoom, duration: 0 });
	};
  
	const mapElement = document.getElementById('newmap');

	if (mapElement) { // only build a map if there's a div#map to inject into

		mapboxgl.accessToken = mapElement.dataset.mapboxApiKey;

		const map = new mapboxgl.Map({
			container: 'newmap',
			style: 'mapbox://styles/mapbox/outdoors-v11'
		});

		const markers = JSON.parse(mapElement.dataset.markers);

		markers.forEach((marker) => {
			var buoyMarker = document.createElement('div');
			buoyMarker.className = 'marker';
			let situation
			if (marker.buoy.status) {
				buoyMarker.style.backgroundImage = `url('${buoyGreen}')`;
				situation = 'OPERATIVA'
			} else {
				buoyMarker.style.backgroundImage = `url('${buoyRed}')`;
				situation = 'MANUTENÇÃO'
			}
			buoyMarker.style.backgroundSize = 'contain';
			buoyMarker.style.width = '15px';
			buoyMarker.style.height = '29px';
			let markerBuoy
			markerBuoy = new mapboxgl.Marker(buoyMarker)
				.setLngLat([ marker.buoy.longitude, marker.buoy.latitude ])
				.setPopup(new mapboxgl.Popup().setHTML(`<div class='pop-up'>
					<h3 class='m-0 p-0'><strong>${situation}</strong></h3>
					<p class='m-0 p-0'><strong>${marker.buoy.name}</strong></p>
					<p class='m-0 p-0'><strong>LAT:</strong> ${Math.round(marker.buoy.latitude*1000)/1000}, <strong>LON:</strong> ${Math.round(marker.buoy.longitude*1000)/1000}</p></div>`))
				.addTo(map);
		});
		
		fitMapToMarkers(map, lat, lon, zoom);
	}
};

const initMapbox = () => {

	const fitMapToMarkers = (map, markers) => {
		const bounds = new mapboxgl.LngLatBounds();
		markers.forEach(marker => bounds.extend([ marker.lon, marker.lat ]));
		map.fitBounds(bounds, { padding: 70, maxZoom: 8, duration: 0 });
	};
  
	const mapElement = document.getElementById('map');

	if (mapElement) { // only build a map if there's a div#map to inject into
		mapboxgl.accessToken = mapElement.dataset.mapboxApiKey;
		const map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/mapbox/outdoors-v11'
		});

		const markers = JSON.parse(mapElement.dataset.markers);
		const almirantado_intData = JSON.parse(mapElement.dataset.almirantadoint);
		const almirantado_extData = JSON.parse(mapElement.dataset.almirantadoext);
		const inpeData = JSON.parse(mapElement.dataset.inpe);

		const inpeCard = document.getElementById('inpe');
		const almirantadoIntCard = document.getElementById('almirantado_int');
		const almirantadoExtCard = document.getElementById('almirantado_ext');

		markers.forEach((marker) => {
			if (marker.name === 'almirantado_int') {
				var almirantado_int = document.createElement('div');
				almirantado_int.className = 'marker';
				almirantado_int.style.backgroundImage = `url('${spotterIconBlue}')`;
				almirantado_int.style.backgroundSize = 'contain';
				almirantado_int.style.width = '50px';
				almirantado_int.style.height = '38px';
				if (JSON.stringify(almirantado_intData) === '{}' || almirantado_intData.date_time.length === 0) {
					const markerAlmirantadoInt = new mapboxgl.Marker(almirantado_int)
					.setLngLat([ marker.lon, marker.lat ])
			        .setPopup(new mapboxgl.Popup().setHTML(`<div class='pop-up'>
			          <h3 class='m-0 p-0'><strong>A SER LANÇADA</strong></h3></div>`))
					.addTo(map);
					markerAlmirantadoInt.getElement().addEventListener('click', () => {
						almirantadoIntCard.classList.remove('card-animation');
						void 	almirantadoIntCard.offsetWidth; // trigger reflow
						almirantadoIntCard.classList.add('card-animation');
			        });
				} else {
					const markerAlmirantadoInt = new mapboxgl.Marker(almirantado_int)
					.setLngLat([ marker.lon, marker.lat ])
			        .setPopup(new mapboxgl.Popup().setHTML(`<div class='pop-up'>
			          <h3 class='m-0 p-0'><strong>OPERATIVA</strong></h3>
			          <p class='m-0 p-0'><strong>LAT:</strong> ${Math.round(marker.lat*100)/100}, <strong>LON:</strong> ${Math.round(marker.lon*100)/100}</p>
			          <p class='m-0 p-0'><strong>DATA:</strong> ${almirantado_intData.date_time[0].slice(0,10)}</p>
			          <p class='m-0 p-0'><strong>HORA:</strong> ${almirantado_intData.date_time[0].slice(11,16)}</p>
			          <p class='m-0 p-0'><strong>Altura Onda:</strong> ${almirantado_intData.swvht[0]} m</p>
			          <p class='m-0 p-0'><strong>Vel. Vento:</strong> ${almirantado_intData.wspd[0]} m/s</p></div>`))
					.addTo(map);
					markerAlmirantadoInt.getElement().addEventListener('click', () => {
						almirantadoIntCard.classList.remove('card-animation');
						void 	almirantadoIntCard.offsetWidth; // trigger reflow
						almirantadoIntCard.classList.add('card-animation');
			        });
				}
			} else if (marker.name === 'almirantado_ext'){
				var almirantado_ext = document.createElement('div');
				almirantado_ext.className = 'marker';
				almirantado_ext.style.backgroundImage = `url('${spotterIconYellow}')`;
				almirantado_ext.style.backgroundSize = 'contain';
				almirantado_ext.style.width = '50px';
				almirantado_ext.style.height = '38px';
				if (JSON.stringify(almirantado_extData) === '{}'  || almirantado_extData.date_time.length === 0) {
					const markerAlmirantadoExt = new mapboxgl.Marker(almirantado_ext)
					.setLngLat([ marker.lon, marker.lat ])
			        .setPopup(new mapboxgl.Popup().setHTML(`<div class='pop-up'>
			          <h3 class='m-0 p-0'><strong>A SER LANÇADA</strong></h3></div>`))
					.addTo(map);
					markerAlmirantadoExt.getElement().addEventListener('click', () => {
						almirantadoExtCard.classList.remove('card-animation');
						void 	almirantadoExtCard.offsetWidth; // trigger reflow
						almirantadoExtCard.classList.add('card-animation');
			        });					
				} else {
					const markerAlmirantadoExt = new mapboxgl.Marker(almirantado_ext)
					.setLngLat([ marker.lon, marker.lat ])
			        .setPopup(new mapboxgl.Popup().setHTML(`<div class='pop-up'>
			          <h3 class='m-0 p-0'><strong>OPERATIVA</strong></h3>
			          <p class='m-0 p-0'><strong>LAT:</strong> ${Math.round(marker.lat*100)/100}, <strong>LON:</strong> ${Math.round(marker.lon*100)/100}</p>
			          <p class='m-0 p-0'><strong>DATA:</strong> ${almirantado_extData.date_time[0].slice(0,10)}</p>
			          <p class='m-0 p-0'><strong>HORA:</strong> ${almirantado_extData.date_time[0].slice(11,16)}</p>
			          <p class='m-0 p-0'><strong>Altura Onda:</strong> ${almirantado_extData.swvht[0]} m</p>
			          <p class='m-0 p-0'><strong>Vel. Vento:</strong> ${almirantado_extData.wspd[0]} m/s</p></div>`))
					.addTo(map);
					markerAlmirantadoExt.getElement().addEventListener('click', () => {
						almirantadoExtCard.classList.remove('card-animation');
						void 	almirantadoExtCard.offsetWidth; // trigger reflow
						almirantadoExtCard.classList.add('card-animation');
			        });
			    }
			} else {
				var inpe = document.createElement('div');
				inpe.className = 'marker';
				inpe.style.backgroundImage = `url('${spotterIconGreen}')`;
				inpe.style.backgroundSize = 'contain';
				inpe.style.width = '50px';
				inpe.style.height = '38px';
				if (JSON.stringify(inpeData) === '{}'  || inpeData.date_time.length === 0) {
					const markerInpe = new mapboxgl.Marker(inpe)
					.setLngLat([ marker.lon, marker.lat ])
					.setPopup(new mapboxgl.Popup().setHTML(`<div class='pop-up'>
			        	<h3 class='m-0 p-0'><strong>A SER LANÇADA</strong></h3></div>`))
					.addTo(map);
					markerInpe.getElement().addEventListener('click', () => {
						inpeCard.classList.remove('card-animation');
						void 	inpeCard.offsetWidth; // trigger reflow
						inpeCard.classList.add('card-animation');
					});
				} else {
					const markerInpe = new mapboxgl.Marker(inpe)
					.setLngLat([ marker.lon, marker.lat ])
					.setPopup(new mapboxgl.Popup().setHTML(`<div class='pop-up'>
			        	<h3 class='m-0 p-0'><strong>OPERATIVA</strong></h3>
	          			<p class='m-0 p-0'><strong>LAT:</strong> ${Math.round(marker.lat*100)/100}, <strong>LON:</strong> ${Math.round(marker.lon*100)/100}</p>
						<p class='m-0 p-0'><strong>DATA:</strong> ${inpeData.date_time[0].slice(0,10)}</p>
	         			<p class='m-0 p-0'><strong>HORA:</strong> ${inpeData.date_time[0].slice(11,16)}</p>
						<p class='m-0 p-0'><strong>Altura Onda:</strong> ${inpeData.swvht[0]} m</p>
						<p class='m-0 p-0'><strong>Vel. Vento:</strong> ${inpeData.wspd[0]} m/s</p></div>`))
					.addTo(map);
					markerInpe.getElement().addEventListener('click', () => {
						inpeCard.classList.remove('card-animation');
						void 	inpeCard.offsetWidth; // trigger reflow
						inpeCard.classList.add('card-animation');
			        });
				}
			}
		});

		fitMapToMarkers(map, markers);
	}
};

const initMapboxDrifter = () => {

	const fitMapToMarkers = (map, markers) => {
		const bounds = new mapboxgl.LngLatBounds();
		markers.forEach(marker => bounds.extend([ marker.lon, marker.lat ]));
		map.fitBounds(bounds, { padding: 70, maxZoom: 8, duration: 0 });
	};
  
	const mapElement = document.getElementById('map_drifter');

	if (mapElement) { // only build a map if there's a div#map to inject into
		mapboxgl.accessToken = mapElement.dataset.mapboxApiKey;
		const map = new mapboxgl.Map({
			container: 'map_drifter',
			style: 'mapbox://styles/mapbox/outdoors-v11'
		});

		const markers = JSON.parse(mapElement.dataset.markers);

		console.log(markers)


		const almirantado_extData = JSON.parse(mapElement.dataset.almirantadoext);

		almirantado_extData.forEach((marker) => {
			const markerAlmirantadoInt = new mapboxgl.Marker()
					.setLngLat([ marker[2], marker[1]])
					.setPopup(new mapboxgl.Popup().setHTML(`<div class='pop-up'>
						<p class='m-0 p-0'><strong>LAT:</strong> ${marker[1]}, <strong>LON:</strong> ${marker[2]}</p>
						<p class='m-0 p-0'><strong>DATA:</strong> ${marker[3].slice(0,10)}</p>
						<p class='m-0 p-0'><strong>HORA:</strong> ${marker[3].slice(11,16)}</p>
						</div>`))
					.addTo(map);
		});
		fitMapToMarkers(map, markers);
	}
};


const markerIcon = (text, limit, typeValue, value, maxValue) => {

	const colors = getColor(limit, maxValue, typeValue);
	let htmlText
	if (typeValue === 'normal'){
  
	  let index = Math.round(text.toFixed(1)/maxValue*100)
	  if (index < 0){
		index = index * (-1)
	  }
	  if (index === 100){
		index = index - 1;
	  }
  
	  htmlText = `<div class='all-icon'>
		  <div class='circle-color'>
			<i class="fas fa-circle" style='z-index: 0; color: ${colors[index]};  font-size: 28px;'></i>
		  </div>
		  <p class='p-0 m-0 circle-text' style='z-index:10'>${text.toFixed(1).toString()}</p>
		</div>`;
  
	  const icon = L.divIcon({
		html: htmlText,
		className: '',
	  });
  
	  return icon;
	} else if (typeValue === 'normal-pres'){
	  let pressMin = 940;
  
	  let index = Math.round((text.toFixed(1)-pressMin)/(maxValue-pressMin)*100)
	  if (index < 0){
		index = index * (-1)
	  }
	  if (index === 100){
		index = index - 1;
	  }
  
	  htmlText = `<div class='all-icon'>
		  <div class='circle-color'>
			<i class="fas fa-circle" style='z-index: 0; color: ${colors[index]};  font-size: 28px;'></i>
		  </div>
		  <p class='p-0 m-0 circle-text' style='z-index:10'>${text.toFixed(0).toString()}</p>
		</div>`;
  
	  const icon = L.divIcon({
		html: htmlText,
		className: '',
	  });
  
	  return icon;
	
	} else{
	  let index = Math.round(value/maxValue*100)
	  htmlText = `<div class='all-icon' style='transform: rotate(${text}deg);color: ${colors[index]};  font-size: 20px;'>
		<i class="fas fa-arrow-up"></i>
		</div>`;
	  const icon = L.divIcon({
		html: htmlText,
		className: '',
	  });
	  return icon;    
	}
  };



export { initMapbox, initMapboxNew, initMapboxDrifter, initMapboxSofar };
