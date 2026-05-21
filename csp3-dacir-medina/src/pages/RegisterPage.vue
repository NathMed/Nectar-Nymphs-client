<script setup>
	import {watch, ref, onBeforeMount} from 'vue';
	import { Notyf } from 'notyf';

	import { useRouter } from 'vue-router';
    import { useGlobalStore } from '../stores/global.js';

    import api from '../api.js'

    const firstName = ref("");
    const lastName = ref("");
    const mobileNum = ref("");
    const email = ref("");
    const password = ref("");
    const confirmPass = ref("");
    // for button
    const isEnabled = ref(false);

    const notyf = new Notyf();

    const router = useRouter()

    const {user} = useGlobalStore();


</script>

<template>
	
</template>