import { verify } from "jsonwebtoken"
import { MiddlewareHandler } from "hono"

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const token = c.req.header("authorization")?.split(" ")[1]

  if (!token) return c.json({ error: "Unauthorized" }, 401)

  try {
    const user = verify(token, process.env.JWT_SECRET!)
    c.set("user", user)
    await next()
  } catch {
    return c.json({ error: "Invalid token" }, 401)
  }
}
