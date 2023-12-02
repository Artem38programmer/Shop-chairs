(function () {
    'use strict'

    const Database = {}
    window.Database = Database

    //Создание базы данных
    function makeDatabase(productsQuantity) {
        const database = []
        
        // Счётчик для вставки айди
        function makeCounter() {
            let currentCount = 1

            return function () {
                return currentCount++
            }
        }

        let counter = makeCounter()

        //Функция-конструктор для создания товаров в начальной базе данных
        function Product() {
            this.id = counter()
            this.title = `Стул_${this.id}`
            this.image = `images/chair-${(() => Math.floor(Math.random() * 3 + 1))()}.jpg`
            this.descr = 'Супер стул'
            this.price = (() => Math.floor(Math.random() * 500 + 2500))()
            this.available = (() => Math.random() > 0.50 ? true : false)()
        }

        //Счётчик для создания массива товаров
        for (let i = 0; i < productsQuantity; i++) {
            database.push(new Product())
        }

        return database
    }

    // Загрузка или создание базы данных
    Database.loadDatabase = function loadDatabase(count) {
        //Если страница запущена впервые
        if (localStorage.getItem('productsDatabase') == null) {   
            const database = makeDatabase(count)
            const savedDatabase = JSON.stringify(database);

            localStorage.setItem('productsDatabase', savedDatabase)

            return database
        }
        //Загрузка уже имеющихся данных
        else {
            return JSON.parse(localStorage.getItem('productsDatabase'));
        }
    }

    //Создать и разместить товары
    Database.makeProductsList = function makeProductsList() {
        for (let i = 0; i < PRODUCTS_PER_PAGE; i++) {
            const html = Card.getHTML(currentDatabase[i]);
            productsPlaceElement.append(html)
        }     
    }

    //Удалить список товаров
    Database.deleteProducts = function deleteProducts() {
        while (productsPlaceElement.firstChild) {
            productsPlaceElement.removeChild(productsPlaceElement.firstChild);
        }
    }

}());



