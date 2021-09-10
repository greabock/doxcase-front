<template>
  <my-loader>

  </my-loader>
</template>

<script>
import MyLoader from '@/components/Loader'
import azureService from "@/services/azure.service";
import {onMounted} from 'vue';
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';

export default {
  components: {MyLoader},
  setup() {

    const router = useRouter();
    const store = useStore();

    onMounted(async () => {
      const queryParams = router.currentRoute.value.query;
      if (Object.keys(queryParams).length !== 0) {
        try {
          const res = await azureService.postAzure(queryParams);
          const token = res.data.data.token;
          localStorage.setItem('token', token);
          await store.dispatch('user/fetchUserData');
          const user = store.getters['user/getUser'];
          localStorage.setItem('role', user.role);
          await router.push('/');
        } catch (e) {
          // await router.push('/auth');
          console.log(e);
        }
      }
    })
  }
}
</script>

<style scoped>

</style>