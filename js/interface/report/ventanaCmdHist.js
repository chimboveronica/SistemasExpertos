var formComandos;
var ventanaComandos;
Ext.onReady(function () {
    var idEmpresa = 1;
    var empresaComandos = 'KRADAC';
    var porEquipoComan = false;
    var placacomandos = "";
    var banderaComandos;
    var variableCmd;
    var idVehiculoComando;
    if (idCompanyKarview == 1) {
        banderaComandos = 1;
    } else {
        empresaComandos = storeEmpresas.data.items[0].data.text;
        banderaComandos = storeEmpresas.data.items[0].data.id;
    }
    var cbxEmpresasBDComandos = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Organización',
        name: 'idCompanyComando',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Organización...',
        editable: false,
        allowBlank: false,
        value: banderaComandos,
        listeners: {
            select: function (combo, record, eOpts) {
                storeVeh.removeAll();
                empresaComandos = cbxEmpresasBDComandos.getRawValue();
                placacomandos = " ";
                if (porEquipoComan) {
                    cbxVehBDComanodos.clearValue();
                    cbxVehBDComanodos.enable();
                    storeVeh.load({
                        params: {
                            cbxEmpresas: record.getId()
                        }
                    });
                }
            }
        }
    });
    var cbxVehBDComanodos = Ext.create('Ext.form.ComboBox', {
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
                placacomandos = record.data.placa;
                idVehiculoComando = record.data.id;
            }
        }
    });
    var dateIniComandos = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniComando',
        name: 'fechaIni',
        value: new Date(),
        maxValue: new Date(),
        maxText: 'La fecha debe ser igual o anterior a <br> {0}',
        allowBlank: false,
        invalidText: '{0} No es una fecha validad- Debe estar en formato {1}"',
        endDateField: 'fechaFinPanico',
        emptyText: 'Fecha Inicial...'
    });
    var dateFinComandos = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinComando',
        name: 'fechaFin',
        value: new Date(),
        maxValue: new Date(),
        invalidText: '{0} No es una fecha validad- Debe estar en formato {1}"',
        allowBlank: false,
        startDateField: 'fechaIniPanico',
        emptyText: 'Fecha Final...'
    });
    var timeIniComandos = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIniComando',
        value: '00:00',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Inicial...',
        listConfig: {
            minWidth: 300
        }
    });
    var timeFinComandos = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFinComando',
        value: '23:59',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora final...',
        listConfig: {
            minWidth: 450
        }
    });
    var btnTodayComandos = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function () {
            var nowDate = new Date();
            dateIniComandos.setValue(nowDate);
            dateFinComandos.setValue(nowDate);
            timeIniComandos.setValue('00:00');
            timeFinComandos.setValue('23:59');
        }
    });
    var btnYesterdayComandos = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function () {
            var yestDate = Ext.Date.subtract(new Date(), Ext.Date.DAY, 1);
            dateIniComandos.setValue(yestDate);
            dateFinComandos.setValue(yestDate);
            timeIniComandos.setValue('00:00');
            timeFinComandos.setValue('23:59');
        }
    });
    var panelButtonsComandos = Ext.create('Ext.panel.Panel', {
        layout: 'hbox',
        padding: '0 0 5 0',
        defaults: {
            margin: '0 5 0 0'
        },
        items: [btnTodayComandos, btnYesterdayComandos]
    });
    formComandos = Ext.create('Ext.form.Panel', {
        bodyPadding: '10 10 0 10',
        fieldDefaults: {
            labelAlign: 'left',
            anchor: '100%'
        },
        items: [{
                xtype: 'fieldset',
                title: '<b>Datos</b>',
                items: [
                    {
                        xtype: 'radiogroup',
                        columns: 2,
                        vertical: true,
                        items: [
                            {boxLabel: 'Por Organización', name: 'rb6', id: 'cr1', inputValue: '1'},
                            {boxLabel: 'Por Vehículo', name: 'rb6', id: 'cr2', inputValue: '2'}
                        ],
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                switch (parseInt(newValue['rb6'])) {
                                    case 1:
                                        variableCmd = 1;
                                        idEmpresa = 1;
                                        cbxEmpresasBDComandos.enable();
                                        cbxVehBDComanodos.clearValue();
                                        cbxVehBDComanodos.disable();
                                        porEquipoComan = false;
                                        break;
                                    case 2:
                                        variableCmd = 2;
                                        porEquipoComan = true;
                                        idEmpresa = cbxEmpresasBDComandos.getValue();
                                        if (porEquipoComan) {
                                            cbxVehBDComanodos.enable();
                                            storeVeh.load({
                                                params: {
                                                    cbxEmpresas: formComandos.down('[name=idCompanyComando]').getValue()
                                                }
                                            });
                                        }
                                        break;
                                }
                            }
                        }
                    },
                    cbxEmpresasBDComandos,
                    cbxVehBDComanodos
                ]
            }, {
                xtype: 'fieldset',
                title: '<b>Fechas</b>',
                items: [
                    dateIniComandos,
                    dateFinComandos,
                    timeIniComandos,
                    timeFinComandos,
                    panelButtonsComandos
                ]
            }],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function () {
                    var empresa1 = empresaComandos;
                    var placa1 = placacomandos;
                    var fechaIni1 = dateIniComandos.getRawValue();
                    var fechaFin1 = dateFinComandos.getRawValue();
                    var horaIni1 = timeIniComandos.getRawValue();
                    var horaFin1 = timeFinComandos.getRawValue();
                    var vehiculoEmpresa;
                    if (variableCmd === 1) {
                        vehiculoEmpresa = empresa1;
                    } else {
                        vehiculoEmpresa = empresa1 + " " + placa1;
                    }
                    var formulario = formComandos.getForm();
                    if (formulario.isValid()) {
                        formulario.submit({
                            url: 'php/interface/report/comandos/getReportCmd.php',
                            waitTitle: 'Procesando...',
                            waitMsg: 'Obteniendo Información',
                            params: {
                                idCompany: idEmpresa
                            },
                            success: function (form, action) {
                                var storeDataComandos = Ext.create('Ext.data.JsonStore', {
                                    data: action.result.data,
                                    proxy: {
                                        type: 'ajax',
                                        reader: 'array'
                                    },
                                    fields: ['usuario', 'equipo', 'comando', 'respuesta', 'fecha_creacion', 'fecha_envio', 'estado']
                                });
                                var gridDataComandos = Ext.create('Ext.grid.Panel', {
                                    region: 'west',
                                    frame: true,
                                    width: '100%',
                                    title: '<center>Lista de Comandos ' + '<br>Desde: ' + fechaIni1 + ' | Hasta: ' + fechaFin1 + '</center>',
                                    store: storeDataComandos,
                                    plugins: 'gridfilters',
                                    multiSelect: true,
                                    viewConfig: {
                                        emptyText: 'No hay datos que Mostrar'
                                    },
                                    columns: [
                                        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 40, align: 'center'}),
                                        {text: 'Usuario', width: 100, dataIndex: 'usuario', align: 'center', filter: {type: 'string'}},
                                        {text: 'Comando', width: 100, dataIndex: 'comando', align: 'center', filter: {type: 'string'}},
                                        {text: 'Placa', width: 150, dataIndex: 'placa', align: 'center', filter: {type: 'string'}},
                                        {text: 'Equipo', width: 120, dataIndex: 'equipo', align: 'center', filter: {type: 'string'}},
                                        {text: 'Respuesta', width: 120, dataIndex: 'respuesta', align: 'center', filter: {type: 'string'}},
                                        {text: 'Fecha Creación', width: 150, dataIndex: 'fecha_creacion', align: 'center', format: 'Y-m-d H:i:s', filter: {type: 'date'}, filterable: true},
                                        {text: 'Fecha Envio', width: 150, dataIndex: 'fecha_envio', align: 'center', format: 'Y-m-d H:i:s', filter: {type: 'date'}, filterable: true},
                                        {text: 'Estado', width: 130, dataIndex: 'estado', align: 'center', filter: {type: 'string'}}
                                    ],
                                    tbar: [
                                        {
                                            xtype: 'button',
                                            iconCls: 'icon-excel',
                                            text: 'Exportar a Excel',
                                            handler: function () {
                                                exportExcelEventos(gridDataComandos, "Reporte de Comandos ", "nameSheet", "Reporte de Comandos : " + vehiculoEmpresa + " Desde " + fechaIni1 + " " + horaIni1 + " | " + fechaFin1 + " " + horaFin1);
                                            }
                                        }]
                                });
                                var tabComandos = Ext.create('Ext.container.Container', {
                                    title: '<div id="titulosForm">CMD Enviados ' + empresaComandos + "  " + placacomandos + '</div>',
                                    closable: true,
                                    iconCls: 'icon-cmd-hist',
                                    layout: 'border',
                                    fullscreen: true,
                                    height: 485,
                                    width: 8000,
                                    region: 'center',
                                    items: [gridDataComandos]
                                });
                                panelTabMapaAdmin.add(tabComandos);
                                panelTabMapaAdmin.setActiveTab(tabComandos);
                                ventanaComandos.hide();
                            },
                            failure: function (form, action) {
                                Ext.MessageBox.show({
                                    title: 'Información',
                                    msg: action.result.message,
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.INFO
                                });
                            }
                        });
                    }
                }
            }
            , {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: function () {
                    ventanaComandos.hide();
                }
            }]
    });
});
function  ventanaCmdHistorial() {
    if (!ventanaComandos) {
        ventanaComandos = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'CMD Enviados',
            iconCls: 'icon-cmd-hist',
            resizable: false,
            width: 350,
            height: 370,
            closeAction: 'hide',
            plain: false,
            items: formComandos
        });
    }
    ventanaComandos.show();
    formComandos.getForm().reset();
    if (idRolKarview == 3) {
        Ext.getCmp('cr1').disable();
        Ext.getCmp('cr2').setValue(true);
    } else {
        Ext.getCmp('cr1').setValue(true);
    }
}