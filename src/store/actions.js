import axios from "axios"

export default{

    //  login
    async login({commit, rootGetters},payload){
        const res = await axios.post(`${rootGetters.getUrl}/api/AdminDatas/mainlogin`,payload);
        if(res.status >= 200 && res.status < 300){
            console.log(res);
            commit('setRole',res.data.role);
            commit('setLoginDetails',res.data);
            // return true;
            return res.data.role;
        }
    }
}    

