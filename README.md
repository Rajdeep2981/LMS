# Lib-Manager

This is a Library Management System based on a Node.js serving frontend views using [Handlebars](https://handlebarsjs.com/).

## Installation

1. Clone the repository into your local machine using the command:
   ```bash
   git clone git@github.com:LunaticFrisbee/Lib-Manager.git
   cd Lib-Manager
   ```
2. If you have docker-compose installed, perform the following command:
   ```bash
   sudo docker-compose up
   ```
   This will start up your application at port 5000 and will be accessible to you at `http://localhost:5000`
   If you want to persist data then just change the docker-compose.yml and add a directory under the `volumes:` key.

## Usage

This app is split on the usage for two kinds of users, default users(referred to as 'User' from now on) and users with admin privileges(referred to as 'Admin' henceforth)

1. User
   - You will land at the default login page for user. Existing users sign in and new users can register themselves and then login in to land to the User Dashboard.
   - At the dashboard, you will find
     - All the available books along with their quantity with an option to request any of the books for checkout.
     - You can also see all of the books checked out in your name and you have an option to hand in the checked-out books to the library.
     - The option to logout.
2. Admin
   - You will land at the default login page for users. You will see an option `Continue as Admin`. Click on that and login with the admin credentials to go to the Admin Dashboard.
   - At the Admin Dashboard, you will find
     - All of the available books.
     - Options to either add new or remove existing books.
     - View existing checkout requests and the option of denying/accepting the request.
     - The option to logout.
