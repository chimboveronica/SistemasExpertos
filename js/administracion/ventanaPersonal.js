var winAdminPerson;
var formAdminPerson;
var gridAdminPerson;

/////////////////////////
var storeCorreo;
var gridCorreo;
var storeCelular;
var gridCelular;
var listaCorreos = [];
var listaCelulares = [];
Ext.onReady(function () {
    Ext.define('Celular', {
        extend: 'Ext.data.Model',
        fields: [
            'celular'
        ]
    });
    storeCelular = Ext.create('Ext.data.Store', {
        autoDestroy: true,
        model: 'Celular',
        proxy: {
            type: 'memory'
        },
        data: listaCelulares,
        sorters: [{
                property: 'start',
                direction: 'ASC'
            }]
    });
    var rowEditingCelular = Ext.create('Ext.grid.plugin.RowEditing', {
        clicksToEdit: 1,
        autoCancel: false,
        saveBtnText: 'Guardar',
        cancelBtnText: 'Cancelar'
    });
    gridCelular = Ext.create('Ext.grid.Panel', {
        store: storeCelular,
        name: 'celular',
        iconCls: 'icon-telef',
        columns: [
            {
                header: '<center><b>Celular</b><center>',
                dataIndex: 'celular',
                width: 250,
                editor: {
                    xtype: 'textfield',
                    allowBlank: false,
                    name: 'celular',
                    maxLength: 10,
                    vtype: 'telefonocelular'
                }}
        ],
        width: 310,
        height: 250,
        title: '<b>Celular</b>',
        frame: true,
        tbar: [{
                text: '<b>Agregar</b>',
                iconCls: 'icon-add',
                handler: function () {
                    rowEditingCelular.cancelEdit();
                    var celular = Ext.create('Celular', {
                        celular: '0900000000'
                    });
                    storeCelular.insert(0, celular);
                    rowEditingCelular.startEdit(storeCelular.data.items.length - 1, 0);
                }
            }, {
                itemId: 'removeCelular',
                text: '<b>Remover</b>',
                iconCls: 'icon-delete',
                handler: function () {
                    var sm = gridCelular.getSelectionModel();
                    rowEditingCelular.cancelEdit();
                    storeCelular.remove(sm.getSelection());
                    if (storeCelular.getCount() > 0) {
                        sm.select(0);
                    }
                },
                disabled: true
            }],
        plugins: [rowEditingCelular],
        listeners: {
            'selectionchange': function (view, records) {
                gridCelular.down('#removeCelular').setDisabled(!records.length);
            }
        }
    });

//////////////////////////
    Ext.define('Employee', {
        extend: 'Ext.data.Model',
        fields: [
            'correo'
        ]
    });
    // create the Data Store
    storeCorreo = Ext.create('Ext.data.Store', {
        // destroy the store if the grid is destroyed
        autoDestroy: true,
        model: 'Employee',
        proxy: {
            type: 'memory'
        },
        data: listaCorreos,
        sorters: [{
                property: 'start',
                direction: 'ASC'
            }]
    });
    var rowEditingCorreo = Ext.create('Ext.grid.plugin.RowEditing', {
        clicksToEdit: 1,
        autoCancel: false,
        saveBtnText: 'Guardar',
        cancelBtnText: 'Cancelar'
    });
    gridCorreo = Ext.create('Ext.grid.Panel', {
        store: storeCorreo,
        name: 'telefonos',
        iconCls: 'icon-email',
        columns: [
            {
                header: '<center><b>Correo</b><center>',
                dataIndex: 'correo',
                width: 250,
                editor: {
                    xtype: 'textfield',
                    allowBlank: false,
                    name: 'correo',
                    maxLength: 45,
                    vtype: 'email'
                }}
        ],
        width: 310,
        height: 250,
        frame: true,
        tbar: [{
                text: '<b>Agregar</b>',
                iconCls: 'icon-add',
                handler: function () {
                    rowEditingCorreo.cancelEdit();
                    var correo = Ext.create('Employee', {
                        correo: 'kradac@kradac.com'
                    });
                    storeCorreo.insert(0, correo);
                    rowEditingCorreo.startEdit(storeCorreo.data.items.length - 1, 0);
                }
            }, {
                itemId: 'removeEmployee',
                text: '<b>Remover</b>',
                iconCls: 'icon-delete',
                handler: function () {
                    var sm = gridCorreo.getSelectionModel();
                    rowEditingCorreo.cancelEdit();
                    storeCorreo.remove(sm.getSelection());
                    if (storeCorreo.getCount() > 0) {
                        sm.select(0);
                    }
                },
                disabled: true
            }],
        plugins: [rowEditingCorreo],
        listeners: {
            'selectionchange': function (view, records) {
                gridCorreo.down('#removeEmployee').setDisabled(!records.length);
            }
        }
    });

    var dateAdultPerson = Ext.Date.subtract(currentDate, Ext.Date.YEAR, 18);
    Ext.define('DataPerson', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'idPerson', type: 'int'},
            {name: 'documentPerson', type: 'string'},
            {name: 'namePerson', type: 'string'},
            {name: 'surnamePerson', type: 'string'},
            {name: 'dateOfBirthPerson'},
            {name: 'addressPerson', type: 'string'},
            {name: 'emailPerson', type: 'string'},
            {name: 'cellPerson', type: 'string'},
            {name: 'imagenOrg', type: 'string'}
        ]
    });

    var gridStore = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'DataPerson',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/administracion/personal/read.php',
                create: 'php/administracion/personal/create.php',
                update: 'php/administracion/personal/update.php',
                destroy: 'php/administracion/personal/destroy.php'
            },
            reader: {
                type: 'json',
                successProperty: 'success',
                root: 'personas',
                messageProperty: 'message'
            },
            writer: {
                type: 'json',
                writeAllFields: false
            },
            listeners: {
                exception: function (proxy, response, operation) {
                    gridAdminPerson.getStore().rejectChanges();
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
                onResetPerson();
                if ((operation.getRequest().getInitialConfig(['action']) === 'create') ||
                        (operation.getRequest().getInitialConfig(['action']) === 'update')) {
                    gridStore.reload();
                }
                storePersonas.reload();
                messageInformationEffect(operation.getResultSet().message);
            },
            load: function (thisObj, records, successful, eOpts) {
                if (successful) {
                    gridAdminPerson.setTitle('Registros: ' + records.length);
                }
            }
        }
    });

    gridAdminPerson = Ext.create('Ext.grid.Panel', {
        plugins: 'gridfilters',
        region: 'center',
        store: gridStore,
        title: 'Registros',
        tbar: [{
                text: 'Exportar a Excel',
                iconCls: 'icon-excel',
                handler: function () {
                    exportExcelEventos(gridAdminPerson, 'Registros de Personal', 'Personal', 'Registros de Personal');
                }
            }],
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 40, align: 'center'}),
            {text: "Cédula", width: 100, dataIndex: 'documentPerson', filter: true},
            {text: "Apellidos", width: 125, dataIndex: 'surnamePerson', filter: true},
            {text: "Nombres", width: 125, dataIndex: 'namePerson', filter: true},
            {text: "Dirección", width: 150, dataIndex: 'addressPerson', filter: true},
            {text: "Correo", width: 200, dataIndex: 'emailPerson', filter: true},
            {text: "Celular", width: 100, dataIndex: 'cellPerson', filter: true}
        ],
        listeners: {
            selectionchange: function (thisObject, selected, eOpts) {
                if (selected[0] || null) {
                    setActiveRecordPerson(selected);
                    storeCelular.removeAll();
                    if (selected[0].data.cellPerson !== "") {
                        var celular = selected[0].data.cellPerson;
                        listaCelulares = celular.split(',');
                        for (var i = 0; i < listaCelulares.length; i++) {
                            var r = Ext.create('Celular', {
                                celular: listaCelulares[i]
                            });
                            storeCelular.insert(0, r);
                        }
                    }
                    storeCorreo.removeAll();
                    if (selected[0].data.emailPerson !== "") {
                        var correo = selected[0].data.emailPerson;
                        listaCorreos = correo.split(',');
                        for (var i = 0; i < listaCorreos.length; i++) {
                            var r = Ext.create('Employee', {
                                correo: listaCorreos[i]
                            });
                            storeCorreo.insert(0, r);
                        }
                    }

                }
            }
        },
        viewConfig: {
            loadingText: 'Cargando...'
        }
    });

    formAdminPerson = Ext.create('Ext.form.Panel', {
        region: 'east',
        scrollable: true,
        split: true,
        title: 'Formulario',
        width: '50%',
        bodyPadding: 5,
        collapsible: true,
        defaults: {
            collapsible: true,
            defaultType: 'textfield',
            fieldDefaults: {
                anchor: '100%',
                enforceMaxLength: true
            },
            xtype: 'fieldset'
        },
        dockedItems: [{
                ui: 'footer',
                xtype: 'toolbar',
                dock: 'bottom',
                items: ['->', {
                        text: 'Actualizar',
                        tooltip: 'Actualizar',
                        disabled: true,
                        iconCls: 'icon-update',
                        itemId: 'update',
                        handler: onUpdatePerson
                    }, {
                        text: 'Crear',
                        tooltip: 'Crear',
                        iconCls: 'icon-add',
                        itemId: 'create',
                        handler: onCreatePerson
                    }, {
                        tooltip: 'Limpiar Campos',
                        iconCls: 'icon-cleans',
                        handler: onResetPerson
                    }, {
                        tooltip: 'Cancelar',
                        iconCls: 'icon-cancelar',
                        handler: function () {
                            winAdminPerson.hide();
                        }
                    }]
            }],
        items: [{
                items: [
                    {
                        afterLabelTextTpl: INFOMESSAGEREQUERIDUNIQUE,
                        allowBlank: false,
                        blankText: INFOMESSAGEBLANKUNIQUETEXT,
                        emptyText: '0123456789 (10 digitos)',
                        fieldLabel: 'Cédula',
                        maxLength: 10,
                        itemId: 'cedula',
                        minLengthText: INFOMESSAGEMINLENGTH,
                        name: 'documentPerson',
                        vtype: 'cedulaValida1'
                    }, {
                        afterLabelTextTpl: INFOMESSAGEREQUERID,
                        allowOnlyWhitespace: false,
                        blankText: INFOMESSAGEBLANKTEXT,
                        emptyText: 'Ingresar Nombres...',
                        fieldLabel: 'Nombres',
                        itemId: 'nombres',
                        maxLength: 45,
                        minLength: 2,
                        minLengthText: INFOMESSAGEMINLENGTH,
                        maxLengthText: INFOMESSAGEMAXLENGTH,
                        name: 'namePerson',
                        vtype: 'alphaaccentenespaces'
                    }, {
                        afterLabelTextTpl: INFOMESSAGEREQUERID,
                        allowOnlyWhitespace: false,
                        blankText: INFOMESSAGEBLANKTEXT,
                        emptyText: 'Ingresar Apellidos...',
                        fieldLabel: 'Apellidos',
                        itemId: 'apellidos',
                        maxLength: 45,
                        minLength: 2,
                        minLengthText: INFOMESSAGEMINLENGTH,
                        maxLengthText: INFOMESSAGEMAXLENGTH,
                        name: 'surnamePerson',
                        vtype: 'alphaaccentenespaces'
                    },
                    {
                        xtype: 'datefield',
                        fieldLabel: '<b>Fecha de Nacimiento</b>',
                        format: 'Y-m-d',
                        editable: false,
                        value: dateAdultPerson,
                        maxValue: dateAdultPerson,
                        name: 'dateOfBirthPerson',
                        emptyText: 'Ingresar Fecha...'
                    }
                ],
                title: '<b>Datos Personales</b>'
            }, {
                items: [
                    {
                        emptyText: 'Ingresar Dirección...',
                        fieldLabel: 'Dirección',
                        maxLength: 150,
                        minLength: 10,
                        minLengthText: INFOMESSAGEMINLENGTH,
                        name: 'addressPerson',
                        vtype: 'alphanumnospecialenepointdash'
                    },
                    {
                        hidden: true,
                        name: 'emailPerson',
                        xtype: 'textfield'
                    },
                    {
                        hidden: true,
                        name: 'cellPerson',
                        xtype: 'textfield'
                    },
                    {
                        hidden: true,
                        name: 'imagenOrg',
                        xtype: 'textfield'
                    },
                    {
                        buttonConfig: {
                            iconCls: 'icon-upload',
                            text: 'Logo',
                            tooltip: 'El logo debe contener una dimención de 1366x84 pixeles'
                        },
                        emptyText: "Máximo 2MB",
                        fieldLabel: "Escoger Logo",
                        listeners: {
                            change: function (thisObj, value, eOpts) {
                                var form = formAdminPerson.getForm();
                                if (form.isValid()) {
                                    this.up('form').getForm().submit({
                                        url: 'php/uploads/orgs/uploadOrgs.php',
                                        waitTitle: 'Procesando Información',
                                        waitMsg: 'Subiendo...',
                                        success: function (form, action) {
                                            formAdminPerson.down('[name=imagenOrg]').setValue(action.result.message);
                                            formAdminPerson.down('[name=imageFile]').setRawValue(action.result.messag);
                                            panelMenu.down('[name=labelImage]').setSrc('img/uploads/orgs/' + action.result.message);
                                        },
                                        failure: function (form, action) {
                                            Ext.MessageBox.show({
                                                title: 'Información',
                                                msg: action.result.message,
                                                buttons: Ext.MessageBox.OK,
                                                icon: Ext.MessageBox.INTO
                                            });
                                        }
                                    });
                                } else {
                                    Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo correctamente ');
                                }

                            }
                        },
                        name: 'imageFile',
                        xtype: 'filefield'
                    },
                    {
                        xtype: 'fieldset',
                        title: '<b>Celular</b>',
                        id: 'idCelular',
                        hide: true,
                        collapsible: true,
                        defaultType: 'textfield',
                        layout: 'anchor',
                        padding: '3 3 5 3',
                        defaults: {
                            anchor: '100%'
                        },
                        items: [
                            gridCelular
                        ]
                    },
                    {
                        xtype: 'fieldset',
                        title: '<b>Correo</b>',
                        id: 'idCorreo',
                        collapsible: true,
                        defaultType: 'textfield',
                        layout: 'anchor',
                        padding: '3 3 5 3',
                        defaults: {
                            anchor: '100%'
                        },
                        items: [
                            gridCorreo
                        ]
                    }
                ],
                title: '<b>Dirección y Contactos</b>'
            }],
        listeners: {
            create: function (form, data) {
                gridStore.insert(0, data);
            }
        }
    });
});

function showWinAdminPerson() {
    if (!winAdminPerson) {
        winAdminPerson = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Administración de Personal',
            iconCls: 'icon-persona',
            resizable: false,
            width: 780,
            height: 450,
            closeAction: 'hide',
            plain: false,
            items: [{
                    layout: 'border',
                    bodyPadding: 5,
                    items: [
                        gridAdminPerson,
                        formAdminPerson
                    ]
                }]
        });
    }
    onResetPerson();
    winAdminPerson.show();
    Ext.getCmp('idCorreo').collapse();
    Ext.getCmp('idCelular').collapse();
     if (idRolKarview == 2) {
        formAdminPerson.down('[name=imageFile]').setVisible(false);
    } 
}


function setActiveRecordPerson(selected) {
    formAdminPerson.down('#update').setDisabled(!selected.length);
    formAdminPerson.down('#create').setDisabled(selected.length);
    if (selected.length > 0) {
        formAdminPerson.getForm().loadRecord(selected[0]);
    }
}

function onUpdatePerson() {
    var form = formAdminPerson.getForm();
    if (form.isValid()) {
        formAdminPerson.down('[name=emailPerson]').setValue(onCreateCorreo());
        formAdminPerson.down('[name=cellPerson]').setValue(onCreateCel());
        form.updateRecord(formAdminPerson.activeRecord);
        onResetPerson();
    } else {
        messageInformationEffect(INFOMESSAGEREQUERIDALL);
    }
}
function onCreateCorreo() {
    var aux;
    if (storeCorreo.data.length > 0) {
        if (storeCorreo.data.length > 1) {
            for (var i = 0; i < storeCorreo.data.length - 1; i++) {
                if (i === 0) {
                    aux = storeCorreo.getAt(i).data.correo + ',';
                } else {
                    aux = aux + storeCorreo.getAt(i).data.correo + ',';
                }
            }
            aux = aux + storeCorreo.getAt(storeCorreo.data.length - 1).data.correo;
        } else {
            aux = storeCorreo.getAt(0).data.correo;
        }
    }

    storeCorreo.removeAll();
    return aux;
}

function onCreateCel() {
    var aux;
    if (storeCelular.data.length > 0) {
        if (storeCelular.data.length > 1) {
            for (var i = 0; i < storeCelular.data.length - 1; i++) {
                if (i === 0) {
                    aux = storeCelular.getAt(i).data.celular + ',';
                } else {
                    aux = aux + storeCelular.getAt(i).data.celular + ',';
                }
            }
            aux = aux + storeCelular.getAt(storeCelular.data.length - 1).data.celular;
        } else {
            aux = storeCelular.getAt(0).data.celular;
        }
    }
    storeCelular.removeAll();
    return aux;
}

function onCreatePerson() {
    var form = formAdminPerson.getForm();
    if (form.isValid()) {
        formAdminPerson.down('[name=emailPerson]').setValue(onCreateCorreo());
        formAdminPerson.down('[name=cellPerson]').setValue(onCreateCel());
        formAdminPerson.fireEvent('create', formAdminPerson, form.getValues());
    } else {
        messageInformationEffect(INFOMESSAGEREQUERIDALL);
    }
}

function onResetPerson() {
    storeCelular.removeAll();
    storeCorreo.removeAll();
    Ext.getCmp('idCorreo').collapse();
    Ext.getCmp('idCelular').collapse();
    formAdminPerson.down('#create').setDisabled(0);
    formAdminPerson.down('#update').setDisabled(1);
    formAdminPerson.getForm().reset();
    gridAdminPerson.getView().deselect(gridAdminPerson.getSelection());
}

function onDeletePerson() {
    Ext.MessageBox.confirm('Atención!', 'Desea Eliminar la Persona', function (choice) {
        if (choice === 'yes') {
            var selection = gridAdminPerson.getView().getSelectionModel().getSelection()[0];
            if (selection) {
//                gridAdminPerson.store.remove(selection);
            }
        }
    });
}

function buscarPersonaPorCedula() {
    var cedula = formAdminPerson.down('#cedula').getValue();
    $.get("php/cne", {
        cedula: cedula
    }).done(function (data) {
        var data1 = data.split("\n");
        var dat = data1[data1.length - 1].split(" ");
        console.log(dat);
        if (dat.length === 4) {
            formAdminPerson.down('#apellidos').setValue(dat[0] + " " + dat[1]);
            formAdminPerson.down('#nombres').setValue(dat[2] + " " + dat[3]);
        } else if (dat.length === 2) {
            formAdminPerson.down('#apellidos').setValue(dat[0]);
            formAdminPerson.down('#nombres').setValue(dat[1]);
        }  else if (dat.length === 5) {
            formAdminPerson.down('#apellidos').setValue(dat[0] + " " + dat[1]);
            formAdminPerson.down('#nombres').setValue(dat[2] + " " + dat[3]+ " " + dat[4]);
        }
    });
}
Ext.apply(Ext.form.field.VTypes, {
    cedulaValida1: function (val) {
        if (val.length === 10) {
            if (check_cedula(val)) {
                buscarPersonaPorCedula();
                return true;
            }
            return false;
        }
        return false;
    },
    cedulaValida1Mask: /[0-9]/});

