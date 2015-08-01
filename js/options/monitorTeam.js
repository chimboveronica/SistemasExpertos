
Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath('Ext.ux', 'extjs/examples/ux');
Ext.require([
    'Ext.ux.form.ItemSelector',
    'Ext.grid.filters.Filters',
    'Ext.ux.Spotlight'
]);

var refresh = false;
var timeRefresh = 60;
var cantidadMegas;
var tabla = '';
var tabla1 = '';
var mensajeTabla = '';
var cantidadPrecio;
var storeStateEqp;
var storeStateEqpUdp;
var idEquipo;
var idEquipo1;
var IdVehiculo;
var estadoVeh = '';
var estadoEqui = '';
var val = 1;
var mensajeVehi = '';
var mensajeEqui = '';
var fechaV = '';
var fechaE = '';
var usuarioV = '';
var usuarioE = '';
var gridStateEqpSKP;
var gridStateEqpSKPPasivos;
var gridStateEqpTrackers;

var storeDataInvalid;
var equipo;
var estado;
var fechaEstado;
var panelOeste;
var panelMapa;
var tabPanelReports;
var gridListaNegra;
var datosStore;
var panelCentral;

var bandera = false;
var winReporte;



Ext.onReady(function () {
    var latitud = '';
    var longitud = '';
    applicateVTypes();
    Ext.tip.QuickTipManager.init();
    var ActionVista = Ext.create('Ext.Action', {
        iconCls: 'icon-info', // Use a URL in the icon config
        text: 'Mostrar Información',
        id: 'info',
        disabled: false,
        handler: function (widget, event) {
            var rec = gridStateEqpSKP.getSelectionModel().getSelection()[0];
            if (rec) {
                winReporte.show();
            }
            var rec = gridStateEqpSKPPasivos.getSelectionModel().getSelection()[0];
            if (rec) {
                winReporte.show();
            }
            var rec = gridListaNegra.getSelectionModel().getSelection()[0];
            if (rec) {
                winReporte.show();
            }


        }
    });
    var ActionVista2 = Ext.create('Ext.Action', {
        iconCls: 'icon-vehiculos_lugar', // 
        text: 'Ver en Mapa',
        disabled: false,
        handler: function (widget, event) {
            tabPanelReports.setActiveTab(2);
            localizarDireccion(longitud, latitud, 17);
        }
    });
    var contextMenu = Ext.create('Ext.menu.Menu', {
        items: [
            ActionVista,
            ActionVista2
        ]
    });
    var contextMenu1 = Ext.create('Ext.menu.Menu', {
        items: [
            ActionVista2
        ]
    });
    var storeStateEqp = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/monitoring/getStateEqp.php',
            reader: {
                type: 'json',
                root: 'stateEqp'
            }

        },
        fields: [
            {name: 'activo', type: 'int'},
            {name: 'id_vehiculo', type: 'int'},
            {name: 'empresa', type: 'string'},
            {name: 'idEquipo', type: 'string'},
            {name: 'id_empresa', type: 'int'},
            {name: 'vehiculo', type: 'string'},
            {name: 'fhCon', type: 'date', dateFormat: 'c'},
            {name: 'fhDes', type: 'date', dateFormat: 'c'},
            {name: 'tmpcon', type: 'int'},
            {name: 'tmpdes', type: 'int'},
            {name: 'bateria', type: 'int'},
            {name: 'comentario', type: 'string'},
            {name: 'fechaEstado', type: 'date', dateFormat: 'c'},
            {name: 'gsm', type: 'int'},
            {name: 'gps2', type: 'int'},
            {name: 'vel', type: 'int'},
            {name: 'ign', type: 'int'},
            {name: 'panico', type: 'int'},
            {name: 'equipo', type: 'string'},
            {name: 'estadoE', type: 'string'},
            {name: 'estadoV', type: 'string'},
            {name: 'fecha_hora_estadoE', type: 'date', dateFormat: 'c'},
            {name: 'fecha_hora_estadoV', type: 'date', dateFormat: 'c'},
        ],
        listeners: {
            load: function (thisObj, records, successful, eOpts) {
                if (successful) {
                    Ext.getCmp('formDataEqEstado').setTitle(' ' + records.length + ' Estado de Equipos');
                }
            }
        }
    });

   
    
    gridStateEqpSKP = Ext.create('Ext.grid.Panel', {
        region: 'center',
        id: 'formDataEqEstado',
        title: '<b>Estado de Equipos</b>',
        store: storeStateEqp,
        iconCls: 'icon-list-equipos',
        columnLines: true,
        multiSelect: true,
        plugins: 'gridfilters',
        viewConfig: {
            emptyText: '<center>No hay datos que Mostrar</center>',
            loadMask: false,
            enableTextSelection: true,
            preserveScrollOnRefresh: true,
            listeners: {
                itemcontextmenu: function (view, rec, node, index, e) {
                    if (!winReporte) {
                        winReporte = Ext.create('Ext.window.Window', {
                            layout: 'fit',
                            title: 'Estado de Equipos',
                            iconCls: 'icon-all-flags',
                            resizable: false,
                            width: 350,
                            height: 417,
                            closeAction: 'hide',
                            plain: false,
                            items: [tab],
                            listeners: {
                                close: function (panel, eOpts) {
                                    Ext.getCmp('info').show();
                                },
                                activate: function (panel, eOpts) {
                                    Ext.getCmp('info').hide();
                                }
                            }
                        });
                    }
                    e.stopEvent();
                    contextMenu.showAt(e.getXY());
                    return false;
                }
            }
        },
        tools: [{
                type: 'refresh',
                tooltip: 'Refrescar Datos',
                handler: function (event, toolEl, panelHeader) {
                    storeStateEqp.reload();
                }
            }],
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: '<b>Nº</b>', width: 35, align: 'center'}),
            {text: '<b>Organización</b>', width: 120, dataIndex: 'id_empresa', renderer: formatComp, filter: {type: 'list', store: storeEmpresasMonitoreo}, align: 'center'},
            {text: '<b>Equipo</b>', width: 80, dataIndex: 'equipo', filter: {type: 'string'}, align: 'center'},
            {text: '<b>Vehículo</b>', width: 100, dataIndex: 'vehiculo', filter: {type: 'string'}, align: 'center'},
            {text: '<b>Fecha Conexión</b>', width: 150, align: 'center', xtype: 'datecolumn', format: 'Y-m-d H:i:s', dataIndex: 'fhCon', filter: {type: 'date'}, filterable: true},
            {text: '<b>Fecha Ult Trama</b>', width: 150, dataIndex: 'fhDes', align: 'center', xtype: 'datecolumn', format: 'Y-m-d H:i:s', filter: {type: 'date'}, filterable: true},
            {text: '<b>Tmp Conex.</b>', width: 110, dataIndex: 'tmpcon', align: 'center', filter: {type: 'numeric'}},
            {text: '<b>Estado</b>', width: 100, dataIndex: 'tmpdes', renderer: formatStateConect, align: 'center', filterable: true, filter: {type: 'list', store: storStado}},
            {text: '<b>Tmp Desc.</b>', width: 100, dataIndex: 'tmpdes', align: 'center', renderer: formatTmpDes, filter: {type: 'numeric'}},
            {text: '<b>Batería</b>', width: 140, dataIndex: 'bateria', align: 'center', renderer: formatBat, filter: {type: 'list', store: storBateria}},
            {text: '<b>GSM</b>', width: 105, dataIndex: 'gsm', align: 'center', renderer: estadoGsm, filter: {type: 'list', store: storGsm}},
            {text: '<b>GPS</b>', width: 105, dataIndex: 'gps2', align: 'center', renderer: estadoGps, filter: {type: 'list', store: storGPS}},
            {text: '<b>Vehículo(IGN)</b>', width: 130, dataIndex: 'ign', align: 'center', renderer: formatBatIgn, filter: {type: 'list', store: storIGN}},
            {text: '<b>Velocidad <br> (Km/h)</b>', dataIndex: 'vel', align: 'center', width: 100, renderer: formatSpeed, filter: {type: 'numeric'}},
            {text: '<b>Activo</b>', width: 100, dataIndex: 'activo', renderer: formatLock, align: 'center', filter: {type: 'list', store: storActivo}},
            {text: '<b>Comentario Vehículo</b>', width: 160, dataIndex: 'estadoV', align: 'center', filterable: true, filter: {type: 'string'}},
            {text: '<b>Comentario Equipo</b>', width: 160, dataIndex: 'estadoE', align: 'center', filterable: true, filter: {type: 'string'}},
            {text: '<b>Pánico</b>', width: 170, dataIndex: 'panico', renderer: formatPanic, align: 'center', filterable: true, filter: {type: 'list', store: storPanico}}
        ],
        listeners: {
            activate: function (este, eOpts) {
                panelOeste.show();
            },
            itemdblclick: function (thisObj, record, item, index, e, eOpts) {
                gridStateEqpSKP.tooltip.body.update("Click tDerecho para ver información");
                winReporte.hide();
            },
            itemclick: function (thisObj, record, item, index, e, eOpts) {
                tabla = "<div style=' margin:auto ;padding:1em '>"
                        + "<table>"
                        + "<tr><td>&nbsp</td><td><b>Empresa:" + '<td> </td>' + '<td>' + record.data.empresa + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Equipo:" + '<td> </td>' + '<td>' + record.data.equipo + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Vehículo:" + '<td> </td>' + '<td>' + record.data.vehiculo + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Fecha Conexión:" + '<td> </td>' + '<td>' + (Ext.Date.format(record.data.fhCon, 'Y-m-d')) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Fecha Ult.Trama:" + '<td> </td>' + '<td>' + (Ext.Date.format(record.data.fhDes, 'Y-m-d')) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Tiempo Conexión:" + '<td> </td>' + '<td>' + record.data.tmpcon + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Estado:" + '<td> </td>' + '<td>' + formatStateConect(record.data.tmpdes) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Tiempo Desconectado:" + '<td> </td>' + '<td>' + formatTmpDes(record.data.tmpdes) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Batería:" + '<td> </td>' + '<td>' + formatBatIgnGsmGps2(record.data.bateria) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>GSM:" + '<td> </td>' + '<td>' + formatBatIgnGsmGps2(record.data.gsm) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>GPS:" + '<td> </td>' + '<td>' + formatBatIgnGsmGps2(record.data.gps2) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>IGN:" + '<td> </td>' + '<td>' + formatBatIgnGsmGps2(record.data.ign) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Velocidad:" + '<td> </td>' + '<td>' + record.data.vel + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Activo:" + '<td> </td>' + '<td>' + formatLock(record.data.activo) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Comentario Vehículo:" + '<td> </td>' + '<td>' + record.data.estadoE + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Comentario Equipo:" + '<td> </td>' + '<td>' + record.data.estadoV + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Pánico:" + '<td> </td>' + '<td>' + formatPanic(record.data.panico) + "</td></tr>"
                        + "</table>"
                        + "<br/>"
                        + "</div>";
                panelOeste.down('#bloquear').enable();
                panelOeste.down('#desbloquear').disable();
                panelOeste.down('#poner').enable();
                panelOeste.down('#quitar').disable();
                Ext.getCmp('contenedoresg').update(tabla);
                labelFecha.setText('');
                labelUsuario.setText('');
                mensajeVehi = 'Vehículo: ' + record.data.vehiculo;
                mensajeEqui = 'Equipo: ' + record.data.equipo;
                estadoEqui = record.data.estadoE;
                latitud = record.data.latitud;
                longitud = record.data.longitud;
                if (estadoEqui == "") {
                    usuarioE = 'Modificado por: ' + '? ? ? ?';
                    fechaE = 'Fecha de Modificación: ' + '? ? ? ?';
                } else {
                    usuarioE = 'Modificado por: ' + record.data.usuarioE;
                    fechaE = 'Fecha de Modificación: ' + Ext.Date.format(record.data.fecha_hora_estadoE, 'Y-m-d');
                }
                estadoVeh = record.data.estadoV;
                if (estadoVeh == "") {
                    usuarioV = 'Modificado por: ' + '? ? ? ?';
                    fechaV = 'Fecha de Modificación: ' + '? ? ? ?';
                } else {
                    usuarioV = 'Modificado por: ' + record.data.usuarioV;
                    fechaV = 'Fecha de Modificación: ' + Ext.Date.format(record.data.fecha_hora_estadoV, 'Y-m-d');
                }
                idEquipo = record.data.idEquipo;
                idEquipo1 = record.data.idEquipo;
                IdVehiculo = record.data.id_vehiculo;
                labelRegistro.setText(mensajeVehi);
                labelEquipo.setText(mensajeEqui);
                panelOeste.down('#b1').enable();
                panelOeste.down('#b2').enable();
                if (val === 1) {
                    panelOeste.down('[name=stadoEqp]').setValue(estadoVeh);
                    labelFecha.setText(fechaV);
                    labelUsuario.setText(usuarioV);
                    idEquipo = IdVehiculo;
                } else {
                    panelOeste.down('[name=stadoEqp]').setValue(estadoEqui);
                    labelFecha.setText(fechaE);
                    labelUsuario.setText(usuarioE);
                }
            }
        }
    });
    ///////////////////////// Nuevo equipo TRACHERS
    
    var storeStateEqpTrackers = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/monitoring/getstateTrackers.php',
            reader: {
                type: 'json',
                root: 'stateEqp'
            }

        },
        fields: [
            {name: 'activo', type: 'int'},
            {name: 'id_vehiculo', type: 'int'},
            {name: 'empresa', type: 'string'},
            {name: 'idEquipo', type: 'string'},
            {name: 'id_empresa', type: 'int'},
            {name: 'vehiculo', type: 'string'},
            {name: 'fhCon', type: 'date', dateFormat: 'c'},
            {name: 'fhDes', type: 'date', dateFormat: 'c'},
            {name: 'tmpcon', type: 'int'},
            {name: 'tmpdes', type: 'int'},
            {name: 'bateria', type: 'int'},
            {name: 'comentario', type: 'string'},
            {name: 'fechaEstado', type: 'date', dateFormat: 'c'},
            {name: 'gsm', type: 'int'},
            {name: 'gps2', type: 'int'},
            {name: 'vel', type: 'int'},
            {name: 'ign', type: 'int'},
            {name: 'panico', type: 'int'},
            {name: 'equipo', type: 'string'},
            {name: 'estadoE', type: 'string'},
            {name: 'estadoV', type: 'string'},
            {name: 'fecha_hora_estadoE', type: 'date', dateFormat: 'c'},
            {name: 'fecha_hora_estadoV', type: 'date', dateFormat: 'c'},
        ],
        listeners: {
            load: function (thisObj, records, successful, eOpts) {
                if (successful) {
                    Ext.getCmp('formDataEqEstadtrckers').setTitle(' ' + records.length + ' Equipos Trackers');
                }
            }
        }
    });
     gridStateEqpTrackers = Ext.create('Ext.grid.Panel', {
        region: 'center',
        id: 'formDataEqEstadtrckers',
        title: '<b>Equipos Trackers</b>',
        store: storeStateEqpTrackers,
        iconCls: 'icon-estado-veh',
        columnLines: true,
        multiSelect: true,
        plugins: 'gridfilters',
        viewConfig: {
            emptyText: '<center>No hay datos que Mostrar</center>',
            loadMask: false,
            enableTextSelection: true,
            preserveScrollOnRefresh: true,
            listeners: {
                itemcontextmenu: function (view, rec, node, index, e) {
                    if (!winReporte) {
                        winReporte = Ext.create('Ext.window.Window', {
                            layout: 'fit',
                            title: 'Estado de Equipos',
                            iconCls: 'icon-all-flags',
                            resizable: false,
                            width: 350,
                            height: 417,
                            closeAction: 'hide',
                            plain: false,
                            items: [tab],
                            listeners: {
                                close: function (panel, eOpts) {
                                    Ext.getCmp('info').show();
                                },
                                activate: function (panel, eOpts) {
                                    Ext.getCmp('info').hide();
                                }
                            }
                        });
                    }
                    e.stopEvent();
                    contextMenu.showAt(e.getXY());
                    return false;
                }
            }
        },
        tools: [{
                type: 'refresh',
                tooltip: 'Refrescar Datos',
                handler: function (event, toolEl, panelHeader) {
                    storeStateEqp.reload();
                }
            }],
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: '<b>Nº</b>', width: 35, align: 'center'}),
            {text: '<b>Organización</b>', width: 120, dataIndex: 'id_empresa', renderer: formatComp, filter: {type: 'list', store: storeEmpresasMonitoreo}, align: 'center'},
            {text: '<b>Equipo</b>', width: 80, dataIndex: 'equipo', filter: {type: 'string'}, align: 'center'},
            {text: '<b>Vehículo</b>', width: 100, dataIndex: 'vehiculo', filter: {type: 'string'}, align: 'center'},
            {text: '<b>Fecha Conexión</b>', width: 150, align: 'center', xtype: 'datecolumn', format: 'Y-m-d H:i:s', dataIndex: 'fhCon', filter: {type: 'date'}, filterable: true},
            {text: '<b>Fecha Ult Trama</b>', width: 150, dataIndex: 'fhDes', align: 'center', xtype: 'datecolumn', format: 'Y-m-d H:i:s', filter: {type: 'date'}, filterable: true},
            {text: '<b>Tmp Conex.</b>', width: 110, dataIndex: 'tmpcon', align: 'center', filter: {type: 'numeric'}},
            {text: '<b>Estado</b>', width: 100, dataIndex: 'tmpdes', renderer: formatStateConect, align: 'center', filterable: true, filter: {type: 'list', store: storStado}},
            {text: '<b>Tmp Desc.</b>', width: 100, dataIndex: 'tmpdes', align: 'center', renderer: formatTmpDes, filter: {type: 'numeric'}},
            {text: '<b>Batería</b>', width: 140, dataIndex: 'bateria', align: 'center', renderer: formatBat, filter: {type: 'list', store: storBateria}},
            {text: '<b>GSM</b>', width: 105, dataIndex: 'gsm', align: 'center', renderer: estadoGsm, filter: {type: 'list', store: storGsm}},
            {text: '<b>GPS</b>', width: 105, dataIndex: 'gps2', align: 'center', renderer: estadoGps, filter: {type: 'list', store: storGPS}},
            {text: '<b>Vehículo(IGN)</b>', width: 130, dataIndex: 'ign', align: 'center', renderer: formatBatIgn, filter: {type: 'list', store: storIGN}},
            {text: '<b>Velocidad <br> (Km/h)</b>', dataIndex: 'vel', align: 'center', width: 100, renderer: formatSpeed, filter: {type: 'numeric'}},
            {text: '<b>Activo</b>', width: 100, dataIndex: 'activo', renderer: formatLock, align: 'center', filter: {type: 'list', store: storActivo}},
            {text: '<b>Comentario Vehículo</b>', width: 160, dataIndex: 'estadoV', align: 'center', filterable: true, filter: {type: 'string'}},
            {text: '<b>Comentario Equipo</b>', width: 160, dataIndex: 'estadoE', align: 'center', filterable: true, filter: {type: 'string'}},
            {text: '<b>Pánico</b>', width: 170, dataIndex: 'panico', renderer: formatPanic, align: 'center', filterable: true, filter: {type: 'list', store: storPanico}}
        ],
        listeners: {
            activate: function (este, eOpts) {
                panelOeste.show();
            },
            itemdblclick: function (thisObj, record, item, index, e, eOpts) {
                gridStateEqpSKP.tooltip.body.update("Click tDerecho para ver información");
                winReporte.hide();
            },
            itemclick: function (thisObj, record, item, index, e, eOpts) {
                tabla = "<div style=' margin:auto ;padding:1em '>"
                        + "<table>"
                        + "<tr><td>&nbsp</td><td><b>Empresa:" + '<td> </td>' + '<td>' + record.data.empresa + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Equipo:" + '<td> </td>' + '<td>' + record.data.equipo + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Vehículo:" + '<td> </td>' + '<td>' + record.data.vehiculo + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Fecha Conexión:" + '<td> </td>' + '<td>' + (Ext.Date.format(record.data.fhCon, 'Y-m-d')) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Fecha Ult.Trama:" + '<td> </td>' + '<td>' + (Ext.Date.format(record.data.fhDes, 'Y-m-d')) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Tiempo Conexión:" + '<td> </td>' + '<td>' + record.data.tmpcon + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Estado:" + '<td> </td>' + '<td>' + formatStateConect(record.data.tmpdes) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Tiempo Desconectado:" + '<td> </td>' + '<td>' + formatTmpDes(record.data.tmpdes) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Batería:" + '<td> </td>' + '<td>' + formatBatIgnGsmGps2(record.data.bateria) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>GSM:" + '<td> </td>' + '<td>' + formatBatIgnGsmGps2(record.data.gsm) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>GPS:" + '<td> </td>' + '<td>' + formatBatIgnGsmGps2(record.data.gps2) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>IGN:" + '<td> </td>' + '<td>' + formatBatIgnGsmGps2(record.data.ign) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Velocidad:" + '<td> </td>' + '<td>' + record.data.vel + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Activo:" + '<td> </td>' + '<td>' + formatLock(record.data.activo) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Comentario Vehículo:" + '<td> </td>' + '<td>' + record.data.estadoE + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Comentario Equipo:" + '<td> </td>' + '<td>' + record.data.estadoV + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Pánico:" + '<td> </td>' + '<td>' + formatPanic(record.data.panico) + "</td></tr>"
                        + "</table>"
                        + "<br/>"
                        + "</div>";
                panelOeste.down('#bloquear').enable();
                panelOeste.down('#desbloquear').disable();
                panelOeste.down('#poner').enable();
                panelOeste.down('#quitar').disable();
                Ext.getCmp('contenedoresg').update(tabla);
                labelFecha.setText('');
                labelUsuario.setText('');
                mensajeVehi = 'Vehículo: ' + record.data.vehiculo;
                mensajeEqui = 'Equipo: ' + record.data.equipo;
                estadoEqui = record.data.estadoE;
                latitud = record.data.latitud;
                longitud = record.data.longitud;
                if (estadoEqui == "") {
                    usuarioE = 'Modificado por: ' + '? ? ? ?';
                    fechaE = 'Fecha de Modificación: ' + '? ? ? ?';
                } else {
                    usuarioE = 'Modificado por: ' + record.data.usuarioE;
                    fechaE = 'Fecha de Modificación: ' + Ext.Date.format(record.data.fecha_hora_estadoE, 'Y-m-d');
                }
                estadoVeh = record.data.estadoV;
                if (estadoVeh == "") {
                    usuarioV = 'Modificado por: ' + '? ? ? ?';
                    fechaV = 'Fecha de Modificación: ' + '? ? ? ?';
                } else {
                    usuarioV = 'Modificado por: ' + record.data.usuarioV;
                    fechaV = 'Fecha de Modificación: ' + Ext.Date.format(record.data.fecha_hora_estadoV, 'Y-m-d');
                }
                idEquipo = record.data.idEquipo;
                idEquipo1 = record.data.idEquipo;
                IdVehiculo = record.data.id_vehiculo;
                labelRegistro.setText(mensajeVehi);
                labelEquipo.setText(mensajeEqui);
                panelOeste.down('#b1').enable();
                panelOeste.down('#b2').enable();
                if (val === 1) {
                    panelOeste.down('[name=stadoEqp]').setValue(estadoVeh);
                    labelFecha.setText(fechaV);
                    labelUsuario.setText(usuarioV);
                    idEquipo = IdVehiculo;
                } else {
                    panelOeste.down('[name=stadoEqp]').setValue(estadoEqui);
                    labelFecha.setText(fechaE);
                    labelUsuario.setText(usuarioE);
                }
            }
        }
    });
    
    
    
    var storeStateEqpPasivos = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/monitoring/getStateEqpPasivos.php',
            reader: {
                type: 'json',
                root: 'stateEqpPasivos'
            }
        },
        fields: [
            {name: 'activo', type: 'int'},
            {name: 'id_vehiculo', type: 'int'},
            {name: 'empresa', type: 'string'},
            {name: 'idEquipo', type: 'string'},
            {name: 'vehiculo', type: 'string'},
            {name: 'fhCon', type: 'date', dateFormat: 'c'},
            {name: 'fhDes', type: 'date', dateFormat: 'c'},
            {name: 'tmpcon', type: 'int'},
            {name: 'tmpdes', type: 'int'},
            {name: 'bateria', type: 'int'},
            {name: 'comentario', type: 'string'},
            {name: 'fechaEstado', type: 'date', dateFormat: 'c'},
            {name: 'gsm', type: 'int'},
            {name: 'gps2', type: 'int'},
            {name: 'vel', type: 'int'},
            {name: 'ign', type: 'int'},
            {name: 'panico', type: 'int'},
            {name: 'equipo', type: 'string'},
            {name: 'estadoE', type: 'string'},
            {name: 'estadoV', type: 'string'},
            {name: 'fecha_hora_estadoE', type: 'date', dateFormat: 'c'},
            {name: 'fecha_hora_estadoV', type: 'date', dateFormat: 'c'},
        ],
        listeners: {
            load: function (thisObj, records, successful, eOpts) {
                if (successful) {
                    Ext.getCmp('formDataEqPasivos').setTitle(' ' + records.length + ' Equipos Pasivos');
                }
            }
        }
    });

    gridStateEqpSKPPasivos = Ext.create('Ext.grid.Panel', {
        region: 'center',
        title: '<b>Equipos Pasivos</b>',
        id: 'formDataEqPasivos',
        store: storeStateEqpPasivos,
        iconCls: 'icon-reten',
        name: 'monitoreopasivos',
        columnLines: true,
        multiSelect: true,
        plugins: 'gridfilters',
        viewConfig: {
            emptyText: '<center>No hay datos que Mostrar</center>',
            loadMask: false,
            enableTextSelection: true,
            preserveScrollOnRefresh: true,
            listeners: {
                itemcontextmenu: function (view, rec, node, index, e) {
                    if (!winReporte) {
                        winReporte = Ext.create('Ext.window.Window', {
                            layout: 'fit',
                            title: 'Estado de Equipos',
                            iconCls: 'icon-all-flags',
                            resizable: false,
                            width: 350,
                            height: 417,
                            closeAction: 'hide',
                            plain: false,
                            items: [tab],
                            listeners: {
                                close: function (panel, eOpts) {
                                    Ext.getCmp('info').show();

                                },
                                activate: function (panel, eOpts) {

                                    Ext.getCmp('info').hide();

                                }
                            }
                        });
                    }
                    e.stopEvent();
                    contextMenu.showAt(e.getXY());
                    return false;
                }
            }
        },
        tools: [{
                type: 'refresh',
                tooltip: 'Refrescar Datos',
                handler: function (event, toolEl, panelHeader) {
                    storeStateEqpPasivos.reload();
                }
            }],
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: '<b>Nº</b>', width: 35, align: 'center'}),
            {text: '<b>Organización</b>', width: 120, dataIndex: 'empresa', renderer: formatCompany, filter: {type: 'list', store: storeEmpresasMonitoreo}, align: 'center'},
            {text: '<b>Equipo</b>', width: 80, dataIndex: 'equipo', filter: {type: 'string'}, align: 'center'},
            {text: '<b>Vehículo</b>', width: 100, dataIndex: 'vehiculo', filter: {type: 'string'}, align: 'center'},
            {text: '<b>Fecha Conexión</b>', width: 150, align: 'center', xtype: 'datecolumn', format: 'Y-m-d H:i:s', dataIndex: 'fhCon', filter: {type: 'date'}, filterable: true},
            {text: '<b>Fecha Ult Trama</b>', width: 150, dataIndex: 'fhDes', align: 'center', xtype: 'datecolumn', format: 'Y-m-d H:i:s', filter: {type: 'date'}, filterable: true},
            {text: '<b>Tmp Conex.</b>', width: 110, dataIndex: 'tmpcon', align: 'center', filter: {type: 'numeric'}},
            {text: '<b>Estado</b>', width: 100, dataIndex: 'tmpdes', renderer: formatStateConect, align: 'center', filterable: true, filter: {type: 'list', store: storStado}},
            {text: '<b>Tmp Desc.</b>', width: 100, dataIndex: 'tmpdes', align: 'center', renderer: formatTmpDes, filter: {type: 'numeric'}},
            {text: '<b>Batería</b>', width: 140, dataIndex: 'bateria', align: 'center', renderer: formatBat, filter: {type: 'list', store: storBateria}},
            {text: '<b>GSM</b>', width: 105, dataIndex: 'gsm', align: 'center', renderer: estadoGsm, filter: {type: 'list', store: storGsm}},
            {text: '<b>GPS</b>', width: 105, dataIndex: 'gps2', align: 'center', renderer: estadoGps, filter: {type: 'list', store: storGPS}},
            {text: '<b>Vehículo(IGN)</b>', width: 130, dataIndex: 'ign', align: 'center', renderer: formatBatIgn, filter: {type: 'list', store: storIGN}},
            {text: '<b>Velocidad <br> (Km/h)</b>', dataIndex: 'vel', align: 'center', width: 100, renderer: formatSpeed, filter: {type: 'numeric'}},
            {text: '<b>Activo</b>', width: 100, dataIndex: 'activo', renderer: formatLock, align: 'center', filter: {type: 'list', store: storActivo}},
            {text: '<b>Comentario Vehículo</b>', width: 160, dataIndex: 'estadoV', align: 'center', filterable: true, filter: {type: 'string'}},
            {text: '<b>Comentario Equipo</b>', width: 160, dataIndex: 'estadoE', align: 'center', filterable: true, filter: {type: 'string'}},
            {text: '<b>Pánico</b>', width: 170, dataIndex: 'panico', renderer: formatPanic, align: 'center', filterable: true, filter: {type: 'list', store: storPanico}}
        ],
        listeners: {
            selectionchange: function (sm, selections) {
                if (selections.length) {
                    ActionVista.enable();
                } else {
                    ActionVista.disable();
                }
            },
            activate: function (este, eOpts) {
                panelOeste.show();
            },
            itemdblclick: function (thisObj, record, item, index, e, eOpts) {
                gridStateEqpSKPPasivos.tooltip.body.update("Click tDerecho para ver información");
                winReporte.hide();
            },
            itemclick: function (thisObj, record, item, index, e, eOpts) {
                tabla = "<div style=' margin:auto ;padding:1em '>"
                        + "<table>"
                        + "<tr><td>&nbsp</td><td><b>Empresa:" + '<td> </td>' + '<td>' + record.data.equipo + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Equipo:" + '<td> </td>' + '<td>' + record.data.equipo + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Vehículo:" + '<td> </td>' + '<td>' + record.data.vehiculo + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Fecha Conexión:" + '<td> </td>' + '<td>' + (Ext.Date.format(record.data.fhCon, 'Y-m-d')) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Fecha Ult.Trama:" + '<td> </td>' + '<td>' + (Ext.Date.format(record.data.fhDes, 'Y-m-d')) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Tiempo Conexión:" + '<td> </td>' + '<td>' + record.data.tmpcon + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Estado:" + '<td> </td>' + '<td>' + formatStateConect(record.data.tmpdes) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Tiempo Desconectado:" + '<td> </td>' + '<td>' + formatTmpDes(record.data.tmpdes) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Batería:" + '<td> </td>' + '<td>' + formatBatIgnGsmGps2(record.data.bateria) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>GSM:" + '<td> </td>' + '<td>' + formatBatIgnGsmGps2(record.data.gsm) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>GPS:" + '<td> </td>' + '<td>' + formatBatIgnGsmGps2(record.data.gps2) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>IGN:" + '<td> </td>' + '<td>' + formatBatIgnGsmGps2(record.data.ign) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Velocidad:" + '<td> </td>' + '<td>' + record.data.vel + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Activo:" + '<td> </td>' + '<td>' + formatLock(record.data.activo) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Comentario Vehículo:" + '<td> </td>' + '<td>' + record.data.estadoV + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Comentario Equipo:" + '<td> </td>' + '<td>' + record.data.estadoE + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Pánico:" + '<td> </td>' + '<td>' + formatPanic(record.data.panico) + "</td></tr>"
                        + "</table>"
                        + "<br/>"
                        + "</div>";
                panelOeste.down('#bloquear').disable();
                panelOeste.down('#desbloquear').enable();
                panelOeste.down('#poner').disable();
                panelOeste.down('#quitar').disable();
                Ext.getCmp('contenedoresg').update(tabla);
                labelFecha.setText('');
                labelUsuario.setText('');
                latitud = record.data.latitud;
                longitud = record.data.longitud;
                mensajeVehi = 'Vehículo: ' + record.data.vehiculo;
                mensajeEqui = 'Equipo: ' + record.data.equipo;
                estadoEqui = record.data.estadoE;
                estadoVeh = record.data.estadoV;
                idEquipo = record.data.idEquipo;
                idEquipo1 = record.data.idEquipo;
                IdVehiculo = record.data.id_vehiculo;
                usuarioE = 'Modificado por: ' + record.data.usuarioE;
                usuarioV = 'Modificado por: ' + record.data.usuarioV;
                labelRegistro.setText(mensajeVehi);
                labelEquipo.setText(mensajeEqui);
                fechaE = 'Fecha de Modificación: ' + record.data.fecha_hora_estadoE;
                fechaV = 'Fecha de Modificación: ' + record.data.fecha_hora_estadoV;
                panelOeste.down('#b1').enable();
                panelOeste.down('#b2').enable();
                if (val === 1) {
                    panelOeste.down('[name=stadoEqp]').setValue(estadoVeh);
                    labelFecha.setText(fechaV);
                    labelUsuario.setText(usuarioV);
                    idEquipo = IdVehiculo;

                } else {
                    panelOeste.down('[name=stadoEqp]').setValue(estadoEqui);
                    labelFecha.setText(fechaE);
                    labelUsuario.setText(usuarioE);
                }
            }
        }
    });

    var storeListaNegra = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/monitoring/getListaNegra.php',
            reader: {
                type: 'json',
                root: 'stateEqp'
            }
        },
        fields: [
            {name: 'activo', type: 'int'},
            {name: 'id_vehiculo', type: 'int'},
            {name: 'empresa', type: 'string'},
            {name: 'idEquipo', type: 'string'},
            {name: 'vehiculo', type: 'string'},
            {name: 'fhCon', type: 'date', dateFormat: 'c'},
            {name: 'fhDes', type: 'date', dateFormat: 'c'},
            {name: 'tmpcon', type: 'int'},
            {name: 'tmpdes', type: 'int'},
            {name: 'bateria', type: 'int'},
            {name: 'comentario', type: 'string'},
            {name: 'fechaEstado', type: 'date', dateFormat: 'c'},
            {name: 'gsm', type: 'int'},
            {name: 'gps2', type: 'int'},
            {name: 'vel', type: 'int'},
            {name: 'ign', type: 'int'},
            {name: 'panico', type: 'int'},
            {name: 'equipo', type: 'string'},
            {name: 'estadoE', type: 'string'},
            {name: 'estadoV', type: 'string'},
            {name: 'fecha_hora_estadoE', type: 'date', dateFormat: 'c'},
            {name: 'fecha_hora_estadoV', type: 'date', dateFormat: 'c'},
        ],
        listeners: {
            load: function (thisObj, records, successful, eOpts) {
                if (successful) {
                    Ext.getCmp('formDataListNegra').setTitle('' + records.length + ' Equipos en Lista Negra');
                }
            }
        }
    });

    gridListaNegra = Ext.create('Ext.grid.Panel', {
        region: 'center',
        id: 'formDataListNegra',
        title: '<b>Equipos en Lista Negra</b>',
        store: storeListaNegra,
        iconCls: 'icon-list-black',
        columnLines: true,
        activeItem: 0,
        multiSelect: true,
        plugins: 'gridfilters',
        viewConfig: {
            emptyText: '<center>No hay datos que Mostrar</center>',
            loadMask: false,
            enableTextSelection: true,
            preserveScrollOnRefresh: true,
            listeners: {
                itemcontextmenu: function (view, rec, node, index, e) {
                    if (!winReporte) {
                        winReporte = Ext.create('Ext.window.Window', {
                            layout: 'fit',
                            title: 'Estado de Equipos',
                            iconCls: 'icon-all-flags',
                            resizable: false,
                            width: 350,
                            height: 417,
                            closeAction: 'hide',
                            plain: false,
                            items: [tab],
                            listeners: {
                                close: function (panel, eOpts) {
                                    Ext.getCmp('info').show();

                                },
                                activate: function (panel, eOpts) {

                                    Ext.getCmp('info').hide();

                                }
                            }
                        });
                    }
                    e.stopEvent();
                    contextMenu.showAt(e.getXY());
                    return false;
                }
            }
        },
        tools: [{
                type: 'refresh',
                tooltip: 'Refrescar Datos',
                handler: function (event, toolEl, panelHeader) {
                    storeListaNegra.reload();
                }
            }],
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: '<b>Nº</b>', width: 35, align: 'center'}),
            {text: '<b>Organización</b>', width: 120, dataIndex: 'empresa', renderer: formatCompany, filter: {type: 'list', store: storeEmpresasMonitoreo}, align: 'center'},
            {text: '<b>Equipo</b>', width: 80, dataIndex: 'equipo', filter: {type: 'string'}, align: 'center'},
            {text: '<b>Vehículo</b>', width: 100, dataIndex: 'vehiculo', filter: {type: 'string'}, align: 'center'},
            {text: '<b>Fecha Conexión</b>', width: 150, align: 'center', xtype: 'datecolumn', format: 'Y-m-d H:i:s', dataIndex: 'fhCon', filter: {type: 'date'}, filterable: true},
            {text: '<b>Fecha Ult Trama</b>', width: 150, dataIndex: 'fhDes', xtype: 'datecolumn', align: 'center', format: 'Y-m-d H:i:s', filter: {type: 'date'}, filterable: true},
            {text: '<b>Tmp Conex.</b>', width: 110, dataIndex: 'tmpcon', align: 'center', filter: {type: 'numeric'}},
            {text: '<b>Estado</b>', width: 100, dataIndex: 'tmpdes', renderer: formatStateConect, align: 'center', filterable: true, filter: {type: 'list', store: storStado}},
            {text: '<b>Tmp Desc.</b>', width: 100, dataIndex: 'tmpdes', align: 'center', renderer: formatTmpDes, filter: {type: 'numeric'}},
            {text: '<b>Batería</b>', width: 140, dataIndex: 'bateria', align: 'center', renderer: formatBat, filter: {type: 'list', store: storBateria}},
            {text: '<b>GSM</b>', width: 105, dataIndex: 'gsm', align: 'center', renderer: estadoGsm, filter: {type: 'list', store: storGsm}},
            {text: '<b>GPS</b>', width: 105, dataIndex: 'gps2', align: 'center', renderer: estadoGps, filter: {type: 'list', store: storGPS}},
            {text: 'Vehículo(IGN)', width: 130, dataIndex: 'ign', align: 'center', renderer: formatBatIgn, filter: {type: 'list', store: storIGN}},
            {text: '<b>Velocidad <br> (Km/h)</b>', dataIndex: 'vel', align: 'center', width: 100, renderer: formatSpeed, filter: {type: 'numeric'}},
            {text: '<b>Activo</b>', width: 100, dataIndex: 'activo', renderer: formatLock, align: 'center', filter: {type: 'list', store: storActivo}},
            {text: '<b>Comentario Vehículo</b>', width: 160, dataIndex: 'estadoV', align: 'center', filterable: true, filter: {type: 'string'}},
            {text: '<b>Comentario Equipo</b>', width: 160, dataIndex: 'estadoE', align: 'center', filterable: true, filter: {type: 'string'}},
            {text: '<b>Pánico</b>', width: 170, dataIndex: 'panico', renderer: formatPanic, align: 'center', filterable: true, filter: {type: 'list', store: storPanico}}
        ],
        listeners: {
            selectionchange: function (sm, selections) {
                if (selections.length) {
                    ActionVista.enable();
                } else {
                    ActionVista.disable();
                }
            },
            activate: function (este, eOpts) {
                panelOeste.show();
            },
            itemdblclick: function (thisObj, record, item, index, e, eOpts) {
                gridStateEqpSKP.tooltip.body.update("Click Derecho para ver información");
                winReporte.hide();
            },
            itemclick: function (thisObj, record, item, index, e, eOpts) {
                tabla = "<div style=' margin:auto ;padding:1em '>"
                        + "<table>"
//                        + "<tr><td>&nbsp</td><td><b>Empresa:" + '<td> </td>' + '<td>' + record.data.equipo + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Equipo:" + '<td> </td>' + '<td>' + record.data.equipo + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Vehículo:" + '<td> </td>' + '<td>' + record.data.vehiculo + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Fecha Conexión:" + '<td> </td>' + '<td>' + (Ext.Date.format(record.data.fhCon, 'Y-m-d')) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Fecha Ult.Trama:" + '<td> </td>' + '<td>' + (Ext.Date.format(record.data.fhDes, 'Y-m-d')) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Tiempo Conexión:" + '<td> </td>' + '<td>' + record.data.tmpcon + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Estado:" + '<td> </td>' + '<td>' + formatStateConect(record.data.tmpdes) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Tiempo Desconectado:" + '<td> </td>' + '<td>' + formatTmpDes(record.data.tmpdes) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Batería:" + '<td> </td>' + '<td>' + formatBatIgnGsmGps2(record.data.bateria) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>GSM:" + '<td> </td>' + '<td>' + formatBatIgnGsmGps2(record.data.gsm) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>GPS:" + '<td> </td>' + '<td>' + formatBatIgnGsmGps2(record.data.gps2) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>IGN:" + '<td> </td>' + '<td>' + formatBatIgnGsmGps2(record.data.ign) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Velocidad:" + '<td> </td>' + '<td>' + record.data.vel + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Activo:" + '<td> </td>' + '<td>' + formatLock(record.data.activo) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Comentario Vehículo:" + '<td> </td>' + '<td>' + record.data.estadoV + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Comentario Equipo:" + '<td> </td>' + '<td>' + record.data.estadoE + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Pánico:" + '<td> </td>' + '<td>' + formatPanic(record.data.panico) + "</td></tr>"
                        + "</table>"
                        + "<br/>"
                        + "</div>";
                panelOeste.down('#bloquear').disable();
                panelOeste.down('#desbloquear').disable();
                panelOeste.down('#poner').disable();
                panelOeste.down('#quitar').enable();
                Ext.getCmp('contenedoresg').update(tabla);
                labelFecha.setText('');
                labelUsuario.setText('');
                mensajeVehi = 'Vehículo: ' + record.data.vehiculo;
                mensajeEqui = 'Equipo: ' + record.data.equipo;
                estadoEqui = record.data.estadoE;
                estadoVeh = record.data.estadoV;
                idEquipo = record.data.idEquipo;
                idEquipo1 = record.data.idEquipo;
                IdVehiculo = record.data.id_vehiculo;
                latitud = record.data.latitud;
                longitud = record.data.longitud;
                usuarioE = 'Modificado por: ' + record.data.usuarioE;
                usuarioV = 'Modificado por: ' + record.data.usuarioV;
                labelRegistro.setText(mensajeVehi);
                labelEquipo.setText(mensajeEqui);
                fechaE = 'Fecha de Modificación: ' + record.data.fecha_hora_estadoE;
                fechaV = 'Fecha de Modificación: ' + record.data.fecha_hora_estadoV;
                panelOeste.down('#b1').enable();
                panelOeste.down('#b2').enable();
                if (val === 1) {
                    panelOeste.down('[name=stadoEqp]').setValue(estadoVeh);
                    labelFecha.setText(fechaV);
                    labelUsuario.setText(usuarioV);
                    idEquipo = IdVehiculo;

                } else {
                    panelOeste.down('[name=stadoEqp]').setValue(estadoEqui);
                    labelFecha.setText(fechaE);
                    labelUsuario.setText(usuarioE);
                }
            }
        }
    });
    
    var storeDataInvalid = Ext.create('Ext.data.JsonStore', {
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/interface/monitoring/getDataInvalid.php',
        reader: {
            type: 'json',
            root: 'dataInvalid'
        }
    },
    fields: [
        {name: 'descripcionDI', type: 'string'},
        {name: 'fecha_hora_regDI', type: 'date', dateFormat: 'c'},
        {name: 'equipoDI', type: 'string'},
        {name: 'megasDI', type: 'int'},
        {name: 'precioDI', type: 'int'},
        {name: 'tramaDI', type: 'string'},
        {name: 'excepcionDI', type: 'string'}
    ],
    listeners: {
        load: function (thisObj, records, successful, eOpts) {
            if (successful) {
                Ext.getCmp('formDataInvalid').setTitle(' ' + records.length + ' Datos Inválidos');
            }
        }
    }
});
    
    var gridDataInvalid = Ext.create('Ext.grid.Panel', {
        region: 'center',
        id: 'formDataInvalid',
        title: 'Datos Inválidos',
        iconCls: 'icon-feed-error',
        store: storeDataInvalid,
        columnLines: true,
        multiSelect: true,
        plugins: 'gridfilters',
        tools: [{
                type: 'refresh',
                tooltip: 'Refrescar Datos',
                handler: function (event, toolEl, panelHeader) {
                    storeDataInvalid.reload();
                }
            }],
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
            {text: 'Descripción', width: 200, dataIndex: 'descripcionDI', filter: {type: 'list', store: storedatosInvalidos}, align: 'center'},
            {text: 'Fecha y Hora de Registro', width: 180, dataIndex: 'fecha_hora_regDI', xtype: 'datecolumn', align: 'center', format: 'Y-m-d H:i:s', filter: {type: 'date'}, filterable: true},
            {text: 'Equipo', width: 80, dataIndex: 'equipoDI', filter: {type: 'string'}, align: 'center'},
            {text: 'Trama', width: 480, dataIndex: 'tramaDI', filter: {type: 'string'}, align: 'center'},
            {text: 'Excepcion', flex: 1, dataIndex: 'excepcionDI', filter: {type: 'string'}, align: 'center'}
        ], listeners: {
            activate: function (este, eOpts) {
                panelOeste.hide();
                if (winReporte) {
                    winReporte.hide();
                }
            }},
        viewConfig: {
            emptyText: '<center>No hay datos que Mostrar</center>',
            loadMask: true,
            enableTextSelection: true,
            preserveScrollOnRefresh: true
        }
    });

    if (idRolKarview === 1) {
        panelCentral = Ext.create('Ext.tab.Panel', {
            region: 'center',
            deferreRender: false,
            activeTab: 0,
            items: [gridStateEqpSKP,gridStateEqpTrackers,gridStateEqpSKPPasivos, gridListaNegra, gridDataInvalid],
        });
        tabPanelReports = Ext.create('Ext.tab.Panel', {
            region: 'south',
            height: '40%',
            activeTab: 2,
            items: [{
                    region: 'center',
                    xtype: 'grid',
                    iconCls: 'icon-cantidad',
                    height: '100%',
                    title: 'Cantidad de Equipos',
                    columnLines: true,
                    plugins: 'gridfilters',
                    store: storeCantEqp,
                    viewConfig: {
                        emptyText: '<center>No hay datos que Mostrar</center>',
                        loadMask: false
//                    preserveScrollOnRefresh: true
                    },
                    columns: [
                        {text: 'Organización ', width: 130, dataIndex: 'empresa', renderer: formatComp, filter: {type: 'list', store: storeEmpresasMonitoreo}, align: 'center'},
                        {text: 'Conectados', width: 110, dataIndex: 'conect', align: 'center', filter: {type: 'numeric'}},
                        {text: 'Desconectados', width: 120, dataIndex: 'desco', align: 'center', filter: {type: 'numeric'}},
                        {text: 'Total', width: 100, dataIndex: 'total', align: 'center', filter: {type: 'numeric'}}
                    ]
                }
                , {
                    xtype: 'grid',
                    height: '30%',
                    iconCls: 'icon-user',
                    title: 'Conectados',
                    columnLines: true,
                    plugins: 'gridfilters',
                    store: storeUserConect,
                    viewConfig: {
                        emptyText: '<center>No hay datos que Mostrar</center>',
                        loadMask: false,
                        listeners: {
                            itemcontextmenu: function (view, rec, node, index, e) {
                                e.stopEvent();
                                contextMenu1.showAt(e.getXY());
                                return false;
                            }
                        }
                    },
                    columns: [
                        {text: 'Usuario', width: 150, dataIndex: 'usuarioConect', align: 'center', filter: {type: 'string'}},
                        {text: 'Rol', width: 125, dataIndex: 'rolConect', renderer: formatRolUser, align: 'center', filter: {type: 'list', store: storRol}}, //stortconectados
                        {text: 'Organización', width: 150, dataIndex: 'empresaConect', renderer: formatCompany, filter: {type: 'list', store: storeEmpresasMonitoreo}, align: 'center'},
                        {text: 'Fecha y Hora', width: 150, dataIndex: 'fechaHoraConect', xtype: 'datecolumn', align: 'center', format: 'Y-m-d H:i:s', filter: {type: 'date'}, filterable: true},
                        {text: 'Estado', width: 110, dataIndex: 'conectadoConect', renderer: formatStateUser, align: 'center', filter: {type: 'list', store: stortconectados}},
                        {text: 'Ip', width: 150, dataIndex: 'ipConect', align: 'center', filter: {type: 'string'}}
                    ],
                    listeners: {
                        itemclick: function (thisObj, record, item, index, e, eOpts) {
                            latitud = record.data.latitudConect;
                            longitud = record.data.longitudConect;
                            if (longitud !== "0" && latitud !== "") {
                            } else {
                                Ext.example.msg("Error", "El Usuario no Tiene Coordenadas Correctas");
                            }
                        }
                    }
                },
                Ext.create('Ext.form.Panel', {
                    title: 'Mapa',
                    frame: true,
                    iconCls: 'icon-mapa',
                    html: '<div id="map"></div>'
                })
            ]
        });
    } else if (idRolKarview === 4) {
        panelCentral = Ext.create('Ext.tab.Panel', {
            region: 'center',
            deferreRender: false,
            activeTab: 0,
            items: [gridStateEqpSKP, gridStateEqpTrackers,gridStateEqpSKPPasivos, gridListaNegra]
        });
        tabPanelReports = Ext.create('Ext.tab.Panel', {
            region: 'south',
            height: '40%',
            activeTab: 0,
            items: [
                Ext.create('Ext.form.Panel', {
                    title: 'Mapa',
                    frame: true,
                    iconCls: 'icon-mapa',
                    html: '<div id="map"></div>'
                })
            ]
        });
    }






    var menuRefresh = Ext.create('Ext.menu.Menu', {
        width: 100,
        margin: '0 0 10 0',
        items: [
            {group: 'time-refresh', text: '15 seg.', checked: false, inputValue: 15},
            {group: 'time-refresh', text: '20 seg.', checked: false, inputValue: 20},
            {group: 'time-refresh', text: '30 seg.', checked: false, inputValue: 30},
            {group: 'time-refresh', text: '1 min.', checked: true, inputValue: 60}, '-',
            {group: 'time-refresh', text: 'Nunca', checked: false, inputValue: false}
        ],
        listeners: {
            click: function (menu, item, e, eOpts) {
                var valor = item.inputValue;
                if (valor) {
                    refresh = true;
                    timeRefresh = valor;
                } else {
                    refresh = false;
                }
            }
        }
    });
    estado = Ext.create('Ext.form.field.TextArea', {
        fieldLabel: '<b>Comentario</b>',
        name: 'stadoEqp',
        vtype: 'campos',
        width: 350,
        height: 70
    });
    panelOeste = Ext.create('Ext.form.Panel', {
        region: 'east',
        title: 'Configuración',
        iconCls: 'icon-config',
        name: 'panelEste',
        width: '31%',
        frame: true,
        split: true,
        collapsible: true,
        layout: 'border',
        tbar: ['->', {
                xtype: 'label',
                html: '<iframe src="http://free.timeanddate.com/clock/i3x5kb7x/n190/tlec4/fn12/fs18/tct/pct/ftb/bas0/bat0/th1" frameborder="0" width="98" height="15" allowTransparency="true"></iframe>'
            }],
        items: [{
                xtype: 'form',
                region: 'north',
                height: '54%',
                width: '15%',
                autoScroll: true,
                bodyPadding: 5,
                title: 'Asignar Comentario al Vehículo',
                iconCls: 'icon-obtener',
                tools: [{
                        type: 'expand',
                        tooltip: '<b>Tiempo de actualización.</b>',
                        callback: function (owner, tool, event) {
                            menuRefresh.showBy(tool.el);
                        }
                    }, {
                        type: 'refresh',
                        tooltip: '<b>Actualizar datos.<b>',
                        handler: function (event, toolEl, panelHeader) {
                            Ext.example.msg('Mensaje', 'Datos actualizados correctamente.');
                            storeDataInvalid.reload();
                            storeUserConect.reload();
                            storeStateEqp.reload();
                            storeStateEqpPasivos.reload();
                            storeListaNegra.reload();
                            storeStateEqpTrackers.reload();
                            reloadStateEqpByItems(storeUserConect, 60);
                            reloadStateEqpByItems(storeDataInvalid, 60);
                            reloadStateEqpByItems(storeStateEqp, 60);
                            reloadStateEqpByItems(storeStateEqpPasivos, 60);
                            reloadStateEqpByItems(storeListaNegra, 60);
                            reloadStateEqpByItems(storeStateEqpTrackers, 60);
                        }
                    }],
                items: [
                    {
                        xtype: 'radiogroup',
                        fieldLabel: '<b>Criterios</b>',
                        // Arrange radio buttons into two columns, distributed vertically
                        columns: 2,
                        vertical: true,
                        items: [{boxLabel: 'Por Vehículo ', name: 'rb', inputValue: '1', checked: true}, 
                                {boxLabel: 'Por Equipo', name: 'rb', inputValue: '2'},
                        ],
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                switch (parseInt(newValue['rb'])) {
                                    case 1:
                                        idEquipo = IdVehiculo;
                                        panelOeste.down('[name=stadoEqp]').setValue(estadoVeh);
                                        val = 1;
                                        labelFecha.setText(fechaV);
                                        labelUsuario.setText(usuarioV);
                                        break;
                                    case 2:
                                        idEquipo = idEquipo1;
                                        panelOeste.down('[name=stadoEqp]').setValue(estadoEqui);
                                        val = 2;
                                        labelFecha.setText(fechaE);
                                        labelUsuario.setText(usuarioE);
                                        break;
                                }

                            }
                        }
                    },
                    {
                        xtype: 'panel',
                        margin: '5 5 5 5',
                        border: false,
                        layout: 'vbox',
                        bodyStyle: {
                            background: '#ffc'
                        },
                        items: [labelDatos, estado, labelRegistro, labelEquipo,
                            labelFecha, labelUsuario]
                    }, labelInformativo
                ],
                dockedItems: [{
                        xtype: 'toolbar',
                        dock: 'bottom',
                        ui: 'footer',
                        items: [{
                                xtype: 'button',
                                iconCls: 'icon-vita-eqp',
                                tooltip: '<b>Agregar Bitácora</b>',
                                text: 'Bitácora',
                                id: 'b1',
                                handler: function () {
                                    var form = this.up('form').getForm();
                                    if (form.isValid()) {
                                        form.submit({
                                            url: 'php/interface/monitoring/getVitacoraEqp.php',
                                            params: {
                                                idEquipo: idEquipo,
                                            },
                                            failure: function (form, action) {
                                                Ext.example.msg("Mensaje", 'No hay registros de Estado');
                                            },
                                            success: function (form, action) {
                                                var storeVitacora = Ext.create('Ext.data.Store', {
                                                    fields: ['equipoVtc', 'estadoVtc', 'fechaHoraReg', 'tecnicoVtc'],
                                                    data: action.result.vitaStateEqp
                                                });
                                                var windowVitacora = Ext.create('Ext.window.Window', {
                                                    title: 'Vitácora:<br> ' + mensajeVehi + '-' + mensajeEqui,
                                                    iconCls: 'icon-vita-eqp',
                                                    height: 430,
                                                    width: 700,
                                                    layout: 'form',
                                                    items: [{
                                                            xtype: 'grid',
                                                            height: 250,
                                                            border: false,
                                                            columns: [
                                                                Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
                                                                {text: '<b>Estado</b>', width: 200, dataIndex: 'estadoVtc'},
                                                                {text: '<b>Fecha de estado</b>', width: 200, dataIndex: 'fechaHoraReg', aling: 'center'},
                                                                {text: '<b>Nombres del Tecnico</b>', width: 250, dataIndex: 'tecnicoVtc', aling: 'center'}
                                                            ],
                                                            store: storeVitacora,
                                                            listeners: {
                                                                select: function (thisObj, record, index, eOpts) {
                                                                    windowVitacora.down('[name=estado]').setValue(record.data.estadoVtc);
                                                                }
                                                            }
                                                        }, {
                                                            xtype: 'textarea',
                                                            grow: true,
                                                            //                                                    fieldLabel: '<b>Comentario</b>',
                                                            editable: false,
                                                            name: 'estado'
                                                        }, {
                                                            xtype: 'button',
                                                            text: 'Cerrar',
                                                            margin: '5 5 10 5',
                                                            iconCls: 'icon-cancel',
                                                            handler: function () {
                                                                windowVitacora.hide();

                                                            }}]
                                                }).show();
                                            }
                                        });
                                    }

                                }
                            },'->',
                            {   iconCls: 'icon-lock',
                                id: 'bloquear',
                                tooltip: '<b>Enviar a Estado pasivo el Equipo</b>',
                                handler: function () {
                                    var form = this.up('form').getForm();
                                    if (form.isValid()) {
                                        form.submit({
                                            url: 'php/interface/monitoring/setBloqueo.php',
                                            params: {
                                                bloqueo: 0,
                                                idEquipo: idEquipo1

                                            },
                                            failure: function (form, action) {
                                                Ext.MessageBox.show({
                                                    title: 'Error...',
                                                    msg: 'No fue posible Actualizar Estado',
                                                    buttons: Ext.MessageBox.OK,
                                                    icon: Ext.MessageBox.ERROR
                                                });
                                            },
                                            success: function (form, action) {
                                                Ext.example.msg("Mensaje", 'Vehículo Bloqueado Correctamente...');
                                                storeStateEqpPasivos.reload();
                                                storeStateEqp.reload();
                                            }
                                        });
                                    }

                                }
                            }, {
                                iconCls: 'icon-unlock',
                                id: 'desbloquear',
                                tooltip: '<b>Desbloquear Unidad</b>',
                                handler: function () {
                                    var form = this.up('form').getForm();
                                    if (form.isValid()) {
                                        form.submit({
                                            url: 'php/interface/monitoring/setBloqueo.php',
                                            params: {
                                                bloqueo: 1,
                                                idEquipo: idEquipo1
                                            },
                                            failure: function (form, action) {
                                                Ext.MessageBox.show({
                                                    title: 'Error...',
                                                    msg: 'No fue posible Actualizar Estado',
                                                    buttons: Ext.MessageBox.OK,
                                                    icon: Ext.MessageBox.ERROR
                                                });
                                            },
                                            success: function (form, action) {
                                                Ext.example.msg("Mensaje", 'Vehículo Desbloqueado Correctamente...');
                                                storeStateEqpPasivos.reload();
                                                storeStateEqp.reload();
                                            }
                                        });
                                    }

                                }
                            },'->',{
                                iconCls: 'icon-list',
                                id: 'poner',
                                tooltip: '<b>Enviar Equipo a Lista Negra</b>',
                                handler: function () {
                                    var form = this.up('form').getForm();
                                    if (form.isValid()) {
                                        form.submit({
                                            url: 'php/interface/monitoring/setEstado.php',
                                            params: {
                                                estado: 0,
                                                idEquipo: idEquipo1
                                            },
                                            failure: function (form, action) {
                                                Ext.MessageBox.show({
                                                    title: 'Error...',
                                                    msg: 'No fue posible Actualizar Estado',
                                                    buttons: Ext.MessageBox.OK,
                                                    icon: Ext.MessageBox.ERROR
                                                });
                                            },
                                            success: function (form, action) {
                                                Ext.example.msg("Mensaje", 'Vehículo en Lista Negra Correctamente...');
                                                storeStateEqpPasivos.reload();
                                                storeStateEqp.reload();
                                                storeListaNegra.reload();
                                            }
                                        });
                                    }

                                }
                            }, {
                                iconCls: 'icon-acept',
                                id: 'quitar',
                                tooltip: '<b>Quitar el Equipo de Lista Negra</b>',
                                handler: function () {
                                    var form = this.up('form').getForm();
                                    if (form.isValid()) {
                                        form.submit({
                                            url: 'php/interface/monitoring/setEstado.php',
                                            params: {
                                                estado: 1,
                                                idEquipo: idEquipo1
                                            }, failure: function (form, action) {
                                                Ext.MessageBox.show({
                                                    title: 'Error...',
                                                    msg: 'No fue posible Actualizar Estado',
                                                    buttons: Ext.MessageBox.OK,
                                                    icon: Ext.MessageBox.ERROR
                                                });
                                            }, success: function (form, action) {
                                                Ext.example.msg("Mensaje", 'Vehículo Eliminado de Lista Negra Correctamente...');
                                                storeStateEqpPasivos.reload();
                                                storeStateEqp.reload();
                                                storeListaNegra.reload();
                                                storeCantEqp.reload();
                                            }
                                        });
                                    }

                                }
                            },'->' ,{
                                text: 'Asignar',
                                id: 'b2',
                                iconCls: 'icon-check',
                                tooltip: '<b>Asignar Comentario </b>',
                                handler: function () {
                                    var form = this.up('form').getForm();
                                    var comentario = panelOeste.down('[name=stadoEqp]').getValue();
                                    if (comentario !== "") {
                                        if (comentario !== estadoEqui && comentario !== estadoVeh) {
                                            if (form.isValid()) {
                                                form.submit({
                                                    url: 'php/interface/monitoring/setState.php',
                                                    params: {
                                                        idEquipo: idEquipo,
                                                        idvehiculo: IdVehiculo
                                                    },
                                                    failure: function (form, action) {
                                                        Ext.MessageBox.show({
                                                            title: 'Error...',
                                                            msg: 'No fue posible Actualizar Estado',
                                                            buttons: Ext.MessageBox.OK,
                                                            icon: Ext.MessageBox.ERROR
                                                        });
                                                    },
                                                    success: function (form, action) {
                                                        Ext.example.msg("Mensaje", 'Estado Modificado Correctamente');
                                                        form.reset();
                                                        panelOeste.down('[name=stadoEqp]').setValue('');
                                                        labelEquipo.setText('');
                                                        labelRegistro.setText('');
                                                        labelFecha.setText('');
                                                        labelUsuario.setText('');
                                                        storeStateEqp.reload();
                                                        storeStateEqpUdp.reload();
                                                    }
                                                });
                                            }
                                        } else {
                                            Ext.example.msg("Mensaje", 'Debe ingresar un comentario diferente ');
                                        }
                                    } else {
                                        Ext.example.msg("Mensaje", 'Debe ingresar un comentario');
                                    }
                                }
                            }
                        ]}]
            }
            , tabPanelReports]
    });
    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: [panelCentral, panelOeste]
    });
    var tab = Ext.create('Ext.form.Panel', {
        id: 'contenedoresg',
        name: 'contenedoresg',
        items: [
            {
                id: 'contenido2',
                html: ""
            }
        ]

    });

    panelOeste.down('#b1').disable();
    panelOeste.down('#b2').disable();
    panelOeste.down('#bloquear').disable();
    panelOeste.down('#desbloquear').disable();
    panelOeste.down('#poner').disable();
    panelOeste.down('#quitar').disable();
    reloadStateEqpByItems(storeStateEqp);
    reloadStateEqpByItems(storeStateEqpPasivos);
    reloadStateEqpByItems(storeListaNegra);
    reloadStateEqpByItems(storeCantEqp);
    reloadStore(storeDataInvalid, 60);
    reloadStore(storeUserConect, 60);
    checkRolSesion(idRolKarview);
    refresh=true;
    if (idRolKarview === 1) {
        panelOeste.setVisible(true);
    } else if (idRolKarview === 4) {
        panelOeste.setVisible(true);
        gridDataInvalid.setVisible(false);

    } else {
        panelOeste.setVisible(false);
    }
    setTimeout(function () {
        tabPanelReports.setActiveTab(0);
    }, 0);
});

function limpiarPanelG() {
    Ext.getCmp('contenedoresg').update('');
    if (winReporte) {
        winReporte.hide();
    }

}
function addTooltip(value, metadata, record, rowIndex, colIndex, store) {
    metadata.attr = 'ext:qtip="' + 'value' + '"';
    return value;
}

function formatStateConect(val) {
    if (val <= 3) {
        return '<span style="color:green;">Conect</span>';
    } else if (val > 3) {
        return '<span style="color:red;">Disconect</span>';
    }
}

function formatStateUser(val) {
    if (val === '0') {
        return '<span style="color:red;">Desconectado</span>';
    } else if (val === '1') {
        return '<span style="color:green;">Conectado</span>';
    }
}


function formatRolUser(val) {
    if (val === 1) {
        return '<span style="color:black;">Administrador</span>';
    }
    if (val === 2) {
        return '<span style="color:blue;">Organización</span>';
    }
    if (val === 3) {
        return '<span style="color:orange;">Particular</span>';
    }
    if (val === 4) {
        return '<span style="color:green;">Distribuidor</span>';
    }
}

function reloadStateEqpByItems(store) {
    setTimeout(function () {
        reloadStateEqpByItems(store);
        if (refresh) {
            store.reload();
        }
    }
    , timeRefresh * 1000);
}

var labelInformativo = Ext.create('Ext.form.Label', {
    text: '',
    style: {
        color: 'black'
    }
});

var labelDatos = Ext.create('Ext.form.Label', {
    text: 'DATOS:',
    style: {
        color: 'RED'
    }
});
var labelRegistro = Ext.create('Ext.form.Label', {
    text: '',
    style: {
        color: 'black'
    }
});
var labelEquipo = Ext.create('Ext.form.Label', {
    text: '',
    style: {
        color: 'black'
    }
});
var labelFecha = Ext.create('Ext.form.Label', {
    text: '',
    style: {
        color: 'black'
    }
});

var labelUsuario = Ext.create('Ext.form.Label', {
    text: '',
    margin: '0 0 8 0',
    style: {
        color: 'black'
    }
});





















