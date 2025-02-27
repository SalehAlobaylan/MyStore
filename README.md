# Launching Point Store
- A store built with MEAN stack
- it's a simple demonstration website without authentication fouced in frontend with angular
- it contains products in the landing page with navigation bar to navigate to the cart or opposite,
- the header contains number of products calculator in the cart
- you can select number of same product that you want to add to the cart, also you can change it in the cart if you changed your mind after seeing the overall price
- User-friendly UX/UI

#### first to make sure the backend works setup the database:

* Note: you don't have to set the database you can use it without the backed i added a backup way to retrieve data from the frontend in this location:  https://github.com/SalehAlobaylan/MyStore/blob/main/app/MyStore/src/assets/Nike.Nike.json

* so to setup the database Creat a collection Called "Nike" and with collection called "Nike" ,
    you can adjust the database and collection name in this file (lines 25 , 28) : https://github.com/SalehAlobaylan/MyStore/blob/main/app/backend/database/models/product.model.ts
* Mongo database connection address:
        mongodb://127.0.0.1:27017/NikeProducts
* you can adjust it here: https://github.com/SalehAlobaylan/MyStore/blob/main/app/backend/database/MongoDatabase.ts

## Running the Website (Locate to "app" folder):
        cd .\app\
        npm install
### To run the backend (port 3000) -not necessary-:
        npm run dev:backend
### To run the frontend (port 4200):
        npm run start:frontend
- http://localhost:4200/
