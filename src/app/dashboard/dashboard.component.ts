import { Component , OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  codiceFiscaleMedico = 'RSCCML58A44F112E';
  indirizzoMedico = "Via Mar Nero 3/B Milano";

  codiceFiscalePaziente = '';
  indirizzoPaziente = "";
  nomeCompletoPaziente = "";
  
  filtro = "A";
  listaOpzioni: any[] = [];
  opzioneSelezionata : any[] = [];

   valoreSelezionato: string = '';
   importoSelezionato : string = '100 €';
  
  dataSelezionata: Date = new Date();
  numFattura : string = "10";
  valoreSelezionatoImporto = "";


  lista = [
    { valore: 'Certificato Anamnestico per patente', descrizione: 'Certificato Anamnestico per patente' },
    { valore: 'Certificato Invalidità', descrizione: 'Certificato Invalidità' },  
  ];


  listaImporto = [
    { valore: '100 €', descrizione: '100 €' },
    { valore: '50 €', descrizione: '50 €' },
    { valore: '130 €', descrizione: '130 €' },
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
        this.codiceFiscalePaziente = paziente.CodiceFiscale;
        this.indirizzoPaziente = paziente.Indirizzo + " " + paziente.Comune;
        this.nomeCompletoPaziente = paziente.NomeCompleto
      }
    }

    generaPdf() {
      const doc = new jsPDF();

      // Titolo
      doc.setFontSize(16);
      doc.text('Fattura', 10, 10);
  
      // Dati base
      doc.setFontSize(12);
      doc.text(`Numero fattura: ${this.numFattura}         ${this.dataSelezionata.toLocaleDateString()}`  , 10, 20);

      doc.text(`Dott.ssa : ${this.username}  ${this.codiceFiscaleMedico}` , 10, 30);
      doc.text(`${this.indirizzoMedico} ` , 10, 40);
      
      
      
      doc.text(`Paziente: ${this.nomeCompletoPaziente}`, 10, 70);
      doc.text(`Codice Fiscale: ${this.codiceFiscalePaziente}`, 10, 80);
      doc.text(`Indirizzo: ${this.indirizzoPaziente}`, 10, 90);

      doc.text(` ${this.valoreSelezionato}`, 10, 110);
      doc.text(`Importo  ${this.importoSelezionato}`, 10, 120);
      //doc.text(`Totale: ${this.totale} €`, 10, 50);
  
      // (opzionale) tabella
      autoTable(doc, {
        startY: 60,
       // head: [['Voce', 'Q.tà', 'Prezzo', 'Totale']],
        body: [
          // esempio statico, puoi sostituirlo con array del form
         // ['Prodotto A', '2', '10 €', '20 €'],
         // ['Prodotto B', '1', '15 €', '15 €']
        ]
      });
  
      // Scarica il PDF
      doc.save(`fattura_${this.numFattura || 'senza_numero'}.pdf`);

    }

    
}
