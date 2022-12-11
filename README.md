## About

This project was created with [express-generator-typescript](https://github.com/seanpmaxwell/express-generator-typescript).

## Available Scripts

### `npm i`

Install node dependencies.

### `npm run dev`

Run the server in development mode.

### `npm run lint:fix`

Check for linting errors with prettier.

### `npm run build`

Build the project for production. App starts in default 3000 port.

### `npm start`

Run the production build (Must be built first).

### `npm start -- --env="name of env file" (default is production).`

Run production build with a different env file.

## Additional Notes

- If `npm run dev` gives you issues with bcrypt on MacOS you may need to run: `npm rebuild bcrypt --build-from-source`.

## Database creation

`test> use no0days`

`no0days> db.user.insert({name: "User1", email: "email@email.com", passsword: "abc", active: true})`

## Docker database

### `docker compose up`

Start mongo with mongo-express

### `docker compose --profile mongo up`

Start only mongo

#### `-d` flag

Run docker-compose in detached mode.

### `docker-compose stop`

Stop docker-compose.