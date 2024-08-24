import express, { Request, Response } from 'express';
import { ANDROID_SHA_HEX_VALUE, PORT } from '../env';

const router = express.Router();

router.get('/assetlinks.json', (req: Request, res: Response) => {
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
            ANDROID_SHA_HEX_VALUE
          ]
        }
      }
    ]
    res.status(200).json(json)
  })
  
  router.get('/apple-app-site-association', (req: Request, res: Response) => {
    const json = {
        "applinks": {},
        "webcredentials": {
        "apps": ["J3QNL6QPT5.com.flperez.uballet"]
        },
        "appclips": {}
    }
    res.status(200).json(json)
})

export default router
