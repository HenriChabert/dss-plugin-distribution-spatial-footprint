import { DKUApi } from '../../../dku-api.js'
import { PalettePicker } from "./palette-picker.js";
import { VToggle } from "../../form/v-toggle.js";

const OptionsSection = {
    name: "options-section",
    props: {
        settingsModule: String
    },
    computed: {
        getOptions() {
            return this.getModuleGetter('getOptions');
        }
    },
    components: {
        'palette-picker': PalettePicker,
        'v-toggle': VToggle
    },
    methods: {
        setOption (optionName, e) {
            this.$store.commit(`${this.settingsModule}/setOption`, {optionName, optionValue: e});
        },
        getModuleGetter(getter) {
            return this.$store.getters.getModuleGetter(this.settingsModule, getter);
        },
    },
    template: `
        <div id="options-section">
            <div v-if="settingsModule === 'customer'" class="d-flex mb-3">
                <label for="showCustomerCheckbox">Show customers</label>
                <v-toggle
                    id="addCompetitorToggle"
                    :value="getOptions.isActivated"
                    @input="setOption('isActivated', $event)"
                    class="ml-3"></v-toggle>
            </div>
            
            <div v-if="settingsModule === 'competitor'" class="d-flex mb-3">
                <label for="addCompetitorToggle">Add competitor</label>
                <v-toggle
                    id="addCompetitorToggle"
                    :value="getOptions.isActivated"
                    @input="setOption('isActivated', $event)"
                    class="ml-3"></v-toggle>
            </div>
            <div v-if="settingsModule === 'location' || (settingsModule === 'competitor' && getOptions.isActivated)">
                <palette-picker :settingsModule="settingsModule"></palette-picker>
            </div>
        </div>`
};

export {OptionsSection}