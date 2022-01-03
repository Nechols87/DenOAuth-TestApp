import { Router } from "https://deno.land/x/oak/mod.ts"
import { renderFileToString } from "https://deno.land/x/dejs@0.10.2/mod.ts";
import { addProduct, getProducts, getProduct, deleteProduct, addToCart, deleteFromtCart, getCartProducts } from './controllers/products.ts'
import { addUser, loginUser, logout } from './controllers/users.ts'
import { registerPage, loginPage, home, storePage } from './controllers/render.ts'
import { userMiddleware } from './controllers/userMiddleware.ts'
import { OauthOne, OauthTwo, sessionCheck } from './OauthControllers/gitHub.ts'
import { LOauthOne, findCode } from './OauthControllers/LinkedIn.ts'
import { GOauthOne, findGoogleCode } from './OauthControllers/Google.ts'
import { ghStrat, serializerA, deserializerA } from './dashportConfig.ts';
import { LStrategyOne, LStrategyTwo } from './OauthControllers/LinkedInDenOAuth.ts'
import { GHStrategyOne, GHStrategyTwo } from './OauthControllers/GitHubDenOAuth.ts'

// import { storeRender, purchase } from './controllers/stripe.ts'
// import { handler } from './controllers/stripe.ts'

const router = new Router();


router.get('/', home)
      .post('/api/products', addProduct)
      .get('/api/products', getProducts)
      .get('/api/incart', getCartProducts)
      .get('/api/products/:id', getProduct)
      .delete('/api/products/:id', deleteProduct)
      .post('/api/register', addUser)
      .post('/api/login', loginUser)
      // .get('/api/user', jwtLogin)
      .get('/api/logout', logout)
      .patch('/api/addtocart/:id', addToCart)
      .patch('/api/deletefromcart/:id', deleteFromtCart)
      .get('/login', loginPage)
      .get('/register', registerPage)
      .get('/store', storePage)
      // .get('/gitHub', OauthOne)
      .get('/gitHub', GHStrategyOne)
      // .get('/gitHub', dashport.authenticate(ghStrat, serializerA, deserializerA), storePage)
      // .get('/linkedin', LOauthOne)
      .get('/linkedin', LStrategyOne)
      // .get('/auth/linkedin/callback', findCode, storePage)
      .get('/auth/linkedin/callback', LStrategyTwo, storePage)
      // .get('/auth/github/callback', OauthTwo, storePage)
      .get('/auth/github/callback', GHStrategyTwo, storePage)
      .get('/google', GOauthOne)
      .get('/auth/google/callback', findGoogleCode, storePage)
      // .get('/auth/linkedin/callback', LOauthTwo, storePage)
 
   
      
      // .get('/privatepage', dashport.authenticate(googStrat, serializerA, deserializerA),
      //   async (ctx: any, next: any) => {
      //   ctx.response.body = 'This is a private page!';
      // })




      // .get('/store', storeRender)

      // router.post('/api/register', async (ctx: any) => {
      //       const body = await ctx.request.body({ type: 'form-data '});
      //       console.log(body)
      //       const formData = await body.value.read();
      //       console.log(formData.fields);
      //       ctx.response.redirect("/");
      //     });
  

export default router