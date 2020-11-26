# ultramar-server

##Описание rest-запросов

###Авторизация

---
***/auth**(**@RequestBody* String userName, String password)* - проводит проверку существования и правильности указанной пары логин/пароль.

Возвращает (*User*) - объект с данными id, userName пользователя

* {
* "id": 3,
* "userName": "admin",
* "password": null
* }

*Параметры:*
* userName (*String*) - ID родителя/родительской строки
* password (*String*) - наименование файла/папки

---

***/getrole**(**@RequestBody* Integer id)* - возвращает массив ID ролей по указанному ID пользователя.

Возвращает (*Array(id)*) - объект с данными id, userName пользователя

* [
*   {
* "id": 1
* }
* ],

*Параметры:*
* id (*int*) - ID пользователя

---

###Работа с файловым хранилищем

##Работа с медиа-контентом

---
***/uploadmedia**(**@RequestParam* File file, String name, String type, Integer userId) - добавляет Видео или Фото в зависимости от переданного параметра type.

Возвращает (int id) - ID добавленного документа

* 51

*Параметры:*
* Content type: multipart/form-data
* file (*File*) - файл медиа-контента 
* name (*String*) - наименование документа на портале
* type (*String*) - тип документа. Значения -  ***video/photo***
* userId (*int*) - ID пользователя

---

***/getmedia**(**@RequestBody* String type) - возвращает массив медиа-контента по указанному типу.

Возвращает (Array(Files)) - массив объектов с данными по загруженному медиа-контенту

* [
*   {
* "id": 50,
* "parentid": null,
* "docName": "test",
* "fileName": "f0d50",
* "origName": "20181201_231706.jpg",
* "author": " admin",
* "type": "photo",
* "uploadDate": "2020-04-09",
* "file": true
* },
*   {
* "id": 51,
* "parentid": null,
* "docName": "testImage",
* "fileName": "f0d51",
* "origName": "20181201_231706.jpg",
* "author": " admin",
* "type": "photo",
* "uploadDate": "2020-04-09",
* "file": true
* }
* ]

*Параметры:*
* Content type: application/json
* type (String) - тип медиа-контента. Значения - ***video/photo*** 

---

***/download**(**@RequestBody* int id) - возвращает файл из сервера по указанному id

Возвращает файл

*Параметры:*
* Content type: application/json
* id (int) - ID документа 

---
