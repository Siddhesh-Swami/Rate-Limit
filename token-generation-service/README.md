## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

This is a simple token generation service based on NestJS. The service is composed of two main modules:

-   `AdminModule`: This module contains the endpoints to create, read and update access keys.
-   `AppModule`: This module is the main module of the application. It imports the `AdminModule`.

The application has a Redis connection which uses PUBSUB for publishing the rate limit data.

The communication between the microservices is done with Redis Pub-Sub.

The access keys & tokens are stored in MongoDB using the Mongoose library.

The application uses the following libraries:

-   NestJS
-   ioredis
-   mongoose
