import express, { Request, Response , Application } from 'express';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import { AppDataSource } from "./data-source"
import PasskeyService from './services/passkey';
import SignUpService from './services/sign-up';
import { createAccessToken } from './services/token';
import UserService from './services/user'
import signIn from './services/sign-in';
import { authenticateToken } from './jwt-authentication';
import contactsRouter from './routes/contacts';
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

checkNodeVersion(20)

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.json()); // <--- Here
app.use('/contacts', authenticateToken, contactsRouter)

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

app.get('/.well-known/assetlinks.json', (req: Request, res: Response) => {
  const json = [
    {
      "relation" : [
        "delegate_permission/common.handle_all_urls",
        "delegate_permission/common.get_login_creds"
      ],
      "target" : {
        "namespace" : "android_app",
        "package_name" : "com.uballet.wallet",
        "sha256_cert_fingerprints" : [
          process.env.ANDROID_SHA_HEX_VALUE
        ]
      }
    }
  ]
  res.status(200).json(json)
})

app.get('/.well-known/apple-app-site-association', (req: Request, res: Response) => {
    const json = {
        "applinks": {},
        "webcredentials": {
          "apps": ["J3QNL6QPT5.com.flperez.uballet"]
        },
        "appclips": {}
      }
    res.status(200).json(json)
})

app.get('/passkey-registration-options', authenticateToken, async (req: Request, res: Response) => {
    // @ts-ignore
    const user = req.user
    const options = await PasskeyService.getRegistrationOptions(user.id)
    return res.status(200).json(options)
})

app.get('/passkey-authentication-options', async (req: Request, res: Response) => {
    const options = await PasskeyService.getAuthenticationOptions()
    return res.status(200).json(options)
})

app.get('/passkeys', authenticateToken, async (req: Request, res: Response) => {
    // @ts-ignore
    const user = req.user
    const credentials = await PasskeyService.getUserCredentials(user.id as string)
    return res.status(200).json(credentials)
})

app.post('/verify-passkey-authentication', async (req: Request, res: Response) => {
  const { credentials, challenge } = req.body

  const { user, verified, token } = await PasskeyService.verifyAuthentication(credentials, challenge)

  if (!verified) {
    return res.status(401).send()
  }

  return res.status(200).json({ ...user, token })
})

app.post('/verify-passkey-registration', authenticateToken, async (req: Request, res: Response) => {
    // @ts-ignore
    const user = req.user
    const { credentials, challenge } = req.body
    const { verified, passkey } = await PasskeyService.verifyRegistration(user.id, credentials, challenge)

    if (!verified) {
        return res.status(401).send()
    }
    return res.status(200).json(passkey)
})

app.post('/signup', async (req: Request, res: Response) => {
    const { email } = req.body
    const { user } = await SignUpService.signup(email)
    return res.status(200).json(user)
})

app.post('/verify-email', async (req: Request, res: Response) => {
  const { email, code } = req.body
  const user = await SignUpService.verifyUserEmail(email, code)

  const token = createAccessToken(user.id)
  return res.status(200).json({ ...user, token })
})

app.post('/email-sign-in', async (req: Request, res: Response) => {
  const { email, targetPublicKey } = req.body
  const user = await signIn.signInWithEmailSimpler({ email })
  return res.status(200).send();
})

app.post('/complete-sign-in', async (req: Request, res: Response) => {
  const { email, code } = req.body
  const { user, token } = await signIn.completeSimplerEmailSignIn({ email, code })
  res.status(200).send({ ...user, token })
})

app.get('/user', authenticateToken, async (req: Request, res: Response) => {
  // @ts-ignore
  const reqUser = req.user
  const user = await UserService.getUserById(reqUser.id)
  return res.status(200).json(user)
})

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});

AppDataSource.initialize().then(async () => {
    console.log("Here you can setup and run express / fastify / any other framework.")

}).catch(error => console.log(error))
