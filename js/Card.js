(function () {
        'use strict'

        const Card = {}

        //Создает карточку продукта
        Card.getHTML = function getHTML(product) {
            const listElement = document.createElement('li')
            listElement.classList.add('product-card')
            listElement.setAttribute('available', product.available)
            listElement.innerHTML = cardTemplate.replace('%IMAGE%', product.image)
                .replace('%TITLE%', product.title)
                .replace('%TITLE%', product.title)
                .replace('%PRICE%', product.price)
                .replace('%DESCR%', product.descr)

            const actionContainer = listElement.querySelector('.product-card__action')

            //Отображение наличия товара в магазине. 
            if (listElement.getAttribute('available') == 'true') {
                actionContainer.innerHTML = availableProduct.replace('%ID%', product.id)
                
                //Добавиь надпись о количестве товаров в корзине на последний, добавленный в корзину товар.
                if (product.id == lastProductId && lastProductId != 0) {
                    Store.showProductsQuantity(listElement)
                    actionContainer.querySelector('.button').classList.add('button--active')
                }

                return listElement
            }

            actionContainer.innerHTML = unavailableProduct

            return listElement
        }

        window.Card = Card

        //Шаблон карточки
        const cardTemplate = `
        <div class="product-card__info">
            <img
                src="%IMAGE%"
                alt="%TITLE%"
                class="product-card__image js-image"/>
            <div class="product-card__text">
                <h4 class="product-card__title title js-title">
                    %TITLE%
                </h4>
                <span class="product-card__price price">
                    <span class="js-price">%PRICE%</span> рублей
                </span>
                <p class="product-card__description">
                    %DESCR%
                </p>
            </div>
        </div>
        <div class ="product-card__action">
        </div>`

        const availableProduct = ` 
        <button class="button js-add-button"
            onclick="Store.addProduct(event, %ID%)">
            Добавить в корзину
        </button>`

        const unavailableProduct = `
        <span class="product-card__unavailable">Товара нет в наличии</span>
        `
})();