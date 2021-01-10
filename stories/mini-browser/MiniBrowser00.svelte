<script>
	import { onMount, onDestroy, setContext } from 'svelte';
	import { get } from 'svelte/store';
	import mouseCoords from '../../src/app/components/mini-browser/mouse-coords';
	import TabManager from '../../src/app/components/mini-browser/tab-manager';
	import timer from '../../src/app/components/mini-browser/timer'

	import Container from '../../src/app/components/mini-browser/Container.svelte';
	import MiniBrowser from '../../src/app/components/mini-browser/MiniBrowser.svelte';
	import Tab from '../../src/app/components/mini-browser/Tab.svelte';
	import SocialMedia from '../../src/app/components/mini-browser/SocialMedia.svelte';
	import Search from '../../src/app/components/mini-browser/Search.svelte';
	import News from '../../src/app/components/mini-browser/News.svelte';
	import SearchBody from './Search.svelte';
	import SocialMediaBody from './SocialMedia.svelte';
	import NewsBody from './News.svelte';
	
	const CURSOR_TIME = 500;
	const EVENT_TRANSITION = 150;
	setContext('CURSOR_TIME', CURSOR_TIME);
	setContext('EVENT_TRANSITION', EVENT_TRANSITION);

	let tabs = [
		{name: "search", id: 0, icon: Search, url: `<span></span> :// <span></span> . <span style="--w: 2;"></span> . <span style="--w:.75"></span>`, content: SearchBody},
		{name: "social media", id: 1, icon: SocialMedia, url: `<span></span> :// <span></span> . <span style="--w: 2.3"></span> . <span style="--w:.75"></span> / <span style="--w:1"></span>`, content: SocialMediaBody},
		{name: "news", id: 2, icon: News, url: `<span></span> :// <span></span> . <span style="--w: 1.8;"></span> . <span style="--w:.75"></span> / <span style="--w:1.2"></span> / <span style="--w:.7"></span> / <span style="--w:1.2"></span> ? <span style="--w:.8"></span> = <span style="--w:1.2"></span>`, content: NewsBody},
	];

	const tm = new TabManager(tabs);
	let activeTab = tm.activeTab;
	let events = [];
	
	onMount(() => {
        tm.setActiveTab(0);
	})


	function finishEvent() {
		events.unshift({
				uri: tm.activeTab.url, 
				elapsed: Math.round(get(elapsed) * 1000),
				start: (new Date()).toISOString(),
				id: Math.max(...events.map(e=> e.id), -1) + 1  });
			if (events.length > 6) {
				events.pop();
			}
			events = events;
	}
	
	async function switchTabs(tabID) {
		const nextTab = tm.getTab(tabID);
		await coords.goToElement(nextTab.container);
		await tm.setActiveTab(tabID);
		await finishEvent();
		elapsed.restart();
		activeTab = tm.activeTab;
	}

	function setTabAnimation() {
		runningAnimation = setTimeout(() => {
			if (tm.activeTab.id === 0) {
				switchTabs(2);
			} else {
				switchTabs(0);
			}
			setTabAnimation();
		}, CURSOR_TIME * 4 + Math.random());
	}

</script>

<style>
.container {
	display: grid;
	grid-template-columns: max-content max-content;
	grid-column-gap: 16px;
}
</style>

<Container>
	<div class='container'>
		<MiniBrowser>
			<div style='display:contents;' slot='tabs'>
				{#each tm.tabs as tab (tab.id)}
					<Tab active={activeTab.id === tab.id} 
							on:click={() => {
                                tm.setActiveTab(tab.id);
                                activeTab = tm.activeTab;
                            }}
							on:close={() => {
                                tm.closeTab(tab.id);
                                activeTab = tm.activeTab;
                            }}
							bind:container={tab.container}
					>
						<div slot=icon style='display: contents;'>
						{#if tab.icon}
							<svelte:component this={tab.icon} />
						{/if}
						</div>
						{tab.name}</Tab>
				{/each}
			</div>
			<div style='display: contents;' slot='url'>
				{#if tm.activeTab.url}
					{@html tm.activeTab.url}
				{/if}
			</div>
			<div style="display: contents;" slot='window'>
				{#if tm.activeTab.content}
					<svelte:component this={tm.activeTab.content} />
				{/if}
			</div>
		</MiniBrowser>
</Container>