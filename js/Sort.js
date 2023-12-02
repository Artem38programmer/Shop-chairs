(function(){
    //Используемые дом-объекты
    const byName = 'js-sort-by-name'
    const byPrice = 'js-sort-by-price'  
    const active = 'js-sort-active'
    const color = 'js-sort-color'
    
    //Сортировка по имени
    document.querySelector(`.${byName}`).addEventListener('click', function () {
        //Копирование массива, чтобы не было проблемы с его верным отображением
        let innerDatabase = JSON.parse(JSON.stringify(currentDatabase))

        //Следующие два условия — обнуление результатов других видов сортировки
        if(document.querySelector(`.${color}`)){
            document.querySelector(`.${color}`).classList.remove(color)
        }

        for(item of document.querySelectorAll(`.${active}`)) {
            if(!item.classList.contains(byName)) {
                item.classList.remove(active)
            }
        }
        
        //Функция сортировки от меньшего к большему
        if (document.querySelector(`.${byName}`).classList.contains(active)) {
            innerDatabase.sort((a,b) => {
                if(a.title>b.title) {
                    return -1
                }else if(a.title<b.title) {
                    return 1
                }else {
                    return 0
                }
            })

            //Добавление классов цвета и функционального
            document.querySelector(`.${byName}`).classList.remove(active)
            document.querySelector(`.${byName}`).classList.add(color)
    
        } else {
        //Сортировка от большего к меньшему
            innerDatabase.sort((a,b) => {
                if(a.title>b.title) {
                    return 1
                }else if(a.title<b.title) {
                    return -1
                }else {
                    return 0
                }
            })
            document.querySelector(`.${byName}`).classList.add('js-sort-active')
        }
        
        //Замена текущего массива продуктов
        currentDatabase = innerDatabase

        //Функции сами говорят за себя
        Database.deleteProducts()
        Database.makeProductsList()
    
        Pagination.deletePagination()
        Pagination.makePagination()
    })

     //Сортировка по ценнику
    document.querySelector(`.${byPrice}`).addEventListener('click', function () {
        //Копирование массива, чтобы не было проблемы с его верным отображением
        let innerDatabase = JSON.parse(JSON.stringify(currentDatabase))

        //Следующие два условия — обнуление результатов других видов сортировки
        if(document.querySelector(`.${color}`)){
            document.querySelector(`.${color}`).classList.remove(color)
        }

        //Функция сортировки от меньшего к большему
        for(item of document.querySelectorAll(`.${active}`)) {
            if(!item.classList.contains(byPrice)) {
                item.classList.remove(active)
            }
        }

        //Добавление классов цвета и функционального
        if (document.querySelector(`.${byPrice}`).classList.contains(active)) {
            innerDatabase.sort((a, b) => b.price - a.price)
            document.querySelector(`.${byPrice}`).classList.remove(active)
            document.querySelector(`.${byPrice}`).classList.add(color)
            
        } else {
            //Сортировка от большего к меньшему
            innerDatabase.sort((a, b) => a.price - b.price)
            document.querySelector(`.${byPrice}`).classList.remove(color)
            document.querySelector(`.${byPrice}`).classList.add(active)
        }

        //Замена текущего массива продуктов
        currentDatabase = innerDatabase

        //Функции сами говорят за себя
        Database.deleteProducts()
        Database.makeProductsList()
    
        Pagination.deletePagination()
        Pagination.makePagination()
    
    })
}())