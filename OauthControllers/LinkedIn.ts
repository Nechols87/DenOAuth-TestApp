import { OAuth2Client } from "https://deno.land/x/oauth2_client/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Client } from "https://deno.land/x/postgres/mod.ts"
import { dbCreds } from '../config.ts'

const client = new Client(dbCreds);

const obj = config()
const clientKey = Object.values(obj)[2]
const clientId:string = '8693ww7e9p6u3t'
const redirect:string = "http://localhost:3000/store"
const scope:string = 'r_emailaddress'

const oauth2Client = new OAuth2Client({
    clientId: '8693ww7e9p6u3t',
    clientSecret: clientKey, 
    authorizationEndpointUri: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenUri: "https://api.linkedin.com/v2/me",
    redirectUri: "http://localhost:3000/store",
    defaults: {
      scope: "read:user",
    },
  });

// console.log(oauth2Client.config.redirectUri)
let sessionId: String;

// const SampleLink: String = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id={your_client_id}&redirect_uri={your_callback_url}&state=foobar&scope=r_liteprofile%20r_emailaddress%20w_member_social`

const createLink: Function = (cliendId:String, redirect:String, scope:String) => {
  const state: Number = Math.floor(Math.random() * 1000000000)
  let SampleLink: String = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${cliendId}&redirect_uri=${redirect}&state=${state}&scope=${scope}`
  return SampleLink
}

console.log(createLink(clientId, redirect, scope))



const LOauthOne = async (ctx:any, next:any) => {
    let sessionId: Number = Math.floor(Math.random() * 1000000000);
    await client.connect()
    await client.queryObject("INSERT INTO session(session_id) VALUES($1)", sessionId)
    ctx.response.body = {
        message: 'success',
        data: ctx.response.redirect(`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=8693ww7e9p6u3t&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fstore&state=foobar&scope=r_liteprofile`)
        
    };
    ctx.response.redirect("http://localhost:3000/store")
    ctx.cookies.set('test', sessionId, {httpOnly: true})

    // const test = "test"
    // await fetch(ctx.request.url, {
    //   headers: {
    //     Authorization: `Bearer ${test}`
    //   }
    // })
}
    // await next()
    // ctx.cookies.set('jwt', 'tokens.accessToken', {httpOnly: true})
    // const jwt = await ctx.cookies.get("jwt") || ''
    // console.log(jwt)
    // // Exchange the authorization code for an access token
    // const tokens = await oauth2Client.code.getToken(ctx.request.url);
    // console.log(`tokens ${tokens}`)
    // ctx.cookies.set('jwt', tokens.accessToken, {httpOnly: true})


// http://localhost:3000/store?code=AQRQtZgS_T-LpTFQTnBKkzu2D98OJnhu7I8fZOR-K24QbTlakD3yFb-KBjTsCvaCpPPSS6EnMp_ZUNe3M-CpKct7TJQamlyi3H9dlXiEvYQYyFaUcsOJN1Z-sYxNvvpMSxEu-01zsRLh5DohPYYcU0GOhmx2iwBl56uSQmYvVjkvEywe8kC1FPA07EGzgn2nyVF4ALmdKuJ6g9kFgHk

// const LOauthOne = (ctx:any) => {
//     ctx.response.redirect(
//       oauth2Client.code.getAuthorizationUri(),
//     );
//   };

// const hardCode = "AQRQtZgS_T-LpTFQTnBKkzu2D98OJnhu7I8fZOR-K24QbTlakD3yFb-KBjTsCvaCpPPSS6EnMp_ZUNe3M-CpKct7TJQamlyi3H9dlXiEvYQYyFaUcsOJN1Z-sYxNvvpMSxEu-01zsRLh5DohPYYcU0GOhmx2iwBl56uSQmYvVjkvEywe8kC1FPA07EGzgn2nyVF4ALmdKuJ6g9kFgHk"

const oauth2Clone = async (ctx: any) => {
  // const  redirectUri: String = oauth2Client 
  // ctx.cookies.set('test', 'tokens.accessToken', {httpOnly: true});
  // const test = await ctx.cookies.get("test") || '';
  // const test = "test"
  // const userResponse: any = await fetch(ctx.request.url, {
  //   headers: {
  //     Authorization: `Bearer ${test}`,
  //   },
  // })

  ctx.response.redirect(oauth2Client.config.redirectUri);
}


  const LOauthTwo = async (ctx:any, next:any) => {
      console.log(oauth2Client)
    // Exchange the authorization code for an access token
    const tokens = await oauth2Client.code.getToken(ctx.request.url);
    console.log(`tokens ${tokens}`)
    // Use the access token to make an authenticated API request
    const userResponse = await fetch("https://api.linkedin.com/v2/me", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    ctx.cookies.set('jwt', tokens.accessToken, {httpOnly: true})
    // console.log(userResponse)
    // const { name } = await userResponse.json();
    // console.log(name)
    await next()

  };

  export { LOauthOne, oauth2Clone }