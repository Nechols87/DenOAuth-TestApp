import { config } from "https://deno.land/x/dotenv/mod.ts";
import { GoogleClient } from 'https://raw.githubusercontent.com/oslabs-beta/DenOAuth/05a77d00a245d626b53ec813fa855ff96001df2d/mod.ts'


const obj = config()
const clientSecret = Object.values(obj)[3]
const clientId:string = '355975710617-pu1n5okl8jpuh9ofqnclji3bqk6gk88o.apps.googleusercontent.com'
const redirect:string = "http://localhost:3000/auth/google/callback"



const GoogleObject = new GoogleClient({
    clientId: clientId,
    clientSecret: clientSecret,
    redirect: redirect,
    tokenUri: 'https://accounts.google.com/o/oauth2/token',
    scope: 'https://mail.google.com&access_type=offline&include_granted_scopes=true'
});

const GStrategyOne = async (ctx:any) => {
    // Creating a link to redirect user to signin to LinkedIn and redirect to callback url.
    ctx.response.body = {
        message: 'success',
        data: ctx.response.redirect(GoogleObject.code.createLink())
    };
}

const GStrategyTwo = async (ctx: any, next:any) => {
    // Exchange the authorization code for an access token and exchange token for profile
    const userProfile: any = await GoogleObject.code.processAuth(ctx.request.url);
    console.log(userProfile)
    // userProfile is an object of information given by LinkedIn. You can destructure the object to grab specific information
    // const { name } = userProfile;
    // console.log(`Hello ${ name }`)
  
    return await next();
  };




export { GStrategyOne, GStrategyTwo }