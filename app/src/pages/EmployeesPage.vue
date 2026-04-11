<script setup>
import EmployeesFilters from "../components/EmployeesFilters.vue";
import EmployeesTable from "../components/EmployeesTable.vue";
import { useQuasar } from "quasar";
import StepperCreateEmployee from "../components/StepperCreateEmployee.vue";

const $q = useQuasar();

function open() {
  $q.dialog({
    component: StepperCreateEmployee,

    componentProps: {
      text: "something",
      persistent: true,
    },
  });
}
</script>

<template>
  <div class="q-pa-md q-gutter-md">
    <EmployeesFilters />
    <div class="q-mx-xl q-px-xl">
      <EmployeesTable />
    </div>
    <div class="fixed-bottom-right q-pa-lg">
      <q-btn round color="primary" icon="add" size="lg" @click="open" />
    </div>
  </div>
</template>
