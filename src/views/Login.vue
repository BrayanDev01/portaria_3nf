<script>
import axios from 'axios'

export default{
    data(){
        return{
            username:"",
            password:"",
            position: 'center',
            visible: false
        }
    },
    methods:{
        async login(){
            this.visible = true

            const options = {
                method: 'POST',
                url: `${import.meta.env.VITE_URL_API}login`,
                headers: {
                    'X-Parse-Application-Id': `${import.meta.env.VITE_XPARSE_APP_ID}`,
                    'X-Parse-REST-API-Key': `${import.meta.env.VITE_XPARSE_REST_API_KEY}`,
                    'X-Parse-Revocable-Session': '1'
                },
                data:{
                    username: this.username,
                    password: this.password
                }
            };

            await axios.request(options).then((response) => {
                // console.log(response)
                localStorage.setItem("loggedUser", JSON.stringify(response.data));
                this.$router.push({ path: '/home'});
                
                return response.data

            }).catch((error) => {
                console.log(error)
                return this.loading = false        
            });
            // this.loading = false
        }
    }
}
</script>

<template>
<div class="gradient-background">
    <div class="card">
        <div style="display: flex; justify-content: center; margin: 20px;">
            <img src="../assets/images/Portaria_logoFull.png" alt="Logo Portaria" width="70%">
        </div>
        <div class="inputsGroup">
            <div class="inputControler">
                <FloatLabel>
                    <InputText id="username" v-model="username" style="width:100%"/>
                    <label for="username">Usuário</label>
                </FloatLabel>
            </div>
            <div class="inputControler">
                <FloatLabel>
                    <Password 
                        v-model="password" 
                        inputId="Senha" 
                        toggleMask 
                        :feedback="false"
                        style="width: 100%;"
                        @keyup.enter="login()"
                        :pt="{
                            input:{
                                root:{
                                    style:{width:'100%'}
                                }
                            }
                        }"
                    />
                    <label for="password">Password</label>
                </FloatLabel>
            </div>
            
            <Button 
                style="width: 100%;" 
                :pt="{root:{style: 'padding:10px 50px; justify-content: center'}}" 
                @click="login()"
                @keyup.enter="login()"
            >
                Entrar
            </Button>
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
</div>
</template>

<style scoped>
.gradient-background {
    width: 100dvw;
    height: 100dvh;
    display: flex;
    justify-content: center;
    align-items: center;
    
    background: linear-gradient(139deg,#222c56,#1d70b7,#ff7400);
    background-size: 180% 180%;
    animation: gradient-animation 30s ease infinite;
}
.card{
    width: 30%;
    height: 70%;
    background-color: rgb(231, 231, 231);
    border-radius:5%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.inputsGroup{
    width: 60%;
    text-align: center;
}
.inputControler{
    margin: 30px 0px;
}

@keyframes gradient-animation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@media(max-width:500px){
    .card{
        width: 90%;
    }
    .inputsGroup{
        width: 80%;
    }
}
</style>