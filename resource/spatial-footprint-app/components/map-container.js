import { SettingsPanel } from './settings/settings-panel.js'
import { DkuMap } from './map/dku-map.js'

const MapContainer = {
    name: "map-container",
    components: {
        'settings-panel': SettingsPanel,
        'dku-map': DkuMap,
        'ring-loader': window.VueSpinner.RingLoader
    },
    data() {
        return {
            isLoading: false
        }
    },
    template:`
    <div class="map-container">
        <dku-map :isLoading.sync="isLoading"></dku-map>
        <ring-loader :loading="isLoading" color="#509af5"></ring-loader>
        <settings-panel></settings-panel>
    </div>
    `
}
export {MapContainer}