import { FilteringSection } from './filtering/filtering-section.js'

const FiltersTab = {
    name: "filters-tab",
    props: {
        settingsModule: String
    },
    components: {
        'filtering-section': FilteringSection,
    },
    data() {
        return {
            activatedTab: 'points_of_sales'
        }
    },
    computed: {
        getAvailableFilteringFeatures() {
            return this.getModuleGetter('settings/getAvailableFilteringFeatures');
        },
        getValidFilters() {
            const a = _.pickBy(this.getModuleGetter('settings/getFiltering'), (f) => !_.isEmpty(f));
            return a
        },
        hasFilters() {
            return !_.isEmpty(this.getValidFilters)
        },
    },
    methods: {
        getModuleGetter(getter) {
            return this.$store.getters.getModuleGetter(this.settingsModule, getter);
        },
        clearFilters() {
            for (const [featureName, featureItems] of Object.entries(this.getAvailableFilteringFeatures)) {
                this.$store.commit(`${this.settingsModule}/settings/setFilteringFeature`, { featureName, filters: [] });
            }
        },
        showFilteringPanel() {
            this.$store.commit('showFilteringPanel', {
                moduleName: this.settingsModule
            });
        },
    },
    template: `
        <div class="filters-tab">
            <div class="empty-filters-placeholder d-flex align-items-center justify-content-center" v-if="!hasFilters">
                <button class="btn btn-primary" v-on:click="showFilteringPanel">
                    <i class="icon-filter mr-1"></i>
                    <span>create filters</span>
                </button>
            </div>
            <div class="filters-section" v-if="hasFilters">
                <div class="filters-actions d-flex align-items-center justify-content-end">
                    <a href="javascript:void(0);" class="filter-action-btn" @click="clearFilters">clear filters</a>
                    <a href="javascript:void(0);" class="filter-action-btn ml-3" @click="showFilteringPanel">add filters</a>
                </div>
                <filtering-section
                    :settingsModule="settingsModule"
                    :selectable="false"
                    :features="Object.keys(this.getValidFilters)"
                    :showNames="true">
                </filtering-section>
            </div>
            
        </div>`,
};

export {FiltersTab}