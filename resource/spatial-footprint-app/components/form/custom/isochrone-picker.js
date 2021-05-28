import { findByAttribute } from "../../../utils.js"

const DEFAULT_COLORS = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000']

const IsochronePicker = {
    props: {
        name: String,
        label: String,
        choices: Array,
        value: Array
    },
    data() {
        return {
            selectedIsochrones: []
        };
    },
    computed: {
        selectedChoices() {
            return this.choices.filter((c) => findByAttribute(this.selectedIsochrones, 'name', c.value));
        }
    },
    methods: {
        getUnselectedIsochrones() {
            return this.choices.filter((c) => !findByAttribute(this.selectedIsochrones, 'name', c.value));
        },
        getSelectedIsochrones() {
            return this.choices.filter((c) => {
                return findByAttribute(this.selectedIsochrones, 'name', c.value)
            });
        },
        addIsochroneToSelected(isochroneName) {
            const usedColors = this.getUsedColors();
            const newColor = DEFAULT_COLORS.find((color) => !usedColors.includes(color));
            this.selectedIsochrones.push({name: isochroneName, color: newColor})
            this.$refs.isochroneSelect.value = "none";
        },
        removeSelectedIsochrone(isochroneName) {
            this.selectedIsochrones = this.selectedIsochrones.filter((iso) => iso.name !== isochroneName);
        },
        changeIsochroneColor(isochroneName, newColor) {
            findByAttribute(this.selectedIsochrones, 'name', isochroneName).color = newColor;
        },
        getUsedColors() {
            return this.selectedIsochrones.map((iso) => iso.color);
        }
    },
    template: `
        <div class="form-group">
            <label class="form-check-label" :for="name">{{ label }}</label>
            <select
                ref="isochroneSelect"
                class="form-control"
                :id="name"
                :name="name"
                value="none"
                @change="addIsochroneToSelected($event.target.value)">
                <option selected disabled value="none">Select an isochrone...</option>
                <option v-for="choice in getUnselectedIsochrones()"
                    :value="choice.value">{{choice.label}}</option>
            </select>
            <div class="isochrone-selected d-flex justify-content-around align-items-center mt-2" v-for="isochrone in getSelectedIsochrones()" v-bind:key="isochrone.value">
                <input
                    :id="'color_' + isochrone.value"
                    class="ml-4"
                    type="color"
                    :name="isochrone.value"
                    :value="selectedIsochrones.find((iso) => iso.name === isochrone.value).color"
                    @change="changeIsochroneColor(isochrone.value, $event.target.value)"/>
                <span class="ml-2">{{ isochrone.label }}</span>
                <i class="icon-times ml-auto"
                    @click="removeSelectedIsochrone(isochrone.value)"></i>
                
            </div>
        </div>
    `,
    mounted() {
    },
    watch: {
        selectedIsochrones: function() {
            this.$emit('update:value', this.selectedIsochrones);
        }
    }
}

export { IsochronePicker }