var winAddVeh;
var contenedorVeh;
var formRecordsVeh;
var gridRecordsVeh;
var formImage;

var labelTecnico = Ext.create('Ext.form.Label', {
    text: '',
    style: {
        color: 'gray'
    }
});

var labelRegistro = Ext.create('Ext.form.Label', {
    text: '',
    style: {
        color: 'gray'
    }
});
//Llamar al modulo para crear un Equipo
var crearEquipo = Ext.create('Ext.button.Button', {
    xtype: 'button',
    iconCls: 'icon-credits',
    tooltip: 'Agregar nuevo equipo',
    handler: function () {
        showWinAdminDevice();
    }
});
//muestra el boton crear Equipo solo si tiene el rol 1 (administrador)
crearEquipo.setVisible(false);
if (idCompanyKarview == 1) {
    crearEquipo.setVisible(true);
}

Ext.onReady(function () {

    //Genera campos de array para usar en el inicio del store por defecto
    Ext.define('DataObjectVeh', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'idVeh', type: 'int'},
            {name: 'placa'},
            {name: 'idEmpresa', type: 'int'},
            {name: 'cbxPropietario', type: 'int'},
            {name: 'cbxClaseVehiculo', type: 'int'},
            {name: 'marca'},
            {name: 'modelo'},
            {name: 'numMotor'},
            {name: 'numChasis'},
            {name: 'idEquipo', type: 'int'},
            {name: 'vehiculo'},
            {name: 'regMunicipal'},
            {name: 'year', type: 'int'},
            {name: 'imageVehicle'},
            {name: 'obser'},
            {name: 'empresa'},
            {name: 'persona'},
            {name: 'equipo'},
            {name: 'clase_vehiculo', type: 'string'}

        ]
    });

    // crea los datos del store
    var gridStoreVehiculo = Ext.create('Ext.data.Store', {
        autoSync: true,
        model: 'DataObjectVeh',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/administracion/vehiculo/read.php',
                create: 'php/administracion/vehiculo/create.php',
                update: 'php/administracion/vehiculo/update.php',
                destroy: 'php/administracion/vehiculo/destroy.php'
            },
            reader: {
                type: 'json',
                successProperty: 'success',
                root: 'veh',
                messageProperty: 'message'
            },
            writer: {
                type: 'json',
                writeAllFields: false
            },
            listeners: {
                exception: function (proxy, response, operation) {
                    if (operation.getRequest().getInitialConfig(['action']) !== 'destroy') {
                        Ext.MessageBox.show({
                            title: 'ERROR',
                            msg: operation.getError(),
                            icon: Ext.MessageBox.ERROR,
                            buttons: Ext.Msg.OK
                        });
                    }
                }
            }
        },
        listeners: {
            write: function (store, operation, eOpts) {
                if (operation.success) {
                    Ext.example.msg("Mensaje", operation._resultSet.message);
                    gridStoreVehiculo.reload();
                    store_equipos.reload();
                    formRecordsVeh.getForm().reset();
                    onResetVeh();
                    if (operation.state) {
                        formRecordsVeh.down('#updateVeh').disable();
                        formRecordsVeh.getForm().reset();
                        storeTreeVeh.reload();
                        labelTecnico.setText('');
                        labelRegistro.setText('');
                    }
                }

            }

        }
    });

    // Column Model shortcut array
    var columns = [
        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
        {header: "Equipo", width: 80, sortable: true, dataIndex: 'equipo', filter: {type: 'string'}},
        {header: "Organización", width: 110, sortable: true, dataIndex: 'empresa', renderer: formatCompany, filter: {type: 'list', store: storeEmpresasList}},
        {header: "Alias", width: 130, sortable: true, dataIndex: 'vehiculo', filter: {type: 'string'}},
        {header: "Placa", width: 80, sortable: true, dataIndex: 'placa', filter: {type: 'string'}},
        {header: "Propietario", width: 280, sortable: true, dataIndex: 'persona', filter: {type: 'string'}},
        {header: "Marca de Vehículo", width: 150, sortable: true, dataIndex: 'marca', filter: {type: 'list', store: storeMarVehList}},
        {header: "Año", width: 100, sortable: true, dataIndex: 'year', filterable: true},
    ];

    // declare the source Grid
    gridRecordsVeh = Ext.create('Ext.grid.Panel', {
        viewConfig: {
            plugins: {
                ddGroup: 'GridExample',
                ptype: 'gridviewdragdrop',
                enableDrop: false
            }
        },
        store: gridStoreVehiculo,
        columns: columns,
        enableDragDrop: true,
        stripeRows: true,
        height: 420,
        selModel: Ext.create('Ext.selection.RowModel', {singleSelect: true}),
        plugins: 'gridfilters',
        tbar: [{
                xtype: 'button',
                iconCls: 'icon-excel',
                text: 'Exportar a Excel',
                handler: function () {
                    exportExcelEventos(gridRecordsVeh, "Registros de vehículos", "Datos", "Reporte de vehículos");
                }
            }],
        listeners: {
            selectionchange: function (thisObject, selected, eOpts) {
                setActiveRecordVeh(selected[0] || null);
                setImageVehiculo(selected[0].data.labelImage);
            }

        }
    });

    var formPanelGrid = Ext.create('Ext.form.Panel', {
        margins: '0 2 0 0',
        region: 'center',
        width: '30%',
        // autoScroll: true,
        title: '<b>Registros de vehículos</b>',
        items: [gridRecordsVeh]
    });

    formRecordsVeh = Ext.create('Ext.form.Panel', {
        id: 'panel-datos-veh',
        region: 'east',
        title: '<b>Ingresar datos del vehículo</b>',
        activeRecord: null,
        width: '70%',
        fileUpload: true,
        split: true,
        collapsible: true,
        scrollable: true,
        bodyPadding: 5,
        items: [{
                xtype: 'fieldset',
                title: '<b>Datos del vehículo</b>',
                layout: 'hbox',
                defaults: {
                    padding: '5 5 5 5',
                    baseCls: 'x-plain',
                    layout: 'vbox',
                    defaults: {
                        labelWidth: 100
                    }
                },
                items: [{
                        items: [
                            {
                                layout: 'column',
                                baseCls: 'x-plain',
                                itemId: 'placaCon',
                                items: [{
                                        columnWidth: .9,
                                        baseCls: 'x-plain',
                                        items: [
                                            {
                                                xtype: 'textfield',
                                                fieldLabel: '<b>Placa</b>',
                                                afterLabelTextTpl: required,
                                                fieldStyle: 'text-transform: uppercase',
                                                blankText: 'Este campo es Obligatorio',
                                                vtype: 'placaValida',
                                                name: 'placa',
                                                itemId: 'placa',
                                                allowBlank: false,
                                                emptyText: 'LBA1791'
                                            }
                                        ]
                                    },
                                    {
                                        baseCls: 'x-plain',
                                        items: [
                                            {
                                                xtype: 'button',
                                                icon: 'img/logo-ant.png',
                                                tooltip: 'Buscar en la ANT',
                                                handler: buscarVehiculoPorPlaca
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                xtype: 'combobox',
                                fieldLabel: '<b>Organización</b>',
                                AllowSelection: false,
                                blankText: 'Este campo es Obligatorio',
                                name: 'idEmpresa',
                                forceSelection: true,
                                store: storeEmpresas,
                                valueField: 'id',
                                displayField: 'text',
                                queryMode: 'local',
                                allowBlank: false,
                                emptyText: 'Escoger Organización...',
                                listConfig: {
                                    minWidth: 160
                                }
                            }
                            , {
                                xtype: 'combobox',
                                fieldLabel: '<b>Propietario</b>',
                                afterLabelTextTpl: required,
                                blankText: 'Este campo es Obligatorio',
                                name: 'cbxPropietario',
                                store: storePersonas,
                                valueField: 'id',
                                forceSelection: true,
                                displayField: 'text',
                                queryMode: 'local',
                                allowBlank: false,
                                emptyText: 'Escoger Persona...',
                                listConfig: {
                                    minWidth: 300
                                }
                            },
                            {
                                layout: 'column',
                                baseCls: 'x-plain',
                                items: [{
                                        columnWidth: .9,
                                        baseCls: 'x-plain',
                                        items: [
                                            {
                                                xtype: 'combobox',
                                                fieldLabel: '<b>Equipo</b>',
                                                name: 'idEquipo',
                                                id: 'id_equipos',
                                                store: store_equipos,
                                                valueField: 'id',
                                                editable: false,
                                                displayField: 'text',
                                                queryMode: 'local',
                                                emptyText: 'Escoger Equipo...',
                                                afterLabelTextTpl: required,
                                                blankText: 'Este campo es Obligatorio',
                                                allowBlank: false,
                                            }
                                        ]
                                    },
                                    crearEquipo


                                ]
                            },
                            {
                                xtype: 'combobox',
                                fieldLabel: '<b>Clase Vehículo</b>',
                                name: 'cbxClaseVehiculo',
                                displayField: 'text',
                                valueField: 'id',
                                forceSelection: true,
                                store: storeclasseVehiculo,
                                emptyText: 'Escoger Clase Vehiculo...',
                                afterLabelTextTpl: required,
                                blankText: 'Este campo es Obligatorio',
                                allowBlank: false,
                                queryMode: 'local'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '<b>Marca</b>',
                                name: 'marca',
                                vtype: 'campos',
                                itemId: 'marca',
                                emptyText: 'Marca del Vehículo...',
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '<b>Modelo</b>',
                                name: 'modelo',
                                vtype: 'campos',
                                itemId: 'modelo',
                                emptyText: 'Modelo del Vehículo...',
                            },
                            {
                                xtype: 'numberfield',
                                fieldLabel: '<b>Año</b>',
                                name: 'year',
                                emptyText: 'Año del Vehículo...',
                                value: 1950,
                                minValue: 1950,
                                editable: true,
                                itemId: 'anio',
                                maxValue: Ext.Date.format(new Date(), 'Y'),
                                maxValueText: INFOMESSAGEMAXVALUE,
                                minValueText: INFOMESSAGEMINVALUE
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                hidden: true,
                                name: 'imageVehicle',
                                xtype: 'textfield'
                            },
                            {
                                buttonConfig: {
                                    iconCls: 'icon-upload',
                                    text: '',
                                    tooltip: 'Escoger imagen'
                                },
                                emptyText: "Máximo 2MB",
                                fieldLabel: "<b>Fotografía</b>",
                                listeners: {
                                    change: function (thisObj, value, eOpts) {
                                        this.up('form').getForm().submit({
                                            url: 'php/uploads/uploadVehiculo.php',
                                            waitTitle: 'Procesando Información',
                                            waitMsg: 'Subiendo...',
                                            success: function (form, action) {
                                                setImageVehiculo(action.result.message);
                                            },
                                            failure: function (form, action) {
                                                messageInformation(action.result.message);
                                            }
                                        });
                                    }
                                },
                                name: 'imageFile',
                                xtype: 'filefield',
                                margin: '0 0 6 0'
                            }, {
                                anchor: '60%',
                                border: 2,
                                height: 110,
                                margin: '0 0 6 105',
                                name: 'labelImage',
                                src: 'img/uploads/vehiculos/empty.jpg',
                                style: {
                                    borderColor: '#157fcc',
                                    borderStyle: 'solid'
                                },
                                xtype: 'image'
                            }
                            , {
                                xtype: 'textfield',
                                fieldLabel: '<b>Alias</b>',
                                vtype: 'campos',
                                name: 'vehiculo',
                                emptyText: 'Ingresar Vehículo...',
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '<b>Num. Motor</b>',
                                name: 'numMotor',
                                vtype: 'campos',
                                itemId: 'motor',
                                emptyText: 'Número de Motor...'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '<b>Num. Chasis</b>',
                                name: 'numChasis',
                                vtype: 'campos',
                                itemId: 'chasis',
                                emptyText: 'Número de Chasis...'
                            }

                        ]
                    }]
            },
            {
                xtype: 'textarea',
                width: '100%',
                name: 'obser',
                fieldLabel: '<b>Observación</b>'
            }
        ],
        listeners: {
            create: function (form, data) {
                gridStoreVehiculo.insert(0, data);
                gridStoreVehiculo.reload();
            }
        },
        dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: ['->',
                    {iconCls: 'icon-update', itemId: 'updateVeh', text: '<b>Actualizar</b>', scope: this, tooltip: 'Actualizar Datos', handler: onUpdateVeh},
                    {iconCls: 'icon-car', itemId: 'createVeh', text: '<b>Crear</b>', scope: this, tooltip: 'Crear Vehiculo', handler: onCreateVeh},
                    {iconCls: 'icon-cleans', text: '<b>Limpiar</b>', scope: this, tooltip: 'Limpiar Campos', handler: onResetVeh},
                    {iconCls: 'icon-cancelar', text: '<b>Cancelar</b>', tooltip: 'Cancelar', scope: this, handler: clearWinVeh}
                ]
            }]
    });

    contenedorVeh = Ext.create('Ext.form.Panel', {
        layout: 'border',
        bodyPadding: 8,
        items: [
            formPanelGrid,
            formRecordsVeh
        ]
    });
});

function ventanaAddVehiculos() {
    if (!winAddVeh) {
        winAddVeh = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: '<b>Vehículos</b>',
            iconCls: 'icon-car',
            resizable: false,
            width: 1000,
            height: 510,
            closeAction: 'hide',
            plain: false,
            items: [contenedorVeh]
        });
    }
    onResetVeh();
    contenedorVeh.getForm().reset();
    winAddVeh.show();
    labelTecnico.setText('');
    labelRegistro.setText('');
    formRecordsVeh.down('#updateVeh').disable();/// desabilitar
    formRecordsVeh.down('#createVeh').enable();// habilitar
    if (gridRecordsVeh.getStore().getCount() === 0) {
        gridRecordsVeh.getStore().load();
    }
}

function setActiveRecordVeh(record) {
    formRecordsVeh.activeRecord = record;
    if (record) {
        formRecordsVeh.down('#updateVeh').enable();
        formRecordsVeh.down('#createVeh').disable();
        formRecordsVeh.getForm().loadRecord(record);
        Ext.getCmp('id_equipos').setValue(record.data.equipo);
    } else {
        formRecordsVeh.down('#updateVeh').disable();
        formRecordsVeh.getForm().reset();
    }
}


function onUpdateVeh() {
    var form = formRecordsVeh.getForm();
    if (form.isValid()) {
        form.updateRecord(formRecordsVeh.activeRecord);
        storeTreeVeh.reload();
    } else {
        messageInformationEffect(INFOMESSAGEREQUERIDALL);
    }
}


function onCreateVeh() {
    var form = formRecordsVeh.getForm();
    if (form.isValid()) {
        formRecordsVeh.fireEvent('create', formRecordsVeh, form.getValues());
        formRecordsVeh.getForm().reset();
        storeTreeVeh.reload();
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo, correctamente ');

    }
}

function onResetVeh() {
    formRecordsVeh.down('#createVeh').enable();
    formRecordsVeh.getForm().reset();
    setImageVehiculo('empty.jpg');
    storeTreeVeh.reload();
    store_equipos.reload();
}

function clearWinVeh() {
    formRecordsVeh.down('#createVeh').enable();
    winAddVeh.hide();
}

function onDeleteClickVeh() {
    Ext.MessageBox.confirm('Atención!', 'Desea Eliminar el vehiculo', function (choice) {
        if (choice === 'yes') {
            var selection = gridRecordsVeh.getView().getSelectionModel().getSelection()[0];
            if (selection) {
                gridRecordsVeh.store.remove(selection);
                formRecordsVeh.down('#createVeh').enable();
                storeTreeVeh.reload();
            }
        }
    });
}

function buscarVehiculoPorPlaca() {
    var placa = formRecordsVeh.down('#placaCon').down('#placa').getValue();
    $.get("php/ant", {
        placa: placa
    }).done(function (data) {
        var data1 = data.split("\n");
        var dat = data1[data1.length - 1].split("*");
        console.log(dat);
        if (dat.length === 17) {
            var plac = dat[0];
            if (plac !== "") {
                formRecordsVeh.down('#placa').setValue(plac);
                formRecordsVeh.down('#chasis').setValue(dat[1]);
                formRecordsVeh.down('#motor').setValue(dat[2]);
                formRecordsVeh.down('#marca').setValue(dat[3]);
                formRecordsVeh.down('#modelo').setValue(dat[4]);
                formRecordsVeh.down('#anio').setValue(dat[8]);
            } else {
                formRecordsVeh.down('#chasis').reset();
                formRecordsVeh.down('#motor').reset();
                formRecordsVeh.down('#marca').reset();
                formRecordsVeh.down('#modelo').reset();
                formRecordsVeh.down('#anio').reset();
            }
        }
    });
}
function setImageVehiculo(nameImage) {
    formRecordsVeh.down('[name=labelImage]').setSrc('img/uploads/vehiculos/' + nameImage);
    formRecordsVeh.down('[name=imageVehicle]').setValue(nameImage);
    formRecordsVeh.down('[name=imageFile]').setRawValue(nameImage);

}

Ext.apply(Ext.form.field.VTypes, {
    placaValida1: function (val, field) {
        if (val.length === 7) {
            return /^[A-Za-z]{3}[0-9]{4}$/.test(val);
        }
    },
    placaValida1Mask: /[A-Z0-9a-z]/
});