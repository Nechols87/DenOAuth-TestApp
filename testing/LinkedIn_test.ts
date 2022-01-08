import { LinkedInClient } from 'https://deno.land/x/denoauth@v1.0.6/mod.ts';
import { assertEquals } from "https://deno.land/std@0.119.0/testing/asserts.ts"

Deno.test("LinkedIn's createLink method should return the correct url", () => {
  const client = new LinkedInClient({
    clientId: '688zz8dnnxjo4t',
    clientSecret: 'YHhQQW3BaNQCFilB',
    redirect: 'http://localhost:3000/auth/linkedin/callback',
    tokenUri: 'https://api.linkedin.com/v2/me',
    scope: 'r_liteprofile'
  });

  const dummy = client.code.createLink()
  const dummyEncode = encodeURIComponent('http://localhost:3000/auth/linkedin/callback')
  const dummyState = dummy.slice((dummy.indexOf('&state') + 7), -20);

  assertEquals(
    dummy,
    `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=688zz8dnnxjo4t&redirect_uri=${dummyEncode}&state=${dummyState}&scope=r_liteprofile`
    );
});

Deno.test("parsedCode should parse the URL correctly", () => {

  const randomizedCode = Math.random().toString(36).substring(2,13);

  const fakeStringPathName = (`?code=${randomizedCode}&state=777578398`)
  const code:string = JSON.stringify(fakeStringPathName);
  const parsedCodeTest = code.slice(code.indexOf('"?code=')+7, code.indexOf('&state'));
  
  assertEquals(
    randomizedCode,
    parsedCodeTest
  )
});