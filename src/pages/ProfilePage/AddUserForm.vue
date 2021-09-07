<template>
  <div id="modal-add-field-not-required">
    <div class="form-wrap">
      <form @submit="submitHandle">
        <div class="form-wrap__input-wrap form-group">
          <label
          ><span class="form-wrap__input-title">Фамилия Имя Отчество</span
          ><input
              v-model="nameValue"
              class="form-wrap__input form-control"
              type="text"
              placeholder="Введите ФИО"
          />
          </label>
        </div>
        <!-- +e.input-wrap-->
        <div class="form-wrap__input-wrap form-group">
          <label><span class="form-wrap__input-title">Роль</span></label>
          <v-select
              class="mb-3"
              v-model="roleValue"
              :options="roleOptions"
              bordered
          >
          </v-select>
        </div>
        <!-- +e.input-wrap-->
        <div class="form-wrap__input-wrap form-group">
          <label
          ><span class="form-wrap__input-title">Почта</span
          ><input
              v-model="emailValue"
              class="form-wrap__input form-control"
              type="text"
              placeholder="Введите e-mail"
          />
          </label>
        </div>

        <uploader-image
            v-model="fileInput"
            @click.stop.prevent
        ></uploader-image>

        <div class="form-wrap__input-wrap form-group">
          <label
          ><span class="form-wrap__input-title">Логин</span
          ><input
              v-model="loginValue"
              class="form-wrap__input form-control"
              type="text"
              name="newUserLogin"
              placeholder="Введите"
              autocomplete="off"
          />
          </label>
        </div>
        <div class="form-wrap__input-wrap form-group">
          <label
          ><span class="form-wrap__input-title">Пароль</span
          ><input
              v-model="passwordValue"
              class="form-wrap__input form-control"
              type="password"
              name="newUserPassword"
              placeholder="Введите"
              autocomplete="off"
          />
          </label>
        </div>
        <button
            :disabled="!formMeta.valid"
            class="btn btn-primary w-100"
            type="submit"
        >
         Добавить
        </button>
      </form>
    </div>
  </div>
  <loader
    v-show="isLoading"
  ></loader>
</template>

<script>
import {ref} from 'vue';
import {useField, useForm} from 'vee-validate';
import VSelect from '@/ui/VSelect';
import * as yup from 'yup';
import UploaderImage from '@/components/UploaderImage';
import filesService from "@/services/files.service";
import Loader from '@/components/Loader';
import usersService from '@/services/users.service';

export default {
  emits: ['addNewUser', 'closeModal'],
  components: {VSelect, Loader, UploaderImage},
  setup(props, {emit}) {

    const isLoading = ref(false);

    const schema = yup.object({
      name: yup.string().required(),
      role: yup.object().required(),
      email: yup.string().required(),
      login: yup.string().required(),
      password: yup.string().required()
    });

    const {handleSubmit, meta: formMeta} = useForm({
      validationSchema: schema
    });

    const {value: nameValue} = useField('name');
    const {value: roleValue} = useField('role');
    const {value: emailValue} = useField('email');
    const {value: loginValue} = useField('login');
    const {value: passwordValue} = useField('password');
    const roleOptions = [
      {key: 'admin', name: "Администратор"},
      {key: 'moderator', name: "Модератор"},
      {key: 'user', name: "Пользователь"},
    ]

    const fileInput = ref(null);
    const photoUrl = ref(null);

    const addNewUser = async (user, photo) => {
      const userData = {
        ...user,
        role: user.role.key,
        photo
      };
        return await usersService.addUser(userData);
    };

    const submitHandle = handleSubmit(async (values) => {
      try {
        isLoading.value = true;
        if (fileInput.value) {
          const formData = new FormData();
          formData.append('files[]', fileInput.value)

          const imageResp = await filesService.uploadFiles(formData);
          photoUrl.value = imageResp[0].url;
        }

        const userResp = await addNewUser(values, photoUrl.value);
        console.log('NewUser: ', userResp);
      } catch (e) {
        console.log(e);
      } finally {
        isLoading.value = false;
        emit('closeModal');
      }
    });

    return {
      addNewUser,
      formMeta,
      loginValue,
      emailValue,
      nameValue,
      passwordValue,
      roleValue,
      submitHandle,
      roleOptions,
      isLoading,
      fileInput,
    };
  },
};
</script>

<style scoped></style>

