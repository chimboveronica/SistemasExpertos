var formulariogsmgps;
var VentanaPerdidagsmgps;
var placaPerdidaGsm = " ";
var empresaPerdidaGsm = 'KRADAC';
var variable1;
Ext.onReady(function () {
    var porEquipoPerdidaGpsGsm = false;
    var banderaRegistroPanico;
    var id_empresagpsgsms = 1;
    if (idCompanyKarview == 1) {
        banderaRegistroPanico = 1;
    } else {
        empresaPerdidaGsm = storeEmpresaPanicos.data.items[0].data.text;
        banderaRegistroPanico = storeEmpresaPanicos.data.items[0].data.id;
    }
    var cbxEmpresasGSM = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Organización',
        name: 'idempresagsm',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Organización...',
        editable: false,
        allowBlank: false,
        value: banderaRegistroPanico,
        listeners: {
            select: function (combo, record, eOpts) {
                storeVeh.removeAll();
                empresaPerdidaGsm = cbxEmpresasGSM.getRawValue();
                placaPerdidaGsm = " ";
                if (porEquipoPerdidaGpsGsm) {
                    cbxVehPedidaGpsGsm.clearValue();
                    cbxVehPedidaGpsGsm.enable();
                    storeVeh.load({
                        params: {
                            cbxEmpresas: record.getId()
                        }
                    });
                }
            }
        }
    });
    var cbxVehPedidaGpsGsm = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Vehículos',
        name: 'cbxVeh',
        store: storeVeh,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Vehículo...',
        disabled: true,
        editable: false,
        allowBlank: false,
        listConfig: {
            minWidth: 270
        },
        listeners: {
            select: function (combo, record, eOpts) {
                placaPerdidaGsm = record.data.placa;
            }
        }
    });
    var fechaInigsm = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIni',
        name: 'fechaIni',
        maxValue: new Date(),
        value: new Date(),
        maxText: 'La fecha debe ser igual o anterior a <br> {0}',
        allowBlank: false,
        endDateField: 'fechaFin',
        emptyText: 'Fecha Inicial...'
    });

    var fechaFingsm = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFin',
        name: 'fechaFin',
        vtype: 'daterange',
        value: new Date(),
        maxValue: new Date(),
        allowBlank: false,
        startDateField: 'fechaIni',
        emptyText: 'Fecha Final...'
    });

    var btn_Hoygsm = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function () {
            var nowDate = new Date();
            fechaInigsm.setValue(nowDate);
            fechaFingsm.setValue(nowDate);
            timeInigsm.setValue('00:00');
            timeFingsm.setValue('23:59');

        }
    });
    var bt_Hayergsm = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function () {
            var yestDate = Ext.Date.subtract(new Date(), Ext.Date.DAY, 1);
            fechaInigsm.setValue(yestDate);
            fechaFingsm.setValue(yestDate);
            timeInigsm.setValue('00:00');
            timeFingsm.setValue('23:59');
        }
    });
    var timeInigsm = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIni',
        format: 'H:i',
        allowBlank: false,
        value: '00:00',
        emptyText: 'Hora Inicial...',
        listConfig: {
            minWidth: 300
        }
    });
    var timeFingsm = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFin',
        format: 'H:i',
        allowBlank: false,
        value: '23:59',
        emptyText: 'Hora final...',
        listConfig: {
            minWidth: 450
        }
    });
    var panel_Botonesgsm = Ext.create('Ext.panel.Panel', {
        layout: 'hbox',
        padding: '0 0 5 0',
        defaults: {
            margin: '0 5 0 0'
        },
        items: [
            {
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [btn_Hoygsm
                ]
            }, {
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [bt_Hayergsm]
            }
        ]
    });
    formulariogsmgps = Ext.create('Ext.form.Panel', {
        bodyPadding: '10 10 0 10',
        id: 'for_gsm',
        fieldDefaults: {
            labelAlign: 'left',
            anchor: '100%'
        },
        items: [{
                xtype: 'fieldset',
                title: '<b>Datos GSM</b>',
                items: [{
                        xtype: 'radiogroup',
                        columns: 2,
                        vertical: true,
                        items: [
                            {boxLabel: 'Por Organización', name: 'rb4', inputValue: '1', checked: true},
                            {boxLabel: 'Por Vehículo', name: 'rb4', inputValue: '2'}
                        ],
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                switch (parseInt(newValue['rb4'])) {
                                    case 1:
                                        variable1 = 1;
                                        empresaGSM = 1;
                                        cbxEmpresasGSM.enable();
                                        cbxVehPedidaGpsGsm.clearValue();
                                        cbxVehPedidaGpsGsm.disable();
                                        porEquipoPerdidaGpsGsm = false;
                                        break;
                                    case 2:
                                        variable1 = 2;
                                        porEquipoPerdidaGpsGsm = true;
                                        empresaGSM = cbxEmpresasGSM.getValue();
                                        if (porEquipoPerdidaGpsGsm) {
                                            cbxVehPedidaGpsGsm.enable();
                                            storeVeh.load({
                                                params: {
                                                    cbxEmpresas: formulariogsmgps.down('[name=idempresagsm]').getValue()
                                                }
                                            });
                                        }
                                        break;
                                }
                            }
                        }
                    },
                    cbxEmpresasGSM,
                    cbxVehPedidaGpsGsm
                ]
            }, {
                xtype: 'fieldset',
                title: '<b>Fechas</b>',
                items: [
                    fechaInigsm,
                    fechaFingsm,
                    timeInigsm,
                    , timeFingsm,
                    panel_Botonesgsm
                ]
            }],
        buttons: [
            {
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function () {
                    var form = formulariogsmgps.getForm();
                    if (form.isValid()) {
                        form.submit({
                            url: 'php/interface/report/gps-gsm/getReporDetallePerdidaGSM.php',
                            method: 'POST',
                            waitMsg: 'Comprobando Datos...',
                            params: {
                                cbxEmpresasPan: id_empresagpsgsms,
                            },
                            failure: function (form, action) {

                                Ext.Msg.alert('Información', 'No se encuentran datos en estas fechas');
                            },
                            success: function (form, action) {
                                if (VentanaPerdidagsmgps) {
                                    VentanaPerdidagsmgps.hide();
                                }
                                Ext.MessageBox.hide();
                                var resultado = action.result;
                                var datos = Ext.JSON.decode(resultado.string).data;
                                cargardatosalGridGpsGsm(datos,fechaInigsm.getRawValue(),fechaFingsm.getRawValue(),timeInigsm.getRawValue(),timeFingsm.getRawValue());
                            }
                        });
                    } else {
                        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo correctamente ');
                    }
                }
            }
            , {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: function () {
                    VentanaPerdidagsmgps.hide();
                }
            }]
    });
});
function cargardatosalGridGpsGsm(datos, fi, ff, hi, hf) {
    Ext.define('Registros', {
        extend: 'Ext.data.Model',
        fields: ['empresa', 'equipo', 'placa', 'latitud', 'longitud', 'fecha', 'velocidad', 'gps', 'gsm', 'tipo_respuesta']
    });
    var storePerdidaGpsGsm = Ext.create('Ext.data.JsonStore', {
        data: datos,
        storeId: 'recaudoId',
        model: 'Registros',
        sorters: ['empresa', 'equipo', 'placa', 'gsm'],
        groupField: 'tipo_respuesta',
        proxy: {
            type: 'ajax',
            reader: 'array'
        },
        fields: ['empresa', 'equipo', 'placa']
    });

    var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
        id: 'group',
        groupHeaderTpl: 'Registro de : {name} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})',
    });

    var columnGsmGps = [
        {text: 'Organización', flex: 80, dataIndex: 'empresa', renderer: formatCompany, filter: {type: 'list', store: storeEmpresasList}},
        {text: 'Equipo', flex: 80, dataIndex: 'equipo', filter: {type: 'string'}},
        {text: 'Placa', flex: 80, dataIndex: 'placa', filter: {type: 'string'}},
        {text: 'GPS', flex: 80, dataIndex: 'gps', renderer: estadoGps, filter: {type: 'string'}},
        {text: 'Registro', flex: 80, dataIndex: 'fecha', format: 'd-m-Y H:i:s', width: 170, align: 'center', filter: {type: 'date'}, filterable: true},
        {text: 'Velocidad', flex: 80, dataIndex: 'velocidad', cls: 'listview-filesize', filterable: true, filter: {type: 'numeric'}}
    ];
    var vehiculoEmpresa;
    if (variable1 === 1) {
        vehiculoEmpresa = empresaPerdidaGsm;
    } else {
        vehiculoEmpresa = empresaPerdidaGsm + " " + placaPerdidaGsm;
    }
    var gridGsmGps = Ext.create('Ext.grid.Panel', {
        layout: 'fit',
        region: 'center',
        title: '<center> Reporte de GPS-GSM <br>Desde: ' + fi + ' | Hasta: ' + ff + ' Desde las: ' + hi + ' | Hasta las: ' + hf + '</center>',
        store: storePerdidaGpsGsm,
        multiSelect: true,
        width: '100%',
        features: [groupingFeature],
        plugins: 'gridfilters',
        viewConfig: {
            emptyText: 'No hay datos que Mostrar',
            enableTextSelection: true
        },
        dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                items: [{xtype: 'button', text: 'Exportar a Excel', iconCls: 'icon-excel', handler: function () {
                            exportExcelEventos(gridGsmGps, "Reporte de GPS-GSM ", "nameSheet", "Reporte GPS-GSM de " + vehiculoEmpresa+ " " + fi+ " " + hi + " | " + ff + " " + hf + "");
                        }}
                ]
            }],
        columns: columnGsmGps,
        listeners: {
            itemcontextmenu: function (thisObj, record, item, index, e, eOpts) {
                e.stopEvent();
                Ext.create('Ext.menu.Menu', {
                    items: [
                        Ext.create('Ext.Action', {
                            iconCls: 'icon-vehiculos_lugar', // Use a URL in the icon config
                            text: 'Ver Ubicación en el Mapa',
                            disabled: false,
                            handler: function (widget, event) {
                                clearLienzoPointTravel();
                                clearLienzoTravel();
                                drawPointsGsmGps(record.data);
                                panelTabMapaAdmin.setActiveTab('panelMapaTab');
                                localizarDireccion(record.data.longitud, record.data.latitud, 17);
                            }
                        })
                    ]
                }).showAt(e.getXY());
                return false;
            }
        }

    });

    var tabGpsGsm = Ext.create('Ext.container.Container', {
        title: '<div id="titulosForm"> Perdida de GPS y GSM ' + empresaPerdidaGsm + " : " + placaPerdidaGsm + '</div>',
        closable: true,
        iconCls: 'icon-flota',
        layout: 'border',
        items: [{
                layout: 'border',
                xtype: 'panel',
                items: gridGsmGps,
                region: 'center',
                autoScroll: true,
                columnLines: true,
                frame: true
            }
        ]
    });

    panelTabMapaAdmin.add(tabGpsGsm);
    panelTabMapaAdmin.setActiveTab(tabGpsGsm);
}
function reporteWinperdidaGpsGsm() {
    if (!VentanaPerdidagsmgps) {
        VentanaPerdidagsmgps = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Perdida de GPS y GSM',
            iconCls: 'icon-flota',
            resizable: false,
            width: 350,
            height: 370,
            closeAction: 'hide',
            plain: false,
            items: formulariogsmgps
        });
    }
    formulariogsmgps.getForm().reset();
    VentanaPerdidagsmgps.show();
}





