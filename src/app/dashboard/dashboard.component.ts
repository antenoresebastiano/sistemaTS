import { Component , OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';


@Component({
  selector: 'app-dashboard.component',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})


export class DashboardComponent implements OnInit {

  constructor(private http: HttpClient) {}

  username = 'Rosaci Carmela';
  codiceFiscale = 'RSCCML58A44F112E';
  indirizzo = "Via Mar Nero 3/B Milano";
  filtro = "A";
  listaOpzioni: any[] = [];
  opzioneSelezionata : any[] = [];

  dataSelezionata: Date | null = null

  valoreSelezionato: string = '';

lista = [
  { valore: 'Certificato Anamnestico per patente', descrizione: 'Certificato Anamnestico per patente' },
  { valore: 'Certificato Invalidità', descrizione: 'Certificato Invalidità' },  
];

  

    /*ngOnInit() {
      this.http.get<any[]>('assets/clienti.json').subscribe((data: any[]) => {
        this.listaOpzioni = data;
      });
    }*/

    ngOnInit() {
      this.http.get<any[]>('assets/clienti.json').subscribe(data => {
        this.listaOpzioni = data.map((item, index) => ({
          ...item,
          id: index + 1   // assegna un id univoco
        }));
      });
    }

    
    onLogin() {
      alert("Iiii");
    }

 
    get listaFiltrata() {
      const f = (this.filtro || '').toLowerCase();
    
      return this.listaOpzioni.filter(item =>
        ((item?.Cognome ?? '').toLowerCase().includes(f)) ||
        ((item?.Nome ?? '').toLowerCase().includes(f))
      );
    }


    get pazienteSelezionato() {
      return this.listaOpzioni.find(x => x.id == this.opzioneSelezionata);
    }

    onPazienteChange() {
      const paziente = this.listaOpzioni.find(p => p.id == this.opzioneSelezionata);
      

      console.log("Paziente selezionato:", paziente); // DEBUG
    
      if (paziente) {
        this.codiceFiscale = paziente.CodiceFiscale;
        this.indirizzo = paziente.Indirizzo;
      }
    }

    
}
