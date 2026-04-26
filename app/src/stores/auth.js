import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const role = ref('');

    function setRole(newRole) {
        role.value = newRole;
    }

    function $reset() {
        role.value = '';
    }

    return {role, setRole, $reset};
})