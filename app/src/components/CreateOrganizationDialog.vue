<script setup>
import {useDialogPluginComponent} from "quasar";
import {ref} from "vue";

const props = defineProps({
  // ...your custom props
});

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
]);

const formData = ref({
  name: '',
  comment: '',
});

const {
  dialogRef,
  onDialogHide,
  onDialogOK,
  onDialogCancel,
} = useDialogPluginComponent();

async function createOrganization() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/organizations`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(formData.value)
    });

    if (response.ok) {
      onDialogOK();
    }
  } catch (err) {
    console.error(err);
  }
}
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 500px; max-width: 50vw">
      <div class="q-pa-md">
        <q-card-section class="text-center">
          <h5 class="q-ma-none">Добавление организации</h5>
        </q-card-section>
        <q-form @submit="createOrganization">
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
                label="Добавить"
            />
          </div>
        </q-form>
      </div>
    </q-card>
  </q-dialog>
</template>

<style scoped lang="sass">

</style>