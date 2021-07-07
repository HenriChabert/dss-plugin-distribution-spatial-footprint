import {FilteringSection} from "./filtering-section.js";


const FilteringPanel = {
    name: "filtering-panel",
    props: {
        settingsModule: String,
    },
    components: {
        'filtering-section': FilteringSection
    },
    computed: {
        ...Vuex.mapGetters([
            'getFilteringPanelFocus',
        ]),
        getFeaturesToShow() {
            if (this.getFilteringPanelFocus) {
                return [this.getFilteringPanelFocus];
            } else {
                return Object.keys(this.getModuleGetter("settings/getAvailableFilteringFeatures"));
            }
        }
    },
    methods: {
        getModuleGetter(getter) {
            return this.$store.getters.getModuleGetter(this.settingsModule, getter)
        },
    },
    template: `
        <filtering-section
            :settingsModule="settingsModule"
            :selectable="true"
            :features="getFeaturesToShow"
            :showNames="true">
        </filtering-section>`
};

export {FilteringPanel}