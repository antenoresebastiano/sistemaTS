import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';


const secretKey = 'chiave-super-segreta';
const key = CryptoJS.enc.Utf8.parse(secretKey);
const iv = CryptoJS.enc.Utf8.parse(secretKey.substring(0, 16));
    
@Injectable({
  providedIn: 'root'
})

 

export class CriptService {
  // modifica remote main
  // modifica locale main
  constructor() {}


cripta(value: string): string  {
    const testo = CryptoJS.AES.encrypt(value, key, {  
            iv,  
            mode: CryptoJS.mode.CBC,      
            padding: CryptoJS.pad.Pkcs7    
        }).toString();
    const decripta  = this.decripta(testo);
    
    return decripta;
    
  }

 decripta(value: string): string {

    const decrypted = CryptoJS.AES.decrypt(value, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);

    return decrypted || value;
  }


  
}
