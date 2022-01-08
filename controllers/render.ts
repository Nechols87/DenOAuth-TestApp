import { renderFileToString } from "https://deno.land/x/dejs@0.10.2/mod.ts";


export const home = async (ctx: any) => {
    ctx.response.status = 200;
    ctx.response.body = await renderFileToString(
      `${Deno.cwd()}/views/home.ejs`,
      {},
    );
  }

export const loginPage = async (ctx: any) => {
    ctx.response.status = 200;
    ctx.response.body = await renderFileToString(
      `${Deno.cwd()}/views/login.ejs`,
      {
        error: false,
      },
    );
  }

  export const registerPage = async (ctx: any, next: Function) => {
    ctx.response.status = 200;
    ctx.response.body = await renderFileToString(
      `${Deno.cwd()}/views/register.ejs`,
      {},
    );
  }

  export const storePage = async (ctx: any) => {
    ctx.response.status = 200;
    ctx.response.body = await renderFileToString(
      `${Deno.cwd()}/views/store.ejs`,
      {},
    );
  }


