# Rally Study 01 Data Schema

The schema for validating reported data is available [here](#FIXME).

The `schema/` directory has two relevant components:

1. a script that generates the final schema, `generate-schema.mjs`. To generate the schema, run `npm run build:schema`.
2. the last-generated schema, `meaasurements.1.schema.json`.

We've separated the schema construction from the output in case we change the structure and need to output a more complex schema.

## Data Documentation

This part of the document describes the data being collected by this study. This study will send a [`pioneer-study` ping](https://firefox-source-docs.mozilla.org/toolkit/components/telemetry/data/pioneer-study.html) using the Mozilla Rally platform approximately once per day. This study is only available on Mozilla Firefox.

This study sends one event, `RS01.event`. It captures two event types, `"attention"` and `"audio"`, described below. Here is an example of an attention event:

```javascript
{
  "pageId": "2e9109c1a64eb6615fa434f418ce6c77",
  "canonicalOrOGURL": "",
  "origin": "https://www.wiktionary.org",
  "referrerOrigin": "https://www.wikipedia.org",
  "pageVisitStartTime": 1617135086813,
  "pageVisitStopTime": 1617135352548, 
  "duration": 2569,
  "maxRelativeScrollDepth": 0.5724815724815725,
  "maxPixelScrollDepth": 932,
  "scrollHeight": 1628,
  "eventTerminationReason": "page-visit-stop",
  "title": "Wiktionary",
  "ogType": "",
  "description": "",
  "eventStartTime": 1617135349979,
  "eventStopTime": 1617135352548,
  "eventType": "attention"
}
```

For each RS01.event, we will collect:
- `eventType`: The type of event recorded. Either `"attention"` or `"audio"`. An *attention* event is an instance where the user was actively using the browser in an active tab in an active window. An *audio* event tells us when an active browser tab has audio playing. We use this as a proxy for a user passively consuming audio and video. These two event types have near identical payloads, with a few exceptions noted below.
- `canonicalOrOGURL`: The canonical URL as found in the page's head element (e.g. `<link rel='canonical' href='...' />`). If the canonical URL isn't present, looks for and uses the og:url tag contents. if neither are present, will be an empty string.
- `origin`:  the origin of the URL associated with the page visit. Calculated by applying `new URL(url).origin`. See the documentation for [`url.origin`](https://developer.mozilla.org/en-US/docs/Web/API/URL/origin)
- `referrerOrigin`: The origin of the referrer URL for the page loading in the tab
- `pageVisitStartTime`: Unix timestamp (in ms) of the page visit start
- `pageVisitStopTime`: Unix timestamp (in ms) of the page visit end 
- `eventStartTime`: Unix timestamp (in ms) noting when the event started. For an attention event, this field notes when a tab with a page loaded in it was activated. For an audio event, this field notes when an unmuted audio element began playing in the active tab.
- `eventStopTime`: Unix timestamp (in ms) noting when the event ended. For an attention event, this field notes when a user closed the active tab, switched or closed the active window, or loaded a new page into the active tab. For an audio event, this field notes when an unmuted audio element stopped playing in the active tab.
- `duration`: Duration (in ms) that the event occurred
- `eventTerminationReason`: The reason the user’s attention switched to the current attention event (e.g. changed a tab, loaded a new URL in the currently-active tab, closed a tab, closed a window, created a new tab, created a new window, stopped playing audio)
- `title`: The contents of the title element in the head of the page
- `ogType`: the `og:type` meta tag contents (e.g. `<meta type="og:type" contents="article" />`)
- `description`: the `og:description` meta tag contents (e.g. `<meta type="og:description" contents="..." />`). If this isn't supplied, then attempts to look at the meta description contents (e.g. `<meta name="description" content="...">`)

For the attention events `(eventType="attention")` specifically, we will additionally collect the following fields. They will be null in the case of  eventType=”audio”:
- `maxRelativeScrollDepth`: the largest depth reach on the page, as a proportion of the total page height
- `maxPixelScrollDepth`: the largest scroll pixel depth reached on the page
- `scrollHeight`: the total scroll height of the page, taken from `document.documentElement.scrollHeight` at the same interval as the other scroll fields.
