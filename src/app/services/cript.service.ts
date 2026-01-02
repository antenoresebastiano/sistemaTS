import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';


const secretKey = '1234567890123456'; //'melinaRosaci1234';  
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

 _decripta(value: string): string {

    /*const decrypted = CryptoJS.AES.decrypt(value, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);

    return decrypted || value;*/
    
    const bytes = CryptoJS.AES.decrypt(value, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);


  }

  decripta(value: string): string {
    const key = CryptoJS.enc.Utf8.parse(secretKey);
    const iv = CryptoJS.enc.Utf8.parse(secretKey.substring(0, 16));

     var decrypted = '';
    
     try {
     decrypted = CryptoJS.AES.decrypt(value, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
  
  } catch (error) {
     console.log("valorer errore " + value);
      return value;
    } 

    return decrypted || value;

  }

  
}
