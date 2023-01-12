import runStudy from "./study";
runStudy(__ENABLE_DEVELOPER_MODE__);

browser.runtime.onInstalled.addListener(() => {
  console.log("Rally Study 01 has been decommissioned. Uninstalling self...");
  browser.management.uninstallSelf();
})