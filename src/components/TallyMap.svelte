<script lang="ts">
	import { displayTallyTable } from '$lib/services';
	import { currentView } from '$lib/store';
	import { onMount } from 'svelte';
	import { Loader } from '@googlemaps/js-api-loader';

	let map: google.maps.Map;
	let mapElement: HTMLElement;

	function showTable() {
		displayTallyTable();
		currentView.set('default');
	}

	const setUpMapControls = (map: google.maps.Map) => {
		const centerControlDiv = document.createElement('div');
		centerControlDiv.id = 'centerControlDiv';
		centerControlDiv.className = 'centerControlDiv';

		const toggleButton = document.createElement('input');
		toggleButton.type = 'button';
		toggleButton.value = 'Show Table Display';
		toggleButton.className = 'showTableButton';
		toggleButton.addEventListener('click', showTable);
		centerControlDiv.appendChild(toggleButton);

		map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
	};

	const initMap = async (map: google.maps.Map) => {
		setUpMapControls(map);
	};

	onMount(async function () {
		const thing = 'QUl6YVN5QzRkMWNqX2ZRbVR1SDVJbTZoSkJXelRVWjNxZ2wzQjZF';
		const loader = new Loader({
			apiKey: window.atob(thing),
			version: 'beta',
			libraries: ['places', 'marker']
		});

		const { Map } = await loader.importLibrary('maps');

		mapElement = document.getElementById('map') as HTMLElement;

		if (mapElement) {
			map = new Map(mapElement, {
				center: { lat: 0, lng: 0 },
				zoom: 3,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU },
				zoomControl: true,
				mapTypeControl: true,
				scaleControl: true,
				mapId: 'sdle'
			});

			await initMap(map);
		} else {
			console.error('Map element not found');
		}
	});
</script>

<div id="map"></div>
