import { ChangeDetectorRef,  OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FattureService } from '../services/fatture.service';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef,  GridOptions } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { Fattura } from '../services/fatture.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ValueGetterParams } from "ag-grid-community";
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { themeQuartz } from 'ag-grid-community';
import { FatturaData, gridOptions , themeGrigliaPosizioniInEssere } from "./gridOptions";
import { Component } from '@angular/core';
import { createTheme } from 'ag-grid-community';

import { AllEnterpriseModule } from "ag-grid-enterprise";




ModuleRegistry.registerModules([AllCommunityModule]);
ModuleRegistry.registerModules([AllEnterpriseModule]);


interface IRow {
    make: string;
    model: string;
    price: number;
    electric: boolean;
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

      
  themeGrigliaPosizioniInEssere = themeGrigliaPosizioniInEssere;
  
  
  rowDataFattura: FatturaData[] = [];
  //rowData = signal<FatturaData[]>([]);
  rowData : FatturaData[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    private fattureService: FattureService ,
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar
    
  ) {}



  //columnDefs = gridOptions.columnDefs;
  colDefsFattura = gridOptions.columnDefs;
  //gridOptions = gridOptions;
  gridOptions: GridOptions = {
    ...gridOptions,                     // conserva tutte le proprietà già definite
    context: { componentParent: this }  // aggiunge il contesto per i cellRenderer
  };  

  /*gridOptions1: GridOptions = {
    context: { componentParent: this }
  }*/

  
  ngOnInit(): void {

    var listfatture = 
            this.fattureService._getListaFatture()
            .subscribe(fatture => {
                      console.log('Fatture decriptate:', fatture);      
                      this.rowDataFattura = fatture;
                      //this.rowData = fatture;
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
                  //this.cd.detectChanges();
                });
    
     });
 
     // ✅ 3. Intercetto ogni cambio di route
     this.router.events
       .pipe(filter(event => event instanceof NavigationEnd))
       .subscribe(event => {
         console.log('🔄 Route cambiata:', (event as NavigationEnd).url);
       });
    

  }
  

  /*gridOptions: GridOptions = {
    rowSelection: 'single',
    suppressRowClickSelection: false,
    // altre opzioni...
  };*/
  
  /*gridOptions = {
    context: { componentParent: this }
  };*/
    

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

