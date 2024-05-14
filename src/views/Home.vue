<script>
import Concierge from '../components/Concierge.vue'
import Dashboard from '../components/Dashboard.vue';

export default{
    components:{
        Concierge,
        Dashboard
    },
    date(){
        return{
            userInfo: null
        }
    },
    created(){
        this.userInfo = JSON.parse(localStorage.getItem("loggedUser"))
    }
}
</script>
<template>
    <Concierge v-if="userInfo?.accessLevel === 1"></Concierge>
    <Dashboard v-else-if="userInfo?.accessLevel === 0"></Dashboard>
    <div class="main" v-else></div>
</template>

<style scoped>
.main{
    width: 100dvw;
    min-height:100dvh;
    background-color: var(--background-color-default);
    color: white;
}
</style>