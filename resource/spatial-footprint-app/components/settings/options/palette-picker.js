import BUILT_IN_PALETTES from '../../../assets/colors-palettes'

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

export { PalettePicker }