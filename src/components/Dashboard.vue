<script>
import axios from 'axios';

export default{
    data(){
        return{
            employees:[],
            movement:[],
            loadingEmployees: true,
            loadingMovement: true
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
                    department: 'COMPRAS'
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
                    department: 'COMPRAS'
                }
            };

            await axios.request(options).then((response) => {
                // console.log(response.data.result);
                this.movement = response.data.result
                this.loadingMovement = false
            }).catch((error) =>{
                console.error(error);
            });
        }
    },
    mounted(){
        this.getMyEmployees();
        this.getEmployeesMovement();
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
            <span @click="logOut()" style="cursor: pointer">SAIR</span>
        </div>
    </div>
    <div class="content">
        <div class="workersSide">
            <DataTable
                :value="employees"
                dataKey="id"
                :loading="loadingEmployees"
                tableStyle="min-width: 50rem"
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
                    
                </Column>
            </DataTable>
        </div>
        <div class="historySide">
            <DataTable
                :value="movement"
                dataKey="id"
                tableStyle="min-width: 50rem"
                removableSortable
                :loading="loadingMovement"
            >
                <template #header>
                    <div style="width: 100%; text-align: center;">
                        Movimentação dos Colaboradores
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
</style>