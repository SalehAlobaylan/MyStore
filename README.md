# Launching Point Store

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![AmazonRDS](https://img.shields.io/badge/Amazon%20RDS-527FFF?style=for-the-badge&logo=Amazon%20RDS&logoColor=white)
![AWS S3](https://img.shields.io/badge/AWS%20S3-%23569A31.svg?style=for-the-badge&logo=amazon-s3&logoColor=white)
![AWS Elastic Beanstalk](https://img.shields.io/badge/AWS%20Elastic%20Beanstalk-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)

<img href="" src="https://github.com/SalehAlobaylan/MyStore/blob/main/ScreenShots/MyStore.png" alt="LoanIt" width="800"/>

<!-- - A store built with MEAN stack -->
- A store built with Angular connected with AWS postgres DB

<!-- - it's a simple demonstration website without authentication just checkout form and fouced in frontend with angular -->
- it contains products in the landing page with navigation bar to navigate to the cart or opposite,
- the header contains number of products calculator in the cart
- you can select number of same product that you want to add to the cart, also you can change it in the cart if you changed your mind after seeing the overall price
- User-friendly UX/UI
- user-friendly aesthetic Notifications 


## Running the Website:
        npm install
        
---
        npm run dev     

## ENV (only samples no real values, just to make you now how to)

```
- POSTGRES_HOST=exampledbname.x1y2z3sn9skh.us-east-1.rds.amazonaws.com


- POSTGRES_USERNAME=postgres


- POSTGRES_PASSWORD=exampledbpassword


- POSTGRES_DB=postgres


- POSTGRES_PORT=5432

```



Visit the site:
http://mystore-dev.us-east-1.elasticbeanstalk.com


### To run the backend (port 3000) -not necessary-:
        npm run dev:backend
### To run the frontend (port 4200):
        npm run start:frontend





## Built With

![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white) 
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) 
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
<!-- ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) -->
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

![AWS RDS](https://img.shields.io/badge/AWS%20RDS-527FFF?style=for-the-badge&logo=Amazon%20RDS&logoColor=white)
![AWS S3](https://img.shields.io/badge/AWS%20S3-%23569A31.svg?style=for-the-badge&logo=amazon-s3&logoColor=white)
![AWS Elastic Beanstalk](https://img.shields.io/badge/AWS%20Elastic%20Beanstalk-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)



<!-- BucketNAme: mystorebucket927319
us-east 1

Engine version: PostgreSQL 17.2-R1
DB instance identifier: mystoredb1
Master password: postgres927319
psql -h mydbinstance.csxbuclmtj3c.us-east-1.rds.amazonaws.com -U [username] postgres -->


<!-- 
________________________________________________________

#### first to make sure the backend works setup the database:

* Note: you don't have to set the database you can use it without the backed i added a backup way to retrieve data from the frontend in this location:  https://github.com/SalehAlobaylan/MyStore/blob/main/app/MyStore/src/assets/Nike.Nike.json

* so to setup the database in mongoDB Create a database Called "Nike" and with collection called "Nike" ,
    you can adjust the database and collection name in this file (lines 25 , 28) : https://github.com/SalehAlobaylan/MyStore/blob/main/app/backend/database/models/product.model.ts
* Mongo database connection address:
```mongodb://127.0.0.1:27017/NikeProducts```
* you can adjust it here: https://github.com/SalehAlobaylan/MyStore/blob/main/app/backend/database/MongoDatabase.ts

## Running the Website (Locate to "app" folder):
        cd .\app\
        npm install
### To run the backend (port 3000) -not necessary-:
        npm run dev:backend
### To run the frontend (port 4200):
        npm run start:frontend
- http://localhost:4200/ -->
