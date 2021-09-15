import Glean from "@mozilla/glean/webext";
import PingEncryptionPlugin from "@mozilla/glean/webext/plugins/encryption";

import { Rally, runStates } from "@mozilla/rally";
import { onPageData, stopMeasurement } from "./attention-reporter";

import * as pageMetrics from "../src/generated/page.js";
import * as pageVisitMetrics from "../src/generated/pageVisit.js";
import * as eventMetrics from "../src/generated/event.js";
import * as pageAttentionMetrics from "../src/generated/pageAttention.js";
import * as rallyManagementMetrics from "../src/generated/rally.js";
import * as rs01Pings from "../src/generated/pings.js";

function collectEventDataAndSubmit(rally, devMode) {
  // note: onPageData calls startMeasurement.
  onPageData.addListener(async (data) => {
    if (devMode) {
      console.debug("RS01.event", data);
    }

    // Report the data using Glean.
    pageMetrics.id.set(data.pageId);
    pageMetrics.origin.set(data.origin);
    pageMetrics.referrerOrigin.set(data.referrerOrigin);
    pageVisitMetrics.start.set(new Date(data.pageVisitStartTime));
    pageVisitMetrics.stop.set(new Date(data.pageVisitStopTime));
    eventMetrics.start.set(new Date(data.eventStartTime));
    eventMetrics.stop.set(new Date(data.eventStopTime));
    // `setRawNanos` expects the input to be in nanoseconds so
    // convert it before setting.
    eventMetrics.duration.setRawNanos(data.duration * 1000000);
    eventMetrics.terminationReason.set(data.eventTerminationReason);
    pageMetrics.title.set(data.title);
    pageMetrics.ogType.set(data.ogType);
    pageMetrics.ogDescription.set(data.description);

    if (data.eventType === "attention") {
      pageAttentionMetrics.maxRelativeScrollDepth.set(data.maxRelativeScrollDepth);
      pageAttentionMetrics.maxPixelScrollDepth.set(data.maxPixelScrollDepth);
      pageAttentionMetrics.scrollHeight.set(data.scrollHeight);
    }

    rs01Pings.rs01Event.submit(data.eventType);
  }, {
    matchPatterns: ["<all_urls>"],
    privateWindows: false
  });
}

export default async function runStudy(devMode) {
  const rallyStateChange = (newState) => {
    switch (newState) {
      case runStates.RUNNING: {
        // if the study is running but wasn't previously, let's re-initiate the onPageData listener.
        console.debug("~~~ RS01 running ~~~");

        const rallyId = rally.rallyId;
        rallyManagementMetrics.id.set(rallyId);

        // Send one-time study enrollment ping.
        // TODO this could be moved to the server-side.
        const studyEnrolled = browser.storage.local.get("studyEnrolled");
        if (studyEnrolled !== true) {
          rs01Pings.studyEnrollment.submit();
          browser.storage.local.set({
            studyEnrolled: true
          })
        }
        Glean.setUploadEnabled(true);
        collectEventDataAndSubmit(rally, devMode);
        break;
      }
      case runStates.PAUSED: {
        console.debug("~~~ RS01 not running ~~~");
        // stop the measurement here.
        stopMeasurement();
        Glean.setUploadEnabled(false);
        break;
      }
      case runStates.ENDED: {
        console.debug("~~~ RS01 not running ~~~");
        // stop the measurement here.
        stopMeasurement();
        Glean.setUploadEnabled(false);
        break;
      }
      default:
        throw new Error(`Unknown Rally state: ${newState}`);
    }
  }

  let rallySite = "https://rally-web-spike.web.app";
  if (devMode) {
    rallySite = "http://localhost:3000";
  }

  // The Rally Study ID.
  let studyId = "rally-study-01";
  if (devMode) {
    studyId = "exampleStudy1";
  }

  // The Firebase config.
  let firebaseConfig = {
    "apiKey": "AIzaSyAJv0aTJMCbG_e6FJZzc6hSzri9qDCmvoo",
    "authDomain": "rally-web-spike.firebaseapp.com",
    "projectId": "rally-web-spike",
    "storageBucket": "rally-web-spike.appspot.com",
    "messagingSenderId": "85993993890",
    "appId": "1:85993993890:web:b975ff99733d2d8b50c9fb",
    "functionsHost": "https://us-central1-rally-web-spike.cloudfunctions.net"
  }

  if (devMode) {
    firebaseConfig = {
      "apiKey": "abc123",
      "authDomain": "demo-rally.firebaseapp.com",
      "projectId": "demo-rally",
      "storageBucket": "demo-rally.appspot.com",
      "messagingSenderId": "abc123",
      "appId": "1:123:web:abc123",
      "functionsHost": "http://localhost:5001"
    }
  }

  const rally = new Rally(devMode, rallyStateChange, rallySite, studyId, firebaseConfig);

  const uploadEnabled = !devMode;

  // If we got to this point, then Rally is properly
  // initialized and we can flip collection on.
  Glean.initialize("rally-study-zero-one-rwp-test", uploadEnabled, {
    debug: { logPings: true },
    plugins: [
      new PingEncryptionPlugin({
        "crv": "P-256",
        "kid": "rally-study-zero-one-rwp-test",
        "kty": "EC",
        "x": "-a1Ths2-TNF5jon3MlfQXov5lGA4YX98aYsQLc3Rskg",
        "y": "Cf8PIvq_CV46r_DBdvAc0d6aN1WeWAWKfiMtwkpNGqw"
      })
    ]
  });

  return rally;
}
