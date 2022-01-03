import { OAuth2Client } from "https://deno.land/x/oauth2_client/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Client } from "https://deno.land/x/postgres/mod.ts"
import { dbCreds } from '../config.ts'

const client = new Client(dbCreds);

const obj = config()
const clientKey = Object.values(obj)[1]
const clientId:string = '8d769a8e565111f853fb'
let sessionId: String;

const oauth2Client = new OAuth2Client({
    clientId: '8d769a8e565111f853fb',
    clientSecret: clientKey,
    authorizationEndpointUri: "https://github.com/login/oauth/authorize",
    tokenUri: "https://github.com/login/oauth/access_token",
    redirectUri: "http://localhost:3000/auth/github/callback",
    defaults: {
      scope: "read:user",
    },
  });

const hardCode = 'https://github.com/login/oauth/authorize?response_type=code&client_id=8d769a8e565111f853fb&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fgithub%2Fcallback&scope=read%3Auser'

const createLink: Function = (cliendId:String, redirect:any, scope:any) => {
  const state: Number = Math.floor(Math.random() * 1000000000)
  const encodeLink: any = encodeURIComponent(redirect)
  const encodeScope: any = encodeURIComponent(scope)
  let SampleLink: String = `https://github.com/login/oauth/authorize?response_type=code&client_id=${cliendId}&redirect_uri=${encodeLink}&state=${state}&scope=${encodeScope}`
  return SampleLink
}
const redirectGHLink = createLink('8d769a8e565111f853fb', "http://localhost:3000/auth/github/callback", "read:user")
// console.log(redirectGHLink)

const setBearerToken = async (bearToken: any) => {
  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${bearToken}`,
    },
  });
  const { name } = await userResponse.json()
  console.log(`Hello ${name}`)
  
}

const OauthOne = async (ctx:any, next:any) => {
  let sessionId = Math.floor(Math.random() * 1000000000);

  try {
    // await client.connect()
    // await client.queryObject("INSERT INTO session(session_id) VALUES($1)", sessionId)
    ctx.response.body = {
      message: 'success',
      data: ctx.response.redirect(redirectGHLink)
      
  };
    // ctx.cookies.set('test', sessionId, {httpOnly: true})
  } catch(err) {
    return err;
  }
  // await next()
  };
  
  // const token: String = '6f8fa69ebe3d77e856b4&state=326957956'
  const OauthTwo = async (ctx:any, next:any) => {
    const stringPathName: String = ctx.request.url;

    const code: String = JSON.stringify(stringPathName.search) 
    // console.log(code)
    const parsedCode = code.slice(code.indexOf('"?code=')+7, code.indexOf('&state'))
    // console.log(parsedCode)

   await fetch('https://github.com/login/oauth/access_token',{
    method: 'POST',
      headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientKey,
      code: parsedCode,
      redirect_uri: "http://localhost:3000/auth/github/callback"
  })
})
.then((response: any) => {
  // console.log(response)
  return response.text()
})
.then((paramsString: any) => {
  let params = new URLSearchParams(paramsString)
  // console.log(params)
  let tokenKey = [];
  for (const [key, value] of params.entries()){
  // for (const key in params){
    
    tokenKey.push(key, value)
  }
  console.log(tokenKey[0])
  let obj: any = tokenKey[0]
  let values = Object.values(obj)
  // console.log(values)
  const tokenArr = []
  let i = 17;
  while (values[i] !== '"') {
    tokenArr.push(values[i])
    i++
  }
  const bearerToken = tokenArr.join('')
  // obj = JSON.stringify(obj)
  // // console.log(obj)
  // let Btoken = [];
  // for(const token in obj) {
  //   Btoken.push(token)
  // }
  console.log('access_token', bearerToken)
  
  setBearerToken(bearerToken)
})

  // console.log(tokens)
    
    // Exchange the authorization code for an access token
    // const tokens = await oauth2Client.code.getToken(ctx.request.url);

    // Use the access token to make an authenticated API request
    // const userResponse = await fetch("https://api.github.com/user", {
    //   headers: {
    //     Authorization: `Bearer ${bearerToken}`,
    //   },
    // });
    // console.log(userResponse)
    // ctx.response.redirect("http://localhost:3000/store")
    // ctx.cookies.set('test', sessionId, {httpOnly: true})

    await next()
    
  };

  const sessionCheck = async (ctx:any, next:any) => {
    const jwt = await ctx.cookies.get("jwt") || '' ;
    if(jwt) {
      await next()
    } else {
    const test = await ctx.cookies.get("test") || '';
    console.log(test)
    if (!test) {
      ctx.response.body = 401;
      ctx.response.body = {
          message: 'unauthenticated',
          data: ctx.response.redirect('./login')
      };
      return 
  }
    const token = await client.queryObject(`SELECT * FROM session WHERE session_id = '${ test }'`)
    if (!token){
        ctx.response.body = 401;
        ctx.response.body = {
            message: 'unauthenticated',
            data: ctx.response.redirect('./login')
        } 
    } 
    await next();
    return;
  }
};  



  //    console.log(`url ${ctx.request.url}`)
  // console.log(JSON.stringify(tokens.accessToken))
  export { OauthOne, OauthTwo, oauth2Client, sessionCheck }