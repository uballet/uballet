# Awesome Project Build with TypeORM

Steps to run this project:

1. Run `npm i` command
2. Run `docker-compose up` command
3. Run `npm start` command
4. Run `npm run typeorm migration:run -- -d src/data-source.ts` command

Caso error 'entidad no encontrada'

Replace in data-source.ts

const entities = path.join(**dirname, "../dist/entity/\*.js");
const migrations = path.join(**dirname, "../dist/migration/\*.js");

with

const entities = path.join(**dirname, "./entity/\*.ts");
const migrations = path.join(**dirname, "./migration/\*.ts");

Then replace in package.json

"typeorm": "rm -rf ./dist && typeorm-ts-node-commonjs"

with

"typeorm": "typeorm-ts-node-commonjs"

Then run, if not already did

`npm run typeorm migration:run -- -d src/data-source.ts`
