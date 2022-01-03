import { OAuth2Client } from "https://deno.land/x/oauth2_client/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Client } from "https://deno.land/x/postgres/mod.ts"
import { dbCreds } from '../config.ts'

const client = new Client(dbCreds);

const obj = config()
const clientKey = Object.values(obj)[3]
const clientId:string = '355975710617-pu1n5okl8jpuh9ofqnclji3bqk6gk88o.apps.googleusercontent.com'
const redirect:string = "http://localhost:3000/auth/google/callback"

const hardCode = 'https://accounts.google.com/o/oauth2/v2/auth?scope=https://mail.google.com&access_type=offline&include_granted_scopes=true&response_type=code&state=state_parameter_passthrough_value&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fstore&client_id=355975710617-72oa7uqupki1hhce0c036ai69edioj7e.apps.googleusercontent.com'

const createLink: Function = (cliendId:String, redirect:any) => {
    const state: Number = Math.floor(Math.random() * 1000000000)
    const encodeLink: any = encodeURIComponent(redirect)
    let SampleLink: String = `https://accounts.google.com/o/oauth2/v2/auth?scope=https://mail.google.com&access_type=offline&include_granted_scopes=true&response_type=code&state=${state}&redirect_uri=${encodeLink}&client_id=${cliendId}`
    return SampleLink
  }
  const redirectGoogleLink = createLink(clientId, redirect)


const setBearerToken = async (bearToken: any) => {
    const userResponse = await fetch("https://www.googleapis.com/drive/v2/files", {
      headers: {
        Authorization: `Bearer ${bearToken}`,
      },
    });
    console.log(await userResponse.json())
    // const {localizedFirstName} = await userResponse.json()
    // console.log(`Hello ${localizedFirstName}`)
    
}


const GOauthOne = async (ctx:any, next:any) => {
    ctx.response.body = {
        message: 'success',
        data: ctx.response.redirect(redirectGoogleLink) 
    };
}


const findGoogleCode = async (ctx:any, next:any) => {
    const stringPathName: String = ctx.request.url;
    
    const code: String = JSON.stringify(stringPathName.search)
    console.log(code)
    const parsedCode = code.slice(code.indexOf('"?code=')+24, code.indexOf('&scope'))
    console.log(`parsedCode ${parsedCode}`)
  
  
    // const tokens = await fetch('https://oauth2.googleapis.com/token',{
    const tokens = await fetch('https://accounts.google.com/o/oauth2/token',{
    method: 'POST',
    headers: {
      // 'Accept': 'application/json',
      // "Content-type": "application/json"
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },

    body: new URLSearchParams({
      'code': parsedCode,
      'client_id': clientId,
      'client_secret': clientKey,
      'redirect_uri': redirect,
      'grant_type': "authorization_code",
    })
   })
   .then((response: any) => {
    console.log(response)
    return response.text()
  })
  .then((paramsString: any) => {
    let params = new URLSearchParams(paramsString)
      console.log(`params ${params}`);
      let tokenKey = [];
      for (const [key, value] of params.entries()){
      // for (const key in params){
        
        tokenKey.push(key, value)
      }
      console.log(`tokenKey first element ${tokenKey[0]}`)
      let obj: any = tokenKey[0]
      let values = Object.values(obj)
      console.log(`values ${values}`)
      const tokenArr:any = []
      console.log(`tokenArr ${tokenArr}`)
      let i = 21;
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
      console.log(`typeof for token ${typeof bearerToken}`)
      console.log('access_token', bearerToken)
  
      setBearerToken(bearerToken)

   })
   
    return await next();
  }
const accessToken = 'ya29.a0ARrdaM-Mgg8vzS_OEgY5LQGeJSJ6cZCKgSv7Ayb1RXiPFxw92PT2YsVdRtYg6fgdnKuqjhLUbvozSN6eiRWU5c6g4ARCGwGY80Na3M2C1oVonxKqY5tRf9MMg25y0497t85hZ2XwLCDCtpCnvsYmiU6mLuXD'
const refresh_token = "1//0fZThYb5fInCNCgYIARAAGA8SNwF-L9Ir3L1rAKiM8gvI9kM_OCY5gV1V5A7ESVhphNkzTjtdi9he-g0OcQhhGmzX7WwdGkBCcPg"

export { GOauthOne, findGoogleCode } 

// var xhr = new XMLHttpRequest();
// xhr.open('GET',
//     'https://www.googleapis.com/drive/v3/about?fields=user&' +
//     'access_token=' + params['access_token']);
// xhr.onreadystatechange = function (e) {
//   console.log(xhr.response);
// };
// xhr.send(null);
/**
 * 
 */