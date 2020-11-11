
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
  selector: 'app-mailbox',
  templateUrl: './mailbox.component.html',
  styles: []
})
export class MailboxComponent implements OnInit {
  heading = 'Invetario';
  subheading = 'Dispositivos';
  icon = 'pe-7s-plane icon-gradient bg-tempting-azure';

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

  constructor(private ds: SicoitService) {
 
  }

  ngOnInit() {
    this.cargarDispositivos();
    this.table();
  }


  cargarDispositivos() {
    this.spinner = true;
   this. ds.getService('catalogo/getDispositivos').toPromise().then((data : any) => {
      console.log("getDispositivos " ,  data.recordsets[0])
     this.tipoDispositivos = data.recordsets[0];    
     this.spinner = false;
    })
  }

  table() {

    // Columnas de la tabla
    try {
      this.columns = [
        {
          caption: 'ID Dispositivo',
          dataField: 'idDispositivo',
        },
        {
          caption: 'Tipo de dispositivo',
          dataField: 'nombreTipoDispositivo',
        },
        {
          caption: 'Marca',
          dataField: 'marca',
        },
        {
          caption: 'Modelo',
          dataField: 'modelo',
        },
        {
          caption: 'Serie',
          dataField: 'serie',
        },
        {
          caption: 'Memoria',
          dataField: 'memoria',
        },
        {
          caption: 'Almacenamiento',
          dataField: 'almacenamiento',
        },
        {
          caption: 'Procesador',
          dataField: 'nombreTipoProcesador',
        },
        {
          caption: 'Velocidad del procesador',
          dataField: 'velocidadProcesador',
        },
        {
          caption: 'nucleos',
          dataField: 'nucleos',
        },
        {
          caption: 'estatus',
          dataField: 'estatus',
        },
        {
          caption: 'Foto',
          dataField: 'foto',
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
      this.dispositivos = $event.data;
      console.log("Dispositivo" , this.datosevent);
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
      this.datos.emit(this.tipoDispositivos);
      this.boolAddUpd = false;
      this.add_upd.emit(this.boolAddUpd);
      this.Alta = true;

    }

    if ($event === 'add') {
      this.datos.emit(this.tipoDispositivos);
      this.boolAddUpd = true;
      this.add_upd.emit(this.boolAddUpd);
      this.Alta = true;
    }

    if ($event === 'del') {
      this.delDispositivo();

    }
  }
 

  cerrarTab($event) {
    this.Alta = false;
    console.log("Cerre desde aqui");
    if($event){
      this.ngOnInit();
    }    
  }


  delDispositivo(){ 
    this.ds.deleteService('catalogo/deleteDispositivo' , 'idDispositivo=' + this.datosevent[0].idDispositivo).toPromise().then((data: any) => {
      console.log("catalogo/deletUsuario ")
      this.cerrarTab("");
      this.spinner = false;
      this.cerrarTab(true);
    })
  }


}
