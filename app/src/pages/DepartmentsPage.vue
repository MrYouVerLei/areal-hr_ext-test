<template>
  <div class="q-pa-md q-gutter-md">
    <div class="q-px-xl q-py-md q-mx-xl">
      <q-select filled v-model="organization" :options="organizationsOptions" option-value="id" option-label="name"
                label="Организация"/>
    </div>
    <div class="q-px-xl q-mx-xl">
      <q-input ref="filterRef" filled v-model="filter" label="Фильтр">
        <template v-slot:append>
          <q-icon
              v-if="filter !== ''"
              name="clear"
              class="cursor-pointer"
              @click="resetFilter"
          />
        </template>
      </q-input>
      <q-tree
          :nodes="tree"
          node-key="id"
          default-expand-all
          v-if="tree.length > 0"
          :filter="filter"
      >
        <template v-slot:default-header="prop">
          <div class="row items-center justify-between full-width">
            <div class="row">
              <q-icon v-if="prop.node.icon" :name="prop.node.icon" class="q-mr-sm"/>
              <div>
                {{ prop.node.label }}
              </div>
            </div>
            <div v-if="!prop.node.id.toString().startsWith('id-') && prop.node.id !== 'root'" class="q-gutter-xs">
              <q-btn flat round color="primary" size="sm" icon="edit" @click.stop="openEditDialog(prop.node.id)"
                     v-if="$can('update', 'Department') || auth.role === 'Администратор'"/>
              <q-btn flat round color="primary" size="sm" icon="delete" @click.stop="openDeleteDialog(prop.node.id)"
                     v-if="$can('delete', 'Department') || auth.role === 'Администратор'"/>
            </div>
          </div>
        </template>
        <template v-slot:default-body="prop">
          <div v-if="prop.node.comment">
            {{ prop.node.comment }}
          </div>
        </template>
      </q-tree>
    </div>
    <div class="fixed-bottom-right q-pa-lg" v-if="$can('create', 'Department') || auth.role === 'Администратор'">
      <q-btn round color="primary" icon="add" size="lg" @click="open"/>
    </div>
  </div>

</template>

<script setup>
import {useQuasar} from "quasar";
import {onMounted, ref, watch} from "vue";
import CreateDepartmentDialog from "../components/department/CreateDepartmentDialog.vue";
import {useAuthStore} from "../stores/auth.js";
import EditDepartmentDialog from "../components/department/EditDepartmentDialog.vue";
import DeleteDepartmentDialog from "../components/department/DeleteDepartmentDialog.vue";

const organization = ref(null);
const organizationsOptions = ref([]);
const tree = ref([]);
const filter = ref('')
const filterRef = ref(null)
const auth = useAuthStore();
const $q = useQuasar();

function open() {
  $q.dialog({
    component: CreateDepartmentDialog,

    componentProps: {
      text: "something",
      persistent: true,
    },
  }).onOk(() => {
    updateTree();
  });
}

function openEditDialog(departmentId) {
  $q.dialog({
    component: EditDepartmentDialog,

    componentProps: {
      id: departmentId,
      persistent: true,
    },
  }).onOk(() => {
    updateTree();
  });
}

function openDeleteDialog(departmentId) {
  $q.dialog({
    component: DeleteDepartmentDialog,

    componentProps: {
      id: departmentId,
      persistent: true,
    },
  }).onOk(() => {
    updateTree();
  });
}

function resetFilter() {
  filter.value = ''
  filterRef.value.focus()
}

async function loadOrganizationsData() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/organizations`, {credentials: 'include'});

    if (!response.ok) {
      throw new Error("Ошибка загрузки данных");
    }

    const data = await response.json();

    const options = data.map((organization) => {
      return {
        id: organization.id,
        name: organization.name,
      };
    });

    organizationsOptions.value = [
      {
        id: 0,
        name: "Все"
      },
      ...options,
    ];

    organization.value = organizationsOptions.value[0];
  } catch (err) {
    console.error(err);
  }
}

async function transform(organizationId) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/departments/tree/${organizationId}`, {credentials: "include"});

    if (!response.ok) {
      throw new Error("Ошибка загрузки данных");
    }

    const data = await response.json();

    const map = {};
    const treeTmp = {
      id: `id-${organizationId}`,
      label: organizationsOptions.value.find(item => item.id === organizationId).name,
      icon: "business",
      comment: organizationsOptions.value.find(item => item.id === organizationId).comment,
      children: []
    };

    data.forEach(item => {
      map[item.id] = {
        id: item.id,
        label: item.name,
        comment: item.comment,
        children: [],
        ...item
      };
    });

    data.forEach(item => {
      if (item.parent_id && map[item.parent_id]) {
        map[item.parent_id].children.push(map[item.id]);
      } else {
        treeTmp.children.push(map[item.id]);
      }
    });

    return treeTmp;
  } catch (err) {
    console.error(err);
  }
}

async function updateTree() {
  tree.value = [];

  if (organization.value.id === 0) {
    const root = [{
      id: "root",
      label: "Все организации",
      children: []
    }];

    for (const item of organizationsOptions.value) {
      if (item.id !== 0) {
        const treeTmp = await transform(item.id);
        root[0].children.push(treeTmp);
      }
    }

    tree.value = root;
  } else {
    tree.value = [await transform(organization.value.id)];
  }
}

onMounted(() => {
  loadOrganizationsData();
});

watch(organization, () => {
  updateTree()
});
</script>

<style lang="sass">

</style>
