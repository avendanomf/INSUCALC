import { NgbCalendar, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { Fila } from './filas';
import { Glucometrias } from "./glucometrias";
import { Insulinas } from "./insulinas";
import { TblComida } from "./tblComida";

export class FormRegistro {
    id: string
    fecha: NgbDateStruct | undefined;
    comida: string | undefined;
    tblComida: TblComida[]
    totalCho: number | undefined;
    tblGlucometria?:Glucometrias[]= [];
    tblInsulinas?:Insulinas[]= [];

    constructor(private calendar: NgbCalendar, public comidas: Fila []= []) {
        this.fecha = this.calendar.getToday();
        this.comida = '';        
    }
}


