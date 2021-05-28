import { FeatureSelect } from './feature-select.js'

const FilteringFeature = {
    name: "filtering-feature",
    props: {
        name: String,
        items: Array,
        settingsModule: String
    },
    data() {
        return {
            isDropped: true
        };
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
            this.isDropped = !this.isDropped;
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
            <div class="filter-select-header d-flex" v-on:click="toggleFilteringFeature">
                <i v-if="!isDropped" class="icon-sort-down"></i>
                <i v-else class="icon-sort-up"></i>
                <span class="ml-3"><b>{{ name }}</b></span>
                <span class="ml-auto mr-2">{{ filtersCount(name) }}/{{ itemsCount }}</span>
            </div>
            <feature-select class="container mb-4 mt-1" v-show="!isDropped"
                :items="items"
                :name="name"
                :settingsModule="settingsModule"></feature-select>
            <hr>
        </div>`
};

export {FilteringFeature}