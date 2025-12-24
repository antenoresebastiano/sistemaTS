import { signal, Component ,  computed, effect } from '@angular/core';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-report',
  standalone: true,
  imports: [],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
})

export class ReportComponent {


  test = 12;
  count = signal(0);
  double = computed(() => this.count() * 2);

  //products = signal<Product[]>([]);
  search = signal('');
  category = signal<string | null>(null);
  maxPrice = signal<number | null>(null);
  onlyAvailable = signal(false);
  selectedFile: File | null = null;
  
  constructor( private api: ApiService) {
    effect(() => console.log('count changed:', this.count()));
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



  increment() {
    this.count.update(n => n + 1);
    this.test = this.test+1;
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
