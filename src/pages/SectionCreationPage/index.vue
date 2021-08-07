<template>
    <main class="main-block">
        <!-- start sCabinet-->
        <section class="sCabinet section py-0" id="sCabinet">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-aside col-lg-auto d-flex flex-column">
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item">
                                    <a href="/" itemprop="item"
                                        ><span itemprop="name">Главная</span> <meta itemprop="position" content="1"
                                    /></a>
                                </li>
                                <li class="breadcrumb-item">
                                    <a href="#" itemprop="item"
                                        ><span itemprop="name">Разделы</span> <meta itemprop="position" content="2"
                                    /></a>
                                </li>
                                <li class="breadcrumb-item active">
                                    <a href="#" itemprop="item"
                                        ><span itemprop="name">Создать новый проект/материал</span>
                                        <meta itemprop="position" content="3"
                                    /></a>
                                </li>
                            </ol>
                        </nav>
                        <!-- start sSectionAside-->
                        <div class="sSectionAside section" id="sSectionAside">
                            <div class="pb-1">
                                <h1>Новый раздел</h1>
                            </div>
                            <div class="form-wrap">
                                <div class="form-wrap__input-wrap form-group">
                                    <label
                                        ><span class="form-wrap__input-title">Название раздела</span
                                        ><input
                                            class="form-wrap__input form-control"
                                            name="text"
                                            type="text"
                                            placeholder="Заполнить"
                                        />
                                    </label>
                                </div>
                                <!-- +e.input-wrap-->
                                <p class="fw-500">Изображние раздела</p>
                                <div class="small text-dark mb-1">
                                    Только svg или png c соотношеием сторон 1:1 не более 100 кБ
                                </div>
                                <div class="row align-items-center">
                                    <div class="col-auto mb-3">
                                        <button class="form-wrap__btn-choose">Выбрать...</button>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="custom-input form-check"
                                        ><input
                                            class="custom-input__input form-check-input"
                                            name="checkbox"
                                            type="checkbox"
                                            checked="checked"
                                        /><span class="custom-input__text form-check-label"
                                            >Использовать как справочник</span
                                        >
                                    </label>
                                    <label class="custom-input form-check"
                                        ><input
                                            class="custom-input__input form-check-input"
                                            name="checkbox"
                                            type="checkbox"
                                            checked="checked"
                                        /><span class="custom-input__text form-check-label"
                                            >Отображать в навигации</span
                                        >
                                    </label>
                                </div>
                                <div class="d-lg-none">
                                    <button
                                        class="btn btn-outline-primary w-100"
                                        type="button"
                                        data-fancybox="data-fancybox"
                                        data-src="#modal-filter"
                                    >
                                        Настроить фильтры для раздела
                                    </button>
                                </div>
                                <div class="form-wrap__modal-win" id="modal-filter">
                                    <p class="fw-500">Фильтры для раздела</p>
                                    <div class="form-wrap__text small text-dark">
                                        Выберите допустимые для фильтрации поля&nbsp;из&nbsp;добавленных
                                    </div>
                                    <div class="form-wrap__input-wrap form-group">
                                        <div class="form-wrap__input form-select toggle-dropdown">Выберите поле</div>
                                        <div class="form-wrap__dropdown">
                                            <div class="form-wrap__dropdown-item">
                                                <label class="dropdown-custom-input">
                                                    <input type="checkbox" name="" /><span
                                                        class="dropdown-custom-input__title"
                                                    >
                                                        Контрагент</span
                                                    ><span class="dropdown-custom-input__circle"></span>
                                                </label>
                                            </div>
                                            <div class="form-wrap__dropdown-item">
                                                <label class="dropdown-custom-input">
                                                    <input type="checkbox" name="" /><span
                                                        class="dropdown-custom-input__title"
                                                    >
                                                        Локация</span
                                                    ><span class="dropdown-custom-input__circle"></span>
                                                </label>
                                            </div>
                                            <div class="form-wrap__dropdown-item">
                                                <label class="dropdown-custom-input">
                                                    <input type="checkbox" name="" /><span
                                                        class="dropdown-custom-input__title"
                                                        >Обучение</span
                                                    ><span class="dropdown-custom-input__circle"></span>
                                                </label>
                                            </div>
                                            <div class="form-wrap__dropdown-item">
                                                <label class="dropdown-custom-input">
                                                    <input type="checkbox" name="" /><span
                                                        class="dropdown-custom-input__title"
                                                        >Файлы от менеджера</span
                                                    ><span class="dropdown-custom-input__circle"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-wrap__footer">
                                        <button class="btn btn-primary">
                                            Сохранить <span class="d-none d-lg-inline">раздел</span>
                                        </button>
                                        <button class="btn btn-outline-primary">Отмена</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- end sSectionAside-->
                    </div>
                    <div class="col col--main">
                        <!-- start sSectionMain-->
                        <section class="sSectionMain section" id="sSectionMain">
                            <div class="row">
                                <div class="col">
                                    <h3>Конструктор полей для добавления материалов</h3>
                                </div>
                                <div class="col-auto d-none d-lg-block">
                                    <div class="btn-add">
                                        <div class="btn-add__plus"></div>
                                        <div class="btn-add__text">Добавить</div>
                                    </div>
                                </div>
                            </div>
                            <div class="sSectionMain__body">
                                <div class="sSectionMain__item disabled">
                                    <div class="row">
                                        <div class="col-lg-auto col order-first">
                                            <div class="sSectionMain__count">1</div>
                                        </div>
                                        <div class="sSectionMain__col-title col-lg-auto">
                                            <div class="text-dark small">Заголовок</div>
                                            <div class="fw-500 text-primary">Название материала</div>
                                        </div>
                                        <div class="sSectionMain__col-content col-lg">
                                            <div class="text-dark small">Содержание</div>
                                            <div class="sSectionMain__content">
                                                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Debitis nam
                                                amet assumenda, laudantium molestias officia odio quis veritatis
                                                consequuntur sapiente cum omnis facere corporis, expedita quasi neque
                                                vel at dignissimos sit placeat ipsam. Tenetur molestias totam velit
                                                maxime dolorum quibusdam nostrum labore illum ab omnis est dignissimos
                                                deserunt minus ducimus quidem repellat vitae, illo ipsum sit alias
                                                veritatis rem expedita qui cum. Eaque dolorem animi sit rem iure beatae
                                                aliquam blanditiis libero laborum sint odit nulla debitis, perferendis
                                                minus est consequuntur fuga, totam inventore enim laboriosam corporis?
                                                Sequi, aliquam. Veniam, optio! Ut accusamus possimus doloremque?
                                                Doloremque exercitationem, expedita fugit quod sunt ab id obcaecati
                                                harum commodi quaerat dolore voluptas fuga nihil laboriosam repellendus
                                                excepturi dolores incidunt voluptatibus labore? Earum atque assumenda ad
                                                veritatis, deserunt qui, labore eos quibusdam rem distinctio incidunt
                                                velit natus aliquid doloribus quaerat commodi in autem! Assumenda ex
                                                porro libero fuga velit corrupti quae facere harum placeat beatae vel,
                                                rem maxime vitae, repudiandae eaque laboriosam ipsam, ipsa consectetur.
                                                Explicabo, porro? Perspiciatis quidem ex vel, totam sequi tenetur hic
                                                minima, ad porro debitis, blanditiis quam laborum dolor voluptatem.
                                                Maiores fuga voluptatum, rem mollitia dolorem magnam eveniet ipsa
                                                perferendis culpa quasi accusamus molestiae earum unde possimus
                                                voluptatem minus neque.
                                            </div>
                                        </div>
                                        <div class="sSectionMain__col-cut col-auto order-first order-lg-0">
                                            <div class="text-dark small d-none d-lg-block">Тип поля</div>
                                            <div class="sSectionMain__content">Короткое текстовое поле</div>
                                        </div>
                                        <div class="col-12 d-lg-none pb-3"></div>
                                        <div class="col-lg-auto">
                                            <div class="sSectionMain__btn-control"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="d-lg-none">
                                <div class="mb-3">
                                    <div class="btn-add">
                                        <div class="btn-add__plus"></div>
                                        <div class="btn-add__text">Добавить</div>
                                    </div>
                                </div>
                                <div class="sSectionAside__footer">
                                    <button class="btn btn-primary">Сохранить раздел</button>
                                    <button class="btn btn-outline-primary ms-2">Отмена</button>
                                </div>
                            </div>
                        </section>
                        <!-- end sSectionMain-->
                    </div>
                </div>
            </div>
        </section>
        <!-- end sCabinet-->
    </main>
</template>

<script>
export default {};
</script>

<style scoped></style>
