import { FilteringFeature } from './filtering-feature.js'

const FilteringSection = {
    name: "filtering-section",
    props: {
        settingsModule: String,
        selectable: Boolean,
        features: Array,
        showNames: Boolean
    },
    data() {
        return {
            visibleFeatures: this.features.slice(0, 1)
        }
    },
    components: {
        'filtering-feature': FilteringFeature,
        'v-select': VueSelect.VueSelect
    },
    computed: {
        // hasFilters() {
        //     return !_.isEmpty(this.getModuleGetter('settings/getFiltering'));
        // },
        hasFeatures() {
            return !_.isEmpty(this.features);
        },
        featuresAndItems() {
            const featuresAndItems = {};
            this.features.forEach((f) => {
                featuresAndItems[f] = this.featureAvailableItems(f);
            })
            return featuresAndItems
        }
    },
    methods: {
        featureAvailableItems(featureName) {
            let availableItems;
            if (featureName === "id") {
                availableItems = this.getModuleGetter("settings/getAvailableIdentifiers");
            } else {
                availableItems = this.getModuleGetter("settings/getAvailableFilteringFeatures")[featureName];
            }
            return availableItems || [];
        },
        getModuleGetter(getter) {
            return this.$store.getters.getModuleGetter(this.settingsModule, getter)
        },
        // showFilteringPanel() {
        //     this.$store.commit('showFilteringPanel', { moduleName: this.settingsModule });
        // },
        isFeatureVisible(featureName) {
            return this.visibleFeatures.includes(featureName);
        },
        toggleFeatureVisibility(featureName) {
            if (this.isFeatureVisible(featureName)) {
                this.visibleFeatures = this.visibleFeatures.filter(el => el !== featureName);
            } else {
                this.visibleFeatures.push(featureName);
            }
        }
    },
    template: `
        <div id="filtering-section">
            <div class="filtering-features" v-if="hasFeatures">
                <filtering-feature v-for="(featureItems, featureName) in featuresAndItems" :key="featureName"
                    :name="featureName"
                    :items="featureItems"
                    :settingsModule="settingsModule"
                    :selectable="selectable"
                    :isVisible="isFeatureVisible(featureName)"
                    :showName="showNames"
                    v-on:update:featureVisibility="toggleFeatureVisibility(featureName)"
                    ></filtering-feature>
                <hr>
            </div>
        </div>`
};

export {FilteringSection}