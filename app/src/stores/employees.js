import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useEmployeesFilterStore = defineStore('employeesFilter', () => {
    const name = ref('');
    const department = ref(null);
    const position = ref(null);

    function $reset() {
        name.value = '';
        department.value = null;
        position.value = null;
    }

    return {name, department, position, $reset};
})