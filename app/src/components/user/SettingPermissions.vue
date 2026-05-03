<script setup>
import {onMounted, ref} from "vue";
import {useQuasar} from "quasar";
import SavePermissionsDialog from "./SavePermissionsDialog.vue";

const permissions = ref({
  create_Organization: false,
  create_Department: false,
  create_Position: false,
  read_Changelog: false,
  delete_Organization: false,
  delete_Department: false,
  delete_Position: false,
  update_Organization: false,
  update_Department: false,
  update_Position: false,
});
const loadPermissions = ref(null);
const roleId = ref(null);

const $q = useQuasar();

function open() {
  $q.dialog({
    component: SavePermissionsDialog,

    componentProps: {
      persistent: true,
    },
  }).onOk((role) => {
    roleId.value = role.id;
    savePermissions();
  });
}

async function loadPermissionsData() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/permissions`, {credentials: 'include'});

    if (!response.ok) {
      throw new Error("Ошибка загрузки данных");
    }

    const data = await response.json();
    loadPermissions.value = data;

    data.forEach(permission => {
      const transformPermission = `${permission.action}_${permission.subject}`;
      if (transformPermission in permissions.value) {
        permissions.value[transformPermission] = true;
      }
    });
  } catch (err) {
    console.error(err);
  }
}

async function savePermissions() {
  const transformPermissions = loadPermissions.value.map(item => `${item.action}_${item.subject}`);

  for (const permission in permissions.value) {
    if (!transformPermissions.includes(permission) && permissions.value[permission]) {
      try {
        const actionAndSubject = permission.split('_');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/permissions`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include',
          body: JSON.stringify({
            action: actionAndSubject[0],
            subject: actionAndSubject[1],
            role_id: roleId.value
          })
        });

        if (!response.ok) {
          throw new Error("Ошибка добавления разрешения");
        }
      } catch (err) {
        console.error(err);
      }
    } else if (transformPermissions.includes(permission) && !permissions.value[permission]) {
      try {
        const id = loadPermissions.value.find(item => `${item.action}_${item.subject}` === permission).id;
        const response = await fetch(`${import.meta.env.VITE_API_URL}/permissions/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error("Ошибка удаления разрешения");
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  await loadPermissionsData();
}

onMounted(() => {
  loadPermissionsData();
});
</script>

<template>
  <div class="q-pa-md">
    <q-expansion-item
        icon="settings"
        label="Разрешения и доступы менеджера"
    >
      <q-list>
        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>Просмотр истории изменений</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle
                v-model="permissions.read_Changelog"
                checked-icon="check"
                unchecked-icon="clear"
            />
          </q-item-section>
        </q-item>
        <q-separator/>
        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>Создание организации</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle
                v-model="permissions.create_Organization"
                checked-icon="check"
                unchecked-icon="clear"
            />
          </q-item-section>
        </q-item>
        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>Редактирование организации</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle
                v-model="permissions.update_Organization"
                checked-icon="check"
                unchecked-icon="clear"
            />
          </q-item-section>
        </q-item>
        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>Удаление организации</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle
                v-model="permissions.delete_Organization"
                checked-icon="check"
                unchecked-icon="clear"
            />
          </q-item-section>
        </q-item>
        <q-separator/>
        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>Создание отдела</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle
                v-model="permissions.create_Department"
                checked-icon="check"
                unchecked-icon="clear"
            />
          </q-item-section>
        </q-item>
        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>Редактирование отдела</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle
                v-model="permissions.update_Department"
                checked-icon="check"
                unchecked-icon="clear"
            />
          </q-item-section>
        </q-item>
        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>Удаление отдела</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle
                v-model="permissions.delete_Department"
                checked-icon="check"
                unchecked-icon="clear"
            />
          </q-item-section>
        </q-item>
        <q-separator/>
        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>Создание должности</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle
                v-model="permissions.create_Position"
                checked-icon="check"
                unchecked-icon="clear"
            />
          </q-item-section>
        </q-item>
        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>Редактирование должности</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle
                v-model="permissions.update_Position"
                checked-icon="check"
                unchecked-icon="clear"
            />
          </q-item-section>
        </q-item>
        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>Удаление должности</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle
                v-model="permissions.delete_Position"
                checked-icon="check"
                unchecked-icon="clear"
            />
          </q-item-section>
        </q-item>
      </q-list>
      <div class="flex justify-end q-mt-md">
        <q-btn style="width: 150px" color="primary" label="Сохранить" @click="open"/>
      </div>
    </q-expansion-item>
  </div>
</template>

<style scoped lang="sass">

</style>