<script lang="ts">
	import { displayTallyTable } from '$lib/services';
	import { currentView, meetingData } from '$lib/store';
	import type { MeetingLocations } from '$lib/types';
	import { onMount } from 'svelte';
	import { Loader } from '@googlemaps/js-api-loader';
	import { MarkerClusterer, Cluster } from '@googlemaps/markerclusterer';

	let meetings: MeetingLocations[] = [];

	meetingData.subscribe((value) => {
		meetings = value;
	});

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

	const createCustomRenderer = () => {
		return {
			render(cluster: Cluster): google.maps.marker.AdvancedMarkerElement {
				const count = cluster.count;
				const position = cluster.position;

				const naMarkerImage = document.createElement('img');
				naMarkerImage.src = count > 10 ? 'images/NAMarkerB.png' : 'images/NAMarkerR.png';

				const div = document.createElement('div');
				div.appendChild(naMarkerImage);

				return new google.maps.marker.AdvancedMarkerElement({
					position: position.toJSON(),
					content: div
				});
			}
		};
	};

	onMount(async function () {
		const thing = 'QUl6YVN5QzRkMWNqX2ZRbVR1SDVJbTZoSkJXelRVWjNxZ2wzQjZF';
		const loader = new Loader({
			apiKey: window.atob(thing),
			version: 'beta',
			libraries: ['places', 'marker']
		});

		const { Map } = await loader.importLibrary('maps');
		await google.maps.importLibrary('marker');

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

			const markers = meetings.map((location) => {
				const naMarkerImage = document.createElement('img');
				naMarkerImage.src = 'images/NAMarkerR.png';
				const position: google.maps.LatLngLiteral = {
					lat: location.latitude,
					lng: location.longitude
				};
				const div = document.createElement('div');
				div.appendChild(naMarkerImage);
				return new google.maps.marker.AdvancedMarkerElement({
					position: position,
					content: div
				});
			});

			new MarkerClusterer({ markers, map, renderer: createCustomRenderer() });
		}
	});
</script>

<div id="map" style="height: 500px;"></div>
