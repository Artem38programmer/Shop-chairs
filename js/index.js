//Количество продуктов на страницу. Используется как глобальная переменная
const PRODUCTS_PER_PAGE = 15

//Контейнер с товарами
const productsPlaceElement = document.getElementById('js-product')

//Создание или загрузка базы на n объектов. Используется как глобальная переменная. Прошлое значение необходимо удалить из локалстораджа, чтобы записалось новое
const productsDatabase = Database.loadDatabase(3000)

//Глобальная переменная, показывающая используемый в данный момент массив
let currentDatabase = productsDatabase

//Глобальная переменная с количеством страниц текущего массива
let pageCount = pageCounter(currentDatabase)

//Загрузить корзину
Store.loadStore()

//Показываем список товаров
Database.makeProductsList()

//Показываем пагинацию
Pagination.makePagination()

//Вычислить количество, отображаемых страниц
function pageCounter(arr) {
    return Math.ceil(arr.length / PRODUCTS_PER_PAGE)
}
