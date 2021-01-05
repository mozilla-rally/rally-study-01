<script>
	import { onMount, setContext } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { get } from 'svelte/store';
	import { flip } from 'svelte/animate';
	import mouseCoords from '../../src/app/components/mini-browser/mouse-coords';
	import TabManager from '../../src/app/components/mini-browser/tab-manager';
	import Container from '../../src/app/components/mini-browser/Container.svelte';
	import MiniBrowser from '../../src/app/components/mini-browser/MiniBrowser.svelte';
	import Tab from '../../src/app/components/mini-browser/Tab.svelte';
	import SocialMedia from '../../src/app/components/mini-browser/SocialMedia.svelte';
	import Search from '../../src/app/components/mini-browser/Search.svelte';
	import News from '../../src/app/components/mini-browser/News.svelte';
	import Cursor from '../../src/app/components/mini-browser/Cursor.svelte';
	import SearchBody from './Search.svelte';
	import SocialMediaBody from './SocialMedia.svelte';
	import NewsBody from './News.svelte';

	import Event from '../../src/app/components/mini-browser/Event.svelte';
	import EventContainer from '../../src/app/components/mini-browser/EventContainer.svelte';
	
	const CURSOR_TIME = 500;
	const EVENT_TRANSITION = 150;
	setContext('CURSOR_TIIME', CURSOR_TIME);
	setContext('EVENT_TRANSITION', EVENT_TRANSITION);



	let tabs = [
		{name: "search", id: 0, icon: Search, url: `<span></span> :// <span></span> . <span style="--w: 2;"></span> . <span style="--w:.75"></span>`, content: SearchBody},
		{name: "social media", id: 1, icon: SocialMedia, url: `<span></span> :// <span></span> . <span style="--w: 2.3"></span> . <span style="--w:.75"></span> / <span style="--w:1"></span>`, content: SocialMediaBody},
		{name: "news", id: 2, icon: News, url: `<span></span> :// <span></span> . <span style="--w: 1.8;"></span> . <span style="--w:.75"></span> / <span style="--w:1.2"></span> / <span style="--w:.7"></span> / <span style="--w:1.2"></span> ? <span style="--w:.8"></span> = <span style="--w:1.2"></span>`, content: NewsBody},
	];
	
	let which = tabs[0];

	const tm = new TabManager(tabs);

	let timer;
	let events = [];

	let elapsedTimer;
	let ms = 0;

	function startElapsedTimer() {
		if (elapsedTimer) {
			ms = 1000;
			elapsed.set(0, { duration: 0 });
			elapsed.set(ms);
			clearInterval(elapsedTimer);
		}
		elapsedTimer = setInterval(() => {
			ms += 1000;
			elapsed.set(ms);
		}, 1000)
	};

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
			startElapsedTimer();
	}

	let elapsed = tweened(0, { duration: 1000 });
	
	elapsed.subscribe(ms => {
		if (events.length)  events[0].elapsed = ~~ms;
	});

	startElapsedTimer();
	
	onMount(() => {
		setActiveTab(0);
		setTabAnimation();
	})
	const coords = mouseCoords(300, 300, { duration: CURSOR_TIME });

	let activeTab = tm.activeTab;
	async function switchTabs(tabID) {
		const nextTab = tm.getTab(tabID);
		await coords.goToElement(nextTab.container);
		await tm.setActiveTab(tabID);
		// set timer?
		await finishEvent();
		activeTab = tm.activeTab;
	}

	function setTabAnimation() {
		setTimeout(() => {
			if (tm.activeTab.id === 0) {

				switchTabs(2);
			} else {
				switchTabs(0	);
			}
			setTab();
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
							on:click={() => setActiveTab(tab.id)}
							on:close={() => closeTab(tab.id)}
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
			<div slot="cursor">
				<Cursor x={$coords.x} y={$coords.y} />
			</div>
		</MiniBrowser>

	<EventContainer>
		{#each events as event, i (event.id)}
		<div animate:flip={{duration: EVENT_TRANSITION}}>
			<Event end={i === event.length - 1} active={i === 0} elapsed={event.elapsed} uri={event.uri} start={event.start} />
		</div>
		{/each}
	</EventContainer>
</Container>