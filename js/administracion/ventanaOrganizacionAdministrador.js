var winAdminCompany;
var formAdminCompany;
var gridAdminCompany;
Ext.onReady(function () {
    Ext.define('DataCompany', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'idCompany', type: 'int'},
            {name: 'acronymCompany', type: 'string'},
            {name: 'companyCompany', type: 'string'},
            {name: 'addressCompany', type: 'string'},
            {name: 'cellCompany', type: 'string'},
            {name: 'emailCompany', type: 'string'},
            {name: 'color', type: 'string'},
            {name: 'idDistribuidor', type: 'int'}
        ]
    });

    var gridStore = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'DataCompany',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/administracion/organizacionAdministrador/read.php',
                create: 'php/administracion/organizacionAdministrador/create.php',
                update: 'php/administracion/organizacionAdministrador/update.php'
            },
            reader: {
                type: 'json',
                successProperty: 'success',
                root: 'data',
                messageProperty: 'message'
            },
            writer: {
                type: 'json',
                writeAllFields: false
            },
            listeners: {
                exception: function (proxy, response, operation) {
                    gridAdminCompany.getStore().rejectChanges();
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
                onResetCompany();
                if ((operation.getRequest().getInitialConfig(['action']) === 'create') ||
                        (operation.getRequest().getInitialConfig(['action']) === 'update')) {
                    gridStore.reload();
                }
                storeEmpresas.reload();
                storeTreeVeh.reload();
                messageInformationEffect(operation.getResultSet().message);
            },
            load: function (thisObj, records, successful, eOpts) {
                if (successful) {
                    gridAdminCompany.setTitle('Registros: ' + records.length);
                }
            }
        }
    });

    gridAdminCompany = Ext.create('Ext.grid.Panel', {
        plugins: 'gridfilters',
        region: 'center',
        store: gridStore,
        title: 'Registros',
        tbar: [{
                text: 'Exportar a Excel',
                iconCls: 'icon-excel',
                handler: function () {
                    exportExcelEventos(gridAdminCompany, 'Registros de Organizaciones', 'Organización', 'Registros de Organizaciones');
                }
            }],
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 40, align: 'center'}),
            {text: "Acrónimo", width: 100, align: 'center', dataIndex: 'acronymCompany', filter: true},
            {text: "Organización", width: 150, dataIndex: 'companyCompany', filter: true},
            {text: "Dirección", width: 150, dataIndex: 'addressCompany', filter: true},
            {text: "Correo", width: 200, align: 'center', dataIndex: 'emailCompany', filter: true},
            {text: "Celular", width: 100, align: 'center', dataIndex: 'cellCompany', filter: true}
        ],
        listeners: {
            selectionchange: function (thisObj, selected, eOpts) {
                setActiveRecordCompany(selected);
            }
        },
        viewConfig: {
            loadingText: 'Cargando...'
        }
    });

    formAdminCompany = Ext.create('Ext.form.Panel', {
        region: 'east',
        scrollable: true,
        split: true,
        title: 'Formulario',
        width: '50%',
        bodyPadding: 5,
        collapsible: true,
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
                        handler: onUpdateCompany
                    }, {
                        text: 'Crear',
                        tooltip: 'Crear',
                        iconCls: 'icon-add',
                        itemId: 'create',
                        handler: onCreateCompany
                    }, {
                        tooltip: 'Limpiar Campos',
                        iconCls: 'icon-cleans',
                        handler: onResetCompany
                    }, {
                        tooltip: 'Cancelar',
                        iconCls: 'icon-cancelar',
                        handler: function () {
                            winAdminCompany.hide();
                        }
                    }]
            }],
//        defaultType: 'textfield',
        layout: 'anchor',
        defaults: {
            anchor: '100%'
        },
        items: [
            {
                xtype: 'textfield',
                afterLabelTextTpl: INFOMESSAGEREQUERIDUNIQUE,
                allowBlank: false,
                allowOnlyWhitespace: false,
                blankText: INFOMESSAGEBLANKUNIQUETEXT,
                emptyText: 'Ingresar Acrónimo...',
                fieldLabel: 'Acrónimo',
                maxLength: 5,
                minLength: 3,
                minLengthText: INFOMESSAGEMINLENGTH,
                maxLengthText: INFOMESSAGEMAXLENGTH,
                name: 'acronymCompany',
                vtype: 'alphaupper'
            }, {
                xtype: 'textfield',
                afterLabelTextTpl: INFOMESSAGEREQUERIDUNIQUE,
                allowBlank: false,
                allowOnlyWhitespace: false,
                blankText: INFOMESSAGEBLANKUNIQUETEXT,
                emptyText: 'Ingresar Organización...',
                fieldLabel: 'Organización',
                maxLength: 45,
                minLength: 3,
                minLengthText: INFOMESSAGEMINLENGTH,
                maxLengthText: INFOMESSAGEMAXLENGTH,
                name: 'companyCompany',
                vtype: 'alphanumnospecialenepointdash'
            }, {
                xtype: 'textfield',
                emptyText: 'Ingresar Dirección...',
                fieldLabel: 'Dirección',
                maxLength: 150,
                minLength: 10,
                minLengthText: INFOMESSAGEMINLENGTH,
                maxLengthText: INFOMESSAGEMAXLENGTH,
                name: 'addressCompany',
                vtype: 'alphanumnospecialenepointdash'
            }, {
                xtype: 'textfield',
                emptyText: 'kradac@kradac.com',
                fieldLabel: 'Correo',
                maxLength: 45,
                maxLengthText: INFOMESSAGEMAXLENGTH,
                name: 'emailCompany',
                vtype: 'email'
            }, {
                xtype: 'textfield',
                emptyText: '0991540427 (10 dígitos)',
                fieldLabel: 'Celular',
                maxLength: 10,
                maxLengthText: INFOMESSAGEMAXLENGTH,
                name: 'cellCompany',
                vtype: 'telefonocelular'
            },
            {
                layout: 'column',
                baseCls: 'x-plain',
                itemId: 'placaCon',
                items: [{
                        columnWidth: .8,
                        baseCls: 'x-plain',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Color',
                                name: 'color',
                                itemId: 'idcolor',
                                tooltip: 'Seleccione Color',
                                allowBlank: false,
                                inputType: 'color',
                                anchor: '55%',
                                minLengthText: INFOMESSAGEMINLENGTH,
                                width: 200,
                                onChange: function (color) {
                                    Ext.getCmp('bt1').setStyle('background', color);
                                }
                            }
                        ]
                    },
                    {
                        baseCls: 'x-plain',
                        items: [
                            {xtype: 'button',
                                id: 'bt1',
                                style: {
                                    background: '#f70606',
                                    borderStyle: '#000000'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                collapsible: true,
                defaultType: 'textfield',
                anchor: '100%',
                items: [{
                        xtype: 'radiogroup',
                        columns: 2,
                        vertical: true,
                        padding: '0 0 10 50',
                        items: [
                            {boxLabel: 'No', name: 'ids', inputValue: 1, checked: true},
                            {boxLabel: 'Si', name: 'ids', inputValue: 2}
                        ],
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                switch (newValue['ids']) {
                                    case 1:
                                        Ext.getCmp('txt-user').disable();
                                        break;
                                    case 2:
                                        Ext.getCmp('txt-user').enable();
                                        break;
                                }
                            }
                        }
                    }, {
                        xtype: 'textfield',
                        allowBlank: false,
                        id: 'txt-user',
                        blankText: INFOMESSAGEBLANKTEXT,
                        displayField: 'text',
                        emptyText: 'Seleccionar Persona...',
                        fieldLabel: 'Persona',
                        forceSelection: true,
                        anchor: '100%',
                        listConfig: {
                            minWidth: 300
                        },
                        margin: '0 5 5 0',
                        name: 'idDistribuidor',
                        maxLength: 90,
                        queryMode: 'local',
                        store: storePersonaDistribuidor,
                        valueField: 'id',
                        width: 400
                    }
                ],
                title: '<b>Establecer Persona Distribuidor</b>',
                xtype: 'fieldset'
            }

        ],
        listeners: {
            create: function (form, data) {
                gridStore.insert(0, data);
            }
        }
    });
});

function showWinAdminCompanyAdmin() {
    if (!winAdminCompany) {
        winAdminCompany = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Organización Admin',
            iconCls: 'icon-central',
            resizable: false,
            width: 700,
            height: 410,
            closeAction: 'hide',
            plain: false,
            items: [{
                    layout: 'border',
                    bodyPadding: 5,
                    items: [
                        gridAdminCompany,
                        formAdminCompany
                    ]
                }]
        });
    }
    onResetCompany();
    winAdminCompany.show();
    Ext.getCmp('txt-user').disable();
}

function setActiveRecordCompany(selected) {
    formAdminCompany.down('#update').setDisabled(!selected.length);
    formAdminCompany.down('#create').setDisabled(selected.length);
    if (selected.length > 0) {
        formAdminCompany.getForm().loadRecord(selected[0]);
    }
}

function onUpdateCompany() {
    var form = formAdminCompany.getForm();
    if (form.isValid()) {
        storeEmpresas.reload();
        form.updateRecord(formAdminCompany.activeRecord);
        onResetCompany();
        Ext.getCmp('txt-user').disable();
    } else {
        messageInformationEffect(INFOMESSAGEREQUERIDALL);
    }
}

function onCreateCompany() {
    var form = formAdminCompany.getForm();
    if (form.isValid()) {
        formAdminCompany.fireEvent('create', formAdminCompany, form.getValues());
        form.reset();
        storeEmpresas.reload();
        Ext.getCmp('txt-user').disable();
    } else {
        messageInformationEffect(INFOMESSAGEREQUERIDALL);
    }
}

function onResetCompany() {
    formAdminCompany.getForm().reset();
    gridAdminCompany.getView().deselect(gridAdminCompany.getSelection());
    Ext.getCmp('txt-user').disable();
}
