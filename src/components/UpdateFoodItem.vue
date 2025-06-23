<template>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Update Food Item</span>
        </v-card-title>
  
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="foodData.foodName"
              label="Food Name"
              required
              :rules="[v => !!v || 'Food name is required']"
            ></v-text-field>
  
            <v-text-field
              v-model.number="foodData.price"
              label="Price"
              type="number"
              required
              :rules="[v => !!v || 'Price is required']"
            ></v-text-field>
  
            <v-select
              v-model="foodData.catId"
              :items="categories"
              item-title="catName"
              item-value="catId"
              label="Category"
              required
              :rules="[v => !!v || 'Category is required']"
            ></v-select>
  
            <v-textarea
              v-model="foodData.foodDescription"
              label="Description"
              rows="3"
            ></v-textarea>
  
            <v-file-input
              v-model="foodData.foodImage"
              label="Update Food Image"
              accept="image/*"
              prepend-icon="mdi-camera"
            ></v-file-input>
          </v-form>
        </v-card-text>
  
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="dialog = false">Close</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="updateFood" :loading="loading">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import { mapGetters, mapActions } from 'vuex'
  
  export default {
    name: 'UpdateFoodItem',
    props: {
      show: {
        type: Boolean,
        default: false
      },
      foodItem: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        dialog: false,
        valid: false,
        loading: false,
        foodData: {
          foodId: '',
          foodName: '',
          price: '',
          catId: '',
          foodDescription: '',
          foodImage: null
        }
      }
    },
    computed: {
      ...mapGetters('outlet', ['categories'])
    },
    methods: {
      ...mapActions('outlet', ['updateFoodItem', 'fetchCategories']),
      
      async updateFood() {
        if (!this.$refs.form.validate()) return
  
        this.loading = true
        try {
          await this.updateFoodItem(this.foodData)
          this.dialog = false
          this.$emit('food-updated')
        } catch (error) {
          console.error('Error updating food:', error)
        } finally {
          this.loading = false
        }
      }
    },
    watch: {
      show(newVal) {
        this.dialog = newVal
      },
      dialog(newVal) {
        if (!newVal) this.$emit('update:show', false)
      },
      foodItem: {
        handler(newVal) {
          if (newVal) {
            this.foodData = {
              foodId: newVal.foodId,
              foodName: newVal.foodName,
              price: newVal.price,
              catId: newVal.catId,
              foodDescription: newVal.foodDescription,
              foodImage: null
            }
          }
        },
        immediate: true
      }
    },
    async created() {
      await this.fetchCategories()
    }
  }
  </script>