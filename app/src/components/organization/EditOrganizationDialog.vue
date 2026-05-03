<script setup>
import {useDialogPluginComponent} from "quasar";
import {onMounted, ref} from "vue";

const props = defineProps({
  id: Number,
});

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
]);

const formData = ref({
  name: '',
  comment: null
});

const {
  dialogRef,
  onDialogHide,
  onDialogOK,
  onDialogCancel,
} = useDialogPluginComponent();

async function loadOrganizationData(id) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/organizations/${id}`, {credentials: 'include'});

    if (!response.ok) {
      throw new Error("Ошибка загрузки данных");
    }

    const data = await response.json();

    formData.value.name = data.name;
    formData.value.comment = data.comment;
  } catch (err) {
    console.error(err);
  }
}

async function saveOrganization(id) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/organizations/${id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({
        ...formData.value
      })
    });

    if (response.ok) {
      onDialogOK();
    }
  } catch (err) {
    console.error(err);
  }
}

onMounted(() => {
  loadOrganizationData(props.id);
});
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 500px; max-width: 50vw">
      <div class="q-pa-md">
        <q-card-section class="text-center">
          <h5 class="q-ma-none">Редактирование организации</h5>
        </q-card-section>
        <q-form @submit="saveOrganization(props.id)">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                  outlined
                  v-model="formData.name"
                  label="Название"
                  :rules="[(val) => !!val || 'Поле обязательно']"
              />
            </div>
            <div class="col-12">
              <q-input outlined v-model="formData.comment" label="Комментарий"/>
            </div>
          </div>
          <div class="row justify-end q-mt-md">
            <q-btn
                flat
                color="primary"
                @click="onDialogCancel"
                label="Отмена"
                class="q-mr-auto"
            />
            <q-btn
                type="submit"
                color="primary"
                label="Сохранить"
            />
          </div>
        </q-form>
      </div>
    </q-card>
  </q-dialog>
</template>

<style scoped lang="sass">

</style>