<template>
    <v-container fluid>
      <!-- Statistics Row -->
      <v-row>
        <v-col v-for="stat in deliveryStats" :key="stat.title" cols="12" sm="6" md="3">
          <v-card :color="stat.color" theme="dark" class="elevation-5 stat-card">
            <v-card-text>
              <div class="d-flex justify-space-between align-center">
                <div>
                  <div class="text-h4 font-weight-bold">{{ stat.value }}</div>
                  <div class="text-subtitle-1">{{ stat.title }}</div>
                </div>
                <v-icon :icon="stat.icon" size="x-large"></v-icon>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- Delivery Boys Table -->
      <v-card class="mt-6">
        <v-card-title class="d-flex align-center py-4 px-6 bg-grey-lighten-4">
          <span class="text-h5">Delivery Personnel</span>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            hide-details
            density="compact"
            class="mx-4"
            style="max-width: 300px"
          ></v-text-field>
          <v-btn color="primary" prepend-icon="mdi-plus" @click="openAddDialog">
            Add Delivery Boy
          </v-btn>
        </v-card-title>
  
        <v-data-table
          :headers="headers"
          :items="deliveryBoys"
          :search="search"
          :loading="loading"
          :items-per-page="10"
          class="elevation-1"
        >
          <template #[`item.avatar`]="{ item }">
            <v-avatar size="40">
              <v-img :src="item.avatar" :alt="item.name"></v-img>
            </v-avatar>
          </template>
  
          <template #[`item.status`]="{ item }">
            <v-chip
              :color="getStatusColor(item.status)"
              size="small"
              class="text-capitalize"
            >
              {{ item.status }}
            </v-chip>
          </template>
  
          <template #[`item.rating`]="{ item }">
            <v-rating
              v-model="item.rating"
              color="warning"
              density="compact"
              half-increments
              readonly
              size="small"
            ></v-rating>
            <span class="text-caption ml-2">({{ item.rating }})</span>
          </template>
  
          <template #[`item.actions`]="{ item }">
            <v-btn
              icon="mdi-pencil"
              variant="text"
              size="small"
              color="primary"
              class="mr-2"
              @click="editDeliveryBoy(item)"
            ></v-btn>
            <v-btn
              icon="mdi-eye"
              variant="text"
              size="small"
              color="info"
              class="mr-2"
              @click="viewDetails(item)"
            ></v-btn>
            <v-btn
              icon="mdi-delete"
              variant="text"
              size="small"
              color="error"
              @click="confirmDelete(item)"
            ></v-btn>
          </template>
        </v-data-table>
      </v-card>
  
      <!-- Add/Edit Dialog -->
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title class="text-h5 pa-4 bg-grey-lighten-4">
            {{ formTitle }}
          </v-card-title>
  
          <v-card-text class="pa-4">
            <v-form ref="form" v-model="valid">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.name"
                    label="Name*"
                    :rules="[v => !!v || 'Name is required']"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.phone"
                    label="Phone*"
                    :rules="[v => !!v || 'Phone is required']"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="editedItem.status"
                    :items="['Active', 'On Break', 'Offline']"
                    label="Status*"
                    required
                  ></v-select>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
  
          <v-card-actions class="pa-4">
            <v-spacer></v-spacer>
            <v-btn color="error" variant="text" @click="closeDialog">Cancel</v-btn>
            <v-btn
              color="primary"
              variant="text"
              @click="saveDeliveryBoy"
              :disabled="!valid"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Delete Confirmation Dialog -->
      <v-dialog v-model="deleteDialog" max-width="400px">
        <v-card>
          <v-card-title class="text-h5 pa-4 bg-grey-lighten-4">Delete Delivery Boy</v-card-title>
          <v-card-text class="pa-4">
            Are you sure you want to delete this delivery boy?
          </v-card-text>
          <v-card-actions class="pa-4">
            <v-spacer></v-spacer>
            <v-btn color="error" variant="text" @click="deleteDialog = false">Cancel</v-btn>
            <v-btn color="primary" variant="text" @click="deleteDeliveryBoy">Confirm</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script>
  export default {
    name: 'DeliveryBoy',
    data() {
      return {
        search: '',
        loading: false,
        dialog: false,
        deleteDialog: false,
        valid: true,
        headers: [
          { title: 'Avatar', key: 'avatar', sortable: false },
          { title: 'Name', key: 'name', sortable: true },
          { title: 'Phone', key: 'phone', sortable: true },
          { title: 'Status', key: 'status', sortable: true },
          { title: 'Current Order', key: 'currentOrder', sortable: true },
          { title: 'Total Deliveries', key: 'totalDeliveries', sortable: true },
          { title: 'Rating', key: 'rating', sortable: true },
          { title: 'Actions', key: 'actions', sortable: false }
        ],
        deliveryStats: [
          {
            title: 'Active Delivery Boys',
            value: '24',
            icon: 'mdi-bike',
            color: 'primary'
          },
          {
            title: 'On Delivery',
            value: '12',
            icon: 'mdi-package-variant',
            color: 'success'
          },
          {
            title: 'Available',
            value: '8',
            icon: 'mdi-account-check',
            color: 'info'
          },
          {
            title: 'Average Rating',
            value: '4.5',
            icon: 'mdi-star',
            color: 'warning'
          }
        ],
        deliveryBoys: [
          {
            id: 1,
            name: 'John Doe',
            phone: '+1 234-567-8900',
            status: 'Active',
            currentOrder: 'Order #1234',
            totalDeliveries: 156,
            rating: 4.5,
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
          },
          {
            id: 2,
            name: 'Mike Smith',
            phone: '+1 234-567-8901',
            status: 'On Break',
            currentOrder: null,
            totalDeliveries: 98,
            rating: 4.2,
            avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
          },
          {
            id: 3,
            name: 'Steve Johnson',
            phone: '+1 234-567-8902',
            status: 'Active',
            currentOrder: 'Order #1235',
            totalDeliveries: 205,
            rating: 4.8,
            avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
          }
        ],
        editedIndex: -1,
        editedItem: {
          name: '',
          phone: '',
          status: 'Active',
          currentOrder: null,
          totalDeliveries: 0,
          rating: 0,
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
        },
        defaultItem: {
          name: '',
          phone: '',
          status: 'Active',
          currentOrder: null,
          totalDeliveries: 0,
          rating: 0,
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
        }
      }
    },
  
    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'New Delivery Boy' : 'Edit Delivery Boy'
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
      },
  
      openAddDialog() {
        this.editedIndex = -1
        this.editedItem = Object.assign({}, this.defaultItem)
        this.dialog = true
      },
  
      editDeliveryBoy(item) {
        this.editedIndex = this.deliveryBoys.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
  
      viewDetails(item) {
        // Implement view details logic
        console.log('View details:', item)
      },
  
      confirmDelete(item) {
        this.editedIndex = this.deliveryBoys.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.deleteDialog = true
      },
  
      deleteDeliveryBoy() {
        this.deliveryBoys.splice(this.editedIndex, 1)
        this.closeDeleteDialog()
      },
  
      closeDialog() {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
  
      closeDeleteDialog() {
        this.deleteDialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
  
      async saveDeliveryBoy() {
        const form = this.$refs.form
        const valid = await form.validate()
        
        if (valid.valid) {
          if (this.editedIndex > -1) {
            Object.assign(this.deliveryBoys[this.editedIndex], this.editedItem)
          } else {
            this.deliveryBoys.push({
              ...this.editedItem,
              id: this.deliveryBoys.length + 1
            })
          }
          this.closeDialog()
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .stat-card {
    transition: transform 0.2s;
  }
  
  .stat-card:hover {
    transform: translateY(-5px);
  }
  
  .v-data-table {
    border-radius: 8px;
  }
  
  .v-data-table :deep(th) {
    font-weight: 600 !important;
    background-color: #f5f5f5 !important;
  }
  
  .v-data-table :deep(tr:hover) {
    background-color: #f5f5f5 !important;
  }
  </style>