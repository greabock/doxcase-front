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
                class='row license-expired__row'
            >
                <div class='col expired-license'>
                    <img class="alert-icon" src="/img/svg/alert.svg" />
                    <span>
                        Срок действия лицензии истекает {{formatDate(licenseEnd)}} г. Для продления лицензии необходимо отправить запрос на адрес
                        <a
                            class='alert-email-pre_expired'
                            href="mailto:doxcase@oktadi.ru?subject=%D0%9F%D1%80%D0%BE%D0%B4%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D0%B8%20DoxCase&body=---%20%D0%94%D0%B0%D0%BD%D0%BD%D0%B0%D1%8F%20%D1%81%D0%B5%D0%BA%D1%86%D0%B8%D1%8F%20%D0%BF%D0%B8%D1%81%D1%8C%D0%BC%D0%B0%20%D1%81%D0%B3%D0%B5%D0%BD%D0%B5%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B0%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%2C%20%D0%B7%D0%B0%D0%BF%D0%BE%D0%BB%D0%BD%D0%B8%D1%82%D0%B5%20%D0%B5%D1%91%20%D0%BF%D0%B5%D1%80%D0%B5%D0%B4%20%D0%BE%D1%82%D0%BF%D1%80%D0%B0%D0%B2%D0%BA%D0%BE%D0%B9%20---%0D%0A%0D%0A%D0%9D%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8%3A%0D%0A%D0%92%D0%B0%D1%88%D0%B5%20%D0%B8%D0%BC%D1%8F%20%D0%B8%20%D0%B4%D0%BE%D0%BB%D0%B6%D0%BD%D0%BE%D1%81%D1%82%D1%8C%3A%0D%0A%D0%A2%D0%B5%D0%BA%D1%81%D1%82%20%D0%92%D0%B0%D1%88%D0%B5%D0%B3%D0%BE%20%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B0%3A%0D%0A%0D%0A"
                        >
                            doxcase@oktadi.ru
                        </a>
                    </span>
                </div>
                <div
                    v-if="userRole === 'admin'"
                    class='col-auto key-modal-toggle-pre_expired'
                    @click="isKeyModal = true"
                >
                    <img class="key-icon" src="/img/svg/key.svg" />
                    Введите ключ
                </div>
            </div>
            <div
                v-if="alertType === 'expired'"
                class='row license-expired__row'
            >
                <div class='col expired-license'>
                    <img class="alert-icon" src="/img/svg/alert_white.svg" />
                    <span>
                        Срок действия лицензии истек. Функциональность ограничена. Для продления лицензии необходимо отправить запрос на адрес
                        <a
                            class="alert-email"
                            href="mailto:doxcase@oktadi.ru?subject=%D0%9F%D1%80%D0%BE%D0%B4%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D0%B8%20DoxCase&body=---%20%D0%94%D0%B0%D0%BD%D0%BD%D0%B0%D1%8F%20%D1%81%D0%B5%D0%BA%D1%86%D0%B8%D1%8F%20%D0%BF%D0%B8%D1%81%D1%8C%D0%BC%D0%B0%20%D1%81%D0%B3%D0%B5%D0%BD%D0%B5%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B0%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%2C%20%D0%B7%D0%B0%D0%BF%D0%BE%D0%BB%D0%BD%D0%B8%D1%82%D0%B5%20%D0%B5%D1%91%20%D0%BF%D0%B5%D1%80%D0%B5%D0%B4%20%D0%BE%D1%82%D0%BF%D1%80%D0%B0%D0%B2%D0%BA%D0%BE%D0%B9%20---%0D%0A%0D%0A%D0%9D%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8%3A%0D%0A%D0%92%D0%B0%D1%88%D0%B5%20%D0%B8%D0%BC%D1%8F%20%D0%B8%20%D0%B4%D0%BE%D0%BB%D0%B6%D0%BD%D0%BE%D1%81%D1%82%D1%8C%3A%0D%0A%D0%A2%D0%B5%D0%BA%D1%81%D1%82%20%D0%92%D0%B0%D1%88%D0%B5%D0%B3%D0%BE%20%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B0%3A%0D%0A%0D%0A"
                        >
                            doxcase@oktadi.ru
                        </a>
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
        <p class='alert-form-text'>Для продления лицензии необходимо отправить запрос на адрес <a
            href="mailto:doxcase@oktadi.ru?subject=%D0%9F%D1%80%D0%BE%D0%B4%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D0%B8%20DoxCase&body=---%20%D0%94%D0%B0%D0%BD%D0%BD%D0%B0%D1%8F%20%D1%81%D0%B5%D0%BA%D1%86%D0%B8%D1%8F%20%D0%BF%D0%B8%D1%81%D1%8C%D0%BC%D0%B0%20%D1%81%D0%B3%D0%B5%D0%BD%D0%B5%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B0%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%2C%20%D0%B7%D0%B0%D0%BF%D0%BE%D0%BB%D0%BD%D0%B8%D1%82%D0%B5%20%D0%B5%D1%91%20%D0%BF%D0%B5%D1%80%D0%B5%D0%B4%20%D0%BE%D1%82%D0%BF%D1%80%D0%B0%D0%B2%D0%BA%D0%BE%D0%B9%20---%0D%0A%0D%0A%D0%9D%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8%3A%0D%0A%D0%92%D0%B0%D1%88%D0%B5%20%D0%B8%D0%BC%D1%8F%20%D0%B8%20%D0%B4%D0%BE%D0%BB%D0%B6%D0%BD%D0%BE%D1%81%D1%82%D1%8C%3A%0D%0A%D0%A2%D0%B5%D0%BA%D1%81%D1%82%20%D0%92%D0%B0%D1%88%D0%B5%D0%B3%D0%BE%20%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B0%3A%0D%0A%0D%0A"
        >
            doxcase@oktadi.ru
        </a> или обратиться по номеру телефона<br />  +7 495 899 05 50</p>

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
            return 'not_expired';
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
    min-height: 40px;
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
.alert-email {
    color:#fff;
}
.alert-email-pre_expired {
    color:#000;
}
@media (max-width: 974px) {
    .key-alert-wrapper {
        font-size: 11px;
    }
    .license-expired__row {
        flex-direction: column;
    }
    .key-modal-toggle {
        padding: 5px 0;
        text-align: center;
    }
    .key-modal-toggle:hover {
        background-color: #E2594F;
    }
    .key-modal-toggle-pre_expired {
        padding: 5px 0;
        text-align: center;
    }
    .key-modal-toggle-pre_expired:hover {
        background-color: #ebc43d;
    }

    .license-expired .expired-license {
        display: flex;
        padding: 5px 10px;
    }
}
</style>