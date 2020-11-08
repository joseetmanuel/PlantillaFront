import { Component, OnInit } from '@angular/core';
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
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
})
export class AnalyticsComponent implements OnInit {

  heading = 'Etmanuel';
  subheading = 'This is an example dashboard created using build-in elements and components.';
  icon = 'pe-7s-plane icon-gradient bg-tempting-azure';

  gridOptions: IGridOptions;
  columns: IColumns[];
  checkbox: ICheckbox;
  facturas = [];
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


  constructor(private ds: SicoitService) {
    this.table();

    ds.getService('tiket/getTikets').toPromise().then(data => {
      console.log(data)
    })
  }

  ngOnInit() {
  }

  table() {

    // Columnas de la tabla
    try {
      this.columns = [
        {
          caption: 'Razon social',
          dataField: 'razonSocial',
          hiddingPriority: '0'
        },
        {
          caption: 'Contrato',
          dataField: 'contrato',
          hiddingPriority: '1'
        },
        {
          caption: 'Estatus',
          dataField: 'estatus',
          hiddingPriority: '2'
        },
        {
          caption: 'Por facturar',
          dataField: 'porFacturar',
          hiddingPriority: '3',
        },
        {
          caption: 'Descuentos',
          dataField: 'descuentos',
          hiddingPriority: '4',
        },
        {
          caption: 'Pagos',
          dataField: 'pagos',
          hiddingPriority: '5',
        },
        {
          caption: 'Notas de crédito',
          dataField: 'notasCredito',
          hiddingPriority: '6',
        },
        {
          caption: 'Facturado',
          dataField: 'facturado',
          hiddingPriority: '7',
        }
      ];

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
      console.log(this.editing)
      this.view = true;

    } catch (error) { 

      console.log('errTbl',error)
    }
  }

  DatosMessage($event) {
    try {
      this.datosevent = $event.data;
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
      // this.EditaFactura(senddata);
    }
  }

}
