<template>
    <v-container class="mt-10" max-width="700px"   >
      <v-card class="pa-6 rounded-2xl shadow-lg bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200">
        <v-card-title class="text-3xl font-bold mb-4 justify-center text-center text-indigo-700">
          🍔 Add New Food Item
        </v-card-title>
  
        <v-form ref="form" v-model="isValid" lazy-validation>
          <v-row dense>
  
            <!-- Food Name -->
            <v-col cols="12" sm="6">
              <v-text-field
                label="Food Name"
                v-model="food.name"
                variant="outlined"
                color="purple"
                class="rounded-xl"
                :rules="[v => !!v || 'Name is required']"
                required
              ></v-text-field>
            </v-col>
  
            <!-- Price -->
            <v-col cols="12" sm="6">
              <v-text-field
                label="Price"
                v-model="food.price"
                type="number"
                variant="outlined"
                color="purple"
                class="rounded-xl"
                :rules="[v => !!v || 'Price is required']"
                required
              ></v-text-field>
            </v-col>
  
            <!-- Category Dropdown -->
            <v-col cols="12">
              <v-select
              label="Select Category"
              v-model="food.catId"
              :items="categories"
              item-title="catName"
              item-value="catId"
              variant="outlined"
              color="purple"
              class="rounded-xl"
              :rules="[v => !!v || 'Category is required']"
              required
            ></v-select>

            </v-col>
  
            <!-- Description -->
            <v-col cols="12">
              <v-textarea
                label="Description"
                v-model="food.description"
                variant="outlined"
                color="purple"
                class="rounded-xl"
                auto-grow
                rows="3"
              ></v-textarea>
            </v-col>
  
            <!-- Image Upload -->
            <v-col cols="12">
              <v-file-input
                label="Upload Image"
                accept="image/*"
                show-size
                variant="outlined"
                color="purple"
                class="rounded-xl"
                @change="onImageSelected"
                :rules="[v => !!v || 'Image is required']"
                required
              ></v-file-input>
            </v-col>
  

          </v-row>
  
          <!-- Buttons -->
          <v-card-actions class="mt-6 justify-center">
            <v-btn :loading="loading" color="purple" class="rounded-lg px-6 text-white" @click="submitForm">
              Submit
            </v-btn>
            <v-btn color="deep-purple accent-4" class="rounded-lg px-6 text-white" @click="resetForm">
              Reset
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
  
      <!-- Snackbar -->
      <v-snackbar v-model="showSnackbar" color="green" timeout="3000">
        Food item added successfully!
        <template v-slot:action="{ attrs }">
          <v-btn color="white" text v-bind="attrs" @click="showSnackbar = false">Close</v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  import { mapGetters } from 'vuex'
  
  export default {
    name: 'AddFoodItems',
    data() {
      return {
        food: {
          name: '',
          catId: '',
          price: '',
          description: '',
          image: null,
        },
       
        imagePreview: null,
        isValid: false,
        loading: false,
        showSnackbar: false,
      };
    },
   
    created() {
      this.loadCategories()
    },

    methods: {
      async loadCategories() {
  try {
    await this.$store.dispatch('outlet/fetchCategories')
    console.log('Categories loaded:', this.categories);
  } catch (error) {
    console.error('Error loading categories:', error)
  }
},
      onImageSelected(event) {
        const file = event.target.files[0];
        if (file) {
          this.food.image = file;
          this.imagePreview = URL.createObjectURL(file);
        }
      },
      
      async submitForm() {
  const isFormValid = await this.$refs.form.validate();
  if (!isFormValid) return;

  this.loading = true;

  try {
    const foodModule = JSON.stringify({
      catId: this.food.catId,
      foodName: this.food.name,
      price: parseFloat(this.food.price),
      foodDescription: this.food.description
    });

    const formData = new FormData();
    
    
    formData.append('foodModule', new Blob([foodModule], { type: 'application/json' }));

    if (this.food.image) {
      formData.append('foodImage', this.food.image);
    }

    
    const response = await axios.post('http://localhost:8448/api/outletdetails/addfoodItem', formData);
    
    await this.$store.dispatch('outlet/fetchFoods')
    console.log('Food item added:', response.data);
    this.showSnackbar = true;
    this.resetForm();
  
  } catch (error) {
    console.error('Error adding food item:', error);
  } finally {
    this.loading = false;
  }
},


      resetForm() {
        this.food = {
          name: '',
          catId: '',
          price: '',
          description: '',
          image: null,
        };
       
        if (this.$refs.form) this.$refs.form.resetValidation();
      }
    },

    computed: {
    ...mapGetters('outlet', ['categories'])
  },
  };
  </script>
  
  <style scoped>
  .v-img {
    border: 2px dashed #ccc;
  }
  
  .v-card {
    transition: all 0.3s ease;
  }
  
  .v-card:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
  </style>
  