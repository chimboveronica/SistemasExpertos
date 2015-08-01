


var stortconectados = Ext.create('Ext.data.Store', {
    data: [
        {id: 0, text: 'Desconectado'},
        {id: 1, text: 'Conectado'}
    ],
    fields: [
        {name: 'id', type: 'string'},
        {name: 'text', type: 'string'}
    ]
});

var storRol = Ext.create('Ext.data.Store', {
    data: [
        {id: 1, text: 'Adminnistrador'},
        {id: 2, text: 'Organización'},
        {id: 3, text: 'Particular'}
    ],
    fields: [
        {name: 'id', type: 'int'},
        {name: 'text', type: 'string'}
    ]
});

var storStado = Ext.create('Ext.data.Store', {
    data: [
        {id: 0, text: 'Disconect'},
        {id: 1, text: 'Conect'}
    ],
    fields: [
        {name: 'id', type: 'int'},
        {name: 'text', type: 'string'}
    ]
});
///////////////////////////////////////

var storBateria = Ext.create('Ext.data.Store', {
    data: [
        {id: 1, text: 'Bat. del Equipo'},
        {id: 0, text: 'Bat. del Vehiculo'}
    ],
    fields: [
        {name: 'id', type: 'int'},
        {name: 'text', type: 'string'}
    ]
});

var storGsm = Ext.create('Ext.data.Store', {
    data: [
        {id: 1, text: 'Con covertura'},
        {id: 0, text: 'Sin covertura'}
    ],
    fields: [
        {name: 'id', type: 'int'},
        {name: 'text', type: 'string'}
    ]
});


var storGPS = Ext.create('Ext.data.Store', {
    data: [
        {id: 1, text: 'Con GPS'},
        {id: 0, text: 'Sin GPS'}
    ],
    fields: [
        {name: 'id', type: 'int'},
        {name: 'text', type: 'string'}
    ]
});


var storIGN = Ext.create('Ext.data.Store', {
    data: [
        {id: 1, text: 'Encendido'},
        {id: 0, text: 'Apagado'}
    ],
    fields: [
        {name: 'id', type: 'int'},
        {name: 'text', type: 'string'}
    ]
});


var storActivo = Ext.create('Ext.data.Store', {
    data: [
        {id: 1, text: 'SI'},
        {id: 0, text: 'NO'}
    ],
    fields: [
        {name: 'id', type: 'int'},
        {name: 'text', type: 'string'}
    ]
});


var storPanico = Ext.create('Ext.data.Store', {
    data: [
        {id: 1, text: 'Normal'},
        {id: 0, text: 'Pánico receptado'}
    ],
    fields: [
        {name: 'id', type: 'string'},
        {name: 'text', type: 'string'}
    ]
});










