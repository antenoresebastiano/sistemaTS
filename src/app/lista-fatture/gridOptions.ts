import type { GridOptions } from "ag-grid-community";
import { ValueGetterParams } from 'ag-grid-community';
import 'ag-grid-enterprise';
import { themeQuartz } from 'ag-grid-community';



export interface FatturaData {
    numero: number;
    paziente: string;
    importo: number;
    imponibile: number;
    codiceFiscalePaziente : string;
    data : string;
    iva : number;
    ivaPerc : number;
  }

  export const gridOptions: GridOptions<FatturaData> = {
         columnDefs: [
            {    field: "numero",
                 headerName: "Num. Fattura",
                 width: 10 , flex: 1 
            },
            {    field: "data" 
            
            },
            {    field: "paziente",
                 filter: 'agSetColumnFilter',
                 floatingFilter: true,

            }, 
            {    field: "codiceFiscalePaziente", 
                 filter: "agTextColumnFilter" ,
                 floatingFilter: true

            }, 
            {    field: "imponibile",
                 cellStyle: { textAlign: "right" } 
            },
            {    field: "ivaPerc",
                 headerName: "iva %",
                 cellStyle: { textAlign: "right" } 
            }, 
            {    field: "iva", 
                 headerName: "importo iva" ,
                 cellStyle: { textAlign: "right" } 
            },
            {    field: "importo",
                 headerName: "Importo Fattura", 
                 cellStyle: { textAlign: "right" } 
            } , 
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
                width: 120,
                cellStyle: { textAlign: "right" } 
              }
          
          ],
          defaultColDef: {
            flex: 1,
            minWidth: 100,
            filter: true,
            sortable: true,
            resizable: true,
          },
          enableFilterHandlers: true,
          sideBar: {
            toolPanels: ["columns", "filters"],
            defaultToolPanel: "filters"  
          },
          
};  


export const themeGrigliaPosizioniInEssere =  themeQuartz.withParams({
     accentColor: "#087AD1",
     backgroundColor: "#ffffff",
     borderColor: "#D7E2E6",
     borderRadius: 2,
     browserColorScheme: "light",
     cellHorizontalPaddingScale: 0.7,
     chromeBackgroundColor: {
         ref: "backgroundColor"
     },
     columnBorder: false,
     fontFamily: {
         googleFont: "Inter"
     },
     fontSize: 13,
     foregroundColor: "#555B62",
     headerBackgroundColor: "#F4EAEA",
     headerFontSize: 13,
     headerFontWeight: 400,
     headerTextColor: "#84868B",
     rowBorder: true,
     rowVerticalPaddingScale: 0.8,
     sidePanelBorder: true,
     spacing: 6,
     wrapperBorder: false,
     wrapperBorderRadius: 2
 });

