<script setup>
	import { useGlobalStore } from '../stores/global.js';
	
	const store = useGlobalStore();
	const user = store.user;
</script>
<template>
    <div>

        <!-- HERO -->
        <section class="hero-section d-flex align-items-center">

            <div class="container">

                <div class="row align-items-center g-5">

                    <!-- Left -->
                    <div class="col-lg-6">

                        <p class="hero-subtitle mb-3">
                            Artisan Pastries & Specialty Coffee
                        </p>

                        <h1 class="hero-title mb-4">
                            Crafted with warmth,
                            baked with love.
                        </h1>

                        <p class="hero-description mb-4">
                            Nectar & Nymphs brings handcrafted pastries,
                            premium coffee, and cozy café experiences
                            straight to your doorstep.
                        </p>

                        <div class="d-flex flex-wrap gap-3">

                            <router-link v-if="!user.isAdmin"
                                :to="{ path: '/products' }"
                                class="btn hero-btn-primary">
                                Shop Now
                            </router-link>

                            <router-link v-else
                                :to="{ path: '/products' }"
                                class="btn hero-btn-primary">
                                Admin Dashboard
                            </router-link>

                            <router-link
                            	v-if="!user.email"
                                :to="{ path: '/register' }"
                                class="btn hero-btn-secondary">

                                Register Now

                            </router-link>

                        </div>

                    </div>

                    <!-- Right -->
                    <div class="col-lg-6">

                        <div class="hero-image shadow-lg"></div>

                    </div>

                </div>

            </div>

        </section>

        <!-- FEATURES -->
        <section class="py-5">

            <div class="container">

                <div class="row g-4">

                    <div class="col-md-4">

                        <div class="feature-card h-100 text-center">

                            <div class="feature-icon mb-3">
                                🥐
                            </div>

                            <h4 class="feature-title">
                                Freshly Baked
                            </h4>

                            <p class="feature-text">
                                Every pastry is baked fresh daily using premium ingredients.
                            </p>

                        </div>

                    </div>

                    <div class="col-md-4">

                        <div class="feature-card h-100 text-center">

                            <div class="feature-icon mb-3">
                                ☕
                            </div>

                            <h4 class="feature-title">
                                Artisan Coffee
                            </h4>

                            <p class="feature-text">
                                Carefully brewed specialty coffee made for every mood.
                            </p>

                        </div>

                    </div>

                    <div class="col-md-4">

                        <div class="feature-card h-100 text-center">

                            <div class="feature-icon mb-3">
                                🚚
                            </div>

                            <h4 class="feature-title">
                                Fast Delivery
                            </h4>

                            <p class="feature-text">
                                Enjoy your café favorites delivered fresh to your door.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </section>

        <!-- CTA -->
        <section class="cta-section py-5">

            <div class="container text-center">

                <h2 class="cta-title mb-4" v-if="!user.isAdmin">
                    Ready for your next cozy moment?
                </h2>
				
				<h2 class="cta-title mb-4" v-else >
                    Ready to manage the dashboard?
                </h2>

                <router-link
                	v-if="!user.isAdmin"
                    :to="{ path: '/products' }"
                    class="btn cta-btn">
                    Explore Products
                </router-link>

                <router-link
                	v-else
                    :to="{ path: '/products' }"
                    class="btn cta-btn">
                    Admin Dashboard
                </router-link>

            </div>

        </section>

    </div>
</template>

<style scoped>
	@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');

	* {
	    font-family: 'Lato', sans-serif;
	}

	/* Hero */
	.hero-section {
	    min-height: 92vh;
	    background: #fdf8f2;
	}

	.hero-subtitle {
	    color: #c8a97e;
	    text-transform: uppercase;
	    letter-spacing: 2px;
	    font-weight: 700;
	    font-size: 0.85rem;
	}

	.hero-title {
	    font-family: 'Playfair Display', serif;
	    font-size: 4rem;
	    color: #2c1f14;
	    font-weight: 700;
	    line-height: 1.15;
	}

	.hero-description {
	    color: #7e6854;
	    line-height: 1.9;
	    max-width: 540px;
	}

	.hero-image {
	    height: 600px;
	    border-radius: 28px;
	    background:
	        linear-gradient(rgba(44,31,20,0.2), rgba(44,31,20,0.2)),
	        url('https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop');
	    background-size: cover;
	    background-position: center;
	}

	.hero-btn-primary {
	    background: #2c1f14;
	    color: white;
	    border-radius: 14px;
	    padding: 0.95rem 1.6rem;
	    font-weight: 700;
	}

	.hero-btn-primary:hover {
	    background: #c8a97e;
	    color: #2c1f14;
	}

	.hero-btn-secondary {
	    border: 1.5px solid #d9c8b8;
	    color: #5a3e2b;
	    border-radius: 14px;
	    padding: 0.95rem 1.6rem;
	    font-weight: 700;
	}

	.hero-btn-secondary:hover {
	    background: #2c1f14;
	    color: white;
	}

	/* Features */
	.feature-card {
	    background: #fffdfb;
	    border-radius: 24px;
	    padding: 2.5rem 2rem;
	    box-shadow: 0 10px 40px rgba(44,31,20,0.06);
	}

	.feature-icon {
	    font-size: 3rem;
	}

	.feature-title {
	    font-family: 'Playfair Display', serif;
	    color: #2c1f14;
	}

	.feature-text {
	    color: #7e6854;
	    line-height: 1.8;
	}

	/* CTA */
	.cta-section {
	    background: #2c1f14;
	}

	.cta-title {
	    font-family: 'Playfair Display', serif;
	    color: white;
	    font-size: 2.7rem;
	}

	.cta-btn {
	    background: #c8a97e;
	    color: #2c1f14;
	    border-radius: 14px;
	    padding: 0.95rem 1.8rem;
	    font-weight: 700;
	}

	.cta-btn:hover {
	    background: white;
	    color: #2c1f14;
	}

	/* Responsive */
	@media (max-width: 991px) {

	    .hero-section {
	        padding: 5rem 0;
	        min-height: auto;
	    }

	    .hero-title {
	        font-size: 2.8rem;
	    }

	    .hero-image {
	        height: 420px;
	    }

	    .cta-title {
	        font-size: 2rem;
	    }
	}
</style>