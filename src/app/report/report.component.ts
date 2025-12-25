import { signal, Component ,  computed, effect } from '@angular/core';
import { ApiService } from '../services/api.service';
import * as CryptoJS from 'crypto-js';
import { FormsModule } from '@angular/forms';

 const secretKey = '1234567890123456'; // deve essere lunga almeno 16 caratteri


@Component({
  selector: 'app-report',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
})

export class ReportComponent {
  
  //products = signal<Product[]>([]);
  testoDaCriptare = '';
  testoCriptato = '';
  testoDeCriptato = '';
  onlyAvailable = signal(false);
  selectedFile: File | null = null;


  
  constructor( private api: ApiService) {

  }


  cripta() {
    const key = CryptoJS.enc.Utf8.parse(secretKey);
    const iv = CryptoJS.enc.Utf8.parse(secretKey.substring(0, 16));
    const testo = CryptoJS.AES.encrypt(this.testoDaCriptare, key, {  iv,  mode: CryptoJS.mode.CBC,      padding: CryptoJS.pad.Pkcs7    }).toString();
    this.testoCriptato = testo 

    const decripta  = this.decripta(testo);
    this.testoDeCriptato = decripta
    
  }

  decripta(value: string): string {
    const key = CryptoJS.enc.Utf8.parse(secretKey);
    const iv = CryptoJS.enc.Utf8.parse(secretKey.substring(0, 16));

    const decrypted = CryptoJS.AES.decrypt(value, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);

    return decrypted || value;
  }



  download() {
    this.api.downloadDb().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'db.json';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  upload() {
    if (!this.selectedFile) return;

    const reader = new FileReader();
    reader.onload = () => {
      const json = JSON.parse(reader.result as string);
      this.api.updateDb(json).subscribe(() => {
        alert('Dati aggiornati in memoria');
      });
    };
    reader.readAsText(this.selectedFile);
  }



  
  
  filteredProducts = computed(() => {
    //const list = products();
    //const q = search().toLowerCase();
    /*const cat = category();
    const max = maxPrice();
    const available = onlyAvailable();
  
    return list
      .filter(p => {
        // filtro testo
        if (q && !p.name.toLowerCase().includes(q)) return false;
  
        // filtro categoria
        if (cat && p.category !== cat) return false;
  
        // filtro prezzo
        if (max !== null && p.price > max) return false;
  
        // filtro disponibilità
        if (available && !p.inStock) return false;
  
        return true;
      })
      .sort((a, b) => a.price - b.price); // esempio: ordina per prezzo*/
  });

}
