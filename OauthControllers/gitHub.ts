import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Client } from "https://deno.land/x/postgres/mod.ts"
import { dbCreds } from '../config.ts'

const client = new Client(dbCreds);

const obj = config()
const clientKey = Object.values(obj)[1]
const clientId:string = '8d769a8e565111f853fb'
const redirect:string = "http://localhost:3000/auth/github/callback"

const hardCode = 'https://github.com/login/oauth/authorize?response_type=code&client_id=8d769a8e565111f853fb&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fgithub%2Fcallback&scope=read%3Auser'

const createLink = (cliendId:string, redirect:any, scope:any) => {
  const state: number = Math.floor(Math.random() * 1000000000)
  const encodeLink: any = encodeURIComponent(redirect)
  const encodeScope: any = encodeURIComponent(scope)
  let SampleLink: string = `https://github.com/login/oauth/authorize?response_type=code&client_id=${cliendId}&redirect_uri=${encodeLink}&state=${state}&scope=${encodeScope}`
  return SampleLink
}
const redirectGHLink = createLink(clientId, redirect , "read:user")


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

  try {
    ctx.response.status = 200;
    ctx.response.body = {
      message: 'success',
      data: ctx.response.redirect(redirectGHLink)
      
    };
  } catch(err) {
    return console.log(err);
    }
  await next()
};
  

const OauthTwo = async (ctx:any, next:any) => {
    ctx.response.status = 200;
    const stringPathName: string = ctx.request.url;
    console.log(`stringPath ${stringPathName}`)
    const code: string = JSON.stringify(stringPathName.search) 
    console.log(`code ${code}`)
    const parsedCode = code.slice(code.indexOf('"?code=')+7, code.indexOf('&state'))
    console.log(`parsedCode ${parsedCode}`)
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
      return response.text()
    })
    .then((paramsString: any) => {
      let params = new URLSearchParams(paramsString)
      let tokenKey = [];
      for (const [key, value] of params.entries()){
        tokenKey.push(key, value)
      }
     
      let obj: any = tokenKey[0]
      let values = Object.values(obj)

      const tokenArr = []
      let i = 17;
      
      while (values[i] !== '"') {
        tokenArr.push(values[i])
        i++
      }

    const bearerToken = tokenArr.join('')

    console.log('access_token', bearerToken)
  
    setBearerToken(bearerToken)
    })

  await next()
};

const sessionCheck = async (ctx:any, next:any) => {
  const jwt = await ctx.cookies.get("jwt") || '' ;
    if(jwt) {
      await next()
    } else {
    
    const test = await ctx.cookies.get("test") || '';
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


  export { OauthOne, OauthTwo, sessionCheck }