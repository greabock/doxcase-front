<template>
    <div class="sCabinetAside section" id="sCabinetAside">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item">
                    <router-link to="/" itemprop="item"><span itemprop="name">Главная</span> </router-link>
                </li>
                <li class="breadcrumb-item active">
                    <a href="#" itemprop="item"><span itemprop="name">Личные данные</span> </a>
                </li>
            </ol>
        </nav>
        <div class="row">
            <div class="col-lg-12 col-auto">
                <div class="sCabinetAside__img-wrap bg-wrap">
                    <!-- picture-->
                    <picture class="picture-bg">
                        <source type="image/png" :srcset="avatar" media="(min-width:576px)" />
                        <source type="image/png" :srcset="avatar" />
                        <img class="object-fit-js" :src="avatar" alt="" />
                    </picture>
                    <!-- /picture-->
                </div>
            </div>
            <div class="col">
                <div class="h1">{{ user?.name }}</div>
                <div class="small mb-1">
                    <a href="#">{{ user?.email }}</a>
                </div>
            </div>
            <div class="sCabinetAside__footer mt-3">
                <span @click="handleLogout" style="cursor: pointer" class="text-body small">Выйти из аккаунта</span>
                <br />
                <br />
<!--                <button-->
<!--                    @click="deleteLicense" class="btn btn-sm btn-danger">Обнулить лицензию-->
<!--                </button>-->
            </div>
        </div>
    </div>
</template>

<script>
import {useAuth} from '@/hooks/useAuth';
import {computed} from 'vue';
import licenseService from '@/services/license.service';

export default {
    props: {
        user: {
            type: Object,
        },
    },
    setup(props) {
        const {handleLogout} = useAuth();
        const avatar = computed(() => {
            if (props.user?.photo !== null ) {
                return props.user?.photo;
            } else {
                return 'img/@1x/avatar-2.png'
            }
        });

        const deleteLicense = async () => {
            await licenseService.deleteLicense();
        }

        return {
            handleLogout,
            avatar,
            deleteLicense
        };
    },
};
</script>
<style scoped>
.sCabinetAside__img-wrap {
  margin-bottom: 30px;
}
</style>
