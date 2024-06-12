<script lang="ts">
	import { currentView } from '$lib/store';
	import { displayTallyReports, displayTallyTable } from '$lib/services';

	function showTallyReports() {
		displayTallyReports();
		currentView.set('reports');
	}

	function showTable() {
		displayTallyTable();
		currentView.set('default');
	}

	function openMetrics() {
		window.open('https://metrics.bmlt.app/', '_blank');
	}
</script>

<div class="tallyButtons">
	{#if $currentView === 'default'}
		<input class="tallyButton" id="tallyReportsButton" type="button" value="Reports" on:click={showTallyReports} />
		<input class="tallyButton" id="tallyMetrics" type="button" value="Metrics" on:click={openMetrics} />
	{/if}
	{#if $currentView === 'reports'}
		<input class="tallyButton" id="tallyRootServers" type="button" value="Root Servers" on:click={showTable} />
	{/if}
</div>
