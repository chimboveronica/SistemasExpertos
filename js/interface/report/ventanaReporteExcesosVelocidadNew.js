var formularioExcesos;
var ventanaExcesosVelocidad;
var placaExcesos = "";
var empresaExVelocidad = 'KRADAC';
var variable;

Ext.onReady(function () {
    var porEquipoEx = false;
    var banderaEx;
    var id_empresa = 1;
    var idTipoEquipo;
    if (idCompanyKarview == 1) {
        banderaEx = 1;
    } else {
        empresaExVelocidad = storeEmpresas.data.items[0].data.text;
        banderaEx = storeEmpresas.data.items[0].data.id;
    }
    var cbxEmpresasExcesos = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Organización',
        name: 'idempresasExcesos',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Organización...',
        editable: false,
        allowBlank: false,
        value: banderaEx,
        listeners: {
            select: function (combo, record, eOpts) {
                storeVeh.removeAll();
                empresaExVelocidad = cbxEmpresasExcesos.getRawValue();
                placaExcesos = " ";
                if (porEquipoEx) {
                    cbxVehExceso.clearValue();
                    cbxVehExceso.enable();
                    storeVeh.load({
                        params: {
                            cbxEmpresas: record.getId()
                        }
                    });
                    id_empresa = record.getId();
                }
            }
        }
    });

    var cbxVehExceso = Ext.create('Ext.form.ComboBox', {
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
                placaExcesos = record.data.placa;
                idTipoEquipo = record.data.idTipoEquipo;
            }
        }
    });
    var fechaIniExcesos = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniEx',
        name: 'fechaIniEx',
        value: new Date(),
        maxValue: new Date(),
//        vtype: 'daterange',
        allowBlank: false,
        endDateField: 'fechaFinEx',
        emptyText: 'Fecha Inicial...'
    });

    var fechaFinExcesos = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d', //YYYY-MMM-DD
        id: 'fechaFinEx',
        name: 'fechaFinEx',
        value: new Date(),
        maxValue: new Date(),
//        vtype: 'daterange',
        allowBlank: false,
        startDateField: 'fechaIniEx',
        emptyText: 'Fecha Final...'
    });

    var btn_HoyExcesos = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function () {
            var nowDate = new Date();
            fechaIniExcesos.setValue(nowDate);
            fechaFinExcesos.setValue(nowDate);
            timeIniExcesos.setValue('00:00');
            timeFinExcesos.setValue('23:59');
        }
    });
    var bt_HayerExcesos = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function () {
            var yestDate = Ext.Date.subtract(new Date(), Ext.Date.DAY, 1);
            fechaIniExcesos.setValue(yestDate);
            fechaFinExcesos.setValue(yestDate);
            timeIniExcesos.setValue('00:00');
            timeFinExcesos.setValue('23:59');
        }
    });
    var timeIniExcesos = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIniExcesos',
        value: '00:00',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Inicial...',
        listConfig: {
            minWidth: 300
        }
    });
    var timeFinExcesos = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFinExcesos',
        value: '23:59',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora final...',
        listConfig: {
            minWidth: 450
        }
    });
    var panel_BotonesExceso = Ext.create('Ext.panel.Panel', {
        layout: 'hbox',
        padding: '0 0 5 0',
        defaults: {
            margin: '0 5 0 0'
        },
        items: [
            {
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [btn_HoyExcesos
                ]
            }, {
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [bt_HayerExcesos]
            }

        ]
    });

    formularioExcesos = Ext.create('Ext.form.Panel', {
        bodyPadding: '10 10 0 10',
        id: 'for_excesos',
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
                            {boxLabel: 'Por Organización', name: 'rb1', id: 'vr1', inputValue: '1'},
                            {boxLabel: 'Por Vehículo', name: 'rb1', id: 'vr2', inputValue: '2'}
                        ],
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                switch (parseInt(newValue['rb1'])) {
                                    case 1:
                                        variable = 1;
                                        cbxEmpresasExcesos.enable();
                                        cbxVehExceso.clearValue();
                                        cbxVehExceso.disable();
                                        porEquipoEx = false;
                                        break;
                                    case 2:
                                        variable = 2;
                                        porEquipoEx = true;
                                        if (porEquipoEx) {
                                            cbxVehExceso.enable();
                                            storeVeh.load({
                                                params: {
                                                    cbxEmpresas: formularioExcesos.down('[name=idempresasExcesos]').getValue()
                                                }
                                            });
                                        }
                                        break;
                                }
                            }
                        }
                    },
                    cbxEmpresasExcesos,
                    cbxVehExceso
                ]
            }, {
                xtype: 'fieldset',
                title: '<b>Fechas</b>',
                items: [
                    fechaIniExcesos,
                    fechaFinExcesos,
                    timeIniExcesos,
                    , timeFinExcesos,
                    panel_BotonesExceso
                ]
            }],
        buttons: [
            {
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function () {
                    var form = formularioExcesos.getForm();
                    if (idTipoEquipo === '3') {
                        if (form.isValid()) {
                            form.submit({
                                url: 'php/interface/report/velocidades/getdataExcesVelocidad.php',
                                method: 'POST',
                                waitMsg: 'Comprobando Datos...',
                                params: {
                                    cbxEmpresasExcesos: id_empresa,
                                },
                                failure: function (form, action) {
                                    Ext.Msg.alert('Información', 'No se encuentras datos en estas fechas');
                                },
                                success: function (form, action) {
                                    if (ventanaExcesosVelocidad) {
                                        ventanaExcesosVelocidad.hide();
                                    }
                                    Ext.MessageBox.hide();
                                    var resultado = action.result;
                                    var datos = Ext.JSON.decode(resultado.string).data;
                                    cargardatosalGrid(datos, fechaIniExcesos.getRawValue(), fechaFinExcesos.getRawValue(), timeIniExcesos.getRawValue(), timeFinExcesos.getRawValue());
                                }
                            });
                        } else {
                            Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo correctamente ');
                        }
                    }else{
                           if (form.isValid()) {
                        form.submit({
                            url: 'php/interface/report/velocidades/getdataExcesVelocidad.php',
                            method: 'POST',
                            waitMsg: 'Comprobando Datos...',
                            params: {
                                cbxEmpresasExcesos: id_empresa,
                            },
                            failure: function (form, action) {
                                Ext.Msg.alert('Información', 'No se encuentras datos en estas fechas');
                            },
                            success: function (form, action) {
                                if (ventanaExcesosVelocidad) {
                                    ventanaExcesosVelocidad.hide();
                                }
                                Ext.MessageBox.hide();
                                var resultado = action.result;
                                var datos = Ext.JSON.decode(resultado.string).data;
                                cargardatosalGrid(datos, fechaIniExcesos.getRawValue(), fechaFinExcesos.getRawValue(), timeIniExcesos.getRawValue(), timeFinExcesos.getRawValue());
                            }
                        });
                    } else {
                        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo correctamente ');
                    }
                    }
                }
            }
            , {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: function () {
                    ventanaExcesosVelocidad.hide();
                }
            }]
    });
});
function cargardatosalGrid(datos, fi, ff, hi, hf) {

    Ext.define('Registros', {
        extend: 'Ext.data.Model',
        fields: ['acronimo', 'equipo', 'empresa', 'placa', 'velocidad', 'fecha', 'evento']
    });
    var storeExcesosVelocidad = Ext.create('Ext.data.JsonStore', {
        data: datos,
        storeId: 'recaudoId',
        model: 'Registros',
        sorters: ['acronimo', 'equipo', 'empresa', 'placa', 'evento'],
        groupField: 'acronimo',
        proxy: {
            type: 'ajax',
            reader: 'array'
        },
        fields: ['acronimo', 'equipo', 'empresa', 'evento']
    });

    var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
        id: 'group',
        groupHeaderTpl: 'Registro de : {name} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})',
    });
    var columnExcesosVelocidad = [
        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
        {text: 'Organización', flex: 80, dataIndex: 'empresa', renderer: formatCompany, filter: {type: 'list', store: storeEmpresasList}},
        {text: 'Placa', flex: 80, dataIndex: 'placa', filter: {type: 'string'}},
        {text: 'Velocidad', flex: 80, dataIndex: 'velocidad', cls: 'listview-filesize', filterable: true, filter: {type: 'numeric'}},
        {text: 'Registrado', flex: 80, dataIndex: 'fecha', format: 'd-m-Y H:i:s', width: 170, align: 'center', filter: {type: 'date'}, filterable: true},
        {text: 'Evento', flex: 100, dataIndex: 'evento', filter: {type: 'list', store: storeEventos}},
        {text: 'Dirección', flex: 350, dataIndex: 'direccion', filter: {type: 'string'}}
    ];
    var empresaVehiculo;
    if (variable === 1) {
        empresaVehiculo = empresaExVelocidad;
    } else {
        empresaVehiculo = empresaExVelocidad + " " + placaExcesos;
    }
    var gridExcesosVelocidad = Ext.create('Ext.grid.Panel', {
        layout: 'fit',
        region: 'center',
        title: '<center> Reporte de Excesos de Velocidad <br>Desde: ' + fi + ' | Hasta: ' + ff + ' Desde las: ' + hi + ' | Hasta las: ' + hf + '</center>',
        store: storeExcesosVelocidad,
        multiSelect: true,
        autoScroll: true,
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
                            exportExcelEventos(gridExcesosVelocidad, "Reporte de Excesos de Velocidad ", "nameSheet", "Reporte de " + empresaVehiculo + " " + fi + " " + hi + " | " + ff + " " + hf + "");
                        }}
                ]
            }],
        columns: columnExcesosVelocidad
    });
    var tabExcesosVelocidad = Ext.create('Ext.container.Container', {
        title: '<div id="titulosForm"> Excesos de Velocidad ' + empresaExVelocidad + " " + placaExcesos + '</div>',
        closable: true,
        iconCls: 'icon-exceso-vel',
        layout: 'border',
        items: [{
                layout: 'border',
                xtype: 'panel',
                items: gridExcesosVelocidad,
                region: 'center',
                autoScroll: true,
                columnLines: true,
                frame: true
            }
        ]
    });
    panelTabMapaAdmin.add(tabExcesosVelocidad);
    panelTabMapaAdmin.setActiveTab(tabExcesosVelocidad);
}
function ventanaexcesosvelociadadWin() {
    if (!ventanaExcesosVelocidad) {
        ventanaExcesosVelocidad = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Excesos de Velocidad',
            iconCls: 'icon-exceso-vel',
            resizable: false,
            width: 350,
            height: 370,
            autoHeight: true,
            closeAction: 'hide',
            plain: false,
            items: [formularioExcesos]
        });
    }
    formularioExcesos.getForm().reset();
    ventanaExcesosVelocidad.show();
    if (idRolKarview == 3) {
        Ext.getCmp('vr1').disable();
        Ext.getCmp('vr2').setValue(true);
    } else {
        Ext.getCmp('vr1').setValue(true);
    }
}





