
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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  toggleMobileSidebar: any;
  tipoDispositivos = [];

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
  tickets =  [];
  Alta: boolean = false;
  spinner: boolean;
  boolAddUpd: boolean;
  dispositivos: any;
  ticket: any;

  constructor(private ds: SicoitService) {
 
  }

  ngOnInit() {
    this.cargarTickets();
    this.table();
  }


  cargarTickets() {
    this.spinner = true;
   this. ds.getService('tiket/getTikets').toPromise().then((data : any) => {
      console.log("getTikets " ,  data.recordsets[0])
     this.tickets = data.recordsets[0];    
     this.spinner = false;
    })
  }

  table() {

    // Columnas de la tabla
    try {
/****** Script for SelectTopNRows command from SSMS  ******/
 
 
      this.columns = [
        {
          caption: 'ID Tiket',
          dataField: 'idTiket',
        },
        {
          caption: 'Tipo Tiket',
          dataField: 'idTipoTiket',
        },
        {
          caption: 'Usuario',
          dataField: 'idUsuario',
        },
        {
          caption: 'Dispositivo',
          dataField: 'idDispositivo',
        },
        {
          caption: 'Cuenta',
          dataField: 'idCuenta',
        },
        {
          caption: 'Fecha de creación',
          dataField: 'fechaCreacion',
        },
        {
          caption: 'Prioridad',
          dataField: 'idPrioridad',
        },
        {
          caption: 'estatus',
          dataField: 'Estatus',
        },
        {
          caption: 'Solucion',
          dataField: 'solucion',
        },
        {
          caption: 'Fecha de solución',
          dataField: 'fechaSolucion',
        },
        {
          caption: 'Usuario Solución',
          dataField: 'idUsuarioSolucion',
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
      this.ticket = $event.data;
      console.log("Tiket Seleccionado" , this.ticket);
    } catch (error) {
    }
  }

  receiveMessage($event) {
    this.evento = $event.event;
    if ($event === 'Administrar') {
      const senddata = {
        event: $event,
        data: this.datosevent
      };
      this.datos.emit(this.ticket);
      this.boolAddUpd = false;
      this.add_upd.emit(this.boolAddUpd);
      this.Alta = true;
    }

    if ($event === 'add') {
      this.datos.emit(this.ticket);
      this.boolAddUpd = true;
      this.add_upd.emit(this.boolAddUpd);
      this.Alta = true;
      this.ngOnInit();
    }

    if ($event === 'del') {
      this.delTicket();
      this.cerrarTab($event);
    }
  }
 

  cerrarTab($event) {
    this.Alta = false;
    console.log("Cerre desde aqui");
    this.ngOnInit();
  }


  delTicket(){ 
    this.ds.deleteService('tiket/deleteTiket' , 'idTiket=' + this.datosevent[0].idDispositivo).toPromise().then((data: any) => {
      console.log("tiket/deleteTiket ")
      this.cerrarTab("");
      this.spinner = false;
    })
  }

}
