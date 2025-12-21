import { signal, Component ,  computed, effect } from '@angular/core';



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

  
  constructor() {
    effect(() => console.log('count changed:', this.count()));
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
