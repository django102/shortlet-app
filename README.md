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

## >> Implementation Approach

I opted for the Incremental Model of development for my latest application. This approach allowed me to build and refine various components iteratively, adapting to evolving requirements and interdependencies as they emerged.

### Initial Setup and Configuration
I started by bootstrapping the application, creating a foundational structure that, while initially minimal, laid the groundwork for future enhancements. This "empty shell" was crucial for establishing a functional environment. I then set up environment variables that would be consistently utilized throughout the application, along with a globally accessible configuration file. This setup not only streamlined the management of these variables but also enhanced the overall readability and maintainability of the code.

### Database and Caching Configuration
Next, I focused on integrating the database and caching mechanisms. I chose MongoDB for its ability to handle data in JSON format seamlessly, which aligns well with the application's data structure. For caching, I implemented Redis, a widely adopted solution known for its performance and reliability. This combination allows for efficient data retrieval and storage.

To further enhance the application’s performance, I implemented a CRON job that periodically retrieves data from the REST Countries API. This background process updates both the database and the cache upon completion. Although the REST Countries API provides endpoints for most of the project’s requirements, pre-fetching all available country data and storing it locally in the database allows for greater flexibility in data access. This strategy minimizes reliance on the external API and significantly reduces database load, leading to improved response times for API calls.

### Conclusion
By adopting this incremental approach and carefully selecting the technologies and strategies employed, I was able to create a robust backend that not only meets current needs but is also adaptable for future enhancements. This project exemplifies how thoughtful planning and execution can lead to a well-structured and efficient application.


## Interesting Challenges

* **Code Structure**: Most of the TypeScript projects I've worked on utilized [Microframework](https://www.npmjs.com/package/microframework-w3tec), a tool that organizes bootstrap code into modules, known as loaders. This modular approach not only simplifies the setup of various application components but also facilitates automatic Swagger documentation generation during the build process. Although building a TypeScript application in a manner similar to a vanilla Node.js app posed some challenges, I was able to leverage my experience from both environments to create a successful Minimum Viable Product (MVP).

* **Redis**: My experience with Redis was initially limited to basic key-value storage, using commands like `client.set("key", "value")` for strings and `client.set("key", JSON.stringify(value))` for objects. I soon realized this approach was inefficient for handling JSON data due to the overhead of serialization. To address this, I discovered **`RedisJSON`**, a module that enables native JSON storage and manipulation. However, installing it wasn't straightforward, as it isn't included with the standard Redis setup. After some consideration, I chose to install RedisJSON via Docker, which streamlined the process. This experience significantly improved my ability to work with JSON data and deepened my understanding of Redis for developing efficient backend solutions.

## Aspects I'm Proud Of

* **Extensive Use of Caching**: While testing on my development system, I noticed usually noticed a decrease of between 200% and 500% in response API response time when data is retrieved from the cache, when compared to when data is retrieved from the database directly. All endpoints initially check the cache to see if the required data exists before calling the database. Also, because I am storing the values directly as JSON, it also removes the overhead of stringifying and parsing the object before storage and retreival respectively.

## Potential Improvements

* **Better Error Handling**: I feel I could have better handled some errors, or at least handle them more uniformly
* **Add Retry Logic**: I could add a retry logic for when calls made to the REST Countries API fail with certain HTTP response codes, or when API calls timeout.
* **Dependency Injection**: Implement Dependency Injection to improve testability. This is because I can easily replace real dependencies with mock objects during testing.
* **Automatic API Documentation Generation**: I would also like to implement the automatic generation of the API documentation with Swagger either when the application is being built, or during application startup
