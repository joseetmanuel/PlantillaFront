import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Color } from 'ng2-charts';
import { SicoitService } from 'src/app/sicoit.service';

@Component({
  selector: 'app-helpdesk',
  templateUrl: './helpdesk.component.html',
  styles: []
})
export class HelpdeskComponent implements OnInit {

  @Input() dispositivos;
  @Input() add_upd;
  @Output() cerrarTab = new EventEmitter<any>();
  estatus: any;
  usuarioForm = new FormGroup({
    idTipoDispositivo: new FormControl('', [Validators.required]),
    marca: new FormControl('', [Validators.required]),
    modelo: new FormControl(''),
    serie: new FormControl('', [Validators.required]),
    memoria: new FormControl(''),
    almacenamiento: new FormControl(''),
    idProcesador: new FormControl('' ),
    velocidadProcesador: new FormControl(''),
    nucleos: new FormControl(''),
    estatus: new FormControl('')
  });
  tipoDispositivos: any;
  procesadores: any;
  labelButonAddUpd: string;

  constructor(private ds: SicoitService) {
  }

  ngOnInit() {
    this.catalogoEstatus();
    this.catalogoTipoDispositivo();
    this.catalogoProcesador();
    if (this.add_upd) {
      this.labelButonAddUpd = "Agregar"
    } else {
      this.fillForms();
    }
  }


  fillForms() {
    console.log("fillForms()", this.dispositivos);
    this.labelButonAddUpd = "Modificar"
    this.usuarioForm.controls.idTipoDispositivo.setValue(this.dispositivos[0].idTipoDispositivo),
      this.usuarioForm.controls.marca.setValue(this.dispositivos[0].marca),
      this.usuarioForm.controls.modelo.setValue(this.dispositivos[0].modelo),
      this.usuarioForm.controls.serie.setValue(this.dispositivos[0].serie),
      this.usuarioForm.controls.almacenamiento.setValue(this.dispositivos[0].almacenamiento),
      this.usuarioForm.controls.nucleos.setValue(this.dispositivos[0].nucleos),
      this.usuarioForm.controls.idProcesador.setValue(this.dispositivos[0].idProcesador),
      this.usuarioForm.controls.estatus.setValue(this.dispositivos[0].estatus),
      this.usuarioForm.controls.memoria.setValue(this.dispositivos[0].memoria),
      this.usuarioForm.controls.velocidadProcesador.setValue(this.dispositivos[0].velocidadProcesador)

  }
 
  cancelar() {
    this.cerrarTab.emit(false);
  }

  insDispositivo() {

    const data = {
      idTipoDispositivo: this.usuarioForm.controls.idTipoDispositivo.value,
      marca: this.usuarioForm.controls.marca.value,
      modelo: this.usuarioForm.controls.modelo.value,
      serie: this.usuarioForm.controls.serie.value,
      almacenamiento: this.usuarioForm.controls.almacenamiento.value,
      nucleos: this.usuarioForm.controls.nucleos.value,
      idProcesador: this.usuarioForm.controls.idProcesador.value,
      estatus: 1,
      memoria: this.usuarioForm.controls.memoria.value,
      velocidadProcesador: this.usuarioForm.controls.velocidadProcesador.value,
      foto: ""


    };


    this.ds.postService('catalogo/postDispositivo', data).subscribe((res: any) => {
      if (res.err) {
      } else
        if (res.excepcion) { }
        else {

          this.cerrarTab.emit(true);
         }
    }, (error: any) => { });
  }


  updDispositivo() {
    const data = {
      idDispositivo: this.dispositivos[0].idDispositivo,
      idTipoDispositivo: this.usuarioForm.controls.idTipoDispositivo.value,
      marca: this.usuarioForm.controls.marca.value,
      modelo: this.usuarioForm.controls.modelo.value,
      serie: this.usuarioForm.controls.serie.value,
      almacenamiento: this.usuarioForm.controls.almacenamiento.value,
      nucleos: this.usuarioForm.controls.nucleos.value,
      idProcesador: this.usuarioForm.controls.idProcesador.value,
      estatus:this.usuarioForm.controls.idProcesador.value ,
      memoria: this.usuarioForm.controls.memoria.value,
      velocidadProcesador: this.usuarioForm.controls.velocidadProcesador.value,
      foto: ""
    };

    this.ds.putService('catalogo/putDispositivo', data).subscribe((res: any) => {
      if (res.err) {
      } else
        if (res.excepcion) { }
        else {
          this.cerrarTab.emit(true);
         }
    }, (error: any) => { });


  }

  selectorInsUpdUsuario() {
    if (this.add_upd) {
      this.insDispositivo();
    } else {
      this.updDispositivo();
    }


  }

  catalogoTipoDispositivo() {
    this.ds.getService('catalogo/getTipoDispositivos').toPromise().then((tipoDispositivos: any) => {
      console.log("getTipoDispositivos ", tipoDispositivos.recordsets[0])
      this.tipoDispositivos = tipoDispositivos.recordsets[0];
    })
  }

  catalogoProcesador() {
    this.ds.getService('catalogo/getProcesadores').toPromise().then((procesadores: any) => {
      console.log("getProcesadores ", procesadores.recordsets[0])
      this.procesadores = procesadores.recordsets[0];
    })
  }
  
  catalogoEstatus() {
    this.ds.getService('catalogo/getEstatus').toPromise().then((estatus: any) => {
      console.log("getEstatus ", estatus.recordsets[0])
      this.estatus = estatus.recordsets[0];
    })
  }



}
