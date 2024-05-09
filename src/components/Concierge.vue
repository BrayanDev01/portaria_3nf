<script>
import axios from 'axios';

export default{
    data(){
        return{
            search:'',
            checked: false,
            granted: true,
            suggestions:[],
            filteredNames: null,
            loading: true,
            listSearching: true,
            loadingEmployees: true
        }
    },
    methods:{
        async getListEmployees(){
            const options = {
                method: 'POST',
                url: `${import.meta.env.VITE_URL_API}functions/listEmployees`,
                headers: {
                    'X-Parse-Rest-API-Key':`${import.meta.env.VITE_XPARSE_REST_API_KEY}`,
                    'X-Parse-Application-Id': `${import.meta.env.VITE_XPARSE_APP_ID}`
                }
            };  

            axios.request(options).then((response) =>{
                // this.listSearching = false
                // console.log(response.data.result);
                this.suggestions = response.data.result
                this.loadingEmployees = false
            }).catch((error) => {
                console.error(error);
            });
        },
        async getEmployee(employee){
            console.log(employee.value.objectId)
            const options ={
                method: 'GET',
                url: `${import.meta.env.VITE_URL_API}classes/employees/${employee.value.objectId}`,
                headers: {
                    'X-Parse-Rest-API-Key':`${import.meta.env.VITE_XPARSE_REST_API_KEY}`,
                    'X-Parse-Application-Id': `${import.meta.env.VITE_XPARSE_APP_ID}`
                }
            }

            await axios.request(options).then((response)=>{
                console.log(response)
                this.search = response.data
                this.loading = false
            }).catch(error =>{
                console.log(error)
            })
        },
        pesquisa(event){
            // console.log(event.query)
            
            if (!event.query.trim().length) {
                this.filteredNames = [...this.suggestions];
            } else {
                this.filteredNames = this.suggestions.filter((item) => {
                    return item.name.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }
        },
        logOut(){
            this.$router.push("/")
        }
    },
    mounted(){
        this.getListEmployees()
    },
    watch:{
        search(){
            if(this.search === ''){
                this.loading = true
            }else{return}
        }
    }
}
</script>

<template>
<div class="main">
    <div class="topSearch">
        <div>
            <img src="../assets/images/grupo_3_nf_white.png" alt="Logo 3NF" width="200px">
        </div>
        <div style="color:white">
            <span @click="logOut()" style="cursor: pointer;">SAIR</span>
        </div>
    </div>
    <div class="content">
        <div class="inputGroup" style="color:white">
            <span>Digite o nome do colaborador:</span>
            <AutoComplete 
                v-model="search" 
                :suggestions="filteredNames"    
                @complete="pesquisa($event)"
                optionLabel="name"
                @item-select="getEmployee($event)"
                :disabled="loadingEmployees"
            />
        </div>
        <div class="cardEmployee" v-if="!!search.name">
            <div class="organizer plus" v-if="!loading">
                <div class="organizer">
                    <div class="imageSide">
                        image                
                    </div>
                    <div class="formSide">
                        <div class="inputGroup">
                            <span>Nome do colaborador :</span>
                            <InputText type="text" v-model="search.name" disabled />
                        </div>
                        <div class="inputGroup">
                            <span>Setor :</span>
                            <InputText type="text" v-model="search.department" disabled />
                        </div>
                        <div class="inputGroup" style="text-align: center;" v-if="search.contract === 'CLT'">
                            <span>Liberado?</span>
                            <ToggleButton 
                                v-model="search.released" 
                                onLabel="Liberado" 
                                offLabel="Não Liberado" 
                                onIcon="pi pi-check" 
                                offIcon="pi pi-lock" 
                                aria-label="Do you confirm" 
                                disabled
                                :pt="{
                                    icon:{
                                        style:{margin:'0px 10px'}
                                    }
                                }" 
                            />
                        </div>
                        <div class="inputGroup" style="text-align: center;" v-else>
                            <span>Liberado?</span>
                            <ToggleButton 
                                v-model="granted" 
                                onLabel="Liberado" 
                                offLabel="Não Liberado" 
                                onIcon="pi pi-check" 
                                offIcon="pi pi-lock" 
                                aria-label="Do you confirm" 
                                disabled
                                :pt="{
                                    icon:{
                                        style:{margin:'0px 10px'}
                                    }
                                }" 
                            />
                        </div>
                    </div>
                </div>
                <div style="width: 100%; display: flex; justify-content: center; padding: 20px; gap: 30px;">
                    <Button severity="help">Cancelar</Button>
                    <Button severity="warning">Registrar Entrada</Button>
                    <Button severity="info">Registrar Saída</Button>
                </div>
            </div>
            <div class="organizer" style="justify-content: center; align-items: center;" v-else>
                <ProgressSpinner></ProgressSpinner>
            </div> 
        </div>
    </div>
</div>
</template>

<style scoped>
.main{
    width: 100dvw;
    height: 100dvh;
    background-color: var(--background-color-default);
}
.topSearch{
    width: 100%;
    display: flex;
    align-items: center;
    padding: 30px;
    justify-content: space-between
}
.content{
    width: 100%;
    height: 70%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.inputGroup{
    display: flex;
    flex-direction: column;
    gap:10px;
    margin: 10px;
}
.cardEmployee{
    width: 50%;
    height: 500px;
    margin: 40px 0px;
    background-color: var(--gray-background);
    display: flex;
}
.organizer{
    width: 100%;
    height: 100%;
    display: flex;
}
.plus{
    flex-direction: column;
}
.imageSide, .formSide{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

</style>