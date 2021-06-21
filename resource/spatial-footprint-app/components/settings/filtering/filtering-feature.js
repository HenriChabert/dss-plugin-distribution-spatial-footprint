import { FeatureSelect } from './feature-select.js'

const FilteringFeature = {
    name: "filtering-feature",
    props: {
        name: String,
        label: {
            type: String,
            default: null
        },
        items: Array,
        settingsModule: String,
        selectable: Boolean,
        isVisible: Boolean,
        showName: Boolean
    },
    computed: {
        filtersCount() {
            return this.getModuleGetter('settings/filtersCount');
        },
        itemsCount() {
            return this.items.length;
        },
    },
    methods: {
        toggleFilteringFeature() {
            this.$emit("update:featureVisibility");
        },
        getModuleGetter(getter) {
            return this.$store.getters.getModuleGetter(this.settingsModule, getter);
        },
    },
    components: {
        'feature-select': FeatureSelect
    },
    template: `
        <div class="filter-select">
            <div class="filter-select-header d-flex" v-on:click="toggleFilteringFeature" v-if="showName">
                <i v-if="isVisible" class="icon-sort-down"></i>
                <i v-else class="icon-sort-up"></i>
                <span class="ms-3"><b>{{ label || name }}</b></span>
                <span class="ms-2 n-items-indicator-text">{{ filtersCount(name) }}/{{ itemsCount }}</span>
            </div>
            <feature-select class="container mb-4 mt-1" v-show="isVisible"
                :items="items"
                :name="name"
                :label="label"
                :settingsModule="settingsModule"
                :selectable="selectable"></feature-select>
            <hr>
        </div>`
};

export {FilteringFeature}