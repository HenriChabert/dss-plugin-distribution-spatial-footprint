import { FilteringFeature } from './filtering-feature.js'

const FilteringSection = {
    name: "filtering-section",
    props: {
        settingsModule: String,
        selectable: Boolean,
        focusOn: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            visibleFeatures: []
        }
    },
    components: {
        'filtering-feature': FilteringFeature,
        'v-select': VueSelect.VueSelect
    },
    computed: {
        getAvailableFilteringFeatures() {
            const availableFilteringFeatures = this.getModuleGetter('settings/getAvailableFilteringFeatures');
            if (this.focusOn !== null && availableFilteringFeatures[this.focusOn]) {
                const result = {};
                result[this.focusOn] = availableFilteringFeatures[this.focusOn];
                return result;
            }
            const { location_identifier, ...otherFilteringFeatures } = availableFilteringFeatures
            return location_identifier ? { location_identifier, ...otherFilteringFeatures } : otherFilteringFeatures;
        },
        hasFilters() {
            return !_.isEmpty(this.getModuleGetter('settings/getFiltering'));
        },
        hasAvailableFilters() {
            return !_.isEmpty(this.getModuleGetter('settings/getAvailableFilteringFeatures'));
        }
    },
    methods: {
        initFilteringOptions() {
            for (const [featureName, featureItems] of Object.entries(this.getAvailableFilteringFeatures)) {
                this.$store.commit(`${this.settingsModule}/settings/setFilteringFeature`, { featureName, filters: [] });
            }
        },
        getModuleGetter(getter) {
            return this.$store.getters.getModuleGetter(this.settingsModule, getter);
        },
        showFilteringPanel() {
            this.$store.commit('showFilteringPanel', { moduleName: this.settingsModule });
        },
        isFeatureVisible(featureName) {
            return this.visibleFeatures.includes(featureName);
        },
        focusOnFeature(featureName) {
            if (!this.isFeatureVisible(featureName)) {
                this.visibleFeatures = [featureName];
            }
        },
        toggleFeatureVisibility(featureName) {
            if (this.isFeatureVisible(featureName)) {
                this.visibleFeatures = this.visibleFeatures.filter(el => el !== featureName);
            } else {
                this.visibleFeatures.push(featureName);
            }
        }
    },
    mounted() {
        if (this.focusOn !== null) {
            this.focusOnFeature(this.focusOn);
        }
    },
    template: `
        <div id="filtering-section">
            <div class="d-flex align-items-center" v-if="!selectable">
                <h5 class="mr-auto">Filtering</h5>
                <a href="javascript:void(0);" class="filter-action-btn" @click="initFilteringOptions" v-if="hasFilters">CLEAR FILTERS</a>
                <a href="javascript:void(0);" class="filter-action-btn ml-3" @click="showFilteringPanel">EDIT FILTERS</a>
            </div>
            
            <div class="mb-2" v-if="selectable">
                <v-select
                    :options="Object.keys(getAvailableFilteringFeatures)"
                    @input="focusOnFeature($event)"
                    placeholder="Enter a filter name..."
                    >
                    <template slot="open-indicator">
                        <span><i class="icon-search"></i></span>
                    </template>
                </v-select>
                <hr>
            </div>
            
            <div class="filtering-features" v-if="hasAvailableFilters">
                <filtering-feature v-for="(featureItems, featureName) in getAvailableFilteringFeatures" :key="featureName"
                    :name="featureName"
                    :items="featureItems"
                    :settingsModule="settingsModule"
                    :selectable="selectable"
                    :isVisible="isFeatureVisible(featureName)"
                    v-on:update:featureVisibility="toggleFeatureVisibility(featureName)"
                    ></filtering-feature>
            </div>
        </div>`
};

export {FilteringSection}