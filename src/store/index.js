import { createStore } from "vuex";
import rootActions from './actions.js';
import rootGetters from './getters.js';
import rootMutations from './mutations.js';
import adminModule from './modules/Admin/index.js';
import outletModule from './modules/outlet/index.js';
import userModule from './modules/User/index.js'

const store = createStore({
    modules:{
        admin:adminModule,
        outlet:outletModule,
        user:userModule
    },
    state() {
        return {
            base_url: 'http://localhost:8448',
            role: sessionStorage.getItem('role') || '',
            loginDetails: JSON.parse(sessionStorage.getItem('loginDetails')) || [],
        };
    },
    mutations:rootMutations,
    actions:rootActions,
    getters:rootGetters
})

export default store;