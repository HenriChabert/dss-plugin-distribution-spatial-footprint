const TabsHeader = {
    name: "tabs-header",
    props: {
        activatedTab: String
    },
    template: `
        <div class="tabs-header d-flex align-items-center justify-content-around">
            <span 
                :class="['tab-option', activatedTab === 'points_of_sales' ? 'tab-activated' : '']"
                v-on:click="$emit('update:activatedTab', 'points_of_sales')">select points of sales</span>
            <span class="text-capitalize">or</span>
            <span
                :class="['tab-option', activatedTab === 'filters' ? 'tab-activated' : '']"
                v-on:click="$emit('update:activatedTab', 'filters')">use filters</span>
        </div>`,
};

export {TabsHeader}