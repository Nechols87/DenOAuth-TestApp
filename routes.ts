import { Router } from "https://deno.land/x/oak/mod.ts"
import { addProduct, getProducts, getProduct, deleteProduct, addToCart, deleteFromtCart, getCartProducts } from './controllers/products.ts'
import { addUser, loginUser, logout } from './controllers/users.ts'
import { registerPage, loginPage, home, storePage } from './controllers/render.ts'
import { userMiddleware } from './controllers/userMiddleware.ts'
import { OauthOne, OauthTwo, sessionCheck } from './OauthControllers/gitHub.ts'
import { LOauthOne, findCode } from './OauthControllers/LinkedIn.ts'
import { GOauthOne, findGoogleCode } from './OauthControllers/Google.ts'
import { LStrategyOne, LStrategyTwo } from './OauthControllers/LinkedInDenOAuth.ts'
import { GHStrategyOne, GHStrategyTwo } from './OauthControllers/GitHubDenOAuth.ts'
import {GStrategyOne, GStrategyTwo} from './OauthControllers/GoogleDenOAuth.ts'
import { SOauthOne, findCode2 } from './OauthControllers/spotify.ts'
import {SStrategyOne, SStrategyTwo } from './OauthControllers/SpotifyDenOAuth.ts'
import { IOauthOne, findCode3 } from './OauthControllers/instagram.ts'

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
      // .get('/linkedin', LOauthOne)
      .get('/linkedin', LStrategyOne)
      // .get('/spotify', SOauthOne)
      .get('/spotify', SStrategyOne)
      .get('/instagram', IOauthOne)
      // .get('/auth/linkedin/callback', findCode, storePage)
      .get('/auth/linkedin/callback', LStrategyTwo, storePage)
      // .get('/auth/github/callback', OauthTwo, storePage)
      .get('/auth/github/callback', GHStrategyTwo, storePage)
      // .get('/google', GOauthOne)
      .get('/google', GStrategyOne)
      // .get('/auth/google/callback', findGoogleCode, storePage)
      .get('/auth/google/callback', GStrategyTwo, storePage)
      // .get('/auth/linkedin/callback', LOauthTwo, storePage)
      // .get('/auth/spotify/callback', findCode2, storePage)
      .get('/auth/spotify/callback', SStrategyTwo, storePage)
      .get('/auth/instagram/callback', findCode3, storePage)
 
   

export default router