import axios from "axios";
export default {

   

    async fetchCategories({ commit, rootGetters }) {
        try {
            const response = await axios.get(`${rootGetters.getUrl}/api/outletdetails/listCategory`);
            console.log('Fetched Categories:', response.data);
            commit('SET_CATEGORIES', response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    async addCategory({ rootGetters }, categoryData) {
        try {
            const response = await axios.post(`${rootGetters.getUrl}/api/outletdetails/addCategory`, {
                catName: categoryData.catName
            });
            console.log('Category added:', response.data);
           
            return response.data;
        } catch (error) {
            console.error('Error adding category:', error);
            throw error;
        }
    },

    // delete category

    async deleteCategory({ dispatch, rootGetters }, catId) {
        try {
            const response = await axios.delete(`${rootGetters.getUrl}/api/outletdetails/deleteCategory?catId=${catId}`);
            console.log('Category deleted:', response.data);
            // Refresh the categories list
            await dispatch('fetchCategories');
            return response.data;
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    },

   
    async updateCategory({ dispatch, rootGetters }, categoryData) {
        try {
            const response = await axios.put(
                `${rootGetters.getUrl}/api/outletdetails/updatecategory?catId=${categoryData.catId}&catName=${categoryData.catName}`
            );
            console.log('Category updated:', response.data);
            await dispatch('fetchCategories');
            return response.data;
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    },

    // fetch food items

    async fetchFoods({ commit, rootGetters }) {
        try {
            const response = await axios.get(`${rootGetters.getUrl}/api/outletdetails/listallfoods`);
            console.log('Fetched Foods:', response.data);
            commit('SET_FOODS', response.data);
            
            return response.data;
        } catch (error) {
            console.error('Error fetching foods:', error);
            throw error;
        }
    },
    
    //  update food item

    async updateFoodItem({ dispatch, rootGetters }, foodData) {
        try {
            const formData = new FormData();
            formData.append('foodId', foodData.foodId);
            formData.append('foodName', foodData.foodName);
            formData.append('price', foodData.price);
            formData.append('foodDescription', foodData.foodDescription);
            formData.append('catId', foodData.catId);
            
            if (foodData.foodImage) {
                formData.append('foodImage', foodData.foodImage);
            }

            const response = await axios.put(
                `${rootGetters.getUrl}/api/outletdetails/updatefooditems`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            console.log('Food item updated:', response.data);
           
            await dispatch('fetchFoods');
            return response.data;
        } catch (error) {
            console.error('Error updating food item:', error);
            throw error;
        }
    },
    
// delete food item
async deleteFood({ dispatch, rootGetters }, foodId) {
    try {
        const response = await axios.delete(
            `${rootGetters.getUrl}/api/outletdetails/deletingfood?foodId=${foodId}`
        );
        console.log('Food deleted:', response.data);
       
        await dispatch('fetchFoods');
        return response.data;
    } catch (error) {
        console.error('Error deleting food:', error);
        throw error;
    }
},

// add delivery boy
async addDeliveryBoy({ rootGetters }, { deliveryModel, licenseImage, aadharImage }) {
    try {
      const formData = new FormData();
  
      // Append JSON as string
      formData.append('deliveryModel', JSON.stringify(deliveryModel));
  
      // Append files
      formData.append('licenseImage', licenseImage);
      formData.append('aadharImage', aadharImage);
  
      const res = await axios.post(`${rootGetters.getUrl}/api/outletdetails/addDelivery`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (res.status >= 200 && res.status < 300) {
        console.log(res);
        return true;
      }
      return false;
  
    } catch (error) {
      console.error('Error while adding delivery boy:', error);
      return false;
    }
  }
  
}
    

 
