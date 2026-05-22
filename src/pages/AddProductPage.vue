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
    <div class="container py-5">

        <div class="row justify-content-center">

            <div class="col-lg-7">

                <div class="card add-product-card border-0 overflow-hidden">

                    <!-- Header -->
                    <div class="card-header add-product-header text-center py-4">

                        <p class="header-subtitle mb-2">
                            Admin Product Management
                        </p>

                        <h2 class="header-title mb-0">
                            Add New Product
                        </h2>

                    </div>

                    <!-- Body -->
                    <div class="card-body p-4 p-lg-5">

                        <form
                            v-on:submit="createProduct"
                            class="d-flex flex-column gap-4">

                            <!-- Product Name -->
                            <div>

                                <label
                                    for="productName"
                                    class="form-label custom-label">

                                    Product Name

                                </label>

                                <input
                                    id="productName"
                                    v-model="productName"
                                    type="text"
                                    class="form-control custom-input"
                                    placeholder="Enter product name" />

                            </div>

                            <!-- Description -->
                            <div>

                                <label
                                    for="description"
                                    class="form-label custom-label">

                                    Description

                                </label>

                                <textarea
                                    id="description"
                                    v-model="description"
                                    class="form-control custom-input custom-textarea"
                                    rows="5"
                                    placeholder="Describe your pastry or product...">

                                </textarea>

                            </div>

                            <!-- Price -->
                            <div>

                                <label
                                    for="price"
                                    class="form-label custom-label">

                                    Price

                                </label>

                                <div class="input-group">

                                    <span class="input-group-text peso-sign">
                                        ₱
                                    </span>

                                    <input
                                        id="price"
                                        v-model="price"
                                        type="number"
                                        class="form-control custom-input"
                                        min="1"
                                        placeholder="0.00" />

                                </div>

                            </div>

                            <!-- Button -->
                            <button
                                class="btn add-btn"
                                :class="isEnabled ? 'add-btn-active' : 'add-btn-disabled'"
                                :disabled="!isEnabled || isLoading">

                                <span v-if="isLoading">

                                    <span
                                        class="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true">

                                    </span>

                                    Adding Product...

                                </span>

                                <span v-else>

                                    Add Product

                                </span>

                            </button>

                        </form>

                    </div>

                </div>

            </div>

        </div>

    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');

.container {
    font-family: 'Lato', sans-serif;
}

.add-product-card {
    border-radius: 24px;
    box-shadow: 0 15px 50px rgba(44,31,20,0.08);
    background: #fffdfb;
}

.add-product-header {
    background:
        radial-gradient(circle at top left, rgba(200,169,126,0.15), transparent 30%),
        #2c1f14;
    color: white;
}

.header-subtitle {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.75rem;
    color: #c8a97e;
    font-weight: 700;
}

.header-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.2rem;
    font-weight: 700;
}

.custom-label {
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #5a3e2b;
}

.custom-input {
    border-radius: 12px;
    border: 1.5px solid #e6d9cc;
    padding: 0.85rem 1rem;
}

.custom-input:focus {
    border-color: #c8a97e;
    box-shadow: 0 0 0 0.25rem rgba(200,169,126,0.15);
}

.custom-textarea {
    resize: none;
}

.peso-sign {
    background: #f5ece0;
    border: 1.5px solid #e6d9cc;
    color: #7a5d45;
    font-weight: 700;
}

.add-btn {
    border-radius: 14px;
    padding: 0.95rem;
    font-weight: 700;
    letter-spacing: 0.5px;
    border: none;
}

.add-btn-active {
    background: #2c1f14;
    color: white;
}

.add-btn-active:hover {
    background: #c8a97e;
    color: #2c1f14;
}

.add-btn-disabled {
    background: #e6d9cc;
    color: #a8917a;
}

@media (max-width: 768px) {

    .header-title {
        font-size: 1.8rem;
    }
}
</style>

