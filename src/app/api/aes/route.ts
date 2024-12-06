// @ts-ignore
import  AES from 'crypto-js/aes'

import  CryptoJS from 'crypto-js'

import { NextRequest, NextResponse } from "next/server";
import { timeStamp } from 'console';


// export const revalidate = 60;

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const type: any = searchParams.get("type")||'encrypt'; // 'xxx'、
    let message: any = searchParams.get("message")||''; // 'xxx'、
    message = decodeURI(message)

    const data = {"success":true,"data":"U2FsdGVkX18HW7Jx/FnJ+ZDBkx/VL/2DPL6wkM1KllE="}


    const key  = 'saifchat';
    let ciphertext='';
   
    const t :any= new Date().getTime()+""
    console.log('[type]',type);
    console.log('[message]',message);
    switch (type) {
        case 'encrypt':
            ciphertext = AES.encrypt(t, key).toString();
            break;
        case 'decrypt':
       
            ciphertext =  AES.decrypt(message,key).toString(CryptoJS.enc.Utf8);
            break;
        case 'test':
            // ciphertext = AES.decrypt(data.data,key).toString();
            ciphertext =  AES.decrypt(data.data,key).toString(CryptoJS.enc.Utf8);
            break;
        case 'validate30':
            // ciphertext = AES.decrypt(data.data,key).toString();
            let timetext:any = AES.decrypt(message,key).toString(CryptoJS.enc.Utf8);
            timetext = parseInt(timetext) 
            const validate = (new Date().getTime()-timetext)/60000-30
            return NextResponse.json({  success: true,validate: validate>0?false:true}, { status: 200 });

            break;    
            
            
        default:
            break;
    }
    console.log('[ciphertext]',ciphertext);
    return NextResponse.json({  success: true,data: encodeURI(ciphertext),timestamp: t}, { status: 200 });
}
