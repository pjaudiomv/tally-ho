<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchTallyData } from './services';
	import TallySummary from '../components/TallySummary.svelte';
	import TallyButtons from '../components/TallyButtons.svelte';
	import TallyTable from '../components/TallyTable.svelte';
	import TallyLegend from '../components/TallyLegend.svelte';
	import '../css/tally.css';

	onMount(async () => {
		await fetchTallyData();
	});
</script>

<div id="tallyBannerContainer">
	<img id="tallyBannerImage" src="images/banner.png" alt="Tally Banner" />
</div>
<div id="tallyMan">
	<TallySummary />
	<TallyButtons />
	<div id="tallyLogTable" style="display:none">
		<div id="tallyRootServerDataLoading"><img src="images/spinner3.gif" alt="Loading" /> Loading Root Server Data</div>
	</div>
	<TallyTable />
	<TallyLegend />
</div>
<div id="tallyReports" style="display: none;">
	<TallyButtons />
	<div id="tallyReportsTemplate"></div>
</div>
<div id="tallyMap" style="display: none;"></div>
