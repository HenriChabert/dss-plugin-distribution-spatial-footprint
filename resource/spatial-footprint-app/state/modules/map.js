const state = () => ({
    tileLayerUrl: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
})

// getters
const getters = {
    tileLayerUrl: (state) => state.tileLayerUrl,
}


export default {
    state,
    getters,
}