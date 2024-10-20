import express, { Request, Response, Application } from "express";
import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import { authenticateToken } from "./jwt-authentication";
import contactsRouter from "./routes/contacts";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import webAuthnRouter from "./routes/webauthn";
import wellKnownRouter from "./routes/well-known";
import { PORT } from "./env";
import tokenInfoRouter from "./routes/token-info";
import portfolioRouter from "./routes/portfolio";
// For env File
dotenv.config();

const checkNodeVersion = (version: number) => {
  const versionRegex = new RegExp(`^${version}\\..*`);
  const versionCorrect = process.versions.node.match(versionRegex);
  if (!versionCorrect) {
    throw Error(
      `Running on wrong Nodejs version. Please upgrade the node runtime to version ${version}`
    );
  }
};

checkNodeVersion(20);

const app: Application = express();
const port = PORT || 8000;

app.use(bodyParser.json()); // <--- Here
app.use("/contacts", authenticateToken, contactsRouter);
app.use("/", authRouter);
app.use("/", webAuthnRouter);
app.use("/.well-known", wellKnownRouter);
app.use("/user", authenticateToken, userRouter);
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server");
});

app.use("/contacts", authenticateToken, contactsRouter);
app.use("/token-info", tokenInfoRouter); // Add authenticateToken later...
app.use("/portfolio", portfolioRouter); // Add authenticateToken later...

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server");
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});

AppDataSource.initialize()
  .then(async () => {
    console.log(
      "Here you can setup and run express / fastify / any other framework."
    );
  })
  .catch((error) => console.log(error));
