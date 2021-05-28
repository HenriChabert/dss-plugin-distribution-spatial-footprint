const MAX_LABEL_LENGTH = 20

const FeatureSelect = {
    name: "feature-select",
    props: {
        name: String,
        items: Array,
        settingsModule: String
    },
    components: {
        'v-select': VueSelect.VueSelect
    },
    computed: {
        isAllSelected() {
            return _.isEqual(this.getFiltering[this.name], this.items);
        },
        getFiltering() {
            return this.getModuleGetter('settings/getFiltering');
        }

    },
    methods: {
        isItemSelected(item) {
            return this.getModuleGetter('settings/isItemSelected')(this.name, item);
        },
        getModuleGetter(getter) {
            return this.$store.getters.getModuleGetter(this.settingsModule, getter);
        },
        updateFilters(newFilters) {
            this.$store.commit(
                `${this.settingsModule}/settings/setFilteringFeature`, {
                    featureName: this.name,
                    filters: newFilters
                }
            );
        },
        updateAllFilters() {
            const newFilters = [];
            const checkboxes = this.$refs.featureSelectContent.getElementsByTagName("input");
            for (let checkbox of checkboxes) {
                if (checkbox.checked && checkbox.value !== "select-all") {
                    newFilters.push(checkbox.value);
                }
            }
            this.updateFilters(newFilters);
        },
        selectOrDeselectAll() {
            const newSelectedItems = this.isAllSelected ? [] : _.cloneDeep(this.items);
            this.updateFilters(newSelectedItems);
        },
        shortLabel(label) {
            return label.length >= MAX_LABEL_LENGTH ? `${label.slice(0, 20)}...` : label;
        }
    },
    template: `
        <div class="feature-select">
            <v-select class="mb-2"
                :options="items"
                placeholder="Select an item..."
                @input="updateSelectedItems($event)">
                <template slot="open-indicator">
                    <span><i class="fas fa-search"></i></span>
                </template></v-select>
            <div class="feature-select-content" ref="featureSelectContent">
                <div class="feature-select-item">
                    <input type="checkbox" value="select-all"
                    :checked="isAllSelected"
                    id="select-all"
                    @click="selectOrDeselectAll()">
                    <label for="select-all">All</label>
                </div>
                <div class="feature-select-item" v-for="it in items" :key="it">
                    <input type="checkbox"
                    :value="it"
                    :checked="isItemSelected(it)"
                    @change="updateAllFilters()">
                    <label for="select-all"><span :title="it">{{ shortLabel(it) }}</span></label>
                </div>
            </div>
        </div>`
};

export {FeatureSelect}