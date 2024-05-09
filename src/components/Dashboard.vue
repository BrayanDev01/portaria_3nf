<script>

export default{
    data(){
        return{
            employees:[
                {
                    "name": "VIVALDO DUTRA DO NASCIMENTO",
                    "department": "COMPRAS",
                    "contract": "CLT",
                    "released": false,
                    "createdAt": "2024-05-08T16:49:05.387Z",
                    "updatedAt": "2024-05-08T16:49:05.387Z",
                    "objectId": "lSaj7b1B7d"
                },
                {
                    "name": "MARIANA DE SOUZA FARIAS",
                    "department": "COMPRAS",
                    "contract": "CLT",
                    "released": false,
                    "createdAt": "2024-05-08T16:49:20.163Z",
                    "updatedAt": "2024-05-08T16:49:20.163Z",
                    "objectId": "bGfUEHiECw"
                }
            ]
        }
    },
    methods:{
        logOut(){
            this.$router.push('/')
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
            <span @click="logOut()" style="cursor: pointer">SAIR</span>
        </div>
    </div>
    <div class="content">
        <div class="workersSide">
            <DataTable
                :value="employees"
                dataKey="id"
                tableStyle="min-width: 50rem"
            >
                <Column field="name" header="Nome" sortable></Column>
                <Column field="department" header="Departamento" sortable></Column>
                <Column field="released" header="Liberado?" sortable></Column>
            </DataTable>
        </div>
        <div class="historySide">
            <DataTable
                :value="employees"
                dataKey="id"
                tableStyle="min-width: 50rem"
            >
                <Column field="name" header="Nome" sortable></Column>
                <Column field="department" header="Departamento" sortable></Column>
                <Column field="released" header="Liberado?" sortable></Column>
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