export default class TabManager {
    constructor(tabs, defaultTab = 0) {
        this._defaultTab = defaultTab;
        this._originalTabs = [...tabs.map(t=> ({...t}))];
        this.tabs = tabs;
        this.activeTab = this.tabs[this._defaultTab];
    }

    reset() {
        this.tabs = [...this._originalTabs.map(t=> ({...t}))];
        this.activeTab = this.tabs[this._defaultTab];
    }

    getTab(id) {
        return this.tabs.find(t=>t.id===id);
    }

    async setActiveTab(tabID) {
        const nextTab = this.tabs.find(t=> t.id === tabID);
        this.activeTab = nextTab;
        return this;
    }

    async closeTab(tabID) {
        if (this.activeTab.id === tabID) {
            const ind = this.tabs.findIndex(t=> t.id === tabID);
            let nextIndex;
            if (ind === this.tabs.length - 1) {
                nextIndex = this.tabs.length - 2;
            } else if (ind === 0) {
                nextIndex = 1;
            } else {
                nextIndex = ind - 1;
            }
            const nextTab = this.tabs[nextIndex];
            await this.setActiveTab(nextTab.id);
        }
        this.tabs = this.tabs.filter(t => t.id !== tabID).map(t => ({...t}));

    }
}