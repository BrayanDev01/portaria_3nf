<script>
import Concierge from '../components/Concierge.vue'
import Dashboard from '../components/Dashboard.vue';

export default{
    components:{
        Concierge,
        Dashboard
    }
}
</script>
<template>
    <Concierge></Concierge>
    <!-- <Dashboard></Dashboard> -->
</template>

<style>
.main{
    width: 100dvw;
    min-height:100dvh;
    background-color: var(--background-color-default);
}
</style>