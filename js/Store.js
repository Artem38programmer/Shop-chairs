(function () {
    "use strict"

    const Store = {}
    window.Store = Store

    //счётчик товаров в магазине
    let productsQuantity = 0
    let currentPrice
    let lastProductId = 0

    window.lastProductId = lastProductId

    // Добавляет метод, добавляющий товар
    Store.addProduct = function addProduct(event, id) {
        const target = event.target
        //Карточка товара
        const item = target.parentElement.parentElement
        //Объект с данными товара
        const product = {
            price: item.querySelector('.js-price').innerHTML,
            id: id,
            title: item.querySelector('.js-title').innerHTML,
            img: item.querySelector('.js-image').getAttribute('src')
        }

        // Увеличение счетчика товаров в корзине
        productsQuantity++
        // Запоминание айди последнего элемента
        lastProductId = id

        target.classList.add('button--active')

        //Если товар уже добавлен
        if (checkAlreadyAddedItems(product.id)) {
            const added = document.getElementById('js-store-container').querySelector(`[card-id="${product.id}"]`);

            //Если добавляется 2й товар одного типа
            if (added.querySelector('.js-store-quantity') == null) {
                added.querySelector('.js-store-text').insertAdjacentHTML('beforeend', '<span class="store-item__quantity js-store-quantity">x2</span>');
            }

            //Если добавляется более 2х товаров
            else {
                let quantity = added.querySelector('.js-store-quantity').innerHTML;
                quantity = parseInt(quantity.match(/\d+/));
                quantity++;
                added.querySelector('.js-store-quantity').innerHTML = `x${quantity}`;
            }

            //Общая сумма и количество
            sumPrice(product.price);
            Store.showProductsQuantity(item)
            showMobileQuantity()
            saveStore()

            return;
        }

        //Сделать и вставить карточку в корзину, если это первый товар подобного типа
        const storeCard = createProduct(product)

        document.getElementById('js-store-container').insertAdjacentHTML('beforeend', storeCard)

        Store.showProductsQuantity(item)
        sumPrice(product.price);
        showMobileQuantity()
        saveStore()
    }

    //Метод для удаления карточки из корзины
    Store.deleteProduct = function deleteProduct(id) {
        const item = document.getElementById('js-store-container').querySelector('[card-id="' + id + '"]');
        const quantity = item.querySelector('.js-store-quantity');
        const price = -item.getAttribute('price');

        const alreadyAddedItem = document.getElementById('js-product').querySelector('.product-card__quantity')

        //Убирает отображение количества предметов в корзине
        if (alreadyAddedItem) {
            alreadyAddedItem.previousElementSibling.classList.remove('button--active')
            alreadyAddedItem.remove()
        }

        //Уменьшает количество товаров в магазине
        productsQuantity--
        // Убираем отображение количества товара в карточке при загрузке
        lastProductId = 0

        //Если существует несколько товаров одного типа
        if (quantity) {
            let quantityText = quantity.innerHTML;
            quantityText = parseInt(quantityText.match(/\d+/));
            quantityText--;

            if (quantityText == 1) {
                quantity.remove();
            }

            quantity.innerHTML = `x${quantityText}`;

            sumPrice(price);
            saveStore()

            return;
        }

        //Если один товар такого типа
        sumPrice(price);
        item.remove();
        saveStore()
        showMobileQuantity()

        return;

    }

    //Загрузка локал стораджа
    Store.loadStore = function loadStore() {
        //Если есть запись в хралищие
        if (localStorage.getItem('Store')) {
            //Шаблон карточки
            const cardTemplate = `
            <li class="store-item js-store-item" card-id="%ID%" price="%PRICE%">
                <img class="store-item__image js-store-img" src="%IMG%" alt="%TITLE%
                ">
                <div class="title store-item__text js-store-text">
                    <span class="store-item__name js-store-name">%TITLE%
                    </span>
                    %QUANTITY%
                </div> 
                <button class="store-item__button js-delete-button" onclick="Store.deleteProduct(%ID%)">
                </button>
            </li>
            `

            //Загрузка строки из локал стораджа
            const savedStore = JSON.parse(localStorage.getItem('Store'))

            //Переназначение количества товаров, общей цены, последнего купленного товара
            productsQuantity = savedStore.productsQuantity
            currentPrice = savedStore.totalPrice
            lastProductId = savedStore.lastProductId

            window.lastProductId = lastProductId

            //перебор массива с данными карточками и их выстраивание
            for (const item of savedStore.products) {
                let storeItem = cardTemplate.replace('%ID%', item.id)
                    .replace('%PRICE%', item.price)
                    .replace('%IMG%', item.img)
                    .replace('%TITLE%', item.title)
                    .replace('%TITLE%', item.title)
                    .replace('%ID%', item.id)

                if (item.quantity != null) {
                    storeItem = storeItem.replace('%QUANTITY%', `<span class="store-item__quantity js-store-quantity">${item.quantity}</span>`)
                } else {
                    storeItem = storeItem.replace('%QUANTITY%', '')
                }

                document.getElementById('js-store-container').insertAdjacentHTML('beforeend', storeItem)
            }

            //добавить отображение общей суммы в корзину
            document.querySelector('.js-total-sum').innerHTML = `${currentPrice} рублей`;

            showMobileQuantity()
            

        }

    }

    //Создать карточку для корзины
    function createProduct(product) {
        //Шаблон карточки
        const cardTemplate = `
        <li class="store-item js-store-item" card-id="%ID%" price="%PRICE%">
            <img class="store-item__image js-store-img" src="%IMG%" alt="%TITLE%">
            <div class="title store-item__text js-store-text">
                <span class="store-item__name js-store-name">%TITLE%
                </span>
            </div> 
            <button class="store-item__button js-delete-button" onclick="Store.deleteProduct(%ID%)">
            </button>
        </li>`

        //Заменить шаблон на данные карточки
        const storeElement = cardTemplate.replace('%ID%', product.id)
            .replace('%PRICE%', product.price)
            .replace('%IMG%', product.img)
            .replace('%TITLE%', product.title)
            .replace('%TITLE%', product.title)
            .replace('%ID%', product.id)

        return storeElement
    }

    //Сумма карточек
    function sumPrice(price) {
        const sumItem = document.querySelector('.js-total-sum');
        currentPrice = sumItem.innerHTML;

        currentPrice = parseInt(currentPrice.match(/\d+/));
        currentPrice += parseInt(price);

        sumItem.innerHTML = `${currentPrice} рублей`;
    }

    //Проверить наличие карточки в корзине
    function checkAlreadyAddedItems(id) {
        const added = document.getElementById('js-store-container').querySelector('[card-id="' + id + '"]');
        return added == null ? false : true;
    }

    //Надпись о количестве товара
    Store.showProductsQuantity = function showProductsQuantity(item) {
        //Отображается только для десктоп разрешения. Для остального — переходит в мобильный режим
        if (document.body.clientWidth > 1024) {
            const itemContainer = item.querySelector('.product-card__action')

            //Шаблон 
            const quantityTemplate = `
            <div class="product-card__quantity">
                Добавлено:
                <span class="product-card__quantity--color">
                    %QUANTITY% %PRODUCT%
                </span>
            </div>`

            //Преписка слова товар в конце фразы в зависимости от количества
            let quantityString = 'товар'

            if (productsQuantity < 5 && productsQuantity != 1) {
                quantityString += 'а'
            } else if (productsQuantity >= 5) {
                quantityString += 'ов'
            }

            //Замена шаблонных переменных в шаблоне
            const quantityItem = quantityTemplate.replace('%QUANTITY%', productsQuantity)
                .replace('%PRODUCT%', quantityString)

            //Изменить фразу, если несколько раз подряд добавили один и тот же предмет
            if (itemContainer.querySelector('.product-card__quantity')) {
                itemContainer.querySelector('.product-card__quantity').innerHTML = quantityItem

                return false
            }

            //Перенести фразу о добавлении в другую карточку
            const alreadyAddedItem = document.getElementById('js-product').querySelector('.product-card__quantity')

            if (alreadyAddedItem) {
                alreadyAddedItem.previousElementSibling.classList.remove('button--active')
                alreadyAddedItem.remove()
            }

            //Вставить блок с фразой
            itemContainer.insertAdjacentHTML('beforeend', quantityItem)
        }

    }

    //сохранение корзины
    function saveStore() {
        //пустой массив с товарами
        let savedProducts = []

        //занесение товаров в массив
        for (const item of document.querySelectorAll('.js-store-item')) {
            let storeObj = {
                'id': item.getAttribute('card-id'),
                'title': item.querySelector('.js-store-name').innerHTML.trim(),
                'price': item.getAttribute('price'),
                'img': item.querySelector('.js-store-img').getAttribute('src')
            }

            if (item.querySelector('.js-store-quantity')) {
                storeObj.quantity = item.querySelector('.js-store-quantity').innerHTML.trim()
            } else {
                storeObj.quantity = null
            }

            savedProducts.push(storeObj)
        }

        //создание объекта со всеми параметрами корзины
        const savedStore = {
            'products': savedProducts,
            'totalPrice': currentPrice,
            'productsQuantity': productsQuantity,
            'lastProductId': lastProductId
        }

        //загрузка в локал сторадж
        localStorage.setItem('Store', JSON.stringify(savedStore))
    }

    //Мобильное разрешение. Открытие и закрытие корзины
    document.querySelector('.js-store-mobile').addEventListener('click', () => {
        document.querySelector('.store').classList.add('active')
    })

    document.querySelector('.js-store-close').addEventListener('click', () => {
        document.querySelector('.store').classList.remove('active')
    })

    //Отображение количество товаров в мобильном разрешении
    function showMobileQuantity() {
        document.querySelector('.js-mobile-quantity').innerHTML = productsQuantity
    }
}())