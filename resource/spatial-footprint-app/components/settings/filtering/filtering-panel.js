import {FilteringSection} from "./filtering-section.js";


const FilteringPanel = {
    name: "filtering-panel",
    props: {
        settingsModule: String
    },
    components: {
        'filtering-section': FilteringSection
    },
    computed: {
        getAvailableFilteringFeatures() {
            const { location_identifier, ...otherFilteringFeatures } = this.getModuleGetter('settings/getAvailableFilteringFeatures');
            return location_identifier ? { location_identifier, ...otherFilteringFeatures } : otherFilteringFeatures;
        },

    },
    methods: {
        getModuleGetter(getter) {
            return this.$store.getters.getModuleGetter(this.settingsModule, getter);
        },
    },
    template: `
        <filtering-section
            :settingsModule="settingsModule"
            :selectable="true">
        </filtering-section>`
};

export {FilteringPanel}