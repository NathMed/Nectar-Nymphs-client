<script setup>
  import { watch, ref } from 'vue';
  import { Notyf } from 'notyf';
  import {useRouter} from 'vue-router';

  import axios from 'axios';

  import api from '../api.js';

  const notyf = new Notyf();
  const router = useRouter();

  const productName = ref('');
  const description = ref('');
  const price = ref(0);
  const isEnabled = ref(false);
  const isLoading = ref(false);

  watch([productName, description, price], (currentValue, oldValue) => {

    if (currentValue.every(input => input !== "") && typeof currentValue[2] === 'number' && currentValue[2] > 0) {
      isEnabled.value = true
    } else {
      isEnabled.value = false
    }
  });
  
  async function createProduct(e) {
    e.preventDefault();

    isLoading.value = true;

    try {
      const response = await api.post(`/products/`, {
        name: productName.value,
        description: description.value,
        price: price.value
      })

      if (response.data) {
        notyf.success("Added Successfully");

        productName.value = "";
        description.value = "";
        price.value = "";

        router.push({path: '/products'})
      } else {
        notyf.error("Failed to add product. ");
      }
    } catch (e) {
      console.log(e)
        if(e.response.status === 404 || e.response.status === 401 || e.response.status === 400) {

            notyf.error(e.response.data.error);
        } else {
            notyf.error("Failed to add product.")
        }
    } finally {
        isLoading.value = false;
    } 
  }
</script>

<template>
  <div class="container mt-5">
    <h3 class="text-center mb-4">Add New Product</h3>

    <form v-on:submit="createProduct" class="row justify-content-center">
      <div class="col-md-6">

        <div class="mb-3">
          <label for="productName" class="form-label">Product Name</label>
          <input
            id="productName"
            v-model="productName"
            type="text"
            class="form-control"
          />
        </div>

        <div class="mb-3">
          <label for="description" class="form-label">Description</label>
          <textarea
            id="description"
            v-model="description"
            class="form-control"
            rows="5"
          ></textarea>
        </div>

        <div class="mb-3">
          <label for="price" class="form-label">Price</label>
          <input
            id="price"
            v-model="price"
            type="number"
            class="form-control"
            min="1"
          />
        </div>

        <button
          class="btn"
          :class="isEnabled ? 'btn-primary' : 'btn-danger'"
          :disabled="!isEnabled || isLoading"
        >
          <span v-if="isLoading">
            <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
            Adding...
          </span>
          <span v-else>Add Product</span>
        </button>

      </div>
    </form>
  </div>
</template>

