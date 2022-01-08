import { config } from "https://deno.land/x/dotenv/mod.ts";
import { DiscordClient } from 'https://deno.land/x/denoauth@v1.0.6/mod.ts'


const obj = config()
const clientKey = Object.values(obj)[6]
const clientId:string = '929066732650381313'
const redirect:string = "http://localhost:3000/auth/discord/callback"
const scope:string = 'identify' 



const DiscordObject = new DiscordClient({
    clientId: clientId,
    clientSecret: clientKey,
    redirect: redirect,
    tokenUri: 'https://discord.com/api/oauth2/token',
    scope: scope
});

const DStrategyOne = async (ctx:any) => {
    // Creating a link to redirect user to signin to LinkedIn and redirect to callback url.
    ctx.response.status = 200;
    ctx.response.body = {
        message: 'success',
        data: ctx.response.redirect(DiscordObject.code.createLink())
    };
}

const DStrategyTwo = async (ctx: any, next:any) => {
    ctx.response.status = 200;
    // Exchange the authorization code for an access token and exchange token for profile
    const userProfile: any = await DiscordObject.code.processAuth(ctx.request.url);
    // userProfile is an object of information given by LinkedIn. You can destructure the object to grab specific information
    const { username } = userProfile

    console.log(`Hello ${ username }`)
    return await next();
  };




export { DStrategyOne, DStrategyTwo }