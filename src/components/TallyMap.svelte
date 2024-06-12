<script lang="ts">
	import { displayTallyTable } from '$lib/services';
	import { currentView } from '$lib/store';

	function showTable() {
		displayTallyTable();
		currentView.set('default');
	}
</script>

<input class="tallyButton" id="tallyRootServers" type="button" value="Root Servers" on:click={showTable} />
<h1>Hey</h1>
