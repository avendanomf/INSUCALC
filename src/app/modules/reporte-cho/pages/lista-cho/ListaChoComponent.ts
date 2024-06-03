import { Component, OnInit } from '@angular/core';
import { JsonFileService } from 'src/app/services/save-json.service';
import { DatePipe } from '@angular/common';
import { PdfGeneratorService } from 'src/app/services/pdf-generator.service'; // Asegúrate de que la ruta es correcta

@Component({
  selector: 'app-reporte-cho',
  templateUrl: './lista-cho.component.html',
  styleUrls: ['./lista-cho.component.css'],
  providers: [DatePipe]
})
export class ListaChoComponent implements OnInit {
  dataReporte: any[] = [];
  filteredData: any[] = [];
  tipoConsulta: string = 'Todas';
  tipoComida: string = 'Todas';
  alimento: string = 'Todos';

  constructor(private jsonFileService: JsonFileService, private pdfGeneratorService: PdfGeneratorService) {}

  ngOnInit() {
    this.obtenerData();
  }

  obtenerData() {
    this.jsonFileService.getList().subscribe((res: any) => {
      console.log(res.response);
      this.dataReporte = res.response;
      this.applyFilters();
    }, (error: any) => {
      console.log(error);
    });
  }

  applyFilters() {
    this.filteredData = this.dataReporte;

    if (this.tipoConsulta !== 'Todas') {
      this.filteredData = this.filteredData.filter(item => item.tipoConsulta === this.tipoConsulta);
    }

    if (this.tipoComida !== 'Todas') {
      this.filteredData = this.filteredData.filter(item => item.tipoComida === this.tipoComida);
    }

    if (this.alimento !== 'Todos') {
      this.filteredData = this.filteredData.filter(item => item.alimento === this.alimento);
    }
  }

  onFilterChange() {
    this.applyFilters();
  }

  imprimirReporte() {
    console.log('Imprimir reporte con datos:', this.filteredData);
    this.pdfGeneratorService.generatePDF(this.filteredData);
  }
}
