
import { DataSource } from '@angular/cdk/table';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Color } from 'ng2-charts/ng2-charts';
import { SicoitService } from 'src/app/sicoit.service';
import {
  IGridOptions,
  IColumns,
  ICheckbox,
  IEditing,
  IColumnchooser,
  IColumnHiding,
  IExportExcel,
  ISearchPanel,
  IScroll,
  Toolbar,
  IDetail
} from '../../../interfaces'



@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: []
})
export class ChatComponent implements OnInit {
  heading = 'Inventario';
  subheading = 'Usuarios';
  icon = 'pe-7s-plane icon-gradient bg-tempting-azure';

  spinner = false;
  toggleMobileSidebar: any;
  dispositivos = [];
  @Output() datos = new EventEmitter<any>();

  @Output() add_upd = new EventEmitter<any>();


  gridOptions: IGridOptions;
  columns: IColumns[];
  checkbox: ICheckbox;

  editing: IEditing;
  columnchooser: IColumnchooser;
  searchPanel: ISearchPanel;
  scroll: IScroll;
  datosevent: any;
  evento: string;
  exportExcel: IExportExcel;
  toolbar: Toolbar[] = [];
  columnHiding: IColumnHiding;
  view: boolean = false
  dataGetTicket: any;
  tickets = [];
  Alta: boolean = false;
  usuarios: any;
  usuario: any;

  constructor(private ds: SicoitService) {
 
  }

  ngOnInit() {
    this.cargarUsuarios();

  }


  cargarUsuarios() {
    this.spinner = true;
    this.ds.getService('catalogo/getUsuarios').toPromise().then((data: any) => {
      console.log("getUsuarios ", data.recordsets[0])
      this.dispositivos = data.recordsets[0];
      this.table();
      this.spinner = false;
    })

  }

  table() {

    // Columnas de la tabla
    try {


      this.columns = [
        {
          caption: 'ID usuario',
          dataField: 'idUsuario',
        },
        {
          caption: 'Nombre de usuario',
          dataField: 'nombreUsuario',
        },
        {
          caption: 'Primer nombre',
          dataField: 'primerNombre',
        },
        {
          caption: 'Segundo nombre',
          dataField: 'segundoNombre',
        },
        {
          caption: 'Primer apellido',
          dataField: 'primerApellido',
        },
        {
          caption: 'Segundo apellido',
          dataField: 'segundoApellido',
        },
        {
          caption: 'Estatus',
          dataField: 'estatus',
        },
        {
          caption: 'Foto',
          dataField: 'archivoFoto',
        }
      ];


      // Parametros de Paginacion de Grit
      const pageSizes = [];
      pageSizes.push('10', '25', '50', '100');

      // Parametros de Exploracion
      this.exportExcel = { enabled: true, fileName: 'Listado facturar contrato' };
      // ******************PARAMETROS DE COLUMNAS RESPONSIVAS EN CASO DE NO USAR HIDDING PRIORITY**************** */
      this.columnHiding = { hide: true };
      // ******************PARAMETROS DE PARA CHECKBOX**************** */
      this.checkbox = { checkboxmode: 'multiple' };  // *desactivar con none*/
      this.gridOptions = { paginacion: 10, pageSize: pageSizes };
      // ******************PARAMETROS DE PARA EDITAR GRID**************** */
      this.editing = { allowupdate: false }; // *cambiar a batch para editar varias celdas a la vez*/
      // ******************PARAMETROS DE PARA SELECCION DE COLUMNAS**************** */
      this.columnchooser = { columnchooser: true };

      // Parametros de Search
      this.searchPanel = {
        visible: true,
        width: 200,
        placeholder: 'Buscar...',
        filterRow: true
      };

      // Parametros de Scroll
      this.scroll = { mode: 'standard' };

      // Parametros de Toolbar
      this.toolbar = [];
      this.view = true;
      this.toolbar.push(
        {
          location: 'after',
          widget: 'dxButton',
          locateInMenu: 'auto',
          options: {
            width: 120,
            text: 'Administrar',
            onClick: this.receiveMessage.bind(this, 'Administrar')
          },
          visible: false,
          name: 'simple',
          name2: 'multiple'
        });

      this.toolbar.push(
        {
          location: 'after',
          widget: 'dxButton',
          locateInMenu: 'auto',
          options: {
            width: 120,
            text: 'Eliminar',
            onClick: this.receiveMessage.bind(this, 'del')
          },
          visible: false,
          name: 'simple',
          name2: 'multiple'
        });

      this.toolbar.push(
        {
          location: 'after',
          widget: 'dxButton',
          locateInMenu: 'auto',
          options: {
            width: 90,
            text: 'Agregar',
            onClick: this.receiveMessage.bind(this, 'add')
          },
          visible: true
        }
      );

    } catch (error) {

      console.log('errTbl', error)
    }
  }

  datosMessage($event) {
    try {
      this.datosevent = $event.data;
      this.usuarios = $event.data;
      console.log(this.datosevent);
    } catch (error) {
    }
  }

  boolAddUpd: boolean;

  receiveMessage($event) {
    this.evento = $event.event;
    if ($event === 'Administrar') {
      const senddata = {
        event: $event,
        data: this.datosevent
      };
      this.datos.emit(this.usuarios);
      this.boolAddUpd = false;
      this.add_upd.emit(this.boolAddUpd);
      this.Alta = true;

    }

    if ($event === 'add') {
      this.datos.emit(this.usuarios);
      this.boolAddUpd = true;
      this.add_upd.emit(this.boolAddUpd);
      this.Alta = true;
 
    }

    if ($event === 'del') {
      this.delUsuario();
      this.cerrarTab($event);
    }
  }

  cerrarTab($event) {
    this.Alta = false;
    console.log("Cerre desde aqui");
    if ($event){

      this.ngOnInit();
    }
  }

  delUsuario(){ 
    this.ds.deleteService('catalogo/deleteUsuario' , '_idUsuario=' + this.datosevent[0].idUsuario).toPromise().then((data: any) => {
      console.log("catalogo/deletUsuario ")
      this.cerrarTab("");
      this.spinner = false;
    })
  }

}
