// подкдючаем http-модуль
const http = require('http')

//укажем hostname. 
// если веб-сервер прослушивает 0.0.0.0, 
//то любой в Интернете (в нашем случае контейнер)
// сможет подключиться к нашему серверу, 
//введя в браузере IP-адрес нашего сервера.
//а установленный localhost (127.0.0.1) это не позволит сделать.
const hostname = "0.0.0.0"

// приложение будет работать на определенном порту компьютера
const port = 3000

//метод createServer возвращает объект http.
//req - request: хранит информацию о запросе
//res - response: управляет отправкой ответа
const server = http.createServer((req, res) => {
    // => стрелочные функции позволяют кратко 
    // описывать ф-ии, похоже на лямбды в Python и C++

    //"The HTTP 200 OK" - GET-запрос выполнен успешно 
    res.statusCode = 200;
    //добавим заголовок с явным указанием mime-type содержимого
    res.setHeader('Content-Type', 'text/plain')

    //отправляем http-ответ на get-запрос
    res.end('Hello from Node.js!')
})

// запускаем сервер-приложение.
// вначале прослушаем подключения на указанном нами порту 
server.listen(port, hostname, () => {
 // метод для печати в консоль браузера
  console.log(`Приложение запущено на http://localhost:${port}`)
})
