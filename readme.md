
This application provides an example of:
1. Building a complete RESTful API in PHP using the Slim framework.
2. Consuming these services using RiotJS & jquery

Set Up API:

1. Create a MySQL database name "slim-api".
2. Execute slim-api.sql to create and populate the "news" table:

	mysql slim-api -u root < slim-api.sql

3. Deploy the webapp included in this repository.
4. Open api/index.php. In the getConnection() function at the bottom of the page, make sure the connection parameters match your database configuration.
5. Access the application in your browser. For example: http://localhost/slim-api/api.


Set Up RiotJS:
1. Open tag/new-table.js make sure the connection parameters match your API Url in rootUrl
2. Access the application in your browser. For example: http://localhost/slim-api/ 

Postman API
https://www.getpostman.com/collections/508f96310f270dc15208

Regards,
Rian Firandika