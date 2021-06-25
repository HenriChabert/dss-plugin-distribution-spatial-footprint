const MAX_LABEL_LENGTH = 20

const FeatureSelect = {
    name: "feature-select",
    props: {
        name: String,
        label: String,
        items: Array,
        settingsModule: String,
        selectable: Boolean,
        fullHeight: Boolean
    },
    data() {
        return {
            searchString: ""
        }
    },
    computed: {
        sortedItems() {
            return [...this.items].sort();
        },
        isAllSelected() {
            return _.isEqual(this.filterWithSearchString(this.getFiltering || []), this.filterWithSearchString(this.items));
        },
        getFiltering() {
            return this.getModuleGetter('settings/getFiltering')[this.name];
        },
        getShortFiltering() {
            return this.getFiltering?.map((v) => {
                return {
                    label: this.shortLabel(v),
                    value: v
                }
            }) || [];
        }
    },
    methods: {
        getModuleGetter(getter) {
            return this.$store.getters.getModuleGetter(this.settingsModule, getter);
        },
        isItemSelected(item) {
            return this.getModuleGetter('settings/isItemSelected')(this.name, item);
        },
        updateFilters(newFilters) {
            this.$store.commit(
                `${this.settingsModule}/settings/setFilteringFeature`, {
                    featureName: this.name,
                    filters: newFilters
                }
            );
        },
        getAllSelectedFilters() {
            const selectedFilters = [];
            const checkboxes = this.$refs.featureSelectContent.getElementsByTagName("input");
            for (let checkbox of checkboxes) {
                if (checkbox.checked && checkbox.value !== "select-all") {
                    selectedFilters.push(checkbox.value);
                }
            }
            return selectedFilters
        },
        updateAllFilters() {
            this.updateFilters(this.getAllSelectedFilters());
        },
        addFilter(newFilter) {
            const selectedFilters = this.getAllSelectedFilters();
            if (!selectedFilters.includes(newFilter)) {
                selectedFilters.push(newFilter);
            }
            this.updateFilters(selectedFilters);
        },
        clearFilter() {
            this.updateFilters([]);
        },
        selectOrDeselectAll() {
            let newSelectedItems;
            if (this.isAllSelected) {
                newSelectedItems = this.getAllSelectedFilters().filter((f) => !this.isItemValid(f));
            } else {
                newSelectedItems = _.union(this.getAllSelectedFilters(), this.filterWithSearchString(this.items));
            }
            this.updateFilters(newSelectedItems);
        },
        shortLabel(label) {
            return label.length >= MAX_LABEL_LENGTH ? `${label.slice(0, 30)}...` : label;
        },
        showFilteringPanelAndFocus(e) {
            this.$store.commit('showFilteringPanelAndFocus', {
                moduleName: this.settingsModule,
                focusFeatureName: this.name,
                focusFeatureLabel: this.label
            });
        },
        isItemValid(item) {
            return item.match(new RegExp(`(.*)${this.searchString}(.*)`, "i"))
        },
        filterWithSearchString(items) {
            return items.filter((it) => this.isItemValid(it));
        }
    },
    // language=HTML
    template: `
        <div class="feature-select">
            <div v-if="selectable">
                <v-select class="mb-2"
                    :options="items"
                    placeholder="Select an item..."
                    :noDrop="true"
                    :clearSearchOnBlur="() => false"
                    @input="addFilter($event)"
                    v-on:search="searchString = $event">
                    <template slot="open-indicator">
                        <span><i class="icon-search"></i></span>
                    </template>
                    <template slot="selected-option" slot-scope="option">
                        {{ shortLabel(option.label) }}
                    </template>
                </v-select>
                <div :class="['feature-select-content', fullHeight ? 'full-height' : '']" ref="featureSelectContent">
                    <div class="feature-select-item">
                        <input type="checkbox" value="select-all"
                        :checked="isAllSelected"
                        id="select-all"
                        @click="selectOrDeselectAll()">
                        <span>All</span>
                    </div>
                    <div class="feature-select-item" v-for="it in sortedItems" v-if="isItemValid(it)" :key="it">
                        <input type="checkbox"
                        :value="it"
                        :checked="isItemSelected(it)"
                        @change="updateAllFilters()">
                        <span :title="it">{{ shortLabel(it) }}</span>
                    </div>
                </div>
            </div>
            <div class="d-flex align-items-center" v-else>
                <v-select multiple class="filters-multi-list mb-2 flex-grow-1"
                    placeholder="No filters selected"
                    :value="getShortFiltering"
                    @input="updateFilters($event.map(f => f.value))"
                    v-on:search:focus="showFilteringPanelAndFocus($event)"
                    :noDrop="true"
                    :searchable="false">
                    
                    <template slot="open-indicator">
                        <span><i class="plus-sign"></i></span>
                    </template>
                </v-select>
                <a href="javascript:void(0);" class="ms-2" v-on:click="clearFilter">
                    <i class="icon-trash"></i>
                </a>
            </div>
        </div>`
};

export {FeatureSelect}