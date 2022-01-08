import { config } from "https://deno.land/x/dotenv/mod.ts";
import { SpotifyClient } from 'https://deno.land/x/denoauth@v1.0.6/mod.ts'


const obj = config()
const clientSecret = Object.values(obj)[4]
const clientId:string = '9a02a938c53b4cc59e3b7e389529cea9'
const redirect:string = "http://localhost:3000/auth/spotify/callback"
const scope:string = 'user-read-email' 



const SpotifyObject = new SpotifyClient({
    clientId: clientId,
    clientSecret: clientSecret,
    redirect: redirect,
    tokenUri: 'https://api.spotify.com/v1/me',
    scope: scope
});

const SStrategyOne = async (ctx:any) => {
    ctx.response.status = 200;
    // Creating a link to redirect user to signin to LinkedIn and redirect to callback url.
    ctx.response.body = {
        message: 'success',
        data: ctx.response.redirect(SpotifyObject.code.createLink())
    };
}

const SStrategyTwo = async (ctx: any, next:any) => {
    ctx.response.status = 200;
    // Exchange the authorization code for an access token and exchange token for profile
    const userProfile: any = await SpotifyObject.code.processAuth(ctx.request.url);
    // userProfile is an object of information given by Spotify. You can destructure the object to grab specific information
    const { display_name } = userProfile
    console.log(`Hello ${ display_name }`)
  
    return await next();
  };




export { SStrategyOne, SStrategyTwo }