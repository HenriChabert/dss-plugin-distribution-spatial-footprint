import { FilteringSection } from './filtering/filtering-section.js'
import { TabsHeader } from './tabs-header.js'
import {SamplingSection} from "./sampling/sampling-section.js";
import {PalettePicker} from "./options/palette-picker.js";
import {VToggle} from "../form/v-toggle.js";
import {PointsOfSalesTab} from "./points-of-sales-tab.js";

const FiltersTab = {
    name: "filters-tab",
    props: {
        moduleName: String,
        settingsModule: String,
        isVisible: Boolean
    },
    data() {
        return {
            activatedTab: 'points_of_sales'
        }
    },
    computed: {
        getOptions() {
            return this.getModuleGetter('getOptions');
        },
        activationToggleLabel() {
            return this.settingsModule === 'competitor' ? "Add competitor / other" : "Show customers";
        },
        showActivationToggle() {
            return this.settingsModule !== "basic";
        },
        showColorsPalette() {
            return this.settingsModule !== "customer";
        },
        identifierLabel() {
            return this.settingsModule === "basic" ? "Point of sales" : "Customer ID";
        }
    },
    methods: {
        getModuleGetter(getter) {
            return this.$store.getters.getModuleGetter(this.settingsModule, getter);
        },
        toggleSettingsForm() {
            this.$emit("update:moduleVisibility");
        },
        setOption (optionName, e) {
            this.$store.commit(`${this.settingsModule}/setOption`, {optionName, optionValue: e});
        },
    },
    components: {
        'filtering-section': FilteringSection,
        'sampling-section': SamplingSection,
        'palette-picker': PalettePicker,
        'v-toggle': VToggle,
        'tabs-header': TabsHeader,
        'points-of-sales-tab': PointsOfSalesTab
    },
    created () {
        this.$store.dispatch(`${this.settingsModule}/settings/fetchAvailableIdentifiers`, this.settingsModule);
        this.$store.dispatch(`${this.settingsModule}/settings/fetchAvailableFilteringFeatures`, this.settingsModule);
    },
    template: `
        <div id="settings-form">
            <div class="settings-form-header mb-3" v-on:click="toggleSettingsForm">
                <h4 class="d-flex align-items-center">
                    <div class="mr-2">
                        <i v-if="isVisible" class="icon-sort-down"></i>
                        <i v-else class="icon-sort-up"></i>
                    </div>
                    {{ moduleName }}
                </h4>
            </div>
            <div class="settings-form-body container" v-show="isVisible">
                <div v-if="showActivationToggle" class="d-flex mb-3">
                    <label>{{ activationToggleLabel }}</label>
                    <v-toggle
                        :value="getOptions.isActivated"
                        @input="setOption('isActivated', $event)"
                        class="ml-3"></v-toggle>
                </div>
                <div v-show="getOptions.isActivated">
                    <tabs-header :activatedTab.sync="activatedTab"></tabs-header>
                    <points-of-sales-tab v-show="activatedTab === 'points_of_sales'"
                        :settingsModule="settingsModule"></points-of-sales-tab>
                    <filtering-section
                        :settingsModule="settingsModule"
                        class="mb-3">
                    </filtering-section>
                    <sampling-section
                        :settingsModule="settingsModule"
                        class="mb-3">
                    </sampling-section>
                    <div v-if="showColorsPalette">
                        <palette-picker :settingsModule="settingsModule"></palette-picker>
                    </div>
                </div>
                
            </div>
        </div>`,
};

export {FiltersTab}