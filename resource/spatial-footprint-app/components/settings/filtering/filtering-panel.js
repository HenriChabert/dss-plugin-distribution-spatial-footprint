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
        ...Vuex.mapGetters([
            'getFilteringPanelFocus',
        ])
    },
    template: `
        <filtering-section
            :settingsModule="settingsModule"
            :selectable="true"
            :focusOn="getFilteringPanelFocus">
        </filtering-section>`
};

export {FilteringPanel}