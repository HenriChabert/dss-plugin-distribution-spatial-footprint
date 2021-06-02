import { FilteringFeature } from './filtering-feature.js'
import { LOCATION_UNIQUE_KEY } from "../../../dku-api.js";



const FilteringSection = {
    name: "filtering-section",
    props: {
        settingsModule: String
    },
    components: {
        'filtering-feature': FilteringFeature
    },
    computed: {
        getAvailableFilteringFeatures() {
            const { location_identifier, ...filters } = this.getModuleGetter('settings/getAvailableFilteringFeatures');
            if (location_identifier) {
                return { location_identifier, ...filters }
            } else {
                return filters
            }

        }
    },
    methods: {
        initFilteringOptions() {
            for (const [featureName, featureItems] of Object.entries(this.getAvailableFilteringFeatures)) {
                const filters = (featureName === LOCATION_UNIQUE_KEY && this.settingsModule === 'location') ? [featureItems[0]] : [];
                this.$store.commit(`${this.settingsModule}/settings/setFilteringFeature`, { featureName, filters });
            }
        },
        getModuleGetter(getter) {
            return this.$store.getters.getModuleGetter(this.settingsModule, getter);
        },
    },
    mounted() {
        this.initFilteringOptions();
    },
    template: `
        <div id="filtering-section">
            <h5>Filtering</h5>
            <div class="filtering-features">
                <filtering-feature v-for="(featureItems, featureName) in getAvailableFilteringFeatures" :key="featureName"
                    :name="featureName"
                    :items="featureItems"
                    :settingsModule="settingsModule"
                    ></filtering-feature>
            </div>
            
        </div>`
};

export {FilteringSection}