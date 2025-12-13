import { ChangeDetectorRef, Component , OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { Fattura, FattureService } from '../services/fatture.service';
import { endWith } from 'rxjs';
import Swal from 'sweetalert2';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'dd MMMM yyyy',
  },
  display: {
    dateInput: 'dd MMMM yyyy',
    monthYearLabel: 'MMMM yyyy',
    dateA11yLabel: 'dd MMMM yyyy',
    monthYearA11yLabel: 'MMMM yyyy',
  }
};

export interface Paziente {
  id      : string;
  Nome    : string;
  Cognome : string;  
  CodiceFiscale : string;
  Indirizzo     : string;
  Comune        : string;
  NomeCompleto  : string;

}

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
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})



export class DashboardComponent implements OnInit {

  constructor(private cd: ChangeDetectorRef , private http: HttpClient , private fattureService: FattureService) {}
  
  pbSalvaFattura : boolean = false;
  fattureEmesse : any[] = [];

//  dataSelezionata: Date | null = new Date();
  dataSelezionata: string = new Date().toISOString().substring(0, 10);

  nextFattura : number = 0;

  username = 'Rosaci Carmela';
  codiceFiscaleMedico = 'RSCCML58A44F112E';
  indirizzoMedico = "Via Mar Nero 3/B Milano";

  codiceFiscalePaziente = '';
  indirizzoPaziente = "";
  nomeCompletoPaziente = "";
  
  filtro = "A";
  listaOpzioni: any[] = [];
 
  listaPazientiFiltrata: Paziente[] = [];
  listaPazienti: Paziente[] = [];
  opzioneSelezionata: string = '';

  valoreSelezionato: string = '';
  importoSelezionato : string = '100 €';

  valoreSelezionatoImporto = "";
  valoreSelezionatoIva = "0";

  listaCertificato: any[] = [];

  lsPazienti: Paziente[] = [];

  listaImporto = [
    { valore: '81.97 €', descrizione: '81.97 €' },
    { valore: '50 €', descrizione: '50 €' },
    { valore: '106.57 €', descrizione: '106.57 €' },
  ];

  listaIva = [
    { valore: '0' , descrizione: '0'  },
    { valore: '22', descrizione: '22' },
  ];


    ngOnInit() {
        this.http.get<any[]>('assets/clienti.json').subscribe((data: any[]) => {
         this.listaPazienti = data;
         this.listaPazienti = data.map((paziente, index) => ({
          ...paziente,
              id: `P${String(index + 1).padStart(3, '0')}`
          }));
       
        });

        this.http.get<any[]>('assets/certificati.json').subscribe((data: any[]) => {
          this.listaCertificato = data;
         });

         this.nuovaFattura(); 
     
    }

   
       
    listaFiltrata() {
      const f = (this.filtro || '').toLowerCase();
    
      return this.listaPazientiFiltrata.filter(item =>
        ((item?.Cognome ?? '').toLowerCase().includes(f)) ||
        ((item?.Nome ?? '').toLowerCase().includes(f))
      );
    }
    

    listaFiltrataPazienti(): Paziente[] {
      
      const f = (this.filtro || '').toLowerCase();

      return this.listaPazienti.filter(item =>
        ((item?.Cognome ?? '').toLowerCase().includes(f)) ||
        ((item?.Nome ?? '').toLowerCase().includes(f))
      );

    }
  

    filtraPazienti() {

      const f = (this.filtro || '').toLowerCase();
      
      this.lsPazienti = this.listaPazienti.filter(item =>
        ((item?.Cognome ?? '').toLowerCase().includes(f)) ||
        ((item?.Nome ?? '').toLowerCase().includes(f))
      );

    }


    pazienteSelezionato() {
      return this.listaOpzioni.find(x => x.id == this.opzioneSelezionata);
    }

    onPazienteChange() {
      const paziente = this.lsPazienti.find(p => p.id == this.opzioneSelezionata);
      
      console.log("Paziente selezionato:", paziente); // DEBUG
    
      if (paziente) {
        this.codiceFiscalePaziente = paziente.CodiceFiscale;
        this.indirizzoPaziente = paziente.Indirizzo + " " + paziente.Comune;
        this.nomeCompletoPaziente = paziente.NomeCompleto
      }

    }

    generaPdf() {
      const doc = new jsPDF();
      let nuovaFattura : Fattura = this.getFattura();
 
        // Titolo
      doc.setFontSize(16);
      doc.text('Fattura', 10, 10);
        // Dati base
      doc.setFontSize(12);
      doc.text(`Numero fattura: ${this.nextFattura} del  ${nuovaFattura.data}`  , 10, 20);
      doc.text(`Dott.ssa : ${this.username}  ${this.codiceFiscaleMedico}` , 10, 30);
      doc.text(`${this.indirizzoMedico} ` , 10, 40);
      
      doc.text(`Paziente: ${this.nomeCompletoPaziente}`, 10, 70);
      doc.text(`Codice Fiscale: ${this.codiceFiscalePaziente}`, 10, 80);
      doc.text(`Indirizzo: ${this.indirizzoPaziente}`, 10, 90);

      doc.text(` ${this.valoreSelezionato}`, 10, 110);
      
      doc.text(`Imponibile : €  ${nuovaFattura.imponibile} `, 10, 130);
      doc.text(`iva ${nuovaFattura.ivaPerc} %`, 80, 130);

      //importoIva = Math.round(importoIva* 100)/100;
      doc.text(`: ${nuovaFattura.iva} €`, 99, 130);

      doc.text(`Totale fattura:  ${nuovaFattura.importo} €`, 10, 140);
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
      doc.save(`fattura_${this.nextFattura || 'senza_numero'}.pdf`);

    }

    getFattura() : Fattura {
      let ivaPerc : number = Number(this.valoreSelezionatoIva);   
      let imponibile: number = Number(this.valoreSelezionatoImporto.replace("€", "").trim());
      let ivaSuImponibile: number = ivaPerc > 0 ? (Math.trunc(imponibile) * ivaPerc)/100: 0

      const nuovaFattura = {
        id          : crypto.randomUUID(),
        numero      : this.nextFattura,
        //data        : this.dataSelezionata?.toLocaleDateString() ?? "",
        data        : this.dataSelezionata ?? "",
        imponibile  : imponibile,
        importo     : Math.ceil(imponibile + ivaSuImponibile),
        paziente    : this.nomeCompletoPaziente,
        iva         : ivaSuImponibile,
        ivaPerc     : ivaPerc,
        codiceFiscalePaziente : this.codiceFiscalePaziente
      };

      return nuovaFattura;

    }



    salvaFattura() {
      let nuovaFattura = this.getFattura();
      this.fattureService.checkEsistenzaFattura(nuovaFattura.numero).subscribe(esiste => {
        if (esiste) {
            //alert("Fattura n. " + nuovaFattura.numero + " esistente.")
            Swal.fire('Attenzione!', `Fattura ${nuovaFattura.numero} esistente.`, 'info');          
        } else {
                    
          /*if (confirm("Sei sicuro di voler salvare questa fattura?")) {
            let nuovaFattura = this.getFattura();
            var listfatture = this.fattureService.insertNewFattura(nuovaFattura);
              listfatture.subscribe(valore  => {
                console.log('Valore ricevuto:', valore);
            });
            this.pbSalvaFattura  = false;
          }*/
          Swal.fire({ title: 'Sei sicuro?',text: `Vuoi inserire la fattura ${nuovaFattura.numero}?`,
                      icon: 'warning',showCancelButton: true,confirmButtonText: 'Sì, inserisci',cancelButtonText: 'Annulla'
          }).then(result => {
            let nuovaFattura = this.getFattura();
            var listfatture = this.fattureService.insertNewFattura(nuovaFattura);
              listfatture.subscribe(valore  => {
                console.log('Valore ricevuto:', valore);
            });
            this.pbSalvaFattura  = false;

          });

        }
      });
     
     
      
    }

    scaricaArchivioFatture() {
      
      var listfatture = this.fattureService
            ._getListaFatture().subscribe(valore => {
              console.log('Valore ricevuto:', valore);
            });
  

      /*this.fattureService.getFatture().subscribe(fatture => {

        const blob = new Blob(
          [JSON.stringify(fatture, null, 2)],
          { type: 'application/json' }
        );
      
        console.log(JSON.stringify(fatture, null, 2));
        
        
        const url = URL.createObjectURL(blob);
      
        const a = document.createElement('a');
        a.href = url;
        a.download = 'fatture.json';
        a.click();
      
        URL.revokeObjectURL(url);

      });*/


    }

    handleNumero( numero : string ) {
      this.nextFattura = (parseInt(numero) + 1);
      this.cd.detectChanges();
    }

   

    async nuovaFattura() {
        var numero = await this.fattureService.getNextNumFattura().toPromise() ?? 0;

        this.nextFattura = numero 
        this.codiceFiscalePaziente = "";
        this.indirizzoPaziente = "";
        this.nomeCompletoPaziente = "";

        this.cd.detectChanges();
    }
   
    
    

 }
 
