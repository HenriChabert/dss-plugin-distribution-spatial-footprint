import { SettingsPanel } from './settings/settings-panel.js'
import { DkuMap } from './map/dku-map.js'

const MapContainer = {
    name: "map-container",
    components: {
        'settings-panel': SettingsPanel,
        'dku-map': DkuMap
    },
    template:`
    <div class="map-container">
        <dku-map></dku-map>
        <settings-panel></settings-panel>
    </div>
    `
}
export {MapContainer}