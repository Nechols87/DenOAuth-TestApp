import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Client } from "https://deno.land/x/postgres/mod.ts"
import { dbCreds } from '../config.ts'

const client = new Client(dbCreds);

const obj = config()
const clientSecret = Object.values(obj)[4]
const clientId:string = '9a02a938c53b4cc59e3b7e389529cea9'
const redirect:string = "http://localhost:3000/auth/spotify/callback"
const scope:string = 'user-read-email' 

// https://accounts.spotify.com/authorize?client_id=9a02a938c53b4cc59e3b7e389529cea9&scope=user-read-private&response_type=code&redirect_uri=http://localhost:3000/auth/spotify/callback


const createLink = (clientId:string, redirect:any, scope:string) => {
  const state: number = Math.floor(Math.random() * 1000000000)
  const SampleLink = `https://accounts.spotify.com/authorize?client_id=${clientId}&scope=${scope}&response_type=code&redirect_uri=${redirect}&state=${state}`
  return SampleLink
}

const newLink = createLink(clientId, redirect, scope)

const setBearerToken = async (bearToken: any) => {
  const userResponse = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${bearToken}`,
    },
  });
  const {display_name} = await userResponse.json()
  console.log(`Hello ${display_name}`)
  
}

const SOauthOne = async (ctx:any, next:any) => {
  ctx.response.status = 200;
    ctx.response.body = {
        message: 'success',
        data: ctx.response.redirect(newLink)       
    };
}

const findCode2 = async (ctx:any, next:any) => {
  ctx.response.status = 200;
  const stringPathName: string = ctx.request.url;
  console.log(`stringPathName ${stringPathName}`)
  const code: string = JSON.stringify(stringPathName.search)
  const parsedCode = code.slice(code.indexOf('"?code=')+7, code.indexOf('&state'))


  const tokens = await fetch('https://accounts.spotify.com/api/token',{
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    body: new URLSearchParams({
      'grant_type': "authorization_code",
      'code': parsedCode,
      'redirect_uri': redirect,
      'client_id': clientId,
      'client_secret': clientSecret
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
    let i = 17;
    while (values[i] !== '"') {
      tokenArr.push(values[i])
      i++
    }
    const bearerToken = tokenArr.join('')

    console.log('access_token', bearerToken)

    setBearerToken(bearerToken)
 })
  return await next();
}

export { SOauthOne, findCode2 }