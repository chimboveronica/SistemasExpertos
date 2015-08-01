var winSendMail;
var formSendMail;

Ext.onReady(function () {
    var recordPerson = null;
    var storeEvents = Ext.create('Ext.data.Store', {
        proxy: {
            type: 'ajax',
            url: 'php/administracion/mail/getMails.php',
            reader: {
                type: 'json',
                root: 'mails'
            }
        },
        fields: ['idEmpresa', 'parametro', 'event', 'state']
    });

    formSendMail = Ext.create('Ext.form.Panel', {
        layout: 'border',
        bodyPadding: 5,
        defaults: {
            padding: '0 5 0 0'
        },
        tbar: [{
                xtype: 'label',
                padding: '0 0 0 5',
                html: '<b>Escoja la organización de la cual desea recibir los correos.</b>'
            }, '->', {
                xtype: 'combobox',
                padding: '5 5 5 0',
                labelWidth: 90,
                width: 285,
                fieldLabel: '<b>Organización</b>',
                name: 'cbxEmpresas',
                id: 'cbxEmpresas',
                store: storeEmpresas,
                valueField: 'id',
                displayField: 'text',
                queryMode: 'local',
                emptyText: 'Seleccionar Organización...',
                editable: false,
                allowBlank: false,
                listeners: {
                    select: function (combo, record, eOpts) {
                        Ext.getCmp('button-save-mail-emp').enable();
                        if (recordPerson !== null) {
                            storeEvents.load({
                                params: {
                                    idPerson: recordPerson.data.id,
                                    cbxEmpresas: record.getId()
                                }
                            });
                        }
                    }
                }
            }],
        items: [{
                region: 'west',
                width: '50%',
                xtype: 'grid',
                id: 'form-person-mail',
                title: '<center>Personas</center>',
                plugins: 'gridfilters',
                columns: [
                    {header: '<center><b>Persona</b><center>', flex: 2, dataIndex: 'text', filter: {type: 'string'}},
                    {header: '<b>Ingresada Por</b>', flex: 1, dataIndex: 'empresa',renderer: formatCompany, filter: {type: 'list', store: storeEmpresasList}, align: 'center'}
                ],
                store: storePersonas,
                listeners: {
                    select: function (thisObj, record, index, eOpts) {
                        recordPerson = record;
                        var val = Ext.getCmp('cbxEmpresas').getValue();
                        if (val > 0) {
                            storeEvents.load({
                                params: {
                                    idPerson: record.data.id,
                                    cbxEmpresas: winSendMail.down('[name=cbxEmpresas]').getValue()
                                }
                            });
                        } else {
                            Ext.example.msg('Mensaje', 'Seleccionar Organización.');

                        }

                    }
                }
            }, {
                region: 'center',
                xtype: 'grid',
                id: 'form-event-mail',
                title: '<center>Eventos</center>',
                columns: [
                    {header: '<center><b>Evento</b><center>', flex: 1, dataIndex: 'event'},
                    {xtype: 'checkcolumn', header: "<b>Correo</b>", sortable: true, width: 70, menuDisabled: true, dataIndex: 'state2'},
                    {xtype: 'checkcolumn', header: "<b>SMS</b>", sortable: true, width: 70, menuDisabled: true, dataIndex: 'state1'}
                ],
                store: storeEvents,
                buttons: [{
                        text: 'Guardar',
                        id: 'button-save-mail-emp',
                        iconCls: 'icon-save',
                        disabled: true,
                        handler: function () {
                            var comboEmpresa = winSendMail.down('[name=cbxEmpresas]');
                            if (comboEmpresa.isValid()) {
                                if (storeEvents.getModifiedRecords().length > 0) {
                                     var datosEventos = new Array();
                                     var jsonDataEncode = "";
                                    if (storeEvents.getModifiedRecords().length === 0) {
                                    for (var i = 0; i < storeEvents.data.length; i++) {
                                        if (storeEvents.getAt(i).data.state1 || storeEvents.getAt(i).data.state2) {
                                            datosEventos.push(storeEvents.getAt(i).data);
                                        }
                                    }
                                } else {
                                    var recordsEventos = storeEvents.getModifiedRecords();
                                    for (var i = 0; i < recordsEventos.length; i++) {
                                        datosEventos.push(recordsEventos[i].data);
                                    }
                                }
                                jsonDataEncode = Ext.JSON.encode(datosEventos);
//                                    var datos = new Array();
//                                    var jsonDataEncode = "";
//                                    var records = storeEvents.getModifiedRecords();
//                                    for (var i = 0; i < records.length; i++) {
//                                        datos.push(records[i].data);
//                                    }
//                                    jsonDataEncode = Ext.JSON.encode(datos);

                                    var form = Ext.create('Ext.form.Panel');
                                    form.submit({
                                        url: 'php/administracion/mail/setMails.php',
                                        waitMsg: 'Guardando Envio de Mails...',
                                        params: {
                                            puntos: jsonDataEncode,
                                            cbxEmpresas: comboEmpresa.getValue(),
                                            idPersona: recordPerson.data.id
                                        },
                                        success: function (form, action) {
                                            storeEvents.commitChanges();
                                            Ext.MessageBox.show({
                                                title: 'Exito...',
                                                msg: action.result.message,
                                                buttons: Ext.MessageBox.OK,
                                                icon: Ext.MessageBox.INFO
                                            });
                                        },
                                        failure: function (form, action) {
                                            Ext.MessageBox.show({
                                                title: 'Error...',
                                                msg: action.result.message,
                                                buttons: Ext.MessageBox.OK,
                                                icon: Ext.MessageBox.ERROR
                                            });
                                        }
                                    });
                                } else {
                                    Ext.MessageBox.show({
                                        title: 'Error...',
                                        msg: 'No ha Realizado Cambios...',
                                        buttons: Ext.MessageBox.OK,
                                        icon: Ext.MessageBox.ERROR
                                    });
                                }
                            }
                        }
                    }]
            }]
    });
});

function ventanaEnvioMail() {
    if (!winSendMail) {
        winSendMail = Ext.create('Ext.window.Window', {
            title: 'Envio correo de eventos',
            iconCls: 'icon-email',
            resizable: false,
            width: 800,
            height: 350,
            closeAction: 'hide',
            layout: 'fit',
            items: formSendMail
        });
    }
    winSendMail.show();
}