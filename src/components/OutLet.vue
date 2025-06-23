<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item title="Restaurant Dashboard" prepend-icon="mdi-food"></v-list-item>
        <v-divider></v-divider>
        <v-list-item
          v-for="(item, index) in menuItems"
          :key="index"
          :value="item"
          :title="item.title"
          :prepend-icon="item.icon"
          @click="currentSection = item.value"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="primary" prominent>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Restaurant Management System</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-bell</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>

        <!-- Categories Section -->
        <v-card v-if="currentSection === 'categories'" class="mb-6">
          <v-card-title class="text-h5">
            Categories Management
            <v-spacer></v-spacer>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openCategoryDialog">
              Add Category
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>Sl.No</th>
                  <th>Category ID</th>
                  <th>Category Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(category, index) in categories" :key="category.catId">
                  <td>{{index+1}}</td>
                  <td>{{ category.catId }}</td>
                  <td>{{ category.catName }}</td>
                  <td>
                    <v-btn icon="mdi-pencil" variant="text" size="small" @click="editCategory(category)"></v-btn>
                    <v-btn icon="mdi-delete" variant="text" size="small" color="error" @click="deleteCategory(category)"></v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>

        <!-- Other Sections (unchanged) -->
        <!-- Food Items Section -->
        <v-card v-if="currentSection === 'food'" class="mb-6">
          <v-card-title class="text-h5">
            Food Items Management
            <v-spacer></v-spacer>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openAddFoodDialog">
              Add Food Item
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>Sl.No</th>
                  <th>Image</th>
                  <th>FoodID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
  <tr v-if="!categories || categories.length === 0">
    <td colspan="3" class="text-center">No categories found</td>
  </tr>
  <tr v-else v-for="(food,index) in foods" :key="food.foodId">
     <td>{{ index+1 }}</td>
     <td>
     <v-img
            :src="'data:image/jpeg;base64,' + food.foodImage"
            height="40"
            width="40"
            cover
          ></v-img>
     </td>
    <td>{{ food.foodId }}</td>
    <td>{{ food.foodName }}</td>
    <td>{{ food.catName }}</td>
    <td>{{ food.price }}</td>
    <td>{{ food.foodDescription }}</td>
    <td>
      <v-btn icon="mdi-pencil" variant="text" size="small" @click="editFood(food)"></v-btn>
      <v-btn icon="mdi-delete" variant="text" size="small" color="error" @click="handleDeleteFood(food)"></v-btn>
    </td>
  </tr>
</tbody>
            </v-table>
          </v-card-text>
        </v-card>

        <!-- Delivery Personnel Section -->
        <v-card v-if="currentSection === 'delivery'" class="mb-6">
          <v-card-title class="text-h5">
            Delivery Personnel Management
            <v-spacer></v-spacer>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="showAddDeliveryDialog = true">
              Add Delivery Person
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>Sl.No</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>License.No</th>
                  <th>Aadhar.No</th>
                  <th>License Image</th>
                  <th>Adhar Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="person in deliveryPersonnel" :key="person.id">
                  <td>{{ person.name }}</td>
                  <td>{{ person.phone }}</td>
                  <td>{{ person.email }}</td>
                  <td>{{ person.address }}</td>
                  <td>{{ person.licenseNumber }}</td>
                  <td>{{ person.aadharNumber }}</td>
                  <td>
                    <v-img
                            :src="'data:image/jpeg;base64,' + person.licenseImage"
                            height="40"
                            width="40"
                            cover
                          ></v-img>
                    </td>
                    <td>
                    <v-img
                            :src="'data:image/jpeg;base64,' + person.aadharImage"
                            height="40"
                            width="40"
                            cover
                          ></v-img>
                    </td>
                  


                  <!-- <td>
                    <v-chip :color="person.status === 'Available' ? 'success' : 'warning'">
                      {{ person.status }}
                    </v-chip>
                  </td> -->
  
                  <td>
                    <v-btn icon="mdi-pencil" variant="text" size="small"></v-btn>
                    <v-btn icon="mdi-delete" variant="text" size="small" color="error"></v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>

        <!-- Orders Section -->
        <v-card v-if="currentSection === 'orders'" class="mb-6">
          <v-card-title class="text-h5">
            Orders Management
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search Orders"
              single-line
              hide-details
              density="compact"
              class="ml-4"
              style="max-width: 300px"
            ></v-text-field>
          </v-card-title>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in orders" :key="order.id">
                  <td>#{{ order.id }}</td>
                  <td>{{ order.customer }}</td>
                  <td>{{ order.items }}</td>
                  <td>${{ order.total }}</td>
                  <td>
                    <v-chip :color="getStatusColor(order.status)">
                      {{ order.status }}
                    </v-chip>
                  </td>
                  <td>
                    <v-btn icon="mdi-eye" variant="text" size="small"></v-btn>
                    <v-btn icon="mdi-pencil" variant="text" size="small"></v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>

        <!-- Bookings Section -->
        <v-card v-if="currentSection === 'bookings'" class="mb-6">
          <v-card-title class="text-h5">
            Table Bookings
            <v-spacer></v-spacer>
            <v-btn color="primary" prepend-icon="mdi-plus">
              New Booking
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Guests</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="booking in bookings" :key="booking.id">
                  <td>#{{ booking.id }}</td>
                  <td>{{ booking.customer }}</td>
                  <td>{{ booking.date }}</td>
                  <td>{{ booking.time }}</td>
                  <td>{{ booking.guests }}</td>
                  <td>
                    <v-chip :color="booking.status === 'Confirmed' ? 'success' : 'warning'">
                      {{ booking.status }}
                    </v-chip>
                  </td>
                  <td>
                    <v-btn icon="mdi-pencil" variant="text" size="small"></v-btn>
                    <v-btn icon="mdi-delete" variant="text" size="small" color="error"></v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>

      </v-container>
    </v-main>

    <!-- Category Dialog -->
    <v-dialog v-model="categoryDialog" max-width="500px">
    <v-card>
        <v-card-title>
            <span class="text-h5">Add Category</span>
        </v-card-title>

        <v-card-text>
            <v-container>
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                            v-model="editedCategory.catName"
                            label="Category Name"
                            required
                        ></v-text-field>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="categoryDialog = false">Cancel</v-btn>
            <v-btn color="blue-darken-1" variant="text" @click="saveCategory">Save</v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>

   

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteCategoryDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Delete Category</v-card-title>
        <v-card-text>
          Are you sure you want to delete this category?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="deleteCategoryDialog = false">Cancel</v-btn>
          <v-btn color="red-darken-1" variant="text" @click="confirmDeleteCategory">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

<!-- add food items dialog -->
    <v-dialog v-model="showAddFoodDialog" max-width="700px">
  <AddFoodItems @close="showAddFoodDialog = false" />
</v-dialog>

    <!-- Delete Food Confirmation Dialog -->
    <v-dialog v-model="deleteFoodDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Delete Food Item</v-card-title>
        <v-card-text>
          Are you sure you want to delete this food item?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="deleteFoodDialog = false">Cancel</v-btn>
          <v-btn color="red-darken-1" variant="text" @click="confirmDeleteFood">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add Delivery Person Dialog -->
<v-dialog v-model="showAddDeliveryDialog" max-width="600">
  <AddDeliveryPerson @close="showAddDeliveryDialog = false" />
</v-dialog>

<!-- update food item dialog -->
<UpdateFoodItem
    v-model:show="showUpdateDialog"
    :food-item="selectedFood"
    @food-updated="handleFoodUpdated"
/>

  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import AddFoodItems from './AddFoodItems.vue'
import UpdateFoodItem from './UpdateFoodItem.vue'
import AddDeliveryPerson from './AddDeliveryPerson.vue'

export default {
  name: 'OutLet',

  components: {
    AddFoodItems,UpdateFoodItem,AddDeliveryPerson
  },
  data() {
    return {
      drawer: true,
      currentSection: 'categories',
      search: '',
      menuItems: [
        { title: 'Categories', icon: 'mdi-shape', value: 'categories' },
        { title: 'Food Items', icon: 'mdi-food', value: 'food' },
        { title: 'Delivery Personnel', icon: 'mdi-bike', value: 'delivery' },
        { title: 'Orders', icon: 'mdi-cart', value: 'orders' },
        { title: 'Bookings', icon: 'mdi-calendar', value: 'bookings' }
      ],
      categoryDialog: false,
      deleteCategoryDialog: false,
      editedIndex: -1,
      editedCategory: {
        catName: '',
      },
      defaultCategory: {
        name: '',
      },
      categoryToDelete: null,
      foodItems: [],
      deliveryPersonnel: [],
      orders: [],
      bookings: [],
      showAddFoodDialog: false,
      showUpdateDialog: false,
      selectedFood: null,
      deleteFoodDialog: false,
      foodToDelete: null,
      showAddDeliveryDialog: false,
    }
  },
  computed: {
    ...mapGetters('outlet', ['categories','foods'])
  },
  methods: {

    async loadCategories() {
  try {
    await this.$store.dispatch('outlet/fetchCategories')
    console.log('Categories loaded:', this.$store.state.outlet.categories)
  } catch (error) {
    console.error('Error loading categories:', error)
  }
},

async openCategoryDialog() {
        this.editedCategory = Object.assign({}, this.defaultCategory);
        this.categoryDialog = true;
    },
    
    async saveCategory() {
    try {
        if (this.editedIndex > -1) {
            // Update existing category
            await this.$store.dispatch('outlet/updateCategory', {
                catId: this.editedCategory.catId,
                catName: this.editedCategory.catName
            });
        } else {
            // Add new category
            await this.$store.dispatch('outlet/addCategory', {
                catName: this.editedCategory.catName
            });
        }
        this.categoryDialog = false;
        this.editedCategory = Object.assign({}, this.defaultCategory);
        this.editedIndex = -1;
        await this.loadCategories();
    } catch (error) {
        console.error('Error saving category:', error);
        // Handle error (show error message to user)
    }
},
    
    
editCategory(category) {
    this.editedIndex = this.categories.indexOf(category);
    this.editedCategory = {
        catId: category.catId,
        catName: category.catName,
        // description: category.description || '',
        // active: category.active !== false
    };
    this.categoryDialog = true;
},

    deleteCategory(category) {
      this.categoryToDelete = category
      this.deleteCategoryDialog = true
    },

    async confirmDeleteCategory() {
    try {
        await this.$store.dispatch('outlet/deleteCategory', this.categoryToDelete.catId);
        this.deleteCategoryDialog = false;
        this.categoryToDelete = null;
        // Refresh the categories list
        await this.loadCategories();
    } catch (error) {
        console.error('Error deleting category:', error);
       
    }
  },

    closeCategoryDialog() {
      this.categoryDialog = false
      this.editedCategory = Object.assign({}, this.defaultCategory)
      this.editedIndex = -1
    },

    openAddFoodDialog() {
    this.showAddFoodDialog = true
  },

  // display food details

  async loadFoods() {
  try {
    await this.$store.dispatch('outlet/fetchFoods');
    console.log('Foods loaded:', this.foods);
  } catch (error) {
    console.error('Error loading foods:', error);
  }
},

     // update food item
     editFood(food) {
        this.selectedFood = food;
        this.showUpdateDialog = true;
    },
    handleFoodUpdated() {
        // Refresh the foods list
        this.$store.dispatch('outlet/fetchFoods');
        this.showUpdateDialog = false;
    },

    // delete food
    handleDeleteFood(food) {
      this.foodToDelete = food;
      this.deleteFoodDialog = true;
    },

    async confirmDeleteFood() {
      try {
        await this.$store.dispatch('outlet/deleteFood', this.foodToDelete.foodId);
        this.deleteFoodDialog = false;
        this.foodToDelete = null;
        // Refresh the foods list
        await this.loadFoods();
      } catch (error) {
        console.error('Failed to delete food:', error);
      }
    },

    getStatusColor(status) {
      switch (status) {
        case 'Pending':
          return 'warning'
        case 'Completed':
          return 'success'
        case 'Cancelled':
          return 'error'
        default:
          return 'primary'
      }
    }

  },

  created() {
    this.loadCategories(),
    this.loadFoods();
  },
  beforeMount() {
    this.editedCategory = Object.assign({}, this.defaultCategory)
  }
}
</script>

<style scoped>
.v-table {
  width: 100%;
}
</style>
