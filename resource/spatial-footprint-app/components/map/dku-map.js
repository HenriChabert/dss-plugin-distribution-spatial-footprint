import { DkuGeoJson } from "./dku-geo-json.js";
import { LocationLayerGroup } from "./location-layer-group.js";
import {CustomerPane} from "./customer-pane.js";

const DEFAULT_BOUNDS = [[20.63698621180491, -52.20703125000001], [65.80461669092902, 74.35546875000001]]

const DkuMap = {
    name: "dku-map",
    computed: {
        ...Vuex.mapGetters([
            'getLocations',
            'getCustomers',
            'getActiveIsochrones',
            'tileLayerUrl',
            'showCompetitor',
            'showCustomers'
        ]),
    },
    props: {
        isLoading: Boolean
    },
    data() {
        return {
            bounds: DEFAULT_BOUNDS,
        }
    },
    components: {
        'l-map': window.Vue2Leaflet.LMap,
        'l-tile-layer': window.Vue2Leaflet.LTileLayer,
        'l-control-zoom': window.Vue2Leaflet.LControlZoom,
        'l-feature-group': window.Vue2Leaflet.LFeatureGroup,
        'l-control': window.Vue2Leaflet.LControl,
        'dku-geo-json': DkuGeoJson,
        'location-layer-group': LocationLayerGroup,
        'customer-pane': CustomerPane
    },
    methods: {
        updateLocations(newLocations) {
            this.$store.commit('updateLocations', newLocations);
        },
        fitBounds() {
            if (this.$refs.features.mapObject.getLayers().length) {
                this.bounds = this.$refs.features.mapObject.getBounds();
                this.$refs.map.mapObject.fitBounds(this.bounds);
            }
        },
        updateCustomers() {
            this.$emit("update:isLoading", true);
            this.$store.dispatch(`customer/settings/fetchAvailableIdentifiers`, "customer");
            this.$store.dispatch('customer/settings/fetchAvailableFilteringFeatures', "customer");
            this.$store.dispatch('getFilteredCustomers').then(() => {
                this.$emit("update:isLoading", false);
            });
        }
    },
    mounted() {
        this.unsubscribe = this.$store.subscribe((mutation, state) => {
            const location_updated = mutation.type.match(/(basic|competitor)\/settings\/(setFilteringFeature|setSamplingValue|setActivatedTab|setFilteringFilters)/);
            if (location_updated) {
                this.$emit("update:isLoading", true);
                this.$store.dispatch('getFilteredLocations', location_updated[1]).then(() => {
                    this.$store.commit('updateCustomers', { newCustomers: [] });
                    if (this.showCustomers) {
                        this.updateCustomers();
                    }
                }).then(() => {
                    this.$emit("update:isLoading", false);
                });
            }

            if (mutation.type === "setActiveIsochrones") {
                this.$store.commit('updateCustomers', { newCustomers: [] });
                if (this.showCustomers) {
                    this.updateCustomers();
                }
            }

            if (mutation.type === "customer/activate") {
                if (this.getCustomers.length === 0) {
                    this.updateCustomers();
                }
            }

            if (mutation.type.match(/customer\/settings\/(setFilteringFeature|setSamplingValue)/)) {
                this.$emit("update:isLoading", true);
                this.$store.dispatch('getFilteredCustomers').then(() => {
                    this.$emit("update:isLoading", false);
                });
            }

            if (mutation.type.match(/(updateLocations|updateCustomers)/)) {
                this.$nextTick(function () {
                    this.fitBounds()
                })
            }

        });
    },
    template:`
        <l-map id="dku-map"
            ref="map"
            :bounds="bounds"
            :options="{zoomControl: false}">
            <l-tile-layer :url="tileLayerUrl"></l-tile-layer>
            <l-control-zoom position="bottomright"></l-control-zoom>
            <l-control class="leaflet-control-zoom leaflet-bar leaflet-control" position="bottomright" >
                <a href="javascript:void(0);" class="auto-scale-btn" title="Auto scale" role="button" aria-label="Auto scale" @click="fitBounds"><i class="icon-move"></i></a>
            </l-control>
            <l-feature-group ref="features">
                <location-layer-group v-for="location in getLocations('basic')"
                    :key="location.location_uuid"
                    :location="location"
                    moduleName="basic"></location-layer-group>
                <location-layer-group v-if="showCompetitor"
                    v-for="location in getLocations('competitor')"
                    :key="location.location_uuid + '_competitor'" 
                    :location="location"
                    moduleName="competitor"></location-layer-group>
                <customer-pane v-if="showCustomers"
                    :customers="getCustomers"
                    :activeIsochrones="getActiveIsochrones"
                    ></customer-pane>
            </l-feature-group>
        </l-map>
    `,
    beforeDestroy() {
        this.unsubscribe();
    },
}
export {DkuMap}