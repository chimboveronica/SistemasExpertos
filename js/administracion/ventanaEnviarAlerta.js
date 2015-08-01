var winSendAlert;
var formSendAlertas;

Ext.onReady(function () {
    var recordPerson = null;
    var storeEventAlertas = Ext.create('Ext.data.Store', {
        proxy: {
            type: 'ajax',
            url: 'php/administracion/enviarAlerta/getEvents.php',
            reader: {
                type: 'json',
                root: 'mails'
            }
        },
        fields: ['idEmpresa', 'parametro', 'event', 'state']
    });

    var storeVehicAlertas = Ext.create('Ext.data.JsonStore', {
        autoLoad: true,
        autoDestroy: true,
        proxy: {
            type: 'ajax',
            url: 'php/administracion/enviarAlerta/getVehiculo.php',
            reader: {
                type: 'json',
                root: 'veh'
            }
        },
        fields: ['id', 'text']
    });

    var storePersonasAlertas = Ext.create('Ext.data.Store', {
        autoDestroy: true,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/combobox/comboPersonas.php',
            reader: {
                type: 'json',
                root: 'personas'
            }
        },
        fields: ['id', 'text', 'empresa', 'mail']
    });
    var selected = false;
    var IdVehic;
    formSendAlertas = Ext.create('Ext.form.Panel', {
        layout: 'border',
        bodyPadding: 5,
        defaults: {
            padding: '0 5 0 0'
        },
        items: [
            {
                region: 'west',
                width: '30%',
                xtype: 'grid',
//                id: 'form-person-mail',
                title: '<center>Personas</center>',
                plugins: 'gridfilters',
                columns: [
                    {header: '<center><b>Persona</b><center>', flex: 2, dataIndex: 'text', filter: {type: 'string'}}
                ],
                store: storePersonasAlertas,
                listeners: {
                    select: function (thisObj, record, index, eOpts) {
                        selected = true;
                        recordPerson = record;
                        Ext.getCmp('button-save-alert').enable();
                        storeVehicAlertas.reload();
                        storeEventAlertas.removeAll();
                        storeVehicAlertas.load({
                            params: {
                                idPerson: record.data.id
                            }
                        });
                    }
                }
            }, {
                region: 'center',
                width: '35%',
                xtype: 'grid',
//                id: 'form-vehiculo-mail',
                title: '<center>Vehículos</center>',
                plugins: 'gridfilters',
                columns: [
                    {header: '<center><b>Vehículo</b><center>', flex: 2, dataIndex: 'text', filter: {type: 'string'}},
//                    {xtype: 'checkcolumn', header: "<b>Elegir</b>", width: 55, sortable: true, menuDisabled: true, dataIndex: 'state'}
                ],
                store: storeVehicAlertas,
                listeners: {
                    select: function (thisObj, record, index, eOpts) {
                        selected = true;
                        Ext.getCmp('button-save-alert').enable();
                        IdVehic=record.data.id;
                        storeEventAlertas.load({
                            params: {
                                idPerson: recordPerson.data.id,
                                idVehiculo: record.data.id
                            }
                        });
                    }
                }
            }, {
                region: 'east',
                width: '35%',
                xtype: 'grid',
//                id: 'form-event-mail',
                title: '<center>Alertas</center>',
                columns: [
                    {header: '<center><b>Evento</b><center>', width: 200, dataIndex: 'event'},
                    {xtype: 'checkcolumn', header: "<b>Correo</b>", sortable: true, width: 70, menuDisabled: true, dataIndex: 'state2'},
                    {xtype: 'checkcolumn', header: "<b>SMS</b>", sortable: true, width: 70, menuDisabled: true, dataIndex: 'state1'}
                ],
                store: storeEventAlertas,
                buttons: [{
                        text: 'Guardar',
                        id: 'button-save-alert',
                        iconCls: 'icon-save',
                        disabled: true,
                        handler: function () {
                            if (selected) {
                                var datosEventos = new Array();
                                var datosVehiculos = new Array();
                                var jsonDataEncodeEventosAlert = "";
                                var jsonDataEncodeVehiculosAlert = "";
                                if (storeEventAlertas.getModifiedRecords().length === 0) {
                                    for (var i = 0; i < storeEventAlertas.data.length; i++) {
                                        if (storeEventAlertas.getAt(i).data.state1 || storeEventAlertas.getAt(i).data.state2) {
                                            datosEventos.push(storeEventAlertas.getAt(i).data);
                                        }
                                    }
                                } else {
                                    var recordsEventos = storeEventAlertas.getModifiedRecords();
                                    for (var i = 0; i < recordsEventos.length; i++) {
                                        datosEventos.push(recordsEventos[i].data);
                                    }
                                }
                                jsonDataEncodeEventosAlert = Ext.JSON.encode(datosEventos);
                                var form = Ext.create('Ext.form.Panel');
                                form.submit({
                                    url: 'php/administracion/enviarAlerta/create.php',
                                    waitMsg: 'Guardando Envio de Mails...',
                                    params: {
                                        idPersona: recordPerson.data.id,
                                        idVeh: IdVehic,
                                        puntos2: jsonDataEncodeEventosAlert
                                    },
                                    success: function (form, action) {
                                        storeEventAlertas.commitChanges();
                                        storePersonasAlertas.reload();
                                        storeVehicAlertas.reload();
                                        storeEventAlertas.reload();
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
                    }]
            }]
    });
});

function ventanaEnvioAlerta() {
    if (!winSendAlert) {
        winSendAlert = Ext.create('Ext.window.Window', {
            title: 'Enviar alerta de eventos',
            iconCls: 'icon-alert',
            resizable: false,
            width: 1000,
            height: 400,
            closeAction: 'hide',
            layout: 'fit',
            items: formSendAlertas
        });
    }
    winSendAlert.show();
}