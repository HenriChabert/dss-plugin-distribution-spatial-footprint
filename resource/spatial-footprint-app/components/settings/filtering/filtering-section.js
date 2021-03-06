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
            visibleFeatures: this.features.length === 1 ? [this.features[0]] : []
        }
    },
    components: {
        'filtering-feature': FilteringFeature
    },
    computed: {
        hasFeatures() {
            return !_.isEmpty(this.features);
        },
        featuresAndItems() {
            const featuresAndItems = {};
            this.features.forEach((f) => {
                featuresAndItems[f] = this.featureAvailableItems(f);
            })
            return featuresAndItems
        },
        isFullHeight() {
            return this.features.length === 1;
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
        isFeatureVisible(featureName) {
            return this.visibleFeatures.includes(featureName);
        },
        toggleFeatureVisibility(featureName) {
            if (this.isFeatureVisible(featureName)) {
                this.visibleFeatures = this.visibleFeatures.filter(el => el !== featureName);
            } else {
                this.visibleFeatures.push(featureName);
            }
        },
        isLastItem(item) {
            return item === Object.keys(this.featuresAndItems).slice(-1)[0]
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
                    :isLastItem="isLastItem(featureName)"
                    :fullHeight="isFullHeight"
                    v-on:update:featureVisibility="toggleFeatureVisibility(featureName)"
                    ></filtering-feature>
            </div>
        </div>`
};

export {FilteringSection}