Ext.Loader.setConfig({
    enabled: true
});
Ext.Loader.setPath('Ext.ux', 'extjs/examples/ux');
Ext.require([
    'Ext.ux.form.ItemSelector',
    'Ext.grid.filters.Filters',
    'Ext.ux.Spotlight'
]);
var panelTabMapaAdmin;
var spot;
var panelMenu;

Ext.onReady(function () {
    applicateVTypes();
    spot = Ext.create('Ext.ux.Spotlight', {
        easing: 'easeOut',
        duration: 500
    });
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
        tooltip: 'Administración de Usuarios, Equipos y Vehículos',
        scope: this,
        menu: [
            {text: 'Organización', iconCls: 'icon-central', handler: function () {
                    showWinAdminCompany();
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
            {text: 'Personal', iconCls: 'icon-persona', handler: function () {
                    showWinAdminPerson();

                }},
            {text: 'Usuarios', iconCls: 'icon-user', handler: function () {
                    showWinAdminUser();
                }},
            {text: 'Vehículos', iconCls: 'icon-car', handler: function () {
                    ventanaAddVehiculos();
                }},
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
                    {text: 'Envio Correos Geocercas', iconCls: 'icon-email', handler: function () {
                            visualizarEnviosGeoCercas();
                        }}
                ]
            }
        ]
    });

    var herraminetas = Ext.create('Ext.button.Button', {
        text: 'Herramientas',
        scope: this,
        tooltip: 'Herramintas de Acceso Rapido',
        iconCls: 'icon-config',
        menu: [
            {text: 'Modificar usuarios', iconCls: 'icon-personal', handler: function () {
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
            {text: 'Actualizar email', iconCls: 'icon-email', handler: function () {
                    ventanaActualizarEmail();
                }},
            {text: 'Actualizar Celular', iconCls: 'icon-telef', handler: function () {
                    ventanaActualizarCelular();
                }},
            '-',
            {text: 'Videos',
                iconCls: 'icon-video',
                handler: showVideo
            },
            {text: 'Créditos', iconCls: 'icon-credits', handler: function () {
                    credits();
                    spot.show('panel-credit');
                }}
        ]
    });


    var monitoreo = Ext.create('Ext.button.Button', {
        text: 'Monitoreo',
        tooltip: 'Estado Actual de los Vehiculos y Equipos',
        iconCls: 'icon-monitoreo', handler: function () {
            window.open('monitorTeam.php');
        }
    });
    var salir = Ext.create('Ext.button.Button', {
        id: 'custom',
        scope: this,
        tooltip: 'Salir del Sistema',
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
                tooltip: 'Reportes Informativos',
                menu: [{
                        text: 'Reportes',
                        iconCls: 'icon-general',
                        menu: [
                            {text: 'Recorridos General', iconCls: 'icon-all-flags', handler: function () {
                                    recorridosGeneral();
                                }},
                            {text: 'Registros de Pánico', iconCls: 'icon-reset', handler: function () {
                                    showWinPanicosDaily();
                                }},
                            {text: 'Excesos de Velocidad', iconCls: 'icon-exceso-vel', handler: function () {
                                    ventanaexcesosvelociadadWin();
                                }},
//                            {text: 'Mantenimiento Vehicular', iconCls: 'icon-servicios', handler: function () {
//                                    showWinMantenimientoGeneral();
//                                }},
//                            {text: 'Manatenimiento General', iconCls: 'icon-mantenimiento', handler: function () {
//                                    ventanaReporteMantenimiento();
//                                }},
                            {text: 'Perdida de GPS y GSM', iconCls: 'icon-flota', handler: function () {
                                    reporteWinperdidaGpsGsm();
                                }},
                            {text: 'Reporte de Paradas', iconCls: 'icon-unlock', handler: function () {
                                    showWinPradas();
                                }},
                            {text: 'Reporte de Geocercas', iconCls: 'icon-report-geo', handler: function () {
                                    ventanaReporteGeocerca();
                                }},
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
                            window.open('estadisticaDistribuidor.php');
                        }
                    }
                ]
            },
            herraminetas,
            monitoreo,
            administracion
                    , '->',
//            {
//                xtype: 'button',
//                iconCls: 'icon-act-mapa',
////                 icon: 'img/limpieza.png',
//                tooltip: 'Limpiar Mapa',
//                handler: function () {
//                    clearLienzoPointTravel();
//                    clearLienzoTravel();
//                    clearLienzoReport();
//                    var lonlatCenter = new OpenLayers.LonLat(0, 100000000);
//                    map.setCenter(lonlatCenter, 7);
//                }}
            , ' ',
            salir,
            {
                xtype: 'label',
                html: '<section id="panelNorte">' +
                        '<center><strong id="name"><FONT SIZE=3  COLOR="black">' + (diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()]) + '  ' + '</FONT><iframe src="http://free.timeanddate.com/clock/i3x5kb7x/n190/tlec4/fn12/fs18/tct/pct/ftb/bas0/bat0/th1"  frameborder="0" width="96"  height="15" allowTransparency="true" ></iframe>' + '</strong></center>' +
                        '</section>'
            },
            {
                xtype: 'image',
                src: getNavigator(),
                width: 16,
                height: 16,
                margin: '0 5 0 0'
            }]
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
                        '<center><strong id="subtitulo">Bienvenid@ al Sistema: ' + personKarview + '</strong></center>' +
                        '</section>'
            },
            barraMenu]
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
        items: [
            {
                xtype: 'treepanel',
                id: 'veh-taxis-tree',
                rootVisible: false,
                bodyStyle: {
                    backgroundColor: '#f8fdff'
                },
                title: 'Organización',
                autoScroll: true,
                iconCls: 'icon-tree-company',
                store: storeTreeVeh,
                columns: [
                    {xtype: 'treecolumn', text: 'Central', flex: 4, sortable: true, dataIndex: 'text'}
                ],
                tools: [{
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
                    }],
                root: {
                    dataIndex: 'text',
                    expanded: true
                },
                listeners: {
                    itemclick: function (thisObject, record, item, index, e, eOpts) {
                        if (connectionMap()) {
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
        padding: '2 2 2 2',
        style: {
            backgroundColor: 'white',
            borderStyle: 'solid',
            borderTopColor: '#074471',
            borderTopWidth: '10px'
        },
        border: true,
        items: [
            '->'
                    , {
                        xtype: 'button',
                        iconCls: 'icon-geoloc',
                        tooltip: 'Ubicar mi Posición',
                        handler: function () {
                            clearLienzoPointTravel();
                            getLocation();
                            panelTabMapaAdmin.setActiveTab(0);
                        }
                    },
            {
                xtype: 'button',
//                 icon: 'img/paint_16.png',
                iconCls: 'icon-cleanmap',
//                 icon: 'img/limpieza.png',
                handler: function () {
                    clearLienzoPointTravel();
                    clearLienzoTravel();
                    clearLienzoReport();
                    var lonlatCenter = new OpenLayers.LonLat(0, 100000000);
                    map.setCenter(lonlatCenter, 7);
                }}
            , {
                xtype: 'splitbutton',
                text: 'Organización',
                iconCls: 'icon-central',
                tooltip: 'Organizaciones Asociadas',
                menu: menuCoop,
                handler: function () {
                    this.showMenu();
                }
            }]
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

    var gridEventos = Ext.create('Ext.grid.GridPanel', {
        region: 'south',
        title: "Últimos Reportes de Vehículos",
        collapsible: true,
        collapsed: true,
        split: true,
        height: 200,
        autoScroll: true,
        frame: true,
        store: storeEventos1,
        plugins: 'gridfilters',
        columns: [
            {header: "Organización", flex: 75, sortable: true, dataIndex: "empresa", renderer: formatCompany, filter: {type: 'list', store: storeEmpresasList}, align: 'center'},
            {header: "Vehículo", flex: 75, sortable: true, dataIndex: "vehiculo", filter: {type: 'string'}},
            {header: "Placa", flex: 75, sortable: true, dataIndex: "placa", filter: {type: 'string'}},
            {header: "Equipo", flex: 75, sortable: true, dataIndex: "equipo", filter: {type: 'string'}},
            {header: "Evento", flex: 125, sortable: true, dataIndex: "sky_evento", filter: {type: 'list', store: storeEventos}},
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

    if (connectionMap()) {
        loadMap();
    }
    panelMenu.down('[name=labelImage]').setSrc('img/uploads/orgs/' + logo);
});
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