<template>
    <main class="container bg-light">
        <Home v-if="nav_value === 'trangchu' "/>

        <Calendar v-if="nav_value === 'lichkham' "/>
        <Moth_calendar v-if="nav_value === 'lichkham' "/>

        <Filter v-if="nav_value === 'benhnhan'&& show !== 'add_patient'"
        @add:patient = "add_patient"/>

        <Create_profile v-if="show === 'add_patient'"
        @close:patient = "close_patient"/>

        <!-- -------------- -->
        <TableForm v-if="nav_value === 'benhnhan'&& show !== 'add_patient'"/>

        <TableForm v-if="nav_value === 'lichhen'"/>

        <!-- <div style="margin-top: 150px;" class="container px-4 text-center">
            <div class="row gx-5" style="justify-content: center;">
            </div>

            <div class="accordion border p-3 overflow-auto" id="accordionPanelsStayOpenExample" style="height: 600px;">
                <div>
                </div>
            </div>

            <div class="accordion border p-3 overflow-auto" id="accordionPanelsStayOpenExample" style="height: 600px;">
                <div>
                </div>
            </div>

            <div class="accordion border p-3 overflow-auto" id="accordionPanelsStayOpenExample" style="height: 600px;">
                <div>
                </div>
            </div>
        </div> -->
    </main>
</template>

<script>
    import Calendar from '../../components/element/calendar.vue';
    import Filter from '../../components/element/filter.vue';
    import TableForm from '../../components/element/table.vue';
    import Home from '../../components/doctor/home.vue';
    import Create_profile from '../../components/doctor/create_profile.vue';
    import Moth_calendar from '../../components/element/moth_calendar.vue';
    export default{

        props : {
            nav_value: { type: String, default: "" }
        },

        components: {
            Home,
            Calendar,
            Filter,
            TableForm,
            Create_profile,
            Moth_calendar,
        },

        data (){
            return {
                show: ''
            }
        },

        watch: {
            nav_value : {
                handler() {
                    this.show = '';
                },
            }
        },

        methods: {
            add_patient (status){
                this.show = status
            },

            close_patient(){
                this.show = ''
            }
        }

    }
</script>