<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app class="gradient-bg">
      <v-list>
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
          title="Restaurant Admin"
          subtitle="Super Admin"
        ></v-list-item>
        <v-divider></v-divider>
        <v-list-item
          v-for="(item, index) in menuItems"
          :key="index"
          :value="item"
          :title="item.title"
          :prepend-icon="item.icon"
          @click="currentSection = item.value"
          rounded="lg"
          class="my-1"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="primary" prominent>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Restaurant Management System</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-bell" class="mx-1">
        <v-badge content="3" color="error"></v-badge>
      </v-btn>
      <v-btn icon="mdi-account-circle"></v-btn>
    </v-app-bar>

    <v-main class="bg-grey-lighten-3">
      <v-container fluid>
        <!-- Dashboard Overview -->
        <v-row v-if="currentSection === 'dashboard'">
          <v-col cols="12" sm="6" md="3" v-for="stat in dashboardStats" :key="stat.title">
            <v-card :color="stat.color" theme="dark">
              <v-card-text>
                <div class="text-h4">{{ stat.value }}</div>
                <div class="text-subtitle-1">{{ stat.title }}</div>
                <v-icon :icon="stat.icon" size="large"></v-icon>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Users Management -->
       

        <!-- Outlets Management -->
        <v-row v-if="currentSection === 'outlets'">
          <v-col v-for="outlet in outlets" :key="outlet.id" cols="12" md="4">
            <v-card>
              <v-img :src="outlet.image" height="200" cover></v-img>
              <v-card-title>{{ outlet.name }}</v-card-title>
              <v-card-text>
                <div class="d-flex align-center mb-2">
                  <v-icon icon="mdi-map-marker" color="error" class="mr-2"></v-icon>
                  {{ outlet.location }}
                </div>
                <div class="d-flex align-center mb-2">
                  <v-icon icon="mdi-phone" color="primary" class="mr-2"></v-icon>
                  {{ outlet.contact }}
                </div>
                <v-chip
                  :color="outlet.status === 'Open' ? 'success' : 'error'"
                  class="mt-2"
                >
                  {{ outlet.status }}
                </v-chip>
              </v-card-text>
              <v-card-actions>
                <v-btn variant="text" color="primary">Edit</v-btn>
                <v-btn variant="text" color="primary">View Details</v-btn>
                <v-spacer></v-spacer>
                <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Role Management -->
        <v-card v-if="currentSection === 'roles'" class="mb-6">
          <v-card-title class="d-flex align-center">
            Role Management
            <v-spacer></v-spacer>
            <v-btn color="primary" prepend-icon="mdi-plus">Add Role</v-btn>
          </v-card-title>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>Role Name</th>
                  <th>Permissions</th>
                  <th>Users Count</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="role in roles" :key="role.id">
                  <td>{{ role.name }}</td>
                  <td>
                    <v-chip-group>
                      <v-chip
                        v-for="(perm, index) in role.permissions"
                        :key="index"
                        size="small"
                        color="primary"
                      >
                        {{ perm }}
                      </v-chip>
                    </v-chip-group>
                  </td>
                  <td>{{ role.usersCount }}</td>
                  <td>
                    <v-btn icon="mdi-pencil" variant="text" size="small"></v-btn>
                    <v-btn icon="mdi-delete" variant="text" size="small" color="error"></v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>

        <!-- Revenue Analytics -->
        <v-card v-if="currentSection === 'revenue'" class="mb-6">
          <v-card-title>
            Revenue Analytics
            <v-spacer></v-spacer>
            <v-select
              v-model="revenueTimeframe"
              :items="['Daily', 'Weekly', 'Monthly', 'Yearly']"
              label="Timeframe"
              hide-details
              density="compact"
              class="ml-4"
              style="max-width: 200px"
            ></v-select>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="8">
                <v-sheet class="pa-4 ma-2" height="400">
                  <!-- Revenue Chart Placeholder -->
                  <div class="text-center text-grey">Revenue Chart</div>
                </v-sheet>
              </v-col>
              <v-col cols="12" md="4">
                <v-list lines="two">
                  <v-list-item
                    v-for="stat in revenueStats"
                    :key="stat.title"
                    :title="stat.title"
                    :subtitle="stat.value"
                    :prepend-icon="stat.icon"
                  ></v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Food Management -->
        <v-card v-if="currentSection === 'food'" class="mb-6">
          <v-card-title>
            Food Management
            <v-spacer></v-spacer>
            <v-text-field
              v-model="foodSearch"
              append-icon="mdi-magnify"
              label="Search"
              hide-details
              density="compact"
              class="mx-4"
              style="max-width: 300px"
            ></v-text-field>
            <v-btn color="primary" prepend-icon="mdi-plus">Add Item</v-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col v-for="item in foodItems" :key="item.id" cols="12" sm="6" md="4" lg="3">
                <v-card>
                  <v-img :src="item.image" height="200" cover></v-img>
                  <v-card-title>{{ item.name }}</v-card-title>
                  <v-card-text>
                    <div class="d-flex align-center">
                      <div class="text-h6">${{ item.price }}</div>
                      <v-spacer></v-spacer>
                      <v-rating
                        v-model="item.rating"
                        color="warning"
                        density="compact"
                        readonly
                      ></v-rating>
                    </div>
                    <div class="text-subtitle-2">{{ item.category }}</div>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn variant="text" color="primary">Edit</v-btn>
                    <v-btn variant="text" color="error">Delete</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Delivery Boys -->
        <v-card v-if="currentSection === 'delivery'" class="mb-6">
          <v-card-title>
            Delivery Boys
            <v-spacer></v-spacer>
            <v-btn color="primary" prepend-icon="mdi-plus">Add Delivery Boy</v-btn>
          </v-card-title>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Current Order</th>
                  <th>Rating</th>
                  <th>Total Deliveries</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="boy in deliveryBoys" :key="boy.id">
                  <td>
                    <div class="d-flex align-center">
                      <v-avatar size="32" class="mr-2">
                        <v-img :src="boy.avatar"></v-img>
                      </v-avatar>
                      {{ boy.name }}
                    </div>
                  </td>
                  <td>
                    <v-chip
                      :color="getStatusColor(boy.status)"
                      size="small"
                    >
                      {{ boy.status }}
                    </v-chip>
                  </td>
                  <td>{{ boy.currentOrder || 'No active order' }}</td>
                  <td>
                    <v-rating
                      v-model="boy.rating"
                      color="warning"
                      density="compact"
                      readonly
                      size="small"
                    ></v-rating>
                  </td>
                  <td>{{ boy.totalDeliveries }}</td>
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
  </v-app>
</template>

<script>
export default {
  name: 'AdminPage',
  data() {
    return {
      drawer: true,
      currentSection: 'dashboard',
      search: '',
      foodSearch: '',
      revenueTimeframe: 'Monthly',
      dashboardStats: [
        { title: 'Total Revenue', value: '$45,289', icon: 'mdi-currency-usd', color: 'primary' },
        { title: 'Total Orders', value: '1,234', icon: 'mdi-shopping', color: 'success' },
        { title: 'Active Users', value: '892', icon: 'mdi-account-group', color: 'info' },
        { title: 'Avg Rating', value: '4.5', icon: 'mdi-star', color: 'warning' }
      ],
      menuItems: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard', value: 'dashboard' },
        { title: 'Users', icon: 'mdi-account-group', value: 'users' },
        { title: 'Outlets', icon: 'mdi-store', value: 'outlets' },
        { title: 'Roles', icon: 'mdi-shield-account', value: 'roles' },
        { title: 'Revenue', icon: 'mdi-currency-usd', value: 'revenue' },
        { title: 'Food Items', icon: 'mdi-food', value: 'food' },
        { title: 'Delivery Boys', icon: 'mdi-bike', value: 'delivery' }
      ],
      userHeaders: [
        { title: 'Name', key: 'name' },
        { title: 'Email', key: 'email' },
        { title: 'Role', key: 'role' },
        { title: 'Status', key: 'status' },
        { title: 'Actions', key: 'actions' }
      ],
      users: [
        { name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
        { name: 'Jane Smith', email: 'jane@example.com', role: 'Manager', status: 'Active' },
        { name: 'Bob Wilson', email: 'bob@example.com', role: 'Staff', status: 'Inactive' }
      ],
      outlets: [
        {
          id: 1,
          name: 'Downtown Branch',
          location: '123 Main St, Downtown',
          contact: '123-456-7890',
          status: 'Open',
          image: 'https://picsum.photos/300/200?random=1'
        },
        {
          id: 2,
          name: 'Uptown Branch',
          location: '456 Park Ave, Uptown',
          contact: '098-765-4321',
          status: 'Closed',
          image: 'https://picsum.photos/300/200?random=2'
        }
      ],
      roles: [
        { id: 1, name: 'Admin', permissions: ['all'], usersCount: 3 },
        { id: 2, name: 'Manager', permissions: ['view', 'edit'], usersCount: 5 },
        { id: 3, name: 'Staff', permissions: ['view'], usersCount: 12 }
      ],
      revenueStats: [
        { title: 'Total Sales', value: '$12,456', icon: 'mdi-cash-multiple' },
        { title: 'Average Order Value', value: '$45.67', icon: 'mdi-chart-line' },
        { title: 'Profit Margin', value: '32%', icon: 'mdi-percent' }
      ],
      foodItems: [
        {
          id: 1,
          name: 'Classic Burger',
          price: 12.99,
          category: 'Main Course',
          rating: 4.5,
          image: 'https://picsum.photos/300/200?random=1'
        },
        {
          id: 2,
          name: 'Margherita Pizza',
          price: 15.99,
          category: 'Main Course',
          rating: 4.8,
          image: 'https://picsum.photos/300/200?random=2'
        }
      ],
      deliveryBoys: [
        {
          id: 1,
          name: 'Mike Johnson',
          status: 'Active',
          currentOrder: 'Order #1234',
          rating: 4.5,
          totalDeliveries: 156,
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
        },
        {
          id: 2,
          name: 'Steve Williams',
          status: 'On Break',
          currentOrder: null,
          rating: 4.2,
          totalDeliveries: 98,
          avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
        }
      ]
    }
  },
  methods: {
    getStatusColor(status) {
      switch (status) {
        case 'Active': return 'success'
        case 'On Break': return 'warning'
        case 'Offline': return 'error'
        default: return 'grey'
      }
    }
  }
}
</script>

<style scoped>
.gradient-bg {
  background: linear-gradient(135deg, var(--v-primary-base), var(--v-secondary-base));
}

.v-card {
  transition: transform 0.2s;
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
</style>
