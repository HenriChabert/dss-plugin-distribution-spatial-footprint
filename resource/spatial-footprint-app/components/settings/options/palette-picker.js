import {DKUApi} from '../../../dku-api.js'

const BUILT_IN_PALETTES = {
    location: [
        {
            value: "grey_to_brown",
            label: "Grey to brown",
            colors: ["#E0D5D5", "#E0D5D5", "#8C807F", "#6E6867", "#67544D", "#43211E"]
        },
        {
            value: "grey_to_green",
            label: "Grey to green",
            colors: ["#F2EFEB", "#C9BCB2", "#A66E5C", "#90A68B", "#90A68B", "#424840"]
        }
    ],
    competitor: [
        {
            value: "blue_to_violet",
            label: "Blue to violet",
            colors: ["#FFFFFF", "#9DA4B2", "#18274C", "#18274C", "#4C0F3D", "#403D65"]
        },
        {
            value: "shades_of_blue",
            label: "Shades of blue",
            colors: ["#96B1BF", "#597EAD", "#3E556F", "#3A4D57", "#0E2344", "#101521"]
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
            this.$store.commit(`${this.settingsModule}/setOption`, {
                optionName: 'colorsPalette',
                optionValue: newPalette
            });
        }
    },
    computed: {
        getColorsPalette() {
            return this.$store.getters[`${this.settingsModule}/getOptions`].colorsPalette;
        }
    },
    mounted() {
        this.updateColorsPalette(this.options[0]);
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