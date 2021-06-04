const MAX_LABEL_LENGTH = 20

const FeatureSelect = {
    name: "feature-select",
    props: {
        name: String,
        items: Array,
        settingsModule: String,
        selectable: Boolean
    },
    components: {
        'v-select': VueSelect.VueSelect
    },
    computed: {
        isAllSelected() {
            return _.isEqual(this.getFiltering, this.items);
        },
        getFiltering() {
            return this.getModuleGetter('settings/getFiltering')[this.name];
        },
        getShortFiltering() {
            return this.getFiltering?.map((v) => this.shortLabel(v)) || [];
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
        selectOrDeselectAll() {
            const newSelectedItems = this.isAllSelected ? [] : _.cloneDeep(this.items);
            this.updateFilters(newSelectedItems);
        },
        shortLabel(label) {
            return label.length >= MAX_LABEL_LENGTH ? `${label.slice(0, 30)}...` : label;
        }
    },
    // language=HTML
    template: `
        <div class="feature-select">
            <div v-if="selectable">
                <v-select class="mb-2"
                    :options="items"
                    placeholder="Select an item..."
                    @input="addFilter($event)">
                    <template slot="open-indicator">
                        <span><i class="icon-search"></i></span>
                    </template>
                    <template slot="selected-option" slot-scope="option">
                        {{ shortLabel(option.label) }}
                    </template>
                </v-select>
                <div class="feature-select-content" ref="featureSelectContent">
                    <div class="feature-select-item">
                        <input type="checkbox" value="select-all"
                        :checked="isAllSelected"
                        id="select-all"
                        @click="selectOrDeselectAll()">
                        <span>All</span>
                    </div>
                    <div class="feature-select-item" v-for="it in items" :key="it">
                        <input type="checkbox"
                        :value="it"
                        :checked="isItemSelected(it)"
                        @change="updateAllFilters()">
                        <span :title="it">{{ shortLabel(it) }}</span>
                    </div>
                </div>
            </div>
            <div v-else>
                <v-select multiple class="filters-multi-list mb-2"
                    placeholder="No filters selected"
                    :value="getShortFiltering"
                    @input="updateFilters($event)"
                    :noDrop="true"
                    :searchable="false">
                </v-select>
            </div>
        </div>`
};

export {FeatureSelect}