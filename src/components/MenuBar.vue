<script>
import axios from 'axios';

export default{
    data(){
        return{
            visible:false,
            position: 'center'
        }
    },
    methods:{
        async logOut(){
            this.visible = true;

            const tokenExit = JSON.parse(localStorage.getItem("loggedUser"));

            const options = {
                method: 'POST',
                url: `${import.meta.env.VITE_URL_API}logout`,
                headers: {
                    'X-Parse-Application-Id': `${import.meta.env.VITE_XPARSE_APP_ID}`,
                    'X-Parse-REST-API-Key': `${import.meta.env.VITE_XPARSE_REST_API_KEY}`,
                    'X-Parse-Session-Token': `${tokenExit.sessionToken}`
                }
            };

            await axios.request(options).then((response) => {       
                localStorage.removeItem("loggedUser");
                this.$router.push('/')
                this.visible = false

            }).catch((error) => {
                this.$toast.add({ severity: 'error', summary: 'Algo deu errado', life: 3000 });
                this.visible = false
                return error.response
            });
        }
    }
}

</script>

<template>
    <div class="topSearch">
        <div>
            <img src="../assets/images/grupo_3_nf_white.png" alt="Logo 3NF" width="200px">
        </div>
        <div style="color:white">
            <span @click="logOut()" style="cursor: pointer">SAIR</span>
        </div>
    </div>
    <Dialog 
        v-model:visible="visible" 
        :position="position" 
        :modal="true" 
        :draggable="false"
    >
        <template #container>
            <ProgressSpinner /> 
        </template>
    </Dialog>
</template>

<style>
.topSearch{
    width: 100%;
    display: flex;
    align-items: center;
    padding: 30px;
    justify-content: space-between
}
</style>