import { DKUApi } from '../../../dku-api.js'

const BUILT_IN_PALETTES = {
    location: [
        {
            value: "dku_dss_next",
            label: "DSS Next",
            colors: ["#00AEDB", "#8CC63F", "#FFC425", "#F37735", "#D11141", "#91268F", "#194BA3", "#00B159"]
        },
        {
            value: 'dku_pastel1',
            label: "Pastel",
            colors: ["#EC6547", "#FDC665", "#95C37B", "#75C2CC", "#694A82", "#538BC8", "#65B890", "#A874A0"]
        },
        {
            value: 'dku_corpo1',
            label: "Corporate",
            colors: ["#0075B2", "#818991", "#EA9423", "#A4C2DB", "#EF3C39", "#009D4B", "#CFD6D3", "#231F20"]
        },
        {
            value: 'dku_pastel2',
            label: 'Pastel 2',
            colors: ["#f06548", "#fdc766", "#7bc9a6", "#4ec5da", "#548ecb", "#97668f", "#5e2974"]
        }
    ],
    competitor: [
        {
            value: 'dku_deuteranopia1',
            label: "Deuterano",
            colors: ["#193C81", "#7EA0F9", "#211924", "#757A8D", "#D6C222", "#776A37", "#AE963A", "#655E5D"]
        },
        {
            value: 'dku_tritanopia1',
            label: "Tritanopia",
            colors: ["#CA0849", "#0B4D61", "#E4B2BF", "#3F6279", "#F24576", "#7D8E98", "#9C4259", "#2B2A2E"]
        }
    ]
}

const PalettePicker = {
    name: "palette-picker",
    data() {
        return {
            options: BUILT_IN_PALETTES[this.settingsModule],
        }
    },
    props: {
        settingsModule: String
    },
    components: {
        'v-select': VueSelect.VueSelect
    },
    methods: {
        getFirstColors(colors) {
            return colors.slice(0, 6);
        },
        updateColorsPalette(newPalette) {
            this.$store.commit(`${this.settingsModule}/setOption`, {optionName: 'colorsPalette', optionValue: newPalette});
        }
    },
    computed: {
        getColorsPalette() {
            return this.$store.getters[`${this.settingsModule}/getOptions`].colorsPalette;
        }
    },
    mounted() {
        this.updateColorsPalette(this.options[this.settingsModule === 'location' ? 0 : 1]);
    },
    template: `
        <div id="palette-picker" class="d-flex align-items-center">
            <span class="mr-2">Color palette</span>
            <v-select
            :options="options"
            @input="updateColorsPalette($event)"
            :searchable="false"
            :clearable="false"
            placeholder="Select a palette..."
            :value="getColorsPalette">
                <template slot="option" slot-scope="option">
                    {{ option.label }}
                    <ul class="palette-picker-sample">
                        <li v-for="color in getFirstColors(option.colors)" :key="color" :style="{backgroundColor: color}"></li>
                    </ul>
                </template>
                <template slot="open-indicator">
                    <span><i class="icon-search"></i></span>
                </template>
            </v-select>
        </div>`
};

export {PalettePicker}