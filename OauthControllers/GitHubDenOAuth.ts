import { config } from "https://deno.land/x/dotenv/mod.ts";
import { GitHubClient } from 'https://raw.githubusercontent.com/oslabs-beta/DenOAuth/de763fa294ceacfb888dda648a59cf024b174b6a/mod.ts'


const obj = config()
const clientSecret = Object.values(obj)[1]
const clientId:string = '8d769a8e565111f853fb'
const redirect:string = 'http://localhost:3000/auth/github/callback'
const scope:string = 'read:user' 



const GitHubObject = new GitHubClient({
    clientId: clientId,
    clientSecret: clientSecret,
    redirect: redirect,
    tokenUri: 'https://github.com/login/oauth/access_token',
    scope: scope
});

const GHStrategyOne = async (ctx:any) => {
    // Creating a link to redirect user to signin to LinkedIn and redirect to callback url.
    ctx.response.body = {
        message: 'success',
        data: ctx.response.redirect(GitHubObject.code.createLink())
    };
}

const GHStrategyTwo = async (ctx: any, next:any) => {
    // Exchange the authorization code for an access token and exchange token for profile
    const userProfile: any = await GitHubObject.code.processAuth(ctx.request.url);
    // userProfile is an object of information given by LinkedIn. You can destructure the object to grab specific information
    const { name } = userProfile;
    console.log(`Hello ${ name }`)
  
    return await next();
  };




export { GHStrategyOne, GHStrategyTwo }