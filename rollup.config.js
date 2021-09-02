/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import commonjs from "@rollup/plugin-commonjs";
import copy from "rollup-plugin-copy";
import replace from "@rollup/plugin-replace";
import resolve from "@rollup/plugin-node-resolve";

/**
  * Helper to detect developer mode.
  *
  * @param cliArgs the command line arguments.
  * @return {Boolean} whether or not developer mode is enabled.
  */
function isDevMode(cliArgs) {
  return Boolean(cliArgs["config-enable-developer-mode"]);
}

export default (cliArgs) => [
  {
    input: "src/main.js",
    output: {
      file: "dist/background.js",
      sourcemap: isDevMode(cliArgs) ? "inline" : false,
    },
    plugins: [
      replace({
        // In Developer Mode, the study does not submit data and
        // gracefully handles communication errors with the Core
        // Add-on.
        __ENABLE_DEVELOPER_MODE__: isDevMode(cliArgs),
      }),
      resolve({
        browser: true,
        // These are required in order for rollup to pick up
        // the correct dependencies for ping encryption.
        exportConditions: ["browser"],
        preferBuiltins: false,
      }),
      commonjs(),
      copy({
        targets: [{
          src: [
            "node_modules/@mozilla/rally/dist/rally-content.js",
          ],
          dest: "dist/content-scripts/",
        }],
        flatten: true,
      }),
      copy({
        targets: [{
          src: [
            "node_modules/webextension-polyfill/dist/browser-polyfill.js",
          ],
          dest: "dist/",
        }],
        flatten: true,
      }),
    ],
  },
  {
    input: "src/content-scripts/attention-collector.js",
    output: {
      file: "dist/content-scripts/attention-collector.js",
      sourcemap: isDevMode(cliArgs) ? "inline" : false,
    },
    plugins: [
      replace({
        // In Developer Mode, the study does not submit data and
        // gracefully handles communication errors with the Core
        // Add-on.
        __ENABLE_DEVELOPER_MODE__: isDevMode(cliArgs),
      }),
      resolve({
        browser: true,
      }),
      commonjs(),
    ],
  }
  // NOTE: a content script rollup is not needed for this study.
];
