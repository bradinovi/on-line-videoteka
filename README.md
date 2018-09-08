# On-Line Video Library Example

MEAN stack app developed for academic purposes. Used in bachelor's thesis *The Semistructured Database Management System MongoDB with an On-Line Video Library Example* by [FOI](https://www.foi.unizg.hr/) student [Borna Radinović](https://github.com/bradinovi).

The app implements a user structure of admina and regular users. The regular user can search and browse relevant movie data and then rent movies for a chosen period of time (without the functionality of video streaming). The admin user can create, update and delete all the data used in the database od the application.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Install Node.js on your machine via installers available on [Node.js website](https://nodejs.org/en/)

After installing node install [Angular CLI](https://cli.angular.io/) for building the app frontend.
```
npm install -g @angular/cli
```
Install [Nodemon](https://nodemon.io/) for building app backend.
```
npm install -g nodemon
```
Install all the project dependencies by running
```
npm install
```

### Installing

Position yourself in the on-line-videoteka directory
For building the Angular app run
```
ng serve
```
For running the Web API (backend) run
```
npm run server
```

To access a created profile a user must activate the account by clicking the activation link received after registration.

### Demo

App Demo available at
https://videoteka-frontend.herokuapp.com/
