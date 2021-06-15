import { FilteringSection } from './filtering/filtering-section.js'
import {SamplingSection} from "./sampling/sampling-section.js";
import {PalettePicker} from "./options/palette-picker.js";
import {VToggle} from "../form/v-toggle.js";

const SettingsForm = {
    name: "settings-form",
    props: {
        moduleName: String,
        settingsModule: String,
        isVisible: Boolean
    },
    computed: {
        getOptions() {
            return this.getModuleGetter('getOptions');
        },
        activationToggleLabel() {
            return this.settingsModule === 'competitor' ? "Add competitor / other" : "Show customers";
        },
        showActivationToggle() {
            return this.settingsModule !== "location";
        },
        showColorsPalette() {
            return this.settingsModule !== "customer";
        },
        identifierLabel() {
            return this.settingsModule === 'location' ? "Point of sales" : "Customer ID";
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
        'v-toggle': VToggle
    },
    created () {
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
                    <filtering-feature
                        name="location_identifier"
                        :items
                        :settingsModule="settingsModule"
                        :selectable="false"
                        :isVisible="true">
                    
                    </filtering-feature>
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

export {SettingsForm}