<script>
import axios from 'axios';
import MenuBar from '../components/MenuBar.vue'
import { FilterMatchMode } from 'primevue/api';

export default{
    components:{
        MenuBar
    },
    data(){
        return{
            employees:[],
            movement:[],
            visible: false,
            loadingEmployees: true,
            loadingMovement: true,
            loadingButtons: false,
            userInfo: null,
            nameCompany: null,
            cnpj: null,
            nameWorker: null,
            workers:[],
            filters:{
                global:{ value:null, matchMode: FilterMatchMode.CONTAINS },
                name:{value:null, matchMode: FilterMatchMode.CONTAINS},
                department:{value:null, matchMode: FilterMatchMode.IN},
                released:{value:null, matchMode: FilterMatchMode.CONTAINS}          
            },
            anotherFilter:{
                global:{ value:null, matchMode: FilterMatchMode.CONTAINS },
                'colaborator.name':{value:null, matchMode: FilterMatchMode.CONTAINS},
                movement:{value:null, matchMode: FilterMatchMode.CONTAINS}
            }
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
                console.log(response.data.result);
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
                console.log(response.data.result);
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
        async createOutsourced(){
            const options = {
                method: 'POST',
                url: `${import.meta.env.VITE_URL_API}classes/employees`,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Parse-Rest-API-Key':`${import.meta.env.VITE_XPARSE_REST_API_KEY}`,
                    'X-Parse-Application-Id': `${import.meta.env.VITE_XPARSE_APP_ID}`
                },
                data:{
                    name: this.nameCompany,
                    department: this.userInfo.department,
                    contract: "PJ",
                    outsourced: true,
                    workers: this.workers,
                    document: this.cnpj
                }
            };

            await axios.request(options).then((response)=>{
                console.log(response)
                this.visible=false
            }).catch((error)=>{
                console.log(error)
            })
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
        },
        addWorker(){
            if(!this.nameWorker){
                this.$toast.add({ severity: 'error', summary: 'Campo Vazio', life: 3000 });
            }else{
                this.workers.push(this.nameWorker)
                this.nameWorker = ''
            }
        },
        cleanInfos(){
            this.nameCompany=  null,
            this.cnpj=  null,
            this.nameWorker=  null,
            this.workers= []
        },
        verifyInfos(){
            if(!!this.nameCompany && !!this.cnpj && !!this.workers.length){
                this.createOutsourced()                        
            }else{
                this.$toast.add({ severity: 'error', summary: 'Verifique as informações', detail:'Error detected', life: 3000 });           
            }
        },
        chooseSeverity(data){
            switch (data) {
                case 'Entrada':
                    return 'success';

                case 'Saída':
                    return 'warning';

                case 'Saída sem autorização':
                    return 'danger';

                default:
                    return null;
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
                tableStyle="min-width: 50rem"
                dataKey="id"
                :loading="loadingEmployees"
                v-model:filters="filters"
                :globalFilterFields="['name', 'department', 'released']"
                scrollable 
                scrollHeight="500px"
                removableSort
            >
                <template #header>
                    <div class="organizerHead">
                        <div>Lista de Colaboradores :</div>
                        <div>
                            <Button @click="visible=true">Cadastrar Terceirizado</Button>
                        </div>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                        </IconField>                        
                    </div>
                    <div></div>
                </template>
                <Column field="name" header="Nome" sortable></Column>
                <Column field="department" header="Departamento" sortable>
                    <template #body="{data}">
                        <span v-if="!data.outsourced">{{ data.department }}</span> 
                        <span v-else>TERCEIRIZADO</span>
                    </template>
                </Column>
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
                removableSortable
                :loading="loadingMovement"
                v-model:filters="anotherFilter"
                :globalFilterFields="['colaborator.name', 'movement']"
                scrollable 
                scrollHeight="500px"
                removableSort
            >
                <template #header>
                    <div class="organizerHead">
                        <div>Movimentação do dia :</div>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="anotherFilter['global'].value" placeholder="Keyword Search" />
                        </IconField>                        
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
                <Column field="movement" header="Movimentação" sortable>
                    <template #body="{data}">
                        <Tag :value="data.movement" :severity="chooseSeverity(data.movement)"></Tag>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
    <Toast></Toast>
    <ConfirmDialog></ConfirmDialog>
    <Dialog 
        v-model:visible="visible"
        modal
        header="Cadastrar Terceirizado"
        :style="{ width: '65rem' }"
        :draggable="false"
        @hide="cleanInfos()"
    >
        <div class="formOrganizer">
            <div class="leftSide">
                <strong>Informações Cadastrais</strong>
                <div class="groupInput">
                    <label for="username">Nome da empresa</label>
                    <InputText id="username" v-model="nameCompany"/>
                </div>
                <div class="groupInput">
                    <label>CNPJ</label>
                    <InputMask id="basic" v-model="cnpj" mask="99.999.999/9999-99" />
                </div>
            </div>
            <div class="rigthSide">
                <strong>Funcionarios</strong>
                <div style="display: flex; gap: 10px; margin: 10px;">
                    <FloatLabel>
                        <InputText id="username" v-model="nameWorker" maxlength="42"/>
                        <label for="username">Nome</label>
                    </FloatLabel>
                    <Button @click="addWorker">Adicionar terceiro</Button>
                </div>
                <div class="limitChips">
                    <Chip :label="worker" v-for="(worker, i) in workers" :key="i"/>
                </div>
            </div>
        </div>
        <div class="footer">
            <Button type="button" label="Cancelar" severity="secondary" @click="visible = false"></Button>
            <Button type="button" label="Salvar" @click="verifyInfos()"></Button>
        </div>

    </Dialog>
</div>
</template>

<style scoped>
.limitChips{
    max-width: 100%;
    max-height: 200px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap:10px;
}
.footer{
    display: flex;
    gap: 20px;
    margin: 10px 0px
}
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
    max-width: 100dvw;
    min-height: 70%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 30px;
    flex-wrap: wrap;
    padding: 30px;
}
.emptyInfo{
    width: 100%;
    text-align: center;
}
.organizerHead{
    width: 100%; 
    display: flex; 
    justify-content: space-between; 
    align-items: center;
}
.formOrganizer{
    display: flex;
}
.groupInput{
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 10px;
    width: 100%;
}
.rigthSide{
    width: 60%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.leftSide{
    width: 40%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

@media (max-width: 1025px){
    .content{
        flex-direction: column;
        align-items: center;
    }
    .workersSide, .historySide{
        max-width: 90dvw;
    }
    .organizerHead{
        flex-direction: column;
    }
}
</style>