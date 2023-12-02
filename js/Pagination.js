
(function () {
    'use strict'

    const Pagination = {}
    const activeClass = 'pagination__button--active'
    const skippedPages = `<button class="pagination__button pagination__button--more js-not-button">...</button>`
    const container = document.getElementById('pagination__list')

    window.Pagination = Pagination

    //Переход при клике 
    Pagination.move = function move(event) {
        const clicked = event.target
        const clickedId = parseInt(clicked.getAttribute('page-id'))
        const currentButton = document.querySelector('.pagination__button--active')
        const currentId = parseInt(currentButton.getAttribute('page-id'))

        //Удаление и назначение класса, отвечающего за цвет активного элемента и позиционирование в целом
        currentButton.classList.remove(activeClass)
        clicked.classList.add(activeClass)

        changeProductsList(clickedId)

        //Если нажатая страница уже выбрана
        if (currentId == clickedId) {
            return false
        }

        //Выбор скролла вперед или назад в зависимости от того, куда было совершено нажатие по отношению к текущему активному элементу
        currentId > clickedId ? scrollBackward(clickedId, currentId) : scrollForward(clickedId, currentId)
    }

    //Кнопка вперед
    Pagination.moveForward = function moveForward() {
        const currentButton = document.querySelector('.pagination__button--active')
        const clicked = currentButton.nextElementSibling

        //Если кнопка - последняя страница
        if (currentButton.nextElementSibling == null) {
            return false
        }

        //Во всех других случаях
        currentButton.classList.remove(activeClass)
        clicked.classList.add(activeClass)
        const clickedId = clicked.getAttribute('page-id')

        //скролл пейджбара вперед
        scrollForward(clickedId);
        //Смена страницы с товарами
        changeProductsList(clickedId);

    }

    //Кнопка назад
    Pagination.moveBackward = function moveBackward() {
        const currentButton = document.querySelector('.pagination__button--active')
        const clicked = currentButton.previousElementSibling;

        //Если кнопка - 1 страница
        if (currentButton.previousElementSibling == null) {
            return false
        }

        //Во всех других случаях
        currentButton.classList.remove(activeClass)
        clicked.classList.add(activeClass)
        const clickedId = clicked.getAttribute('page-id')

        //скролл пейджбара назад
        scrollBackward(clickedId);
        //Смена страницы с товарами
        changeProductsList(clickedId);

    }

    //Создать пагинацию
    Pagination.makePagination = function makePagination() {
        //Шаблон кнопки
        const buttonTemplate = `
        <button 
            class="pagination__button"
            page-id="%ID%"
            onclick="Pagination.move(event)">
            %ID%
        </button>
        `

        //Размещаем кнопки в контейнере. Не более 5 штук.
        for (let i = 1; i <= pageCount && i < 6; i++) {
            //Если первые 3 кнопки или всего 5 страниц
            if (pageCount < 6 || i <= 3) {
                const pageButton = buttonTemplate.replace('%ID%', i)
                    .replace('%ID%', i)
                container.insertAdjacentHTML('beforeend', pageButton)
            }

            //Если последняя кнопка
            else if (i == 5){
                const pageButton = buttonTemplate.replace('%ID%', pageCount)
                    .replace('%ID%', pageCount)
                container.insertAdjacentHTML('beforeend', pageButton)
            }

            //Добавление ... иконки
            else {
                container.insertAdjacentHTML('beforeend', skippedPages)
            }

        }

        container.firstElementChild.classList.add('pagination__button--active')
    }

    //Удалить пагинацию
    Pagination.deletePagination = function deletePagination() {
        const productsPagination = document.getElementById('pagination__list')

        while (productsPagination.firstChild) {
            productsPagination.removeChild(productsPagination.firstChild)
        }
    }

    //Смена списка на экране при переходе на другую страницу
    function changeProductsList(id) {
        //Удаление текуших товаров/
        Database.deleteProducts()

        //Выбор страницы с товарами
        const requstedPage = PRODUCTS_PER_PAGE * id;

        //Добавление новых
        for (let i = requstedPage - PRODUCTS_PER_PAGE; i < requstedPage; i++) {
            const html = Card.getHTML(currentDatabase[i]);
            productsPlaceElement.append(html)
        }
    }

    //Скрол пейджбара вперед
    function scrollForward(clickedId, currentId) {
        //Если страниц с товарами больше 5
        if (pageCount > 5) {
            // Если текущая страница является предпоследней, то добавить ссылку на первую страницу
            if (clickedId >= pageCount - 1 && currentId != pageCount - 1) { //Если последние 2 страницы и при этом переход происходит не с предпоследней страницы
                container.firstElementChild.remove()
                container.firstElementChild.remove()

                //Если клик сразу на последнюю страницу
                if (clickedId == pageCount) {
                    //Удаляем и вставляем еще две кнопки.
                    container.firstElementChild.remove()
                    container.firstElementChild.remove()
                    container.insertAdjacentHTML('afterbegin', `<button class="pagination__button" page-id="${parseInt(clickedId) - 1}" onclick="Pagination.move(event)">${parseInt(clickedId) - 1}</button>`)
                    container.insertAdjacentHTML('afterbegin', `<button class="pagination__button" page-id="${parseInt(clickedId) - 2}" onclick="Pagination.move(event)">${parseInt(clickedId) - 2}</button>`)
                }

                //Добавление значка ... и кнопки первой страницы вначало 
                container.insertAdjacentHTML('afterbegin', skippedPages)
                container.insertAdjacentHTML('afterbegin', `<button class="pagination__button" page-id="1" onclick="Pagination.move(event)">1</button>`)

            // Если страница является 2 с конца, то убрать ... и добавить номер страницы вместо этого
            } else if (clickedId == pageCount - 2) {
                document.querySelector('.js-not-button').insertAdjacentHTML('beforebegin', `<button class="pagination__button" page-id="${parseInt(clickedId) + 1}" onclick="Pagination.move(event)">${parseInt(clickedId) + 1}</button>`)
                document.querySelector('.js-not-button').remove()

            //Обычный скролл страницы вперед
            } else if (clickedId < pageCount - 2 && clickedId != 2) {
                container.firstElementChild.remove()
                document.querySelector(`[page-id="${clickedId}"]`).insertAdjacentHTML('afterend', `<button class="pagination__button" page-id="${parseInt(clickedId) + 1}" onclick="Pagination.move(event)">${parseInt(clickedId) + 1}</button>`)
            }
        }
    }

    //Скрол пейджбара назад
    function scrollBackward(clickedId, currentId) {
        //Если страниц с товарами больше 5
        if (pageCount > 5) {
            //если страница 2 с конца, то убрать ... и добавить ссылку на первую страницу
            if (clickedId == pageCount - 2) {
                container.firstElementChild.remove()
                container.firstElementChild.remove()
                container.insertAdjacentHTML('afterbegin', `<button class="pagination__button" page-id="${parseInt(clickedId) - 1}" onclick="Pagination.move(event)">${parseInt(clickedId) - 1}</button>`)
                container.insertAdjacentHTML('afterbegin', `<button class="pagination__button" page-id="${parseInt(clickedId) - 2}" onclick="Pagination.move(event)">${parseInt(clickedId) - 2}</button>`)
            }
            //если клик с последних на 1 элемент, то выстраиваем стандартную пагинацию
            else if (clickedId == 1 && currentId >= pageCount - 2) {
                const paginationArr = container.querySelectorAll('button').length
                let i = 0

                //Удалить все старые кнопки со страницами
                while(i < paginationArr) {
                    container.firstElementChild.remove()
                    i++
                }

                //Добавить новые
                Pagination.makePagination()
            } else {
                /*Обычный случай скролла пейджбара
                  Добавить в конец пейдж бара ... */
                if (clickedId == pageCount - 4) {
                    container.lastElementChild.previousElementSibling.remove()
                    container.lastElementChild.insertAdjacentHTML('beforebegin', skippedPages)
                }

                //Скролл
                if (clickedId < pageCount - 3 && clickedId != 1) {
                    container.insertAdjacentHTML('afterbegin', `<button class="pagination__button" page-id="${parseInt(clickedId) - 1}" onclick="Pagination.move(event)">${parseInt(clickedId) - 1}</button>`)
                    document.querySelector('.js-not-button').previousElementSibling.remove()
                }
            }
        }
    }
}());