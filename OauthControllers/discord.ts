import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Client } from "https://deno.land/x/postgres/mod.ts"
import { dbCreds } from '../config.ts'

const client = new Client(dbCreds);

const obj = config()
const clientKey = Object.values(obj)[6]
const clientId:string = '929066732650381313'
const redirect:string = "http://localhost:3000/auth/discord/callback"

const hardCode = 'https://discord.com/api/oauth2/authorize?response_type=code&client_id=157730590492196864&scope=identify%20guilds.join&state=15773059ghq9183habn&redirect_uri=https%3A%2F%2Fnicememe.website&prompt=consent'

const createLink = (clientId:string, redirect:any, scope:any) => {
  const state: number = Math.floor(Math.random() * 1000000000)
  const encodeLink: any = encodeURIComponent(redirect)
  const encodeScope: any = encodeURIComponent(scope)
  let SampleLink: string = `https://discord.com/api/oauth2/authorize?response_type=code&client_id=${clientId}&scope=${encodeScope}&state=${state}&redirect_uri=${encodeLink}`
  return SampleLink
}
const redirectGHLink = createLink(clientId, redirect , "identify")


const setBearerToken = async (bearToken: any) => {
  const userResponse = await fetch("http://discordapp.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${bearToken}`,
    },
  });
  const { username } = await userResponse.json()

  console.log(`Hello ${ username }`)
  
}

const DOauthOne = async (ctx:any, next:any) => {

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
  

const DOauthTwo = async (ctx:any, next:any) => {
    
    
  try {
    ctx.response.status = 200;  
    const stringPathName: string = ctx.request.url;
    console.log(`stringPath ${stringPathName}`)
    const code: string = JSON.stringify(stringPathName.search) 
    console.log(`code ${code}`)
    const parsedCode = code.slice(code.indexOf('"?code=')+7, code.indexOf('&state'))
    console.log(`parsedCode ${parsedCode}`)
    await fetch('https://discord.com/api/oauth2/token',{
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: new URLSearchParams({
          'grant_type': "authorization_code",
          'code': parsedCode,
          'redirect_uri': redirect,
          'client_id': clientId,
          'client_secret': clientKey
        })
      })
      .then((response: any) => {
        console.log(response)
        return response.text()
      })
      .then((paramsString: any) => {
        let params = new URLSearchParams(paramsString)
        console.log(params);
        let tokenKey = [];
    
        for (const [key, value] of params.entries()){
          tokenKey.push(key, value)
        }
        console.log(tokenKey[0])
        let obj: any = tokenKey[0]
        let values = Object.values(obj)
        console.log(values)
    
        const tokenArr = []
        let i = 18;
        while (values[i] !== '"') {
          tokenArr.push(values[i])
          i++
        }
        const bearerToken = tokenArr.join('')
    
        console.log('access_token', bearerToken)
    
        setBearerToken(bearerToken)
    })
    
    await next()
  }
  catch(err) {
    return console.log(err);
    }
 
};

export { DOauthOne, DOauthTwo }