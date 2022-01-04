import { config } from "https://deno.land/x/dotenv/mod.ts";
import { LinkedInClient } from 'https://raw.githubusercontent.com/oslabs-beta/DenOAuth/bd756b2d5d0e1bb2961dcf35fc4b9bf4f005758d/mod.ts'


const obj = config()
const clientKey = Object.values(obj)[2]
const clientId:string = '8693ww7e9p6u3t'
const redirect:string = "http://localhost:3000/auth/linkedin/callback"
const scope:string = 'r_liteprofile' 



const LinkedInObject = new LinkedInClient({
    clientId: clientId,
    clientSecret: clientKey,
    redirect: redirect,
    tokenUri: 'https://api.linkedin.com/v2/me',
    scope: scope
});

const LStrategyOne = async (ctx:any) => {
    // Creating a link to redirect user to signin to LinkedIn and redirect to callback url.
    ctx.response.body = {
        message: 'success',
        data: ctx.response.redirect(LinkedInObject.code.createLink())
    };
}

const LStrategyTwo = async (ctx: any, next:any) => {
    // Exchange the authorization code for an access token and exchange token for profile
    const userProfile: any = await LinkedInObject.code.processAuth(ctx.request.url);
    // userProfile is an object of information given by LinkedIn. You can destructure the object to grab specific information
    const {localizedFirstName} = userProfile;
    console.log(`Hello ${localizedFirstName}`)
  
    return await next();
  };




export { LStrategyOne, LStrategyTwo }