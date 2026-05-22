<script setup>
    import { useRouter } from 'vue-router';
    import { useGlobalStore } from '../stores/global.js';
    
    const store = useGlobalStore();
    const user = store.user;

    const router = useRouter();
</script>

<template>
    <nav class="navbar navbar-expand-lg sticky-top navbar-custom shadow-sm py-2">
        <div class="container">

            <!-- Brand -->
            <router-link
                :to="{ path: '/' }"
                class="navbar-brand brand-logo">

                Nectar<span>&</span>Nymphs
            </router-link>

            <!-- Mobile Toggle -->
            <button
                class="navbar-toggler border-0 shadow-none"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup"
                aria-expanded="false"
                aria-label="Toggle navigation">

                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- Nav Links -->
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">

                <div class="navbar-nav ms-auto align-items-lg-center gap-lg-2 mt-3 mt-lg-0">

                    <router-link
                        :to="{ path: '/products' }"
                        class="nav-link custom-link">

                        Products
                    </router-link>

                    <router-link
                        :to="{ path: '/cart' }"
                        class="nav-link custom-link">

                        Cart
                    </router-link>

                    <!-- Guest Links -->
                    <template v-if="!user.email">

                        <router-link
                            :to="{ path: '/register' }"
                            class="nav-link custom-link">

                            Register
                        </router-link>

                        <router-link
                            :to="{ path: '/login' }"
                            class="btn login-btn ms-lg-2">

                            Login
                        </router-link>

                    </template>

                    <!-- User Links -->
                    <template v-if="user.email">

                        <router-link
                            :to="{ path: '/profile' }"
                            class="nav-link custom-link">
                            Profile
                        </router-link>

                        <router-link
                            :to="{ path: '/logout' }"
                            class="btn logout-btn ms-lg-2">
                            Logout
                        </router-link>

                    </template>

                </div>

            </div>

        </div>
    </nav>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Lato:wght@300;400;700&display=swap');

.navbar-custom {
    background: rgba(253, 248, 242, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid #eee2d3;
    font-family: 'Lato', sans-serif;
}

/* Brand */
.brand-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.7rem;
    font-weight: 600;
    color: #2c1f14;
    text-decoration: none;
    letter-spacing: -0.5px;
}

.brand-logo span {
    color: #c8a97e;
    font-style: italic;
    margin: 0 0.05em;
}

/* Nav Links */
.custom-link {
    color: #5a3e2b;
    font-weight: 600;
    position: relative;
    transition: color 0.2s ease;
}

.custom-link:hover {
    color: #c8a97e;
}

.custom-link.router-link-active {
    color: #c8a97e;
}

/* Underline Animation */
.custom-link::after {
    content: '';
    position: absolute;
    left: 0.5rem;
    bottom: 0.2rem;
    width: 0;
    height: 2px;
    background: #c8a97e;
    transition: width 0.25s ease;
}

.custom-link:hover::after,
.custom-link.router-link-active::after {
    width: calc(100% - 1rem);
}

/* Buttons */
.login-btn,
.logout-btn {
    border-radius: 10px;
    padding: 0.55rem 1.1rem;
    font-weight: 700;
    letter-spacing: 0.4px;
    transition: all 0.2s ease;
}

/* Login */
.login-btn {
    background: #2c1f14;
    color: #fdf8f2;
    border: none;
}

.login-btn:hover {
    background: #c8a97e;
    color: #2c1f14;
}

/* Logout */
.logout-btn {
    background: #c8a97e;
    color: #2c1f14;
    border: none;
}

.logout-btn:hover {
    background: #2c1f14;
    color: #fdf8f2;
}

/* Mobile */
@media (max-width: 991px) {

    .navbar-nav {
        padding-top: 1rem;
        gap: 0.5rem;
    }

    .login-btn,
    .logout-btn {
        width: 100%;
        text-align: center;
    }

    .custom-link::after {
        display: none;
    }
}
</style>