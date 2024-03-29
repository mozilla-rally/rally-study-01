export const sharedEventProperties = {
    "eventType": {
      "type": "string",
      "description": "the type of event recorded. Either \"attention\" or \"audio\". An attention event is an instance where the user was actively using the browser in an active tab in an active window. An audio event tells us when an active browser tab has audio playing. We use this as a proxy for a user passively consuming audio and video. These two event types have near identical payloads, with a few exceptions noted below.",
      "enum": ["attention", "audio"]
    },
    "pageId": {
        "type": "string",
        "description": "a unique ID associated with a page visit. Each page ID is 128-bit value, randomly generated with the Web Crypto API and stored as a hexadecimal `String`. While this representation is less efficient than a `Uint8Array` or similar, it is more convenient for development and debugging."
      },
      "origin": {
        "type": "string",
        "description": "the origin of the URL associated with the page visit. Calculated by applying new URL(url).origin. See https://developer.mozilla.org/en-US/docs/Web/API/URL/origin"
      },
      "referrerOrigin": {
        "type": "string",
        "description":"the origin of the referrer URL for the page loading in the tab, or `\"\"` if there is no referrer."
      },
      "pageVisitStartTime": {
        "type": "integer",
        "description": "unix timestamp (in ms) of the page visit start"
      },
      "pageVisitStopTime": {
        "type": "integer",
        "description": "unix timestamp (in ms) of the page visit end. NOTE: this field will not necessarily represent the page visit stop time, just the largest time value at the time of the event creation. For a given page id, look for the largest value of pageVisitStopTime to get more accurate information."
      },
      "duration": {
        "type": "integer",
        "description": "duration (in ms) that the event occurred"
      },
      "eventStartTime": { 
        "type": "integer", 
        "description": "unix timestamp (in ms) noting when the event started. For an attention event, this field notes when a an inactive tab with a page loaded in it has been given active focus or a new page loads in an already-active tab. For an audio event, this field notes when an unmuted audio element began playing in the active tab." 
      },
      "eventStopTime": { 
        "type": "integer", 
        "description": "unix timestamp (in ms) noting when the event ended. For an attention event, this field notes when a user closed the active tab, switched or closed the active window, or loaded a new page into the active tab which ends the current attention event. For an audio event, this field notes when an unmuted audio element stopped playing in the active tab." 
      },
      "eventTerminationReason": {
        "type": "string",
        "description": "the reason the user’s attention switched to the current attention event (e.g. changed a tab, loaded a new URL in the currently-active tab, closed a tab, closed a window, created a new tab, created a new window, stopped playing audio)"
      },
      "title": {
        "type": "string",
        "description": "the contents of the title element in the head of the page"
      },
      "description": {
        "type": "string",
        "description": "the og:description meta tag contents (e.g. <meta type=\"og:description\" contents=\"...\" />). If this isn't supplied, then attempts to look at the meta description contents (e.g. <meta name=\"description\" content=\"...\">)"
      },
      "ogType": {
        "type": "string",
        "description": "the og:type meta tag contents (e.g. <meta type=\"og:type\" contents=\"article\" />)"
      }
}

export const requiredEvents = [
  // note that pageVisitStopTime is not a required field.
  "eventType", "pageId", "origin", "referrerOrigin", "pageVisitStartTime",
  "duration", "eventStartTime", "eventStopTime", "eventTerminationReason",
  "description", "title", "ogType"
]

export const attentionEventProperties = {
  "maxPixelScrollDepth": {
    "type": "integer",
    "description": "The largest scroll pixel depth reached on the page"
  },
  "maxRelativeScrollDepth": {
    "type": "number",
    "description": "The largest depth reach on the page, as a proportion of the total page height"
  },
  "scrollHeight": {
    "type": "number",
    "description": "the total scroll height of the page, taken from document.documentElement.scrollHeight at the same interval as the other scroll fields."
  }
}

export const audioEventProperties = {
}