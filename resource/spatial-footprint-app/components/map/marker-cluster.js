const props = {
    options: {
        type: Object,
        default() {
            return {};
        },
    },
}

const MarkerCluster = {
    name: "marker-cluster",
    props: props,
    data() {
        return {
            ready: false,
        };
    },
    mounted() {
        this.mapObject = new L.MarkerClusterGroup(this.options);
        L.DomEvent.on(this.mapObject, this.$listeners);
        window.Vue2Leaflet.propsBinder(this, this.mapObject, props);
        this.ready = true;
        this.parentContainer = window.Vue2Leaflet.findRealParent(this.$parent);
        this.parentContainer.addLayer(this);
        this.$nextTick(() => {
            this.$emit('ready', this.mapObject);
        });
    },
    beforeDestroy() {
        this.parentContainer.removeLayer(this);
    },
    methods: {
        addLayer(layer, alreadyAdded) {
            if (!alreadyAdded) {
                this.mapObject.addLayer(layer.mapObject);
            }
        },
        removeLayer(layer, alreadyRemoved) {
            if (!alreadyRemoved) {
                this.mapObject.removeLayer(layer.mapObject);
            }
        }
    },
    template: `
        <div style="display: none;">
            <slot v-if="ready"></slot>
        </div>
    `
};

export { MarkerCluster }