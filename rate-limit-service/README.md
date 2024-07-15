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

This is a rate limit generation service based on NestJS. The service is composed of two main modules:

The application has a Redis connection which uses PUBSUB for setting the rate limit data in the service.

The rate limit service can be scaled horizontally.

The application uses the following libraries:

-   NestJS
-   ioredis
