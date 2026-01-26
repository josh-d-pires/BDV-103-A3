import Koa from "koa";
import cors from "@koa/cors";
import qs from "koa-qs";
import booksRouters from "./books/routes";

const app = new Koa();

// We use koa-qs to enable parsing complex query strings, like our filters.
qs(app);

// And we add cors to ensure we can access our API from the mcmasterful-books website
app.use(cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true
}))

app.use(booksRouters.routes());
app.use(booksRouters.allowedMethods());

app.listen(3000, () => {
    console.log("listening!")
});