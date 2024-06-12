import { tallyData, currentView } from './store';
import TallyReports from '../components/TallyReports.svelte';
import type { Tally, AggregatorRoot, Root, Reports, ServerInfo, ServiceBody, Meeting } from '$lib/types';

let tallyReportsInstance: TallyReports | null = null;

const virtual_roots: Root[] = [
	{
		id: '143',
		name: 'Virtual NA',
		root_server_url: 'https://bmlt.virtual-na.org/main_server/',
		num_zones: 0,
		num_regions: 0,
		num_areas: 0,
		num_groups: 0,
		num_total_meetings: 0,
		num_in_person: 0,
		num_virtual: 0,
		num_hybrid: 0,
		num_unknown: 0,
		server_info: '[{"version": "0.0.0","semanticAdmin": "0"}]'
	}
];

export async function fetchTallyData() {
	try {
		const data: AggregatorRoot[] = await getJSON('https://aggregator.bmltenabled.org/main_server/api/v1/rootservers/');
		const newState = await calculateTallyData(data);
		tallyData.update((state) => {
			return { ...state, ...newState };
		});
	} catch (error) {
		console.error('Error fetching tally data:', error);
	}
}

export function displayTallyReports() {
	currentView.set('reports'); // Use store to manage current view
	const tallyMan = document.getElementById('tallyMan');
	const tallyReports = document.getElementById('tallyReports');
	const tallyReportsTemplate = document.getElementById('tallyReportsTemplate');

	if (tallyMan && tallyReports && tallyReportsTemplate) {
		tallyMan.style.display = 'none';
		tallyReports.style.display = 'block';

		if (!tallyReportsInstance) {
			tallyReportsInstance = new TallyReports({
				target: tallyReportsTemplate
			});
		}
	}
}

export function displayTallyTable() {
	currentView.set('default'); // Use store to manage current view
	const tallyMan = document.getElementById('tallyMan');
	const tallyReports = document.getElementById('tallyReports');

	if (tallyMan && tallyReports) {
		tallyMan.style.display = 'block';
		tallyReports.style.display = 'none';
	}
}

const getVirtualRootsDetails = async (roots: Root[]): Promise<Root[]> => {
	const updatedRoots: Root[] = [];

	for (const root of roots) {
		try {
			const serviceBodies: ServiceBody[] = await getJSON(`${root.root_server_url}client_interface/json/?switcher=GetServiceBodies`);

			const counts = serviceBodies.reduce(
				(acc, serviceBody) => {
					if (serviceBody.type === 'ZF') {
						acc.zones++;
					} else if (serviceBody.type === 'RS') {
						acc.regions++;
					} else {
						acc.areas++;
					}
					return acc;
				},
				{ regions: 0, areas: 0, zones: 0 }
			);

			const serverInfo: ServerInfo[] = await getJSON(`${root.root_server_url}client_interface/json/?switcher=GetServerInfo`);
			const meetings: Meeting[] = await getJSON(`${root.root_server_url}client_interface/json/?switcher=GetSearchResults&data_field_key=id_bigint,meeting_name`);

			const virtualGroupDistinction: Set<string> = new Set(meetings.map((meeting) => meeting.meeting_name));

			updatedRoots.push({
				root_server_url: root.root_server_url,
				name: root.name,
				num_zones: counts.zones,
				num_regions: counts.regions,
				num_areas: counts.areas,
				num_groups: virtualGroupDistinction.size,
				num_total_meetings: meetings.length,
				num_in_person: root.num_in_person,
				num_virtual: root.num_virtual,
				num_hybrid: root.num_hybrid,
				num_unknown: root.num_unknown,
				server_info: JSON.stringify(serverInfo[0])
			});
		} catch (error) {
			console.error(`Error fetching data for root ${root.id}:`, error);
		}
	}

	return updatedRoots;
};

async function calculateTallyData(roots: AggregatorRoot[]): Promise<Partial<Tally>> {
	let meetingsCount = 0;
	let groupsCount = 0;
	let areasCount = 0;
	let regionsCount = 0;
	let zonesCount = 0;
	const byRootServerVersions: Reports['byRootServerVersions'] = {};
	const filteredRoots: Root[] = [];

	roots.forEach((root) => {
		root.root_server_url = root.url.replace(/\/$/, '');
		const version = JSON.parse(root.serverInfo).version;
		const stats = root.statistics;

		byRootServerVersions[version] = (byRootServerVersions[version] || 0) + 1;
		meetingsCount += stats.meetings.numTotal;
		groupsCount += stats.serviceBodies.numGroups;
		areasCount += stats.serviceBodies.numAreas;
		regionsCount += stats.serviceBodies.numRegions;
		zonesCount += stats.serviceBodies.numZones;

		filteredRoots.push({
			root_server_url: root.root_server_url,
			name: root.name,
			num_zones: stats.serviceBodies.numZones,
			num_regions: stats.serviceBodies.numRegions,
			num_areas: stats.serviceBodies.numAreas,
			num_groups: stats.serviceBodies.numGroups,
			num_total_meetings: stats.meetings.numTotal,
			num_in_person: stats.meetings.numInPerson,
			num_virtual: stats.meetings.numVirtual,
			num_hybrid: stats.meetings.numHybrid,
			num_unknown: stats.meetings.numUnknown,
			server_info: root.serverInfo
		});
	});

	const virtualRoots = await getVirtualRootsDetails(virtual_roots);
	filteredRoots.push(...virtualRoots);

	return {
		meetingsCount,
		groupsCount,
		areasCount,
		regionsCount,
		zonesCount,
		serversCount: roots.length + virtualRoots.length,
		filteredRoots,
		roots,
		serviceBodiesCount: areasCount + regionsCount + zonesCount,
		reports: { byRootServerVersions }
	};
}

async function getJSON(url: string): Promise<[]> {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error('Network response was not ok');
	}
	return await response.json();
}
