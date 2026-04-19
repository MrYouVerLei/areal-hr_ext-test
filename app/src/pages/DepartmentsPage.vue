<template>
  <div class="q-pa-md q-gutter-md">
    <div class="q-pa-md q-gutter-sm">
      <q-tree
          :nodes="tree"
          node-key="id"
          default-expand-all
          v-if="tree.length > 0"
      />
    </div>
    <div class="fixed-bottom-right q-pa-lg">
      <q-btn round color="primary" icon="add" size="lg" @click="open"/>
    </div>
  </div>

</template>

<script setup>
import {useQuasar} from "quasar";
import CreateOrganizationDialog from "../components/CreateOrganizationDialog.vue";
import {onMounted, ref} from "vue";

// переменная для колхозного обновления дочернего компонета (таблицы)
const componentKey = ref(0);
const tree = ref([]);
const $q = useQuasar();

function open() {
  $q.dialog({
    component: CreateOrganizationDialog,

    componentProps: {
      text: "something",
      persistent: true,
    },
  }).onOk(() => {
    componentKey.value++;
  });
}

async function transform(organizationId) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/departments/tree/${organizationId}`, {credentials: "include"});

    if (!response.ok) {
      throw new Error("Ошибка загрузки данных");
    }

    const data = await response.json();

    const map = {};
    const treeTmp = [{
      label: "Название организации",
      children: []
    }];

    data.forEach(item => {
      map[item.id] = {
        label: item.name,
        children: [],
        ...item
      };
    });

    data.forEach(item => {
      if (item.parent_id && map[item.parent_id]) {
        map[item.parent_id].children.push(map[item.id]);
      } else {
        treeTmp[0].children.push(map[item.id]);
      }
    });

    tree.value = treeTmp;

  } catch (err) {
    console.error(err);
  }
}

onMounted(() => {
  transform(4);
})
</script>

<style lang="sass">

</style>
