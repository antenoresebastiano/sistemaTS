import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Fattura {
  id        : string;
  numero    : string;
  data      : string;
  imponibile: number;
  importo   : number;
  paziente  : string;
  iva       : number;
  ivaPerc   : number;
}

@Injectable({
  providedIn: 'root'
})
export class FattureService {

  constructor(private http: HttpClient) {}

  private key = 'fatture';
  private url = 'assets/fatture.json';

  getFattureLocalStorage(): Fattura[] {
    const dati = localStorage.getItem(this.key);
    return dati ? JSON.parse(dati) : [];
 
  }

 
  getFatture(): Observable<Fattura[]> {
    return this.http.get<Fattura[]>(this.url);
  }

  esisteFattura(numero: string): boolean {
    return true; //this.getFatture().some(f => f.numero === numero);
  }

  
  aggiungiFattura(fattura: Fattura): Observable<Fattura[]> {
    return this.getFatture().pipe(
      map((lista: Fattura[]) => {
        lista.push(fattura);
        localStorage.setItem(this.key, JSON.stringify(lista));
        return lista;
      })
    );
  }


  aggiornaFattura(fattura: Fattura): Observable<Fattura[]> {
    return this.getFatture().pipe(
      map((lista: Fattura[]) => {
        const index = lista.findIndex(f => f.id === fattura.id);
  
        if (index !== -1) {
          lista[index] = fattura;
          localStorage.setItem(this.key, JSON.stringify(lista));
        }
  
        return lista; // restituisce la lista aggiornata
      })
    );
  }

  cancellaFattura(id: string): Observable<Fattura[]> {
    return this.getFatture().pipe(
      map((lista: Fattura[]) => {
        const nuovaLista = lista.filter(f => f.id !== id);
        localStorage.setItem(this.key, JSON.stringify(nuovaLista));
        return nuovaLista;
      })
    );
  }

  getUltimoNumeroFattura(): Observable<string> {
    return this.getFatture().pipe(
      map((fatture: Fattura[]) => {
        if (!fatture.length) return "0";
  
        const ultima = fatture.reduce((max, f) =>
          f.numero > max.numero ? f : max
        );
  
        return ultima.numero;
      })
    );
  }

}
