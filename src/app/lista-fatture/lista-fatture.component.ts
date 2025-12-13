import { ChangeDetectorRef, Component , OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FattureService } from '../services/fatture.service';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { Fattura } from '../services/fatture.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ValueGetterParams } from "ag-grid-community";
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

ModuleRegistry.registerModules([AllCommunityModule]);


interface IRow {
    make: string;
    model: string;
    price: number;
    electric: boolean;
  }
  
  interface IRowFattura {
    numero: number;
    paziente: string;
    importo: number;
    imponibile: number;
    codiceFiscalePaziente : string;
    data : string;
    iva : number;
    ivaPerc : number;
  }


@Component({
  selector: 'lista-fatture',
  standalone: true,
  imports: [
    CommonModule,
    AgGridAngular,
    FormsModule
  ],
  templateUrl: './lista-fatture.component.html',
  styleUrls: ['./lista-fatture.component.css']
})
export class ListaFattureComponent implements OnInit {

    rowDataFattura: IRowFattura[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    private fattureService: FattureService ,
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar
  ) {}

 
  ngOnInit(): void {

    var listfatture = 
            this.fattureService._getListaFatture()
            .subscribe(fatture => {
                      console.log('Fatture decriptate:', fatture);      
                      this.rowDataFattura = fatture;
                      this.cd.detectChanges();
              });
        
     // ✅ 1. Leggo i parametri della route all'inizializzazione
     const id = this.route.snapshot.params['id'];
     console.log('Parametro iniziale:', id);
 
     // ✅ 2. Mi iscrivo ai cambi dei parametri della route
     this.route.params.subscribe(params => {
         var listfatture =
          this.fattureService._getListaFatture()
              .subscribe(valore => {
                  this.rowDataFattura = valore;
                  this.cd.detectChanges();
                });
    
     });
 
     // ✅ 3. Intercetto ogni cambio di route
     this.router.events
       .pipe(filter(event => event instanceof NavigationEnd))
       .subscribe(event => {
         console.log('🔄 Route cambiata:', (event as NavigationEnd).url);
       });
    

  }
  
  gridOptions = {
    context: { componentParent: this }
  };
  
  modifica(fattura: Fattura) {
    console.log("Modifica fattura:", fattura);
  }
  
  elimina(fattura: Fattura) {
   /* if (confirm(`Sei sicuro di voler eliminare la fattura ${fattura.numero}`)) {
        this.fattureService.eliminaFattura(fattura).subscribe({
          next: () => { 
              this.snack.open(`Fattura ${fattura.numero} eliminata`, 'OK', { duration: 3000 });
              this.fattureService._getListaFatture()
              .subscribe(valore => {
                  this.rowDataFattura = valore;
                  this.cd.detectChanges();
                });
            },
          error: err => { alert("Errore durante la cancellazione della fattura.") },
          complete: () => {  }
        });
    }*/
    
    
    Swal.fire({
      title: 'Sei sicuro?',
      text: `Vuoi eliminare la fattura ${fattura.numero}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sì, elimina',
      cancelButtonText: 'Annulla'
    }).then(result => {
      if (result.isConfirmed) {
        this.fattureService.eliminaFattura(fattura).subscribe(() => {
            Swal.fire('Eliminata!', `Fattura ${fattura.numero} eliminata.`, 'success');
            this.fattureService._getListaFatture().subscribe(valore => {
              this.rowDataFattura = valore;
              this.cd.detectChanges();
            });
        });
      }
    });


  }
  

  colDefsFattura: ColDef<IRowFattura>[] = [
    { field: "numero" , headerName: "Num. Fattura", width: 10 , flex: 1 },
    { field: "data" },
    { field: "paziente" },
    { field: "codiceFiscalePaziente" },
    { field: "imponibile" , cellStyle: { textAlign: "right" } },
    { field: "ivaPerc" , headerName: "iva %" , cellStyle: { textAlign: "right" }  },
    { field: "iva" , headerName: "importo iva" , cellStyle: { textAlign: "right" } },
    { field: "importo" , headerName: "Importo Fattura" , cellStyle: { textAlign: "right" } } , 
    {
      headerName: "Azioni",
      cellRenderer: (params: { context: { componentParent: { modifica: (arg0: any) => any; elimina: (arg0: any) => any; }; }; data: any; }) => {
        const container = document.createElement("div");
    
        const btnEdit = document.createElement("button");
        btnEdit.innerText = "✏️";
        btnEdit.addEventListener("click", () => params.context.componentParent.modifica(params.data));
    
        const btnDelete = document.createElement("button");
        btnDelete.innerText = "🗑️";
        btnDelete.addEventListener("click", () => params.context.componentParent.elimina(params.data));
    
        container.appendChild(btnEdit);
        container.appendChild(btnDelete);
    
        return container;
      },
      width: 120
    }
    

  ];
  
 gridApi: any;

onGridReady(params: any) {
    this.gridApi = params.api;
}


  defaultColDef: ColDef = {
    flex: 1,
  };

  exportExcel() {
    this.gridApi.exportDataAsExcel({
      fileName: 'fatture.xlsx'
    });
  }
  
  exportSelectedCsv() {
    this.gridApi.exportDataAsCsv({
      onlySelected: false,
      fileName: 'fatture_selezionate.csv'
    });
  }
  

  

}

