<script lang="ts">
	import { displayTallyReports, displayTallyTable  } from '$lib/services';

	function showTallyReports() {
		displayTallyReports();
	}
	function showTable() {
		displayTallyTable();
	}
</script>

<div class="tallyButtons">
	<input class="tallyButton" id="tallyReportsButton" type="button" value="Reports" on:click={showTallyReports} />
	<input class="tallyButton" id="tallyMetrics" type="button" value="Metrics" on:click={() => window.open('https://metrics.bmlt.app/', '_blank')} />
	<input class="tallyButton" id="tallyRootServers" type="button" value="Root Servers" on:click={showTable} style="display:none;">
</div>
