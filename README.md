# shortlet-app

Application Url: [Heroku](https://shortlet-app-23aea4be881a.herokuapp.com/)
API Doocumentation: [Postman](https://documenter.getpostman.com/view/17688519/2sA3rzHrf6 )

&nbsp; 

## Environment Variables Required to bootstrap this project

| Key                        |                        | Default                                                                                           |
| -------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------- |
| **NODE_ENV**               |                        | `local` |
| **PORT**                   |                        | `80` |
| &nbsp; |                        |                                                                                                   |
| **MONGODB_HOST**           |                        | `127.0.0.1` |
| **MONGODB_PORT**           |                        | `27017` |
| **MONGODB_DATABASE**       |                        | `shortlet_app` |
| **MONGODB_USERNAME**       |                        |                                                                                                   |
| **MONGODB_PASSWORD**       |                        |                                                                                                   |
| &nbsp; |                        |                                                                                                   |
| **REDIS_HOST**             |                        | `127.0.0.1` |
| **REDIS_PORT**             |                        | `6379` |
| **REDIS_USER**             |                        |                                                                                                   |
| **REDIS_PASSWORD**         |                        |                                                                                                   |
| &nbsp; |                        |                                                                                                   |
| **REST_COUNTRIES_API_URL** |                        | `https://restcountries.com/v3.1/` |

### Dependencies

* Node >=20.10.0
* TypeScript >=5.5
* MongoDB >=7.0
* Redis >=7.4

&nbsp; 

## Setting Up

### Cloning the Repository

Open your Terminal, and type:
 `$ git clone https://github.com/django102/shortlet-app.git`

&nbsp; 

### Installing Node

* Install Node Version Manager (nvm)

    

```
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    ```

&nbsp; 
* Install the Node using nvm

    

```
    nvm install node
    ```

    or

    

```
    nvm install 20
    ```

    to install the latest release of Node 20

&nbsp; 

### Installing Yarn

```bash
npm install yarn -g
$ yarn
```

&nbsp; 

### Installing Nodemon

  

```bash
  npm install nodemon -g
  ```

&nbsp; 

### Installing MongoDB

We will use HomeBrew to install our MongoDB server

* Install Homebrew
   

```bash
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)
  ```

- Add Homebrew to your PATH

    For Apple Silicon (M1)
    

```bash
    export PATH="/opt/homebrew/bin:$PATH"
    ```

    For Apple Intel

    

```bash
    export PATH="/usr/local/bin:$PATH"
    ```

* Verify Installation
   

```bash
  brew --version
  ```

- Install MongoDB Community
    

```bash
    brew install mongodb-community
    ```

    You may also install MongoDB Compass from [here](https://www.mongodb.com/products/tools/compass).

&nbsp; 

### Installing Redis

This application uses Redis cache and stores information in JSON format. This requires the RedisJSON module to be applied to the Redis installtion. As such, we need to install Redis Stack

* Download Docker from their [website](https://www.docker.com/) and install
* Pull the Redis Stack docker image

    

```bash
    docker pull redis/redis-stack:latest
    ```

* Run the Redis Stack docker image

    

```bash
    docker run -d --name redis-stack -p 6379:6379 redis/redis-stack:latest
    ```

    &nbsp;
    You can verify the Redis installation by connecting to the Redis instance using a Redis client (such as [Redis Insight](https://redis.io/insight/)) or through the redis-cli

    

```bash
    redis-cli -h 127.0.0.1 -p 6379
    ```

&nbsp; 

### Installing Dependencies

* cd into the `shortlet-app` folder
* run `yarn` to install project dependencies

&nbsp; 

### Configuration

* Copy and rename `env.example` to `.env` and `.env.test`. 
* Configure the variables as required.

&nbsp; 

### Development

To build the application:

```bash
$ yarn build
```

Or to enable hot module reloading, using nodemon:

```bash
$ yarn dev
```

To run your tests, run the command:

```bash
$ yarn test
```

&nbsp; 

## Commands

1. `yarn` - Installs all dependencies
2. `yarn test` - Run all tests currently available in the [test](test) folder
3. `yarn build` - Generates all JavaScript files from the TypeScript sources
3. `yarn start` - Run the application from the JavaScript files generated from TypeScript files
4. `yarn dev` - Run the application for development in the local development environment. It starts the application using Nodemon which restarts the server each time a change is made to a file

&nbsp; 
&nbsp; 

## Implementation Approach

I went with the Incremental Model of development, building out parts of the application and iterating as requirements and dependencies on other parts of the application evolve.
I began with bootstrapping the application, building out an empty shell that does nothing but still runs, adding components and dependencies along the way. Next I set up the environment variables that would be used throughout the application and a globally available configuration file that serves up these variables in a more efficient and readable manner.
I then proceeded to set up integration with the database and caching. I went with MongoDB for the database because it is able to handle data directly in JSON format, and Redis for the caching because it is widely used. I also added a CRON job to help with retrieving data from the REST Countries API in the background, updating the database and the cache once the process is completed. While the REST Countries API had endpoints to handle most of the requirements of this project, by getting all the available countries from the API and saving them in the database, I could obtain records in any way I choose without the constant dependency of the API. Implementing a caching system right in front of the database further decreases database overhead and improves API response time.

## Interesting Challenges

* **Code Structure**: Most of the TypeScript projects I have worked on were built using [Microframework](https://www.npmjs.com/package/microframework-w3tec), which is a tool that helps with organizing bootstrap code in modules. In a way, this also helps with setting up other parts of the application in the same way and this helps with generating Swagger documentation automatically during the build process. It was a bit challenging building a TypeScript application in almost the same way you'd build a vanilla Node.js application, but I was able to take my experience from both worlds to build this MVP.

* **Redis**: So, until recently, I have only ever used Redis in its basest form. `client.set("key", "value")` for regular strings and `client.set("key", JSON.stringify(value))` for objects and arrays. I figured that there had to be a way to store JSON data more efficiently, to remove the overhead of `JSON.stringify()` and `JSON.parse()`. I discovered that Redis developed a module, RedisJSON, to help with that. The challenge came when I discovered that this module doesn't come with the regular Redis installation, and that installing this through HomeBrew wasn't as easy and straightforward. I ended up getting the installation through Docker.

## Aspects I'm Proud Of

* **Extensive Use of Caching**: While testing on my development system, I noticed usually noticed a decrease of between 200% and 500% in response API response time when data is retrieved from the cache, when compared to when data is retrieved from the database directly. All endpoints initially check the cache to see if the required data exists before calling the database. Also, because I am storing the values directly as JSON, it also removes the overhead of stringifying and parsing the object before storage and retreival respectively.

## Potential Improvements

* **Better Error Handling**: I feel I could have better handled some errors, or at least handle them more uniformly
* **Add Retry Logic**: I could add a retry logic for when calls made to the REST Countries API fail with certain HTTP response codes, or when API calls timeout.
* **Dependency Injection**: Implement Dependency Injection to improve testability. This is because I can easily replace real dependencies with mock objects during testing.
* **Automatic API Documentation Generation**: I would also like to implement the automatic generation of the API documentation with Swagger either when the application is being built, or during application startup
