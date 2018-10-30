# AIP Visa Compare

- ## Description:
  ### Will allow user to compare waiting period from lodgement to all major milestones, based on countries and visa subclass

# How to set up and run the project for the first time

    - Unzip the Project
    - From the root of the application run "npm i"
    - Then navigate into client folder and run "npm i"
    - Set the environment variable for "jwtPrivateKey"
    - Finally to start the project in reactexpress run "npm run dev" ( set the environment as required -    Default = devlopment)

<strong># Note:</strong> This will run both front and back end concurrently and will open localhost on port 3000.

# key principles of code style and design used in the project

1. Split the work in the smaller number of components we need to build.
2. At each stage, everyone in our group is responsible for a component from both the back-end and front-end point of view.
3. We have regular meetings to discuss and confirm what path moving forward we would like to choose. In terms of how we would like to structure project folders
4. We have decided that we would like to use MongoDB as our project isn’t depending on a complex relational data structure and the performance of retrieving data quickly to provide a better user experience was our major focus.
5. We decided to keep the database connection as a separate module to make it more maintainable and loosely coupled with our logic
6. We spend lots of time to study and learn or solve an issue or subject, such as how to connect to the database or how to create a new document. Then, we sit together and share what we learned and try to make sure everyone on the same page.
7. We decided to use npm package ‘config’ to handle our project’s configuration for a different environment (production, development, and staging) and create a safe and secure way of connecting to the database.
8. We decided to use npm debug package to facilitate our debugging process instead of using console.log (“something”).
9. we first try to get our code working and then we use refactoring techniques to improve readability and to make it more efficient
10. We also decided to use npm package mongoose, like an ORM in a relational database to map data with the database, because it is easier and more convenient to write less error-prone codes
11. We also using npm concurrency and nodemon package to concurrently run both front-end and back-end services and whenever we are changing a file it would automatically refresh the server and reflect the changes on the project. This helped us to improve productivity.
12. Also, we separated our models from routes to have a less coupled logic with improved readability
13. We are using postman to test our APIs and to make user they are working properly before we want to use them in front-end to fetch data. This once we finished front end logic it would be easy to just connect our API with the react components and render it for the user.
14. We will be going to complete the basic blocks of our apps to make sure there is no area that is completely untouched. Then we will come back and iterate through them to finish the whole project.
15. We use YouTube videos, and online resources to find out what is wrong with our code and how we can improve it, what is the proper way of doing it to make sure our project is running and is up to date.
