Ext.Loader.setConfig({
    enabled: true
});
Ext.Loader.setPath('Ext.ux', 'extjs/examples/ux');
Ext.require([
    'Ext.ux.form.ItemSelector',
    'Ext.grid.filters.Filters',
    'Ext.ux.Spotlight'
]);
var idEstacion;
var panelTabMapaAdmin;
var panelMenu;
/////////////////////////
var drawControls;
var required = '<span style="color:red;font-weight:bold" data-qtip="Requerido">*</span>';

var meses = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
var diasSemana = new Array("Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado");
var f = new Date();
var label = Ext.create('Ext.form.Label', {
    text: 'hola',
    id: 'tiempo',
    style: {
        color: 'gray'
    }
});

var filters = {
    ftype: 'filters',
    // encode and local configuration options defined previously for easier reuse
    encode: false, // json encode the filter query
    local: true, // defaults to false (remote filtering)

    // Filters are most naturally placed in the column definition, but can also be
    // added here.
    filters: [{
            type: 'boolean',
            dataIndex: 'visible'
        }]
};

var idEqpMen;
var gridEventos;
var spot;

Ext.onReady(function () {
    applicateVTypes();
    spot = Ext.create('Ext.ux.Spotlight', {
        easing: 'easeOut',
        duration: 500
    });
    var idEqpMen, nameVeh;
    //Ext.getCmp('tiempo').setValue((diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear()));

    Ext.tip.QuickTipManager.init();

    menuCoop = Ext.create('Ext.menu.Menu', {
        items: [],
        listeners: {
            click: function (menu, item, e, eOpts) {
                for (var i = 0; i < showCoopMap.length; i++) {
                    if (showCoopMap[i][0] === item.getItemId()) {
                        showCoopMap[i][2] = item.checked;

                        if (!item.checked) {
                            var form = Ext.create('Ext.form.Panel');
                            form.getForm().submit({
                                url: 'php/interface/monitoring/ultimosGPS.php',
                                params: {
                                    listCoop: showCoopMap[i][0]
                                },
                                failure: function (form, action) {
                                    Ext.example.msg('Mensaje', action.result.message);
                                },
                                success: function (form, action) {
                                    if (connectionMap()) {
                                        clearVehicles(action.result.dataGps);
                                    }
                                }
                            });
                        }
                    }
                }
            }
        }
    });


    var administracion = Ext.create('Ext.button.Button', {
        text: 'Administración',
        iconCls: 'icon-direccion',
        scope: this,
        menu: [
            {text: 'Personal', iconCls: 'icon-persona', handler: function () {
                    showWinAdminPerson();
                }},
            {text: 'Usuarios', iconCls: 'icon-user', handler: function () {
                    showWinAdminUser();
                }},
             {text: 'Alertas',
                iconCls: 'icon-alert',
                menu: [
                    {text: 'Envio Correo Eventos', iconCls: 'icon-email', handler: function () {
                            ventanaEnvioMail();
                        }}
                    ,
                    {text: 'Envio alertas vehículo', iconCls: 'icon-alert', handler: function () {
                            ventanaEnvioAlerta();
                        }}
                ]
            },
            {text: 'Enviar Comando', iconCls: 'icon-cmd', handler: function () {
                    ventComandsPred();
                }},
            {
                text: 'Geocercas',
                iconCls: 'icon-geocerca',
                menu: [
                    {text: 'Administración', iconCls: 'icon-find-geo', handler: function () {
                            ventanaGeocerca();
                        }},
                    {text: 'Envio Correos', iconCls: 'icon-email', handler: function () {
                            visualizarEnviosGeoCercas();
                        }}
                ]
            }
        ]
    });



    var herraminetas = Ext.create('Ext.button.Button', {
        text: 'Herramintas',
        scope: this,
        iconCls: 'icon-config',
        menu: [
            {text: 'Modificar usuario', iconCls: 'icon-personal', handler: function () {
                    ventanaModificarUsuario();
                }},
            {text: 'Cambiar contraseña', iconCls: 'icon-key', handler: function () {
                    ventanaCambiarContrasenia();
                }},
            {text: 'Mantenimientos', iconCls: 'icon-mantenimiento', handler: function () {
                    ventAddMantenimientosPost();
                }},
            {text: 'Vehículos en Lugares', iconCls: 'icon-google-maps', handler: function () {
                    ventanaVehLugares();
                }},
            {text: 'Actualizar Correo', iconCls: 'icon-email', handler: function () {
                    ventanaActualizarEmail();
                }},
            {text: 'Actualizar Celular', iconCls: 'icon-telef', handler: function () {
                    ventanaActualizarCelular();
                }},
            '-',
            {text: 'Creditos', iconCls: 'icon-credits', handler: function () {
                    credits();
                    spot.show('panel-credit');
                }}
        ]
    });
    var salir = Ext.create('Ext.button.Button', {
        id: 'custom',
        text: 'Salir',
        scope: this,
//        icon: 'img/exit_16.png',
        iconCls: 'icon-exitsystem',
        handler: function () {
            Ext.MessageBox.buttonText = {
                yes: "Sí",
                no: "No"
            };
            Ext.MessageBox.confirm('SALIR', 'Desea Salir del Sistema ?', function (choice) {
                if (choice === 'yes') {
                    window.location = 'php/login/logout.php';
                }
            });
        }
    });

    var barraMenu = Ext.create('Ext.toolbar.Toolbar', {
        width: '100%',
        items: [{
                text: 'Menú',
                icon: 'img/menu.png',
                menu: [{
                        text: 'Reportes',
                        iconCls: 'icon-general',
                        menu: [
                            {text: 'Recorridos General', iconCls: 'icon-all-flags', handler: function () {
                                    recorridosGeneral();
                                }}
                            ,
                            {text: 'Registros de Panico', iconCls: 'icon-reset', handler: function () {
                                    showWinPanicosDaily();
                                }},
                            {text: 'Excesos de Velocidad', iconCls: 'icon-exceso-vel', handler: function () {
                                    ventanaexcesosvelociadadWin();
                                }},
//                            {text: 'Mantenimiento Vehicular', iconCls: 'icon-servicios', handler: function () {
//                                    showWinMantenimientoGeneral();
//                                }},
                            {text: 'Perdida de GPS y GSM', iconCls: 'icon-flota', handler: function () {
                                    reporteWinperdidaGpsGsm();
                                }},
                            {text: 'Reporte de Paradas', iconCls: 'icon-unlock', handler: function () {
                                    showWinPradas();
                                }},
                             {text: 'Reporte de Geocercas', iconCls: 'icon-report-geo', handler: function () {
                                    ventanaReporteGeocerca();
                                }}
                            ,
                            {text: 'CMD Enviados', iconCls: 'icon-cmd-hist', handler: function () {
                                    ventanaCmdHistorialPredefinido();
                                }},
                            {text: 'Reporte de Encendido y Apagado', iconCls: 'icon-encendido', handler: function () {
                                    showWinencendidoapagado();
                                }},
                            {text: 'Conexión Desconexión del Equipo', iconCls: 'icon-conexcion', handler: function () {
                                    showWinEnergizar();
                                }},
                            {text: 'Reporte de Eventos', iconCls: 'icon-eventos', handler: function () {
                                    ventanaEventos();
                                }}
                        ]
                    },
                      {
                        text: 'Estadística',
                        iconCls: 'icon-estadistica',
                        scope: this,
                        handler: function () {
                            window.open('estadistica.php');
                        }
                    }
                ]
            },
            herraminetas,
            administracion,
            salir, '->',
//            {
//                xtype: 'button',
//                iconCls: 'icon-act-mapa',
//                tooltip: 'Limpiar Mapa',
//                handler: function () {
//                    clearLienzoPointTravel();
//                    var lonlatCenter = new OpenLayers.LonLat(0, 100000000);
//                    map.setCenter(lonlatCenter, 7);
//
//                }}
                ,
            salir,
            {
                xtype: 'label',
                html: '<section id="panelNorte">' +
                        '<center><strong id="name"><FONT SIZE=3  COLOR="blue">' + (diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()]) + '  ' + '</FONT><iframe src="http://free.timeanddate.com/clock/i3x5kb7x/n190/tlec4/fn12/fs18/tct/pct/ftb/bas0/bat0/th1"  frameborder="0" width="96"  height="15" allowTransparency="true" ></iframe>' + '</strong></center>' +
                        '</section>'
            },
            {
                xtype: 'image',
                src: getNavigator(),
                width: 16,
                height: 16,
                margin: '0 5 0 0'
            }
        ]
    });

    panelMenu = Ext.create('Ext.form.Panel', {
        region: 'north',
        deferreRender: false,
        activeTab: 0,
        items: [
            {
                anchor: '100%',
                border: 1,
                height: 60,
                margin: '0 0 0 0',
                name: 'labelImage',
                src: 'img/uploads/orgs/logoKradac.jpg',
                style: {
                    borderColor: '#157fcc',
                    borderStyle: 'solid'
                },
                xtype: 'image'
            },
            {
                xtype: 'label',
                style: {
                    color: '#157fcc'
                },
                html: '<section id="panelNorte">' +
                        '<center><strong id="subtitulo">Bienvenid@ al Sistema: ' + userKarview + '</strong></center>' +
                        '</section>'
            },
            barraMenu]
    });

    var winSearchVeh = Ext.create('Ext.window.Window', {
        layout: 'fit',
        title: 'Buscar Vehiculo',
        iconCls: 'icon-car',
        width: 300,
        height: 150,
        closeAction: 'hide',
        plain: false,
        items: [{
                xtype: 'form',
                frame: true,
                items: [{
                        xtype: 'combobox',
                        fieldLabel: 'Organización',
                        name: 'cbxEmpresas',
                        store: storeEmpresas,
                        valueField: 'id',
                        displayField: 'text',
                        queryMode: 'local',
                        emptyText: 'Seleccionar Cooperativa...',
                        editable: false,
                        allowBlank: false,
                        listConfig: {
                            minWidth: 160
                        },
                        listeners: {
                            select: function (combo, records, eOpts) {
                                this.up('form').down('[name=cbxVeh]').enable();
                                this.up('form').down('[name=cbxVeh]').clearValue();

                                storeVeh.load({
                                    params: {
                                        cbxEmpresas: records[0].data.id
                                    }
                                });
                            }
                        }
                    }, {
                        xtype: 'combobox',
                        fieldLabel: 'Vehículo:',
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
                            minWidth: 450
                        }
                    }],
                buttons: [{
                        text: 'Buscar',
                        iconCls: 'icon-search-veh',
                        handler: function () {
                            if (this.up('form').getForm().isValid()) {
                                var capa = this.up('form').down('[name=cbxEmpresas]').getValue();
                                var idEqpCoop = this.up('form').down('[name=cbxVeh]').getValue();
                                buscarEnMapa(capa, idEqpCoop);
                            } else {
                                Ext.example.msg('Error', 'Escoja un Vehiculo');
                            }
                        }
                    }]
            }]
    });

    var panelEste = Ext.create('Ext.form.Panel', {
        region: 'west',
        id: 'west_panel',
        title: 'Facetas-Karview',
        iconCls: 'icon-facetas',
        frame: true,
        width: 240,
        split: true,
        collapsible: true,
        layout: 'accordion',
        border: false,
        layoutConfig: {
            animate: false
        },
        items: [{
                xtype: 'treepanel',
                id: 'veh-taxis-tree',
                rootVisible: false,
                title: 'Empresas',
                autoScroll: true,
                iconCls: 'icon-tree-company',
                store: storeTreeVeh,
                columns: [
                    {xtype: 'treecolumn', text: 'Central', flex: 4, sortable: true, dataIndex: 'text'},
//                     {text: 'Estado', flex: 1, dataIndex: 'estado', sortable: true, renderer: formatState}
                ],
                tools: [{
                        type: 'help',
                        handler: function () {
                            // show help here
                        }
                    }, {
                        type: 'refresh',
                        itemId: 'refresh_taxis',
                        tooltip: 'Recargar Datos',
                        handler: function () {
                            var tree = Ext.getCmp('veh-taxis-tree');
                            tree.body.mask('Loading', 'x-mask-loading');
                            reloadTree(tree, 'Vehiculos', storeTreeVeh);
                            Ext.example.msg('Vehiculos', 'Recargado');
                            tree.body.unmask();
                        }
                    },
                    {
                        type: 'search',
                        tooltip: 'Buscar Vehiculo',
                        handler: function (event, target, owner, tool) {
                            owner.child('#refresh_taxis').show();
                            winSearchVeh.showAt(event.getXY());
                        }
                    }
                ],
                root: {
                    dataIndex: 'text',
                    expanded: true
                },
                listeners: {
                    itemclick: function (thisObject, record, item, index, e, eOpts) {
                        if (connectionMap()) {
                            var id = record.internalId;
                            var aux = record.id.split('_');
                            var idEmpresa = parseInt(aux[0]);
                            var idVehicle = 'last' + aux[1];
                            buscarEnMapa(idEmpresa, idVehicle);
                            panelTabMapaAdmin.setActiveTab(0);
                        }
                    }
                }
            }]
    });

    var toolBarOnMap = Ext.create('Ext.toolbar.Toolbar', {
        region: 'north',
        border: true,
        items: [
            '->'
                    , {
                        xtype: 'button',
                        iconCls: 'icon-geoloc',
                        tooltip: 'Ubicar mi Posición',
                        handler: function () {
                            getLocation();
                            panelTabMapaAdmin.setActiveTab(0);
                        }
                    }
                     , {
                xtype: 'button',
//                 icon: 'img/paint_16.png',
                 iconCls: 'icon-cleanmap',
                tooltip: 'Limpiar Mapa',
                handler: function () {
                    clearLienzoPointTravel();
                    var lonlatCenter = new OpenLayers.LonLat(0, 100000000);
                    map.setCenter(lonlatCenter, 7);

                }},
                    , {
                xtype: 'splitbutton',
                text: 'Organización',
                iconCls: 'icon-central',
                menu: menuCoop,
                handler: function () {
                    this.showMenu();
                }
            }
        ]
    });

    panelTabMapaAdmin = Ext.create('Ext.tab.Panel', {
        region: 'center',
        frame: true,
        deferreRender: false,
        activeTab: 0,
        items: [
            {
                title: 'Mapa',
                id: 'panelMapaTab',
                iconCls: 'icon-mapa',
                html: '<div id="map"></div>'
            }
        ]
    });

    gridEventos = Ext.create('Ext.grid.GridPanel', {
        region: 'south',
        title: "Últimos Reportes de Vehiculos",
        collapsible: true,
        collapsed: true,
        split: true,
        height: 200,
        autoScroll: true,
        frame: true,
        store: storeEventos1,
        plugins: 'gridfilters',
        columns: [
            {header: "Empresa", flex: 75, sortable: true, dataIndex: "empresa", filter: {type: 'string'}},
            {header: "Vehiculo", flex: 75, sortable: true, dataIndex: "vehiculo", filter: {type: 'string'}},
            {header: "Placa", flex: 75, sortable: true, dataIndex: "placa", filter: {type: 'string'}},
            {header: "Equipo", flex: 75, sortable: true, dataIndex: "equipo", filter: {type: 'string'}},
            {header: "Evento", flex: 125, sortable: true, dataIndex: "sky_evento"},
            {header: "Vel (Km/h)", flex: 50, sortable: true, dataIndex: "vel", filter: {type: 'numeric'}}
        ],
        listeners: {
            itemclick: function (thisObject, record, item, index, e, eOpts) {
                panelTabMapaAdmin.setActiveTab(0);
                localizarDireccion(record.data.longitud, record.data.latitud, 15);
            }
        }
    });

    panelCentral = Ext.create('Ext.form.Panel', {
        region: 'center',
        layout: 'border',
        items: [
            toolBarOnMap,
            panelTabMapaAdmin,
            gridEventos
        ]
    });

    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: [panelMenu, panelEste, panelCentral]
    });
    storeEmpresas.load();
    loadMap();
    panelMenu.down('[name=labelImage]').setSrc('img/uploads/orgs/' + logo);
});
