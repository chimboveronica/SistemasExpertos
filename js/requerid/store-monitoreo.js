

var storeEmpresasMonitoreo = Ext.create('Ext.data.Store', {
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/listFilters/listEmpresas.php',
        reader: {
            type: 'array'
        }
    },
    fields: ['id', 'text']
});

var storeEmpresaList = Ext.create('Ext.data.Store', {
    autoDestroy: true,
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/listFilters/listEmpresas.php',
        reader: {
            type: 'array'
        }
    },
    fields: [{name: 'id', type: 'string'},
        {name: 'text', type: 'string'}]
});


var storeCantEqp = Ext.create('Ext.data.JsonStore', {
    autoDestroy: true,
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/interface/monitoring/getCantEqp.php',
        reader: {
            type: 'json',
            root: 'cantEqp'
        }
    },
    fields: [
        {name: 'conect', type: 'int'},
        {name: 'desco', type: 'int'},
        {name: 'total', type: 'int'},
        {name: 'empresa', type: 'string'}
    ]
});

var storeUserConect = Ext.create('Ext.data.JsonStore', {
    autoDestroy: true,
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/interface/monitoring/getUserConect.php',
        reader: {
            type: 'json',
            root: 'userConect'
        }
    },
    fields: [
        {name: 'usuarioConect', type: 'string'},
        {name: 'rolConect', type: 'int'},
        {name: 'empresaConect', type: 'string'},
        {name: 'fechaHoraConect', type: 'date', dateFormat: 'c'},
        {name: 'conectadoConect', type: 'string'},
        {name: 'ipConect', type: 'string'},
        {name: 'longitudConect', type: 'string'},
        {name: 'latitudConect', type: 'string'}
    ]
});

var storedatosInvalidos = Ext.create('Ext.data.Store', {
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/listFilters/listaExcepciones.php',
        reader: {
            type: 'array'
        }
    },
    fields: ['id', 'text']
});
