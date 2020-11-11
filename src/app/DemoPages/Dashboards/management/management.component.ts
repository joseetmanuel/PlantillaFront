import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SicoitService } from 'src/app/sicoit.service';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styles: []
})
export class ManagementComponent implements OnInit {


  @Input() usuarios;
  @Input() add_upd;
  @Output() cerrarTab = new EventEmitter<any>();
  estatus: any;
  usuarioForm = new FormGroup({
    nombreUsuario: new FormControl('', [Validators.required]),
    primerNombre: new FormControl('', [Validators.required]),
    segundoNombre: new FormControl(''),
    primerApellido: new FormControl('', [Validators.required]),
    segundoApellido: new FormControl(''),
    estatus: new FormControl('' ),
    archivoFoto: new FormControl('')
 
  });
 
  labelButonAddUpd : string;
  constructor(private ds: SicoitService) {
  }

  ngOnInit() {
 
      console.log("recibiendo datos tabla ", this.usuarios );
      console.log("this.add_upd", this.add_upd);
      if (this.add_upd) {
        this.labelButonAddUpd = "Agregar"
      } else {
        this. fillForms() ;
      }
  }

  fillForms() {
     
    console.log("Entrando afill forms  " );
    this.labelButonAddUpd = "Modificar"
    this.usuarioForm.controls.nombreUsuario.setValue(this.usuarios[0].nombreUsuario),
      this.usuarioForm.controls.primerNombre.setValue(this.usuarios[0].primerNombre),
      this.usuarioForm.controls.segundoNombre.setValue(this.usuarios[0].segundoNombre),
      this.usuarioForm.controls.primerApellido.setValue(this.usuarios[0].primerApellido),
      this.usuarioForm.controls.segundoApellido.setValue(this.usuarios[0].segundoApellido),
      this.usuarioForm.controls.estatus.setValue(this.usuarios[0].estatus)
  }

 
  cancelar() {

    this.cerrarTab.emit(false);
  }


  insUsuario() {

    const data = {
      nombreUsuario: this.usuarioForm.controls.nombreUsuario.value,
      primerNombre: this.usuarioForm.controls.primerNombre.value,
      segundoNombre: this.usuarioForm.controls.segundoNombre.value,
      primerApellido: this.usuarioForm.controls.primerApellido.value,
      segundoApellido: this.usuarioForm.controls.segundoApellido.value,
      estatus: 1,
      archivoFoto: ""
    };


    this.ds.postService('catalogo/postUsuario', data).subscribe((res: any) => {
      if (res.err) {
      } else
        if (res.excepcion) { }
        else {

          this.cerrarTab.emit(true);

         }
    }, (error: any) => { });
  }


  updUsuario() {
    const data = {
      _idUsuario: this.usuarios[0].idUsuario,
      nombreUsuario: this.usuarioForm.controls.nombreUsuario.value,
      primerNombre: this.usuarioForm.controls.primerNombre.value,
      segundoNombre: this.usuarioForm.controls.segundoNombre.value,
      primerApellido: this.usuarioForm.controls.primerApellido.value,
      segundoApellido: this.usuarioForm.controls.segundoApellido.value,
      estatus: this.usuarioForm.controls.estatus.value,
      archivoFoto: ""
    };

    this.ds.putService('catalogo/putUsuario', data).subscribe((res: any) => {
      if (res.err) {
      } else
        if (res.excepcion) { }
        else { 

          this.cerrarTab.emit(true);

        }
    }, (error: any) => { });


  }

  selectorInsUpdUsuario(){
    if (this.add_upd){
      this.insUsuario();
    } else {
      this.updUsuario();
    }
    

  }
 

}




