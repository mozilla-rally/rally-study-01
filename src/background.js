import browser from 'webextension-polyfill';
import AttentionStream from './AttentionStream';
const attention = new AttentionStream();

async function browse(...items) {
  for (const [url, attention = 0, active = true] of items) {
    await browser.tabs.create({ url, active});
    await delay(attention);
  }
}

function delay(time = 0) {
  return new Promise((resolve) => { setTimeout(resolve, time) } );
}

// attention.onAttentionStart((event, tab, stream) => {

// })

// browser.runtime.onMessage.addListener(console.log);

attention.onAttentionEnd(event => {
  console.log("END", event);
})

function openPage() {
  browser.runtime.openOptionsPage().catch(e => {
    console.error(`Study Add-On - Unable to open the control panel`, e);
  });
}

browse(
  ["https://news.ycombinator.com", 500],
  ["https://newyorker.com", 100,]
)

browser.browserAction.onClicked.addListener(openPage);