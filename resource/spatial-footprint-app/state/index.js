import generalSettings from './modules/general-settings.js'
import map from './modules/map.js'


Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        generalSettings,
        map
    },
})