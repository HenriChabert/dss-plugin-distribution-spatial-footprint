import { DkuCheckbox } from './dku-checkbox.js'
import { DkuColorPicker } from './dku-color-picker.js'
import { DkuRadio } from './dku-radio.js'
import { DkuSelect } from './dku-select.js'
import { DkuSwitch } from './dku-switch.js'
import { IsochronePicker } from "./custom/isochrone-picker.js";

const DkuParameter = {
    props: {
        type: String,
        name: String,
        label: String,
        value: null,
        placeholder: String,
        choices: Array,
        inlineChoices: Boolean,
        componentName: String
    },
    data() {
        return {
            localValue: this.value || null
        }
    },
    components: {
        checkbox: DkuCheckbox,
        'color-picker': DkuColorPicker,
        radio: DkuRadio,
        'dku-select': DkuSelect,
        'dku-switch': DkuSwitch,
        'isochrone-picker': IsochronePicker
    },
    methods: {
        emitLocalValue() {
            this.$emit('update:value', this.localValue);
        }
    },
    template: `
        <div class="dku-parameter row">
            <checkbox v-if="type === 'checkbox'"
                :name="name"
                :label="label"
                :choices="choices"
                :inlineChoices="inlineChoices"
                :value.sync="localValue"></checkbox>
            <color-picker v-else-if="type === 'color-picker'"
                :name="name"
                :label="label"
                :value.sync="localValue"></color-picker>
            <radio v-else-if="type === 'radio'"
                :name="name"
                :label="label"
                :choices="choices"
                :inlineChoices="inlineChoices"
                :value.sync="localValue"></radio>
            <dku-select v-else-if="type === 'select'"
                :name="name"
                :label="label"
                :choices="choices"
                :placeholder="placeholder"
                :value.sync="localValue"></dku-select>
            <dku-switch v-else-if="type === 'switch'"
                :name="name"
                :label="label"
                :value.sync="localValue"></dku-switch>
            <component v-else-if="type === 'custom'"
                :is="componentName"
                :name="name"
                :label="label"
                :choices="choices"
                :value.sync="localValue"></component>
        </div>
    `,
    watch: {
        localValue: function () {
            this.emitLocalValue()
        }
    }
}

export { DkuParameter }