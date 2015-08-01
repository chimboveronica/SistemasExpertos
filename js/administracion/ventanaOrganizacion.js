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
            {name: 'color', type: 'string'}
        ]
    });

    var gridStore = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'DataCompany',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/administracion/organizacion/read.php',
                create: 'php/administracion/organizacion/create.php',
                update: 'php/administracion/organizacion/update.php'
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
                if ((operation.getRequest().getInitialConfig(['action']) === 'create')||
                    (operation.getRequest().getInitialConfig(['action']) === 'update')) {
                    gridStore.reload();
                }
                storeEmpresas.reload();
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
        defaultType: 'textfield',
        layout: 'anchor',
        defaults: {
            anchor: '100%'
        },
        items: [
            {
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
                emptyText: 'Ingresar Dirección...',
                fieldLabel: 'Dirección',
                maxLength: 150,
                minLength: 10,
                minLengthText: INFOMESSAGEMINLENGTH,
                maxLengthText: INFOMESSAGEMAXLENGTH,
                name: 'addressCompany',
                vtype: 'alphanumnospecialenepointdash'
            }, {
                emptyText: 'kradac@kradac.com',
                fieldLabel: 'Correo',
                maxLength: 45,
                maxLengthText: INFOMESSAGEMAXLENGTH,
                name: 'emailCompany',
                vtype: 'email'
            }, {
                emptyText: '0991540427 (10 dígitos)',
                fieldLabel: 'Celular',
                maxLength: 10,
                maxLengthText: INFOMESSAGEMAXLENGTH,
                name: 'cellCompany',
                vtype: 'telefonocelular'
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Color',
                name: 'color',
                allowBlank: false,
                inputType: 'color',
                anchor: '55%'
            }
        ],
        listeners: {
            create: function (form, data) {
                gridStore.insert(0, data);
            }
        }
    });
});

function showWinAdminCompany() {
    if (!winAdminCompany) {
        winAdminCompany = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Organización',
            iconCls: 'icon-central',
            resizable: false,
            width: 625,
            height: 375,
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
    } else {
        messageInformationEffect(INFOMESSAGEREQUERIDALL);
    }
}

function onResetCompany() {
    formAdminCompany.getForm().reset();
    gridAdminCompany.getView().deselect(gridAdminCompany.getSelection());
}
