import { Application } from "https://deno.land/x/oak/mod.ts"
import router from './routes.ts'


const port: string|any =  Deno.env.get("PORT") || 3000
const app = new Application()


app.use(router.routes())
app.use(router.allowedMethods())



app.addEventListener("error", (evt) => {
  console.log(evt.error);
});



console.log(`Server running on port ${port}`)

await app.listen({port: +port})

