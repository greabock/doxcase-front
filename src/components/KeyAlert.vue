<template>
    <div
        class='key-alert-wrapper'
        :class="{
        'alert-visible': alertType !== 'not_expired',
        'license-expired': alertType === 'expired'
        }"
    >
        <div class='container-fluid'>
            <div
                v-if="alertType === 'pre_expired'"
                class='row'
            >
                <div class='col'>
                    <img class="alert-icon" src="/img/svg/alert.svg" />
                    <span>
                        Истекает срок действия лицензии {{formatDate(licenseEnd)}} г. Для продления свяжитесь по почте sample@sample.com
                    </span>
                </div>
                <div
                    v-if="userRole === 'admin'"
                    class='col-auto key-modal-toggle'
                    @click="isKeyModal = true"
                >
                    <img class="key-icon" src="/img/svg/key.svg" />
                    Введите ключ
                </div>
            </div>
            <div
                v-if="alertType === 'expired'"
                class='row'
            >
                <div class='col expired-license'>
                    <img class="alert-icon" src="/img/svg/alert_white.svg" />
                    <span>
                        Срок действия лицензии истек. Для продления свяжитесь по почте sample@sample.com
                    </span>
                </div>
                <div
                    v-if="userRole === 'admin'"
                    class='col-auto key-modal-toggle'
                    @click="isKeyModal = true"
                >
                    <img class="key-icon" src="/img/svg/key_white.svg" />
                    Введите ключ
                </div>
            </div>
        </div>
    </div>
    <!-- Удаление группы -->
    <modal-window
        v-model="isKeyModal"
        maxWidth="480px"
    >
        <div class="modal-window__header">
            <h3>Активация продукта</h3>
        </div>
        <p class='alert-form-text'>Для продления свяжитесь по почте sample@sample.com или по номеру телефона +7 985 998 99 88</p>

        <form @submit="submitHandle">
            <div class="form-wrap__input-wrap form-group">
                <label
                >
                    <input
                        v-model="prodKeyValue"
                        class="form-wrap__input form-control"
                        type="text"
                        placeholder="Введите ключ"
                        @input="skipError"
                    />
                </label>
                <span class="validation-error">{{prodKeyError}}</span>
            </div>
            <div
                v-if="error"
                class="form-error-wrapper">Неверный ключ
            </div>
            <div class="modal-window__buttons">
                <v-button
                    class="w-100"
                    :class="{'disabled': !formMeta.valid}"
                    :disabled="loading"
                    type='submit'
                >
                    <span v-show="loading" class="spinner-border spinner-border-sm"></span>
                    Активировать
                </v-button>
            </div>
        </form>
    </modal-window>
</template>

<script>
import {ref, computed} from 'vue';
import ModalWindow from '@/components/ModalWindow';
import {useField, useForm} from 'vee-validate';
import * as yup from 'yup';
import {formatDate} from '@/utils/date.helpers'
import VButton from '@/ui/VButton';
import licenseService from '@/services/license.service';
import {useStore} from 'vuex';

export default {
    props: {
        licenseInfo: {
            type: Object || null
        },
        userRole: {
            type: String || undefined
        }
    },
    components: {
        ModalWindow,
        VButton
    },
    setup(props) {

        const store = useStore()
        const loading = ref(false);
        const error = ref(null);
        const licenseEnd = computed(() => {
            if (props.licenseInfo && props.licenseInfo.expires_at) {
                const dateArr =  props.licenseInfo.expires_at.split('-');
                dateArr[1] = dateArr[1] - 1;
                return new Date(...dateArr);
            }
            return null;
        });

        const currentTime = computed(() => {
            if (props.licenseInfo && props.licenseInfo.current_date) {
                const dateArr = props.licenseInfo.current_date.split('-');
                dateArr[1] = dateArr[1] - 1;
                return new Date(...dateArr);
            }
            return null;
        });

        const alertType = computed(() => {
            if (!props.licenseInfo) {
                return 'not_expired';
            }
            if ((licenseEnd.value - currentTime.value <= 0)) {
                return 'expired';
            } else if ((licenseEnd.value - currentTime.value <= 432000000)) {
                return 'pre_expired';
            } else {
                return 'not_expired';
            }
        });

        const isKeyModal = ref(false);

        const schema = yup.object({
            prodKey: yup.string().required('Добавьте ключ'),
        });

        const skipError = () => {
            error.value = null;
        }

        const {handleSubmit, meta: formMeta, resetForm} = useForm({
            validationSchema: schema,
        });

        const {value: prodKeyValue, errorMessage: prodKeyError} = useField('prodKey');

        const submitHandle = handleSubmit(async ({prodKey}) => {
            try {
                loading.value = true;
                await licenseService.sendLicense(prodKey);
                await store.dispatch('user/fetchLicenseInfo');
                isKeyModal.value = false;
                resetForm();
            } catch (e) {
                error.value = 'Неверный ключ';
                console.log(e.message)
            } finally {
                loading.value = false;
            }
        });

        return {
            isKeyModal,
            ModalWindow,
            prodKeyValue,
            prodKeyError,
            formMeta,
            submitHandle,
            alertType,
            licenseEnd,
            formatDate,
            loading,
            skipError,
            error
        }
    }
};
</script>
<style scoped>
.key-alert-wrapper {
    display: none;
    position: relative;
    z-index: 1000;
    align-items: center;
    height: 40px;
    font-size: 13px;
    color: #000;
    background-color: #FFDA59;
}
.alert-visible {
    display:flex;
}
.alert-icon {
    display: inline-flex;
    position: relative;
    top:-1px;
    margin-right: 10px;
}
.key-icon {
    margin-right: 10px;
}
.key-modal-toggle {
    cursor: pointer;
}
.alert-form-text {
    font-size: 13px;
}
.modal-window__buttons {
    padding-top: 0;
}

.license-expired.key-alert-wrapper {
    background-color: #FF6459;
    color:#fff;
}
.form-error-wrapper {
    display: block;
    margin: 0 0 10px;
    color:#ff0000;
}
</style>