var mapJs = (function() {
	var map;

	function bindListeners() {

		for(let ii = 0; ii < 11; ii++) {
			let a = 'aaa';
			console.log(ii);
		}

		//On window resize, resize that map
		window.addEventListener('resize', function() {
			var consoleSectionHeight = $(document.getElementById('console')).outerHeight(),
				mapHeight = window.innerHeight - consoleSectionHeight,
				mapEl = document.getElementById('map');

			mapEl.style.height = mapHeight + 'px';

		}, true);
	}

	function initMap() {
		//Adjust widths/heights of map section
		var consoleSectionHeight = $(document.getElementById('console')).outerHeight(),
			mapHeight = window.innerHeight - consoleSectionHeight,
			mapEl = document.getElementById('map');

		mapEl.style.height = mapHeight + 'px';

		map = new google.maps.Map(mapEl, {
			center: {
				lat: 29.0,
				lng: -82.0
			},
			zoom: 7
		});

		navigator.geolocation.getCurrentPosition(centerOnCurrentLocation);
	}

	function centerOnCurrentLocation(position) {
		var latitude = position.coords.latitude,
			longitude = position.coords.longitude,
			point = new google.maps.LatLng(latitude, longitude),
			altitude = position.coords.altitude,
			accuracy = position.coords.accuracy,
			altitudeAccuracy = position.coords.altitudeAccuracy,
			heading = position.coords.heading,
			speed = position.coords.speed,
			timestamp = position.timestamp,
			//
			marker = new google.maps.Marker({
				position: point,
				title: 'Where I am'
			});

		marker.setMap(map);
		map.panTo(point);

		//var driver = new Driver(latitude, longitude, altitude, accuracy, altitudeAccuracy, heading, speed, timestamp);
	}

	function getMapMarker(options) {
		return google.maps.Marker(options);
	}

	function getMap() {
		return map;
	}

	function init() {
		bindListeners();
		initMap();
	}

	/*************************
	 * Driver Object
	 ************************/
	function Driver(latitude, longitude, altitude, accuracy, altitudeAccuracy, heading, speed, timestamp) {
		this.latitude = latitude;
		this.longitude = longitude;
		this.altitude = altitude;
		this.accuracy = accuracy;
		this.altitudeAccuracy = altitudeAccuracy;
		this.heading = heading;
		this.speed = speed;
		this.timestamp = timestamp;
	}

	Driver.prototype.moveMarker = function(latitude, longitude) {

	};

	return {
		init: init,
		getMap: getMap,
		centerOnCurrentLocation: centerOnCurrentLocation
	};

}(undefined));