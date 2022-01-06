import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Client } from "https://deno.land/x/postgres/mod.ts"
import { dbCreds } from '../config.ts'

const client = new Client(dbCreds);

const obj = config()
const clientKey = Object.values(obj)[5]
const clientId:string = '600751907683951'
const redirect:string = "https://localhost:3000/auth/instagram/callback/"
const scope:string = 'user_profile' 


// const SampleLink: String = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id={your_client_id}&redirect_uri={your_callback_url}&state=foobar&scope=r_liteprofile%20r_emailaddress%20w_member_social`

const createLink = (cliendId:String, redirect:any, scope:String) => {
  const state: number = Math.floor(Math.random() * 1000000000)
//   const encode: string = encodeURIComponent(redirect)
  let SampleLink: string = `https://api.instagram.com/oauth/authorize?response_type=code&client_id=${cliendId}&redirect_uri=${redirect}&state=${state}&scope=${scope}`
  return SampleLink
}

const newLink = createLink(clientId, redirect, scope)

const setBearerToken = async (bearToken: any) => {
  const userResponse = await fetch("https://graph.instagram.com/v12.0/me", {
    headers: {
      Authorization: `Bearer ${bearToken}`,
    },
  });
//   const response = await userResponse.json()
//   console.log(response)
//   console.log(`Hello ${localizedFirstName}`)
  
}

const IOauthOne = async (ctx:any, next:any) => {
    ctx.response.body = {
        message: 'success',
        data: ctx.response.redirect(newLink)       
    };
}

const findCode3 = async (ctx:any, next:any) => {
  const stringPathName: string = ctx.request.url;
  
  const code: string = JSON.stringify(stringPathName.search)
  const parsedCode = code.slice(code.indexOf('"?code=')+7, code.indexOf('&state'))


  const tokens = await fetch('https://api.instagram.com/oauth/access_token',{
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

export { IOauthOne, findCode3 }