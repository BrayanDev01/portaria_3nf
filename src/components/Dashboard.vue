<script>
import axios from 'axios';
import MenuBar from '../components/MenuBar.vue'

export default{
    components:{
        MenuBar
    },
    data(){
        return{
            employees:[],
            movement:[],
            loadingEmployees: true,
            loadingMovement: true,
            loadingButtons: false,
            userInfo: null
        }
    },
    methods:{
        async getMyEmployees(){
            const options = {
                method: 'POST',
                url: `${import.meta.env.VITE_URL_API}functions/getEmployeesByDepartmentV2`,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Parse-Rest-API-Key':`${import.meta.env.VITE_XPARSE_REST_API_KEY}`,
                    'X-Parse-Application-Id': `${import.meta.env.VITE_XPARSE_APP_ID}`
                },
                data:{
                    department: this.userInfo.department
                }
            };

            await axios.request(options).then((response) => {
                // console.log(response.data.result);
                this.employees = response.data.result
                this.loadingEmployees = false
            }).catch((error) =>{
                console.error(error);
            });
        },
        async getEmployeesMovement(){
            const options = {
                method: 'POST',
                url: `${import.meta.env.VITE_URL_API}functions/employeesMovement`,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Parse-Rest-API-Key':`${import.meta.env.VITE_XPARSE_REST_API_KEY}`,
                    'X-Parse-Application-Id': `${import.meta.env.VITE_XPARSE_APP_ID}`
                },
                data:{
                    department: this.userInfo.department
                }
            };

            await axios.request(options).then((response) => {
                // console.log(response.data.result);
                this.movement = response.data.result
                this.loadingMovement = false
            }).catch((error) =>{
                console.error(error);
            });
        },
        async releasedOutput(data){
            this.loadingButtons = true


            const options = {
                method: 'PUT',
                url: `${import.meta.env.VITE_URL_API}classes/employees/${data.objectId}`,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Parse-Rest-API-Key':`${import.meta.env.VITE_XPARSE_REST_API_KEY}`,
                    'X-Parse-Application-Id': `${import.meta.env.VITE_XPARSE_APP_ID}`
                },
                data:{
                    released: !data.released
                }
            };

            await axios.request(options).then((response) => {
                this.$toast.add({ severity: 'success', summary: 'Alteração Concluída', life: 3000 });
                this.getMyEmployees()
                this.loadingButtons = false
            }).catch((error) =>{
                console.error(error);
                this.loadingButtons = false
                this.$toast.add({ severity: 'danger', summary: 'Algo deu errado', detail: 'Tente recarregar a página', life: 3000 });
            });            
        },
        areUSure(data){

            if(data.released === false){
                this.$confirm.require({
                    message:`Deseja liberar a saída de ${data.name}?`,  
                    header: 'Confirmação',
                    icon: 'pi pi-exclamation-triangle',
                    rejectLabel: 'Cancelar',
                    acceptLabel: 'Liberar',
                    accept: () => {
                        this.releasedOutput(data)
                    },
                    reject: () => {
                        
                    }
                })
            }else{
                this.$confirm.require({
                    message:`Deseja cancelar a saída de ${data.name}?`,  
                    header: 'Confirmação',
                    icon: 'pi pi-exclamation-triangle',
                    rejectLabel: 'Cancelar',
                    acceptLabel: 'Bloquear',
                    acceptClass: 'p-button-danger',
                    accept: () => {
                        this.releasedOutput(data)
                    },
                    reject: () => {
                        
                    }
                })
            }
        }
    },
    mounted(){
        this.userInfo = JSON.parse(localStorage.getItem("loggedUser"))
        this.getMyEmployees();
        this.getEmployeesMovement();
        
    }
}

</script>

<template>
<div class="main">
    <MenuBar></MenuBar>
    <div class="content">
        <div class="workersSide">
            <DataTable
                :value="employees"
                dataKey="id"
                :loading="loadingEmployees"
            >
                <template #header>
                    <div style="width: 100%; text-align: center;">
                        Lista de Colaboradores
                    </div>
                </template>
                <Column field="name" header="Nome" sortable></Column>
                <Column field="department" header="Departamento" sortable></Column>
                <Column field="contract" header="Contrato" sortable></Column>
                <Column field="released" header="Liberado?" sortable>
                    <template #body="{data}">
                        <Button 
                            :icon="data.released === false ? 'pi pi-lock':'pi pi-lock-open'" 
                            rounded
                            :loading="loadingButtons"
                            @click="areUSure(data)"
                        ></Button>
                    </template>                    
                </Column>
            </DataTable>
        </div>
        <div class="historySide">
            <DataTable
                :value="movement"
                dataKey="id"
                tableStyle="min-width: 50rem"
                :breakpoints="{ '1199px': '75vw', '575px': '20vw' }"
                removableSortable
                :loading="loadingMovement"
            >
                <template #header>
                    <div style="width: 100%; text-align: center;">
                        Movimentação dos Colaboradores
                    </div>
                </template>
                <template #empty>
                    <div class="emptyInfo">
                        Não há movimentações no dia de hoje...
                    </div>
                </template>
                <Column field="colaborator.name" header="Nome" sortable></Column>
                <Column field="createdAt" header="Data/Hora" sortable>
                    <template #body="{data}">
                        <div>{{ new Date(data.createdAt).toLocaleString() }}</div>
                    </template>
                </Column>
                <Column field="movement" header="Movimentação" sortable></Column>
            </DataTable>
        </div>
    </div>
    <Toast></Toast>
    <ConfirmDialog></ConfirmDialog>
</div>
</template>

<style scoped>
.main{
    width: 100dvw;
    min-height:100dvh;
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
    align-items: center;
    justify-content: center;
    gap: 30px;
}
.emptyInfo{
    width: 100%;
    text-align: center;
}

@media (max-width: 1025px){
    .content{
        flex-direction: column;
    }
    .workersSide, .historySide{
        max-width: 90dvw;
    }
}
</style>