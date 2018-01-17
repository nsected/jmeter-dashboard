# Jmeter-dashboard

This dashboard displays jmeter test results in a visual form

Эта контрольная панель отображает результаты тестов jmeter в наглядном виде.

Демо: http://ec2-18-221-224-74.us-east-2.compute.amazonaws.com:3000

Jtl файлы jmeter загружаются при помощи backend/push_jmeter_results.js

>Установка: 
* npm install
* npm run build
* npm run express_start
* mongorestore dump/ для восстановления демо базы

![alt tag](https://i.imgur.com/XjiU09c.png "Список сборок")
Список сборок по проекту

![alt tag](https://i.imgur.com/cmB3MiO.png "Просмотр сборки")
Просмотр информации по сборке
