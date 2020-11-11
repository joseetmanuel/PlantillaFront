import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Color } from 'ng2-charts';
import { SicoitService } from 'src/app/sicoit.service';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.scss']
})




export class MonitoringComponent implements OnInit {

  @Input() ticket;
  @Input() add_upd;
  @Output() cerrarTab = new EventEmitter<any>();
  estatus: any;
  usuarioForm = new FormGroup({
    tipoTiket: new FormControl('', [Validators.required]),
    idDispositivo: new FormControl(''),
    nombreUsuario: new FormControl(''),
    idCuenta: new FormControl('' ),
    Marca: new FormControl(''),
    modelo: new FormControl(''),
    observaciones: new FormControl(''),
    fechaCreacion: new FormControl(''),
    idPrioridad: new FormControl(''),
    solucion: new FormControl(''),
    toogleCuentaDispositivo: new FormControl(''),
    idUsuarioSolucion: new FormControl(''),
    cuentadispositivo: new FormControl('')
  });



  tipoDispositivos: any;
  procesadores: any;
  tipoTickets: any;
  tipoCuentas: any;
  tipoPrioridades: any;
  tabCuentaDispositivo: boolean;
  tabDispositivo: any;
  tabCuenta: any;
  labelButonAddUpd: string;
  activaBotonGuardar: boolean;
  constructor(private ds: SicoitService) {

    if (this.usuarioForm.controls.idDispositivo.value === 0 || this.usuarioForm.controls.idCuenta.value === 0) {
      this.activaBotonGuardar = true;
      console.log("valide vpy a cambiar el boton");
    }

  }

  ngOnInit() {
    this.cargarCatalogos();
    if (this.add_upd) {
      this.fillFormsAdd();
    } else {
      this.fillFormsUpd();
    }
  }


  cambiaCuentaDispositivo() {
    if (this.usuarioForm.controls.toogleCuentaDispositivo.value === "1") {
      this.tabCuenta = true;
      this.tabDispositivo = false;

    } else {
      this.tabCuenta = false;
      this.tabDispositivo = true;

    }
  }

  fillFormsAdd() {
    this.usuarioForm.controls.toogleCuentaDispositivo.setValue("1");
    this.labelButonAddUpd = "Agregar"
    this.cambiaCuentaDispositivo();
  }

  fillFormsUpd() {
    this.labelButonAddUpd = "Modificar"
    console.log("fillForms()", this.ticket);
    this.usuarioForm.controls.tipoTiket.setValue(this.ticket[0].idTipoTiket),
      this.usuarioForm.controls.tipoTiket.setValue(this.ticket[0].idTipoTiket),
      this.usuarioForm.controls.idDispositivo.setValue(this.ticket[0].idDispositivo),
      this.usuarioForm.controls.idCuenta.setValue(this.ticket[0].idCuenta),
      this.usuarioForm.controls.idPrioridad.setValue(this.ticket[0].idPrioridad),
      this.usuarioForm.controls.observaciones.setValue(this.ticket[0].observaciones)
  }

  cancelar() {
    this.cerrarTab.emit(false);
  }

  insTiket() {
    // if (this.usuarioForm.controls.toogleCuentaDispositivo.value === "1"){
    // dispositiv
    // } else {


    // }

    const data = {
      idTipoTiket: this.usuarioForm.controls.tipoTiket.value,
      _idUsuario: 1,
      idDispositivo: this.usuarioForm.controls.idDispositivo.value,
      idCuenta: this.usuarioForm.controls.idCuenta.value,
      idPrioridad: this.usuarioForm.controls.idPrioridad.value,
      observaciones :this.usuarioForm.controls.observaciones.value
    };

    if(this.tabDispositivo){
      data.idCuenta = null;
    }
    if(this.tabCuenta){
      data.idDispositivo = null;
    }

    this.ds.postService('tiket/postTiket', data).subscribe((res: any) => {
      if (res.err) {
      } else
        if (res.excepcion) { }
        else {

        }
    }, (error: any) => { });
  }


  updTicket() {

    const data = {
      idTiket: this.usuarioForm.controls.idTiket.value,
      idTipoTiket: this.usuarioForm.controls.idTipoTiket.value,
      _idUsuario: this.usuarioForm.controls.idUsuario.value,
      idDispositivo: this.usuarioForm.controls.idDispositivo.value,
      idCuenta: this.usuarioForm.controls.idCuenta.value,
      idPrioridad: this.usuarioForm.controls.idPrioridad.value,
      observaciones :this.usuarioForm.controls.observaciones.value
    };


    this.ds.putService('tiket/putTiket', data).subscribe((res: any) => {
      if (res.err) {
      } else
        if (res.excepcion) { }
        else {

        }
    }, (error: any) => { });


  }

  selectorInsUpdUsuario() {
    if (this.add_upd) {
      this.insTiket();
    } else {
      this.updTicket();
    }
    this.cerrarTab.emit(true);

  }



  cargarCatalogos() {
    this.catalogoTipoTicket();
    this.catalogoTipoDispositivo();
    this.catalogoTipoCuentas();
    this.catalogoTipoPrioridades();
    this.catalogoEstatus();
  }



  catalogoTipoTicket() {
    this.ds.getService('catalogo/getTipoTickets').toPromise().then((tipoTickets: any) => {
      console.log("getProcesadores ", tipoTickets.recordsets[0])
      this.tipoTickets = tipoTickets.recordsets[0];
    })
  }

  catalogoTipoDispositivo() {
    this.ds.getService('catalogo/getTipoDispositivos').toPromise().then((tipoDispositivos: any) => {
      console.log("getTipoDispositivos ", tipoDispositivos.recordsets[0])
      this.tipoDispositivos = tipoDispositivos.recordsets[0];
    })
  }

  catalogoTipoCuentas() {
    this.ds.getService('catalogo/getTipoCuentas').toPromise().then((tipoCuentas: any) => {
      console.log("catalogo/getTipoCuentas ", tipoCuentas.recordsets[0])
      this.tipoCuentas = tipoCuentas.recordsets[0];
    })
  }

  catalogoTipoPrioridades() {
    this.ds.getService('catalogo/getTipoPrioridad').toPromise().then((tipoPrioridades: any) => {
      console.log("catalogo/getTipoPrioridad ", tipoPrioridades.recordsets[0])
      this.tipoPrioridades = tipoPrioridades.recordsets[0];
    })
  }


  catalogoEstatus() {
    this.ds.getService('catalogo/getEstatus').toPromise().then((estatus: any) => {
      console.log("getEstatus ", estatus.recordsets[0])
      this.estatus = estatus.recordsets[0];
    })
  }


}
