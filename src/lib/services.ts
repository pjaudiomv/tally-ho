import { tallyData } from './store';
import TallyReports from '../components/TallyReports.svelte';
import type { Tally, Root, Meeting, Reports } from '$lib/types';

export async function fetchTallyData() {
	try {
		const data = await getJSON('https://aggregator.bmltenabled.org/main_server/api/v1/rootservers/');
		tallyData.update((state) => {
			const newState = { ...state, ...calculateTallyData(data) };
			return newState;
		});
	} catch (error) {
		console.error('Error fetching tally data:', error);
	}
}

export function displayTallyReports() {
	const tallyMan = document.getElementById('tallyMan');
	const tallyReports = document.getElementById('tallyReports');
	const tallyReportsTemplate = document.getElementById('tallyReportsTemplate');
  const tallyRootServersButton = document.getElementById('tallyRootServers');

	if (tallyMan && tallyReports && tallyReportsTemplate && tallyRootServersButton) {
		tallyMan.style.display = 'none';
		tallyReports.style.display = 'block';
		tallyRootServersButton.style.display = 'block';

		new TallyReports({
			target: tallyReportsTemplate
		});
	}
}

export function displayTallyTable() {
	const tallyMan = document.getElementById('tallyMan');
	const tallyReports = document.getElementById('tallyReports');

	if (tallyMan && tallyReports) {
		tallyMan.style.display = 'block';
		tallyReports.style.display = 'none';
	}
}

function calculateTallyData(roots: Root[]): Partial<Tally> {
	let meetingsCount = 0;
	let groupsCount = 0;
	let areasCount = 0;
	let regionsCount = 0;
	let zonesCount = 0;
	const byRootServerVersions: Reports['byRootServerVersions'] = {};
	const meetings: Meeting[] = [];

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

		meetings.push({
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

	return {
		meetingsCount,
		groupsCount,
		areasCount,
		regionsCount,
		zonesCount,
		serversCount: roots.length,
		meetings,
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
