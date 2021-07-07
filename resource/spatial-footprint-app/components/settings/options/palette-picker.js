import BUILT_IN_PALETTES from '../../../assets/colors-palettes.js'

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
        },
        getSelectableColorPalettes() {
            const colorPalettes = BUILT_IN_PALETTES[this.settingsModule];
            return colorPalettes.filter((cp) => cp.value !== this.getColorsPalette.value)
        }
    },
    mounted() {
        this.updateColorsPalette(this.options[0]);
    },
    template: `
        <div id="palette-picker" class="d-flex align-items-center">
            <span class="me-2">Color </span>
            <v-select
            :options="getSelectableColorPalettes"
            @input="updateColorsPalette($event)"
            :searchable="false"
            :clearable="false"
            placeholder="Select a x palette..."
            :value="getColorsPalette"
            :closeOnSelect="false">
                <template slot="option" slot-scope="option">
                    <ul class="palette-picker-sample">
                        <li v-for="color in getFirstColors(option.colors)" :key="color" :style="{backgroundColor: color}"></li>
                    </ul>
                </template>
                <template #selected-option-container="{ option }">
                    <ul class="palette-picker-sample">
                        <li v-for="color in getFirstColors(option.colors)" :key="color" :style="{backgroundColor: color}"></li>
                    </ul>
                </template>
                <template slot="open-indicator">
                    <span class="open-icon-container"><i class="icon-sort-down"></i></span>
                </template>
            </v-select>
        </div>`
};

export { PalettePicker }