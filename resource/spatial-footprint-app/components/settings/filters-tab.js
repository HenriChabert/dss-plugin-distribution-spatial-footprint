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
            activatedTab: 'individuals'
        }
    },
    computed: {
        getAvailableFilteringFeatures() {
            return this.getModuleGetter('settings/getAvailableFilteringFeatures');
        },
        getValidFilters() {
            const a = _.pickBy(this.getModuleGetter('settings/getFiltering'), (f, fk) => !_.isEmpty(f) && fk !== "id");
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
            this.$store.commit(`${this.settingsModule}/settings/setFilteringFilters`, { newFilters: {} });
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
                    <i class="icon-filter me-1"></i>
                    <span>create filters</span>
                </button>
            </div>
            <div class="filters-section" v-if="hasFilters">
                <filtering-section
                    :settingsModule="settingsModule"
                    :selectable="false"
                    :features="Object.keys(this.getValidFilters)"
                    :showNames="true">
                </filtering-section>
                <div class="filters-actions d-flex align-items-center justify-content-around mt-3">
                    <a href="javascript:void(0);" class="filter-action-btn ms-3" @click="showFilteringPanel"><i class="icon-plus-sign"></i> add filters</a>
                    <a href="javascript:void(0);" class="filter-action-btn" @click="clearFilters">clear filters</a>
                </div>
            </div>
            
        </div>`,
};

export {FiltersTab}