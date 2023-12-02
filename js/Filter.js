(function () {
    'use strict'

    //Событие открытия/закрытия фильтра 
    document.querySelector('.js-dropdown-button').addEventListener('click', function (event) {
        const target = event.target.nextElementSibling.classList
        const active = 'dropdown--active'

        target.toggle(active)
    })

    //Назначение события на элементы фильтра
    const dropdownItems = document.querySelectorAll('.js-dropdown-select')

    //Перебираем все элементы фильтра и назначакем обработчик
    for (let elem of dropdownItems) {
        elem.addEventListener('click', function (event) {
            const target = event.target
            const selectedValue = target.getAttribute('filter-data') //аттрибут для выбора режима фильтра
            const selectedText = target.innerHTML
            const mainElem = target.parentElement

            //Вставка текста в окно фильтра
            mainElem.previousElementSibling.innerHTML = selectedText

            mainElem.classList.remove('dropdown--active')

            //Обнуляет сортировку
            if (document.querySelector('.js-sort-active')) {
                document.querySelector('.js-sort-active').classList.remove('js-sort-active')
            }

            if(document.querySelector('.js-sort-color')){
                document.querySelector('.js-sort-color').classList.remove('js-sort-color')
            }

            useAvailablesFilter(selectedValue)

        })
    }

    //Функция изменения списка товаров в зависимости от значения фильтра
    function useAvailablesFilter(importance) {
        let currentValue = []

        //Переназначение текущего массива в зависимости от значения фильтра
        switch (importance) {
            case 'available':
                currentValue = productsDatabase.filter(item => item.available == true)
                break;

            case 'unavailable':
                currentValue = productsDatabase.filter(item => item.available == false)
                break;

            default:
                currentValue = productsDatabase
        }

        Database.deleteProducts()
        Pagination.deletePagination()

        //Изменение, отображаемого на странице массива
        currentDatabase = currentValue
        pageCount = pageCounter(currentValue)

        Database.makeProductsList()
        Pagination.makePagination()
    }

    //Закрытие фильтра по клику на другую область
    window.addEventListener('click', event => {
        const target = event.target
        if(!document.querySelector('.filter').contains(target)) {
            document.querySelector('.filter__dropdown').classList.remove('dropdown--active')
        }
    })
}())