import { config } from "https://deno.land/x/dotenv/mod.ts";
import { GitHubClient } from 'https://deno.land/x/denoauth@v1.0.6/mod.ts'


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
    ctx.response.status = 200;
    // Creating a link to redirect user to signin to LinkedIn and redirect to callback url.
    ctx.response.body = {
        message: 'success',
        data: ctx.response.redirect(GitHubObject.code.createLink())
    };
}

const GHStrategyTwo = async (ctx: any, next:any) => {
    ctx.response.status = 200;
    // Exchange the authorization code for an access token and exchange token for profile
    const userProfile: any = await GitHubObject.code.processAuth(ctx.request.url);
    // userProfile is an object of information given by LinkedIn. You can destructure the object to grab specific information
    const { name } = userProfile;
    console.log(`Hello ${ name }`)
  
    return await next();
  };




export { GHStrategyOne, GHStrategyTwo }