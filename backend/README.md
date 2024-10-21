# Backend

Steps to run this project:

1. Run `npm i` command
2. Run `docker-compose up` command for deploying Postgres backend database
3. Run `npm start` command
4. Run `npm run typeorm migration:run -- -d src/data-source.ts` command

## Docker

Docker compose consists of a Postgres database, pulled from repostory official image for Docker. Check the ports and credentials defined in the docker-compose.yml file or left the default configuration. You could use 3rd party software like pgAdmin for exploring into database but it is not strictly neccesary because the database tables are managed by the ORM library.

## Common issues

To address the common 'Not found entity' error when running migration, follow this steps:

1. Replace in data-source.ts

```
const entities = path.join(**dirname, "../dist/entity/\*.js");
const migrations = path.join(**dirname, "../dist/migration/\*.js");
```

with

```
const entities = path.join(**dirname, "./entity/\*.ts");
const migrations = path.join(**dirname, "./migration/\*.ts");
```

2. Then replace in package.json `"typeorm": "rm -rf ./dist && typeorm-ts-node-commonjs"` with `"typeorm": "typeorm-ts-node-commonjs"`
3. Then run, if not already did `npm run typeorm migration:run -- -d src/data-source.ts`
