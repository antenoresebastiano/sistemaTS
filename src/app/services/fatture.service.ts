import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';


const secretKey = 'chiave-super-segreta';

export interface Fattura {
  id        : string;
  numero    : number;
  data      : string;
  imponibile: number;
  importo   : number;
  paziente  : string;
  iva       : number;
  ivaPerc   : number;
  codiceFiscalePaziente : string; 
}

@Injectable({
  providedIn: 'root'
})



export class FattureService {

  constructor(private http: HttpClient) {}

   private key = 'fatture';
  private url = 'assets/fatture.json';
  private urlFatture = 'http://localhost:3000/fatture'; //'https://wsfatture.onrender.com/fatture';   //
   
  
  private encryptObject(fattura: Fattura) {
    
    fattura.paziente =  CryptoJS.AES.encrypt(fattura.paziente, secretKey).toString();
    fattura.codiceFiscalePaziente =  CryptoJS.AES.encrypt(fattura.codiceFiscalePaziente, secretKey).toString();
    return fattura;

  }

  decryptField(value: string): string {
    try {
      const decrypted = CryptoJS.AES.decrypt(value, secretKey).toString(CryptoJS.enc.Utf8);
        // ✅ Se decrypt fallisce, CryptoJS restituisce stringa vuota
      return decrypted || value;
  
    } catch {
      return value;
    }
  }

  private decryptFattura(fattura : Fattura) {
    return {
      ...fattura,
      paziente: this.decryptField(fattura.paziente),
      codiceFiscalePaziente: this.decryptField(fattura.codiceFiscalePaziente)
    };
  }        
   
  
  
  //const encrypted = CryptoJS.AES.encrypt(testo, secretKey).toString();
  
    _getListaFatture(): Observable<Fattura[]> {
      return this.http.get<Fattura[]>(this.urlFatture).pipe(
          map(fatture => fatture.map(f => this.decryptFattura(f)))
      );
    }
  
  
  insertNewFattura = ( fattura: Fattura ) =>  this.http.post<Fattura>(this.urlFatture, this.encryptObject(fattura));
      
  getUltimoNumeroFattura(): Observable<number> {
    return this._getListaFatture().pipe(
      map((fatture: Fattura[]) => {
        if (!fatture.length) return 0;
  
        const ultima = fatture.reduce((max, f) =>
          f.numero > max.numero ? f : max
        );
  
        return ultima.numero;
      })
    );
  }

  getNextNumFattura(): Observable<number> {
    return this.http.get<Fattura[]>(this.urlFatture).pipe(
      map(fatture => {
        if (!fatture || fatture.length === 0) {
          return 1; // se non ci sono fatture, inizio da 1
        }
        const maxNumero = Math.max(
          ...fatture
            .filter(f => f.numero != null)   // esclude undefined e null
            .map(f => f.numero)
        );
        return maxNumero + 1;
      })
    );
  }
  

  checkEsistenzaFattura(numero: number): Observable<boolean> {
    return this.http.get<Fattura[]>(this.urlFatture).pipe(
      tap(f => console.log('Fatture:', f)),
      map(fatture => fatture.some(f => String(f.numero) === String(numero))),
      tap(esiste => console.log('Esiste fattura', numero, '?', esiste))
    );
  }  


  eliminaFattura(fattura: Fattura): Observable<void> {
    return this.checkEsistenzaFattura(fattura.numero).pipe(
      tap(esiste => {
        if (!esiste) {
          throw new Error("La fattura non esiste");
        }
      }),
      switchMap(() =>
        this.http.delete<void>(`${this.urlFatture}/${fattura.id}`)
      ),
      tap(() => console.log("Fattura eliminata:", fattura.numero))
      
    );
  }
  

}
