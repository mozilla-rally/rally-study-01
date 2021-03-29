export const sharedEvents = {
    "pageId": {
        "type": "string",
        "description": "Each page ID is 128-bit value, randomly generated with the Web Crypto API and stored as a hexadecimal `String`. While this representation is less efficient than a `Uint8Array` or similar, it is more convenient for development and debugging. The page ID is available in the content script environment."
      },
      "tabId": {
        "type": "integer",
        "description": "the tab id as reported by the web extension API"
      },
      "windowId": {
        "type": "integer",
        "description": "the window id as reported by the web extension API"
      },
      "privateWindow": {
        "type": "boolean",
        "description": "whether or not the page visit was in a private browsing window. For this study, this will always be false."
      },
      "url": {
        "type": "string",
        "description": "the URL associated with the page visit"
      },
      "referrer": {
        "type": "string",
        "description": "the referrer URL for the page loading in the tab"
      },
      "pageVisitStartTime": {
        "type": "integer",
        "description": "a unix timestamp in miliseconds specifying the start time of the page visit"
      },
      "pageVisitEndTime": {
        "type": "integer",
        "description": "a unix timestamp in miliseconds specifying the start time of the page visit. NOTE: this field may be null"
      },
      "duration": {
        "type": "integer",
        "description": "duration of the event in miliseconds"
      },
      "reason": {
        "type": "string",
        "description": "user-initiated reason this event ended"
      },
      "title": {
        "type": "string",
        "description": "the contents of the title element in the head of the page"
      },
}
