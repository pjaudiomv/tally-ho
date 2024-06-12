import { writable } from 'svelte/store';
import type { Tally } from './types'; // Adjust the import path as necessary

export const initialTally: Tally = {
	knownTotal: 72215,
	meetingsCount: 0,
	groupsCount: 0,
	areasCount: 0,
	regionsCount: 0,
	zonesCount: 0,
	serversCount: 0,
	serviceBodiesCount: 0,
	filteredRoots: [],
	roots: [],
	reports: {
		byRootServerVersions: {
			'3.0.5': 24
		}
	}
};

export const tallyData = writable<Tally>(initialTally);
export const currentView = writable('default');
export const isLoadingData = writable(true);
