import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ParametersService } from '../../../../services/parameters.service';
import { Parameter } from 'src/app/interfaces/parameter';
import { FormRegistro } from 'src/app/interfaces/form-registro';
import { ToastrService } from 'ngx-toastr';
import { JsonFileService } from 'src/app/services/save-json.service';
import { Insulinas } from 'src/app/interfaces/insulinas';
import { Glucometrias } from 'src/app/interfaces/glucometrias';
import { Comida, GlucometriaTBL, InsulinaTBL, SaveRegistroApi } from 'src/app/interfaces/save-registro-api';
import { Fila } from 'src/app/interfaces/filas';
import { RegistroAlimentosComponent } from 'src/app/components/registro-alimentos/registro-alimentos.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-calculo-cho',
  templateUrl: './calculo-cho.component.html',
  styleUrls: ['./calculo-cho.component.css']
})
export class CalculoChoComponent implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  user = {} as User;

  parameter: Parameter;

  model: NgbDateStruct | undefined;
  today = this.calendar.getToday();
  comidaValida = true;

  fechaRegistro: Date = new Date();

  registro: FormRegistro;
  insulinas: Insulinas;
  glucometrias: Glucometrias;
  SaveRegistroApi: SaveRegistroApi;
  @ViewChild(RegistroAlimentosComponent) registroAlimentos: RegistroAlimentosComponent | undefined;

  totalCalorias: number = 0;

  constructor(
    private calendar: NgbCalendar,
    private parameterService: ParametersService,
    private toastr: ToastrService,
    private jsonFileService: JsonFileService,
  ) {
    this.parameter = new Parameter();
    this.registro = new FormRegistro(calendar);
    this.insulinas = new Insulinas();
    this.glucometrias = new Glucometrias();
    this.SaveRegistroApi = new SaveRegistroApi();
  }

  ngOnInit(): void {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    this.parameterService.getAllParameters().subscribe(data => {
      if (data.length > 0) {
        const parameter = data[0];
        this.parameter.Ratio = this.user.ratio;
        this.parameter.Sensibilidad = this.user.sensibilidad;
        this.parameter.gluMax = parameter.gluMax;
        this.parameter.glucoMin = parameter.glucoMin;
        this.parameter.glucoMeta = parameter.glucoMeta;
      }
      this.validarParametros()
    });
  }
  validarParametros() {
    if (this.parameter.Ratio < 1) {
      this.utilsSvc.presentToast({
        message: 'Diligencia los parametros de ratio y sensibilidad (Perfil/Parametros)',
        duration: 5500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      })
    }
    if (this.parameter.Sensibilidad < 1) {
      this.utilsSvc.presentToast({
        message: 'Diligencia los parametros de ratio y sensibilidad (Perfil/Parametros)',
        duration: 5500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      })
    }
  }
  actualizarTotalCHO(filas: any) {
    this.registro.totalCho = this.roundToTwo(
      filas.reduce((total: number, fila: any) => total + parseFloat(fila.gramosCarbohidratos), 0)
    );
    this.registro.comidas = filas;
    // Calcular total de calorías
    this.totalCalorias = this.roundToTwo(
      filas.reduce((total: number, fila: any) => total + (parseFloat(fila.caloriasPorcion) || 0), 0)
    );
    this.calcInsulinaCHO();
  }
  calcInsulinaCHO() {
    try {
      this.validarParametros();
      if (this.registro.totalCho !== undefined && this.parameter.Ratio !== undefined) {
        this.insulinas.insulinaCHO = this.roundToTwo(this.registro.totalCho / this.parameter.Ratio);
      } else {
        this.insulinas.insulinaCHO = 0;
      }
      this.insulinaxGluco();
    } catch (error) {
      this.utilsSvc.presentToast({
        message: error,
        duration: 5500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      })
    }

  }

  insulinaxGluco() {
    try {
      this.validarParametros();
      if (this.glucometrias.nivelGlucosa != undefined && this.glucometrias.nivelGlucosa != 0) {
        this.insulinas.insulinaGlucometria = this.roundToTwo(
          (this.glucometrias.nivelGlucosa - this.parameter.glucoMeta) / this.parameter.Sensibilidad
        );
      }
      if (this.insulinas.insulinaCHO != undefined && this.insulinas.insulinaGlucometria != undefined) {
        this.insulinas.insulinaTotal = Math.round(this.insulinas.insulinaCHO + this.insulinas.insulinaGlucometria);
      }

    } catch (error) {
      this.utilsSvc.presentToast({
        message: error,
        duration: 5500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      })
    }

  }

  validarCamposComidas(): boolean {
    if (this.registro.comidas != undefined) {
      for (const fila of this.registro.comidas) {
        if (!fila.name || !fila.pesoGramos) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  validarCampos(): string {
    switch (true) {
      case !this.registro.comida:
        return 'false';
      case !this.registro.fecha:
        return 'false';
      case !this.glucometrias.nivelGlucosa:
        return 'false';
      default:
        if (this.registro.comidas != undefined) {
          if (this.registro.comidas.length > 0) {
            for (const fila of this.registro.comidas) {
              if (!fila.name || !fila.pesoGramos) {
                return 'false';
              }
            }
          }
          else {
            return "warning";
          }
        }
        if (this.user.ratio > 0 && this.user.sensibilidad > 0) {
          return "true";
        }
        else {
          return 'parametros';
        }
    }
  }


  formatDate(date: NgbDateStruct | undefined): string {
    if (date) {
      const year = date.year || 0;
      const month = date.month || 1;
      const day = date.day || 1;

      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

      return formattedDate;
    }
    return '';
  }

  guardarDatos() {
    switch (this.validarCampos()) {
      case 'true':
        this.saveDataBase();

        break;
      case 'false':
        this.toastr.error('Faltan campos por diligenciar', 'error');
        break;
      case 'warning':
        this.toastr.warning('no se diligencio comidas', 'warning');
        break;
      case 'parametros':
        this.validarParametros();
        break;
      default:

    }
  }

  limpiarCampos() {
    this.registro = new FormRegistro(this.calendar);
    this.insulinas = new Insulinas();
    this.glucometrias = new Glucometrias();
    if (this.registroAlimentos) {
      this.registroAlimentos.restaurarCampos();
    }
  }

  singOut() {
    this.firebaseSvc.signOut();
  }



  async saveDataBase() {
    const loading = await this.utilsSvc.loading();
    await loading.present();

    let path = `users/${this.user.uid}/registroCho`;

    const vsaveRegistroApi = new SaveRegistroApi();
    vsaveRegistroApi.comida = this.registro.comida !== undefined ? this.registro.comida : '';
    vsaveRegistroApi.fecha = this.formatDate(this.registro.fecha);
    vsaveRegistroApi.totalCho = this.registro.totalCho !== undefined ? this.registro.totalCho : 0;

    // Convertir las comidas a POJO
    vsaveRegistroApi.tblComida = this.registro.comidas.map((fila: Fila) => {
      return {
        comidaNombre: fila.name,
        pesoGramos: parseFloat(fila.pesoGramos),
        pesoTabla: parseFloat(fila.pesoTabla),
        choTabla: parseFloat(fila.choTabla),
        gramosCarbohidratos: parseFloat(fila.gramosCarbohidratos),
        caloriasPorcion: parseFloat(fila.caloriasPorcion) // <-- Agrega esta línea
      } as Comida;
    });

    // Convertir glucometria a POJO
    const vglucometria = {
      horaRegistro: this.glucometrias.horaRegistro !== undefined ? this.glucometrias.horaRegistro : "",
      nivelGlucosa: this.glucometrias.nivelGlucosa !== undefined ? this.glucometrias.nivelGlucosa : ""
    } as GlucometriaTBL;

    vsaveRegistroApi.tblGlucometria = [vglucometria];

    // Convertir insulina a POJO
    const vinsulinaTBL = {
      insulinaCho: this.insulinas.insulinaCHO,
      insulinaGlucometria: this.insulinas.insulinaGlucometria,
      insulinaTotal: this.insulinas.insulinaTotal
    } as InsulinaTBL;

    vsaveRegistroApi.tblInsulinas = [vinsulinaTBL];

    // Crear un objeto simple para guardar en Firebase
    const dataToSave = {
      comida: vsaveRegistroApi.comida,
      fecha: vsaveRegistroApi.fecha,
      totalCho: vsaveRegistroApi.totalCho,
      tblComida: vsaveRegistroApi.tblComida,
      tblGlucometria: vsaveRegistroApi.tblGlucometria,
      tblInsulinas: vsaveRegistroApi.tblInsulinas,
      tblTotalCalorias: this.totalCalorias
    };


    this.firebaseSvc.addDocument(path, dataToSave).then(async res => {
      this.utilsSvc.presentToast({
        message: 'Se guardo con Exito',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
    }).catch(async err => {
      this.utilsSvc.presentToast({
        message: err.message,
        duration: 2500,
        color: 'primary',
        position: 'top',
        icon: 'alert-circle-outline'
      });
    }).finally(() => {
      this.limpiarCampos();
      loading.dismiss();

    });
  }

  roundToTwo(num: number): number {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }
}
