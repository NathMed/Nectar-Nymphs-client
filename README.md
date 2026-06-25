# 🌸 Nectar & Nymphs

A full-stack e-commerce application built with MongoDB, Express.js, Vue.js, and Node.js. Users can browse products, manage shopping carts, place orders, and manage their accounts, while administrators can oversee products and customer orders through a secure dashboard.

## 🚀 Live Demo

Frontend: https://nectar-nymphs-client.vercel.app/

## 👥 Team Members

* Nathaniel Medina
* John Dacir

---

## 🛠 Tech Stack

### Frontend

* Vue.js
* Vue Router
* Pinia
* Axios
* Bootstrap 5

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt

---

## 🔑 Test Credentials

### Admin Account

```txt
Email: admin@mail.com
Password: admin123
```

### Customer Account

```txt
Email: customer@mail.com
Password: customer123
```

---

## ✨ Features

### Customer Features

* User registration and authentication
* Product browsing and product details
* Search products by name
* Search products by price range
* Add products to cart
* Update cart quantities
* Remove items from cart
* Clear cart
* Checkout orders
* View order history
* Update account password

### Administrator Features

* Create products
* Update product information
* Archive and reactivate products
* View all products
* Promote users to administrator
* View all customer orders

---

## 👨‍💻 Contributions

### Nathaniel Medina

#### User Management

* User Registration
* User Authentication

#### Product Management

* Retrieve Single Product
* Update Product Information
* Archive Product
* Activate Product

#### Shopping Cart

* Add To Cart
* Retrieve User Cart

#### Order Management

* Checkout Order

#### Frontend

* Register Page
* Login Page
* Create Product Page
* Retrieve Products Dashboard
* Add To Cart
* Update Cart Quantity
* Checkout Workflow

---

### John Dacir

#### User Management

* Retrieve User Details
* Update Password
* Set User As Admin

#### Product Management

* Create Product
* Retrieve All Products
* Retrieve Active Products

#### Shopping Cart

* Remove Items From Cart
* Clear Cart
* Cart Calculations

#### Order Management

* View User Orders
* View All Orders

#### Frontend

* Product Catalog
* Product Editing
* Product Activation / Archiving
* Cart Totals
* Cart Cleanup Features

---

## 🔐 Authentication

Protected endpoints require:

```http
Authorization: Bearer <token>
```

### Registration Validation

* Valid email required
* Mobile number must contain 11 digits
* Password must be at least 8 characters long

---

## 📡 API Endpoints

### Users

| Method | Endpoint                | Description           |
| ------ | ----------------------- | --------------------- |
| POST   | /users/register         | Register new user     |
| POST   | /users/login            | Authenticate user     |
| GET    | /users/details          | Retrieve user profile |
| PATCH  | /users/update-password  | Update password       |
| PATCH  | /users/:id/set-as-admin | Set user as admin     |

### Products

| Method | Endpoint                      | Description              |
| ------ | ----------------------------- | ------------------------ |
| GET    | /products/active              | Retrieve active products |
| GET    | /products/:productId          | Retrieve single product  |
| POST   | /products                     | Create product           |
| PATCH  | /products/:productId/update   | Update product           |
| PATCH  | /products/:productId/archive  | Archive product          |
| PATCH  | /products/:productId/activate | Activate product         |
| POST   | /products/search-by-name      | Search by name           |
| POST   | /products/search-by-price     | Search by price          |

### Cart

| Method | Endpoint                          | Description         |
| ------ | --------------------------------- | ------------------- |
| GET    | /cart/get-cart                    | Retrieve cart       |
| POST   | /cart/add-to-cart                 | Add product to cart |
| PATCH  | /cart/update-cart-quantity        | Update quantity     |
| PATCH  | /cart/:productId/remove-from-cart | Remove item         |
| PUT    | /cart/clear-cart                  | Clear cart          |

### Orders

| Method | Endpoint                  | Description          |
| ------ | ------------------------- | -------------------- |
| POST   | /orders/checkout          | Create order         |
| GET    | /orders/my-orders         | Retrieve user orders |
| GET    | /orders/all-orders        | Retrieve all orders  |
| PATCH  | /orders/:orderId/complete | Mark order complete  |

---

## 🗄 Database Models

### User

* firstName
* lastName
* email
* password
* mobileNo
* isAdmin

### Product

* name
* description
* price
* isActive

### Cart

* userId
* cartItems
* totalPrice

### Order

* userId
* productsOrdered
* totalPrice
* status

---

## 🛒 Order Workflow

1. User registers or logs in.
2. User browses active products.
3. User adds products to cart.
4. Existing cart items automatically increase quantity when added again.
5. User checks out.
6. Order is created with a default status of `Pending`.
7. Shopping cart is cleared automatically after successful checkout.

---

## 📁 Project Structure

```txt
client/
server/
```
