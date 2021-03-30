# Manually Testing Rally Study 01

## setup

Make sure to go through all the installation requirements in [README.md](README.md#requirements).

You will need to run the following commands in this repository:

```
# install all the dependencies for building this study
npm install

# spin up the study in developer mode. This will
# launch another version of Firefox Nightly with the study web extension installed.
npm run watch
```

Once you are running the study in developmer mode, pull up the [Multiprocess Browser Console](https://developer.mozilla.org/en-US/docs/Tools/Browser_Console). You can open the Browser Console in one of two ways:

1. from the menu: select "Browser Console" from the Web Developer submenu in the Firefox Menu (or Tools menu if you display the menu bar or are on macOS).
2. from the keyboard: press `Ctrl+Shift+J` (or `Cmd+Shift+J` on a Mac).

We will use only the `debug` and `error` views here. These appear below the trashcan icon in the Browser Console window. Once you have found the `warnings`, `logs`, and `info` options, feel free to de-select them. You will otherwise likely see through this QA a very large number of messages appear in the console. This study utilizes the `debug` view for messages, which is typically a little less noisy.

## 1. testing the attention event collection

### a. test that a normal page load works

- open a new tab and go to `https://wikipedia.org`.
- click on any link on the page to begin a new page visit. For instance, click on the `Wiktionary` link on the left below the fold.
- in the **Browser Console** you should see a debug log that starts with `RS01.event`, along with a data payload.
  - the `eventTerminationReason` should be `page-visit-stop`.
  - the `duration` should be comparable to the amount of time you spent on the page before you clicked on the `Wiktionary` link.
  - the `eventType` should be `"attention"`

### b. test that switching tabs & closing tabs works

- open a new tab and go to `https://wikipedia.org`.
- open another tab and go to `https://youtube.com`.
- switch back to the tab that has `https://wikipedia.org` loaded in it.
- in the **Browser Console** you should see a debug log that starts with `RS01.event`, along with a data payload.
  - the `eventTerminationReason` should be `tab-switched-away`.
  - the `duration` should be comparable to the amount of time you spent on the page before you switched back to the Wikipedia tab.
  - the `eventType` should be `"attention"`.
- now close the tab where Wikipedia was loaded. In the **Browser Console** you should see a debug log that starts with `RS01.event`, along with a data payload:
  - the `eventTerminationReason` should be `page-visit-stop`.
  - the `duration` should be comparable to the amount of time you spent on the Wikipedia page this time before closing it.
  - the `eventType` should be `"attention"`.

### c. test that switching windows works

- open a new tab and go to `https://wikipedia.org`
- open a new window & tab, in in that new window / tab, go to `https://youtube.com`.
- click back to the first window where the Wikipedia page is open.
- in the **Browser Console** you should see a debug log that starts with `RS01.event`, along with a data payload.
  - the `eventTerminationReason` should be `window-focused-lost`
  - the `duration` should be comparable to the amount of time you spent on the page before you switched back to the Wikipedia tab.
  - the `eventType` should be `"attention"`

## 2. testing the audio event collection

### a. test that an audio event finishes when audio stops or tab is closed

- open a new tab and go to `https://youtube.com`.
- click on any video and make sure it is playing & that the audio in the player is not muted.
- after a few seconds, stop the video.
- in the **Browser Console** you should see a debug log that starts with `RS01.event`, along with a data payload:
  - the `eventTerminationReason` should be `audio-event-finished`
- open another tab and to go `https://wikipedia.org`.
- click back into the tab where the Youtube video was, and resume play.
- while the video is playing, close the tab with the video.
- After you close the tab, look in the **Browser Console** you should see two separate events that are very similar. Both start with `RS01.event`, along with a data payload.
  - one event will have `eventType` set to `"attention"`. That's the end of the attention event.
  - the other event that looks similar will have an `eventType` set to `"audio"`. That's the end of the audio event.
  - the `eventTerminationReason` in both cases should be `page-visit-stop`.