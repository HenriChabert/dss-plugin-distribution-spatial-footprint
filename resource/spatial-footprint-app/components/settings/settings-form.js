import { FilteringSection } from './filtering/filtering-section.js'
import { TabsHeader } from './tabs-header.js'
import {SamplingSection} from "./sampling/sampling-section.js";
import {PalettePicker} from "./options/palette-picker.js";
import {VToggle} from "../form/v-toggle.js";
import {PointsOfSalesTab} from "./points-of-sales-tab.js";
import {FiltersTab} from "./filters-tab.js";

const SettingsForm = {
    name: "settings-form",
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
        ...Vuex.mapGetters([
            'getLocations',
            'getCustomers'
        ]),
        getOptions() {
            return this.getModuleGetter('getOptions');
        },
        isCustomerModule() {
            return this.settingsModule === "customer";
        },
        activationToggleLabel() {
            return this.settingsModule === 'competitor' ? "Add competitor / other" : "Show customers";
        },
        showActivationToggle() {
            return this.settingsModule !== "basic";
        },
        showColorsPalette() {
            return !this.isCustomerModule;
        },
        identifierLabel() {
            return this.isCustomerModule ? "Customers" : "Point of sales";
        },
        getNumberItemsShowed() {
            return (this.isCustomerModule ? this.getCustomers : this.getLocations(this.settingsModule)).length;
        },
        getNumberItemsTotal() {
            return this.getModuleGetter("settings/getAvailableIdentifiers").length;
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
        'points-of-sales-tab': PointsOfSalesTab,
        'filters-tab': FiltersTab
    },
    created () {
        this.$store.dispatch(`${this.settingsModule}/settings/fetchAvailableFilteringFeatures`, this.settingsModule);
        this.$store.dispatch(`${this.settingsModule}/settings/fetchAvailableIdentifiers`, this.settingsModule);
    },
    template: `
        <div id="settings-form">
            <div class="settings-form-header d-flex justify-content-between" v-on:click="toggleSettingsForm">
                <h4 class="d-flex align-items-center">
                    <div class="me-2">
                        <i v-if="isVisible" class="icon-sort-down"></i>
                        <i v-else class="icon-sort-up"></i>
                    </div>
                    {{ moduleName }}
                </h4>
                <span class="n-items-indicator-text" v-if="getOptions.isActivated">
                    {{ getNumberItemsShowed }}/{{ getNumberItemsTotal }} {{ identifierLabel }}
                </span>
            </div>
            <div class="settings-form-body container" v-show="isVisible">
                <div v-if="showActivationToggle" class="d-flex mb-3">
                    <label>{{ activationToggleLabel }}</label>
                    <v-toggle
                        :value="getOptions.isActivated"
                        @input="setOption('isActivated', $event)"
                        class="ms-3"></v-toggle>
                </div>
                <div v-show="getOptions.isActivated">
                    <div v-if="showColorsPalette" class="mb-3">
                        <palette-picker :settingsModule="settingsModule"></palette-picker>
                    </div>
                    <tabs-header :activatedTab.sync="activatedTab" class="mb-3"></tabs-header>
                    <points-of-sales-tab v-show="activatedTab === 'points_of_sales'"
                        :settingsModule="settingsModule"></points-of-sales-tab>
                    <filters-tab v-show="activatedTab === 'filters'"
                        :settingsModule="settingsModule"></filters-tab>
                    <sampling-section
                        :settingsModule="settingsModule"
                        class="mb-3">
                    </sampling-section>
                </div>
                
            </div>
        </div>`,
};

export {SettingsForm}