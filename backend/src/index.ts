import express, { Request, Response , Application } from 'express';
import * as bodyParser from 'body-parser';
import * as dotenv from "dotenv";
import { AppDataSource, TestDataSource } from "./data-source"
import { authenticateToken } from './jwt-authentication';
import contactsRouter from './routes/contacts';
import authRouter from './routes/auth'
import userRouter from './routes/user'
import webAuthnRouter from './routes/webauthn'
import wellKnownRouter from './routes/well-known'
import { PORT, IS_E2E_TESTING } from './env';
import quotesRouter from "./routes/quotes";
import portfolioRouter from "./routes/portfolio";
import recoveryRouter from "./routes/recovery";
import notificationsRouter from "./routes/notifications"
import AddressActivity from './routes/address-activity';
import PushNotificationService from './services/push-notification';
import { initWebHooks } from './webhooks';
import ngrok from '@ngrok/ngrok'
import { NGROK_AUTHTOKEN, NGROK_DOMAIN } from './env';
import { clearTestDB, initTestDB } from './test-db';
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
app.use('/contacts', authenticateToken, contactsRouter)
app.use('/', authRouter)
app.use('/', webAuthnRouter)
app.use('/', AddressActivity)
app.use('/.well-known', wellKnownRouter)
app.use('/user', authenticateToken, userRouter)
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

app.use("/contacts", authenticateToken, contactsRouter);
app.use("/quotes", quotesRouter); // Add authenticateToken later...
app.use("/portfolio", portfolioRouter); // Add authenticateToken later...
app.use("/recovery", recoveryRouter);
app.use("/notifications", authenticateToken, notificationsRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server");
});

app.post('/test-push-notification', async (req: Request, res: Response) => {
  const { userId } = req.body
  await PushNotificationService.sendNotificationToUser({ userId, title: 'test', body: 'test' })

  return res.status(200).json({})
})


  async function init() {
    if (IS_E2E_TESTING) {
      await TestDataSource!.initialize();
      await clearTestDB();
      await initTestDB();
    } else {
      await AppDataSource.initialize();
    }
    app.listen(port, () => {
      console.log(`Server is Fire at http://localhost:${port}`);
    });

    if (NGROK_AUTHTOKEN && NGROK_DOMAIN && !IS_E2E_TESTING) {
      try {
        const listener = await ngrok.connect({ addr: port, authtoken: NGROK_AUTHTOKEN, domain: NGROK_DOMAIN });
        initWebHooks({ url: listener.url()! });
      } catch (error) {
        console.error("ERROR SETTING UP NGROK");
      }
    }
    console.log(
      "Here you can setup and run express / fastify / any other framework."
    );
  }

  init();