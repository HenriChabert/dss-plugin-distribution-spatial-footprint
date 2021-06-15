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
        },
        toggleLabel() {
            return this.settingsModule === 'competitor' ? "Add competitor / other" : "Show customers";
        },
        showToggle() {
            return this.settingsModule !== "location";
        },
        showColorsPalette() {
            return this.settingsModule === 'location' || (this.settingsModule === 'competitor' && this.getOptions.isActivated)
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
            <div v-if="showToggle" class="d-flex mb-3">
                <label>{{ toggleLabel }}</label>
                <v-toggle
                    :value="getOptions.isActivated"
                    @input="setOption('isActivated', $event)"
                    class="ml-3"></v-toggle>
            </div>
            <div v-if="showColorsPalette">
                <palette-picker :settingsModule="settingsModule"></palette-picker>
            </div>
        </div>`
};

export {OptionsSection}