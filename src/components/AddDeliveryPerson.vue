<template>
  <v-container class="d-flex justify-center align-center" style="min-height: 100vh; background-color: #f5f5f5;">
    <v-card class="pa-6" max-width="600" elevation="5" style="border-radius: 20px;">
      <v-card-title class="text-h5 font-weight-bold text-center" style="color: #1976d2;">
        Add Delivery Person
      </v-card-title>

      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row dense>
          <v-col cols="12" sm="6">
            <v-text-field v-model="deliveryPerson.name" label="Name" :rules="[rules.required]" outlined dense />
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field v-model="deliveryPerson.phone" label="Phone" :rules="[rules.required, rules.phone]" outlined dense />
          </v-col>

          <v-col cols="12">
            <v-text-field v-model="deliveryPerson.email" label="Email" :rules="[rules.required, rules.email]" outlined dense />
          </v-col>

          <v-col cols="12">
            <v-textarea v-model="deliveryPerson.address" label="Address" :rules="[rules.required]" outlined dense rows="2" />
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field v-model="deliveryPerson.licenseNumber" label="License Number" :rules="[rules.required]" outlined dense />
          </v-col>

          <v-col cols="12" sm="6">
            <v-file-input v-model="deliveryPerson.licenseImage" label="Upload License Image" accept="image/*" outlined dense />
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field v-model="deliveryPerson.aadharNumber" label="Aadhar Number" :rules="[rules.required]" outlined dense />
          </v-col>

          <v-col cols="12" sm="6">
            <v-file-input v-model="deliveryPerson.aadharImage" label="Upload Aadhar Image" accept="image/*" outlined dense />
          </v-col>
        </v-row>

        <v-card-actions class="justify-end mt-4">
          <v-btn color="grey lighten-1" text class="mr-4" @click="$emit('close')">Cancel</v-btn>
          <v-btn 
            color="primary" 
            :loading="isLoading" 
            :disabled="!valid || isLoading" 
            @click="submitForm"
          >
            Submit
          </v-btn>

          <!-- Show error if exists -->
          <v-alert
            v-if="error"
            type="error"
            dense
            class="mt-3"
          >
            {{ error }}
          </v-alert>

        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'AddDeliveryPerson',
  data() {
    return {
      isLoading: false, // Changed from loading to isLoading for consistency
      valid: false,
      error: null,
      deliveryPerson: {
        name: '',
        address: '',
        phone: '',
        email: '',
        licenseNumber: '',
        licenseImage: null,
        aadharNumber: '',
        aadharImage: null,
      },
      rules: {
        required: v => !!v || 'This field is required',
        email: v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        phone: v => /^\d{10}$/.test(v) || 'Phone must be 10 digits',
      }
    };
  },

  computed: {
    ...mapGetters(['getLoginDetails']),
    outletDetails(){
        return this.getLoginDetails;
      }

  },

  methods: {
    resetForm() {
      this.$refs.form.reset();
      this.$refs.form.resetValidation();
    },

    async submitForm() {
      try {
        if (this.$refs.form.validate()) {
          this.isLoading = true;
          this.error = null;

          const formData = new FormData();
          
          // Create the deliveryModel JSON
          const deliveryModel = {
            name: this.deliveryPerson.name,
            // outlet_id: 1,
            outlet_id: this.outletDetails.id,
            address: this.deliveryPerson.address,
            phone: this.deliveryPerson.phone,
            email: this.deliveryPerson.email,
            licenseNumber: this.deliveryPerson.licenseNumber,
            aadharNumber: this.deliveryPerson.aadharNumber
          };

         
          formData.append('deliveryModel', JSON.stringify(deliveryModel));

          
          if (this.deliveryPerson.licenseImage) {
            formData.append('licenseImage', this.deliveryPerson.licenseImage);
          }
          if (this.deliveryPerson.aadharImage) {
            formData.append('aadharImage', this.deliveryPerson.aadharImage);
          }

          const response = await fetch('http://localhost:8448/api/outletdetails/addDelivery', {
            method: 'POST',
            body: formData
          });

          if (!response.ok) {
            throw new Error('Failed to add delivery person');
          }

          const data = await response.json();
          console.log('Delivery person added successfully:', data);
          
          this.resetForm();
          this.$emit('close');
          this.$emit('success', data);
        }
      } catch (error) {
        console.error('Error adding delivery person:', error);
        this.error = error.message || 'Failed to add delivery person';
      } finally {
        this.isLoading = false;
      }
    }
  
  }
};
</script>

<style scoped>
.v-btn {
  border-radius: 8px;
}

.v-card {
  background: #ffffff;
}

.v-file-input {
  cursor: pointer;
}
</style>
