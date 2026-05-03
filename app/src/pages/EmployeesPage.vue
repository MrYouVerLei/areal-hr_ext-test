<script setup>
import EmployeesFilters from "../components/employee/EmployeesFilters.vue";
import EmployeesTable from "../components/employee/EmployeesTable.vue";
import { useQuasar } from "quasar";
import CreateEmployeeStepper from "../components/employee/CreateEmployeeStepper.vue";
import {ref} from "vue";

const componentKey = ref(0);
const $q = useQuasar();

function open() {
  $q.dialog({
    component: CreateEmployeeStepper,

    componentProps: {
      text: "something",
      persistent: true,
    },
  }).onOk(() => {
    componentKey.value++;
  });
}
</script>

<template>
  <div class="q-pa-md q-gutter-md">
    <EmployeesFilters />
    <div class="q-mx-xl q-px-xl">
      <EmployeesTable :key="componentKey"/>
    </div>
    <div class="fixed-bottom-right q-pa-lg">
      <q-btn round color="primary" icon="add" size="lg" @click="open" />
    </div>
  </div>
</template>
