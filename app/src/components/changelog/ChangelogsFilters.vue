<template>
  <div class="column q-gutter-y-md">
    <div class="row justify-center">
      <div class="col-5">
        <div class="row q-col-gutter-x-md">
          <div class="col-6">
            <div class="row q-col-gutter-x-md no-wrap items-center">
              <span class="text-subtitle1">От: </span>
              <q-input filled v-model="from" class="full-width">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="from" mask="YYYY-MM-DD HH:mm">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat/>
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>

                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="from" mask="YYYY-MM-DD HH:mm" format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat/>
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <div class="col-6">
            <div class="row q-col-gutter-x-md no-wrap items-center">
              <span class="text-subtitle1">До: </span>
              <q-input filled v-model="to" class="full-width">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="to" mask="YYYY-MM-DD HH:mm">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat/>
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>

                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="to" mask="YYYY-MM-DD HH:mm" format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat/>
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-center">
      <div class="col-5">
        <div class="row q-col-gutter-x-md">
          <div class="col-6">
            <q-select filled v-model="objectType" :options="objectTypesOptions" label="Объект"/>
          </div>
          <div class="col-6">
            <q-select filled v-model="field" :options="fieldsOptions" label="Поле"/>
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-center">
      <div class="col-5">
        <div class="row q-col-gutter-x-md">
          <div class="col-6">
            <q-btn
                class="full-width"
                color="indigo-1"
                text-color="black"
                label="Очистить"
                @click="reset"
            />
          </div>
          <div class="col-6">
            <q-btn class="full-width" color="primary" label="Найти" @click="applyFilter"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import {useChangelogsFilterStore} from "../../stores/changelogs.js";

const filter = useChangelogsFilterStore();
const from = ref(null);
const to = ref(null);
const objectType = ref(null);
const field = ref(null);
const objectTypesOptions = ref([]);
const fieldsOptions = ref([]);

async function loadObjectTypesData() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/changelogs/objects`, {credentials: 'include'});

    if (!response.ok) {
      throw new Error("Ошибка загрузки данных");
    }

    const data = await response.json();

    objectTypesOptions.value = data.map((objectType) => objectType.object_type);
  } catch (err) {
    console.error(err);
  }
}

async function loadFieldsData() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/changelogs/fields`, {credentials: 'include'});

    if (!response.ok) {
      throw new Error("Ошибка загрузки данных");
    }

    const data = await response.json();

    fieldsOptions.value = data.map((field) => field.field_name);
  } catch (err) {
    console.error(err);
  }
}

function reset() {
  from.value = null;
  to.value = null;
  objectType.value = null;
  field.value = null;
  filter.$reset();
}

function applyFilter() {
  filter.$patch({
    from: from.value,
    to: to.value,
    object: objectType.value,
    field: field.value,
  });
}

onMounted(() => {
  loadObjectTypesData();
  loadFieldsData();
});

onUnmounted(() => {
  filter.$reset();
});
</script>

<style lang="sass">

</style>
