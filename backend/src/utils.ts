import { Request, Response } from "express"

type Handler = (req: Request, res: Response) => Promise<Response>

export function withErrorHandler(fn: Handler) {
  return async (req: Request, res: Response) => {
    try {
      const result = await fn(req, res)
      return result
    } catch (error) {
      return res.status(400).json({ error })
    }
  }
}

