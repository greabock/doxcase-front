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
                        <source type="image/png" :srcset="defaultAvatar" media="(min-width:576px)" />
                        <source type="image/png" :srcset="defaultAvatar" />
                        <img class="object-fit-js" :src="defaultAvatar" alt="" />
                    </picture>
                    <!-- /picture-->
                </div>
            </div>
            <div class="col">
                <div class="h1">{{ user?.name }}</div>
                <div class="small mb-1"><strong>Отдел:</strong> Департамент логистики</div>
                <div class="small mb-1"><strong>Должность:</strong> Менеджер</div>
                <div class="small mb-1">
                    <a href="#">{{ user?.email }}</a>
                </div>
            </div>
            <div class="sCabinetAside__footer mt-3 d-none d-lg-block">
                <span @click="handleLogout" style="cursor: pointer" class="text-body small">Выйти из аккаунта</span>
            </div>
        </div>
    </div>
</template>

<script>
import {useAuth} from '@/hooks/useAuth';
import {ref} from 'vue';

export default {
    props: {
        user: {
            type: Object,
        },
    },
    setup(props) {
        const {handleLogout} = useAuth();
        const defaultAvatar = ref('img/@1x/avatar-2.png');
        if (props.user?.avatar) {
            defaultAvatar.value = ref(props.user.avatar);
        }
        return {
            handleLogout,
            defaultAvatar,
        };
    },
};
</script>
