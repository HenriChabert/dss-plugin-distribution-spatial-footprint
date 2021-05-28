import { SettingsPanel } from './settings/settings-panel.js'
import { DkuMap } from './map/dku-map.js'
import { MapLegend } from './map/map-legend.js'

const MapContainer = {
    name: "map-container",
    components: {
        'settings-panel': SettingsPanel,
        'dku-map': DkuMap,
        'map-legend': MapLegend,
    },
    template:`
    <div class="map-container">
        <dku-map></dku-map>
        <settings-panel></settings-panel>
<!--        <map-legend></map-legend>-->
    </div>
    `
}
export {MapContainer}