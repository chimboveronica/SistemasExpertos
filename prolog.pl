test():-write(B).

escribir_saludo(Hour) :-
   Hour >= 0, Hour < 7, !, write('¡Buenas noches - madrugadas!');
   Hour >= 7, Hour =< 12, !, write('¡Buenos días!');
   Hour > 12, Hour < 20, !, write('¡Buenas tardes!');
   write('¡Buenas noches!').

     
  escribir_hora_y_fecha(Hour,Minute,Second,Day,Month,Year) :-
   write(' ¡Son las  '),
   (
   Hour =< 9, !, write('0'), write(Hour);
   write(Hour)
   ),
   write(':'),
   (
   Minute =< 9, !, write('0'), write(Minute);
   write(Minute)
   ),
   write(':'),
   (
   Second =< 9, !, write('0'), write(Second);
   write(Second)
   ),
   write(' horas !  ¡del día  '),
   write(Day), write(' de '),
   calcular_mes(Month),
   write(' del año '), write(Year),write('!').
   
   calcular_mes(Month) :-
   Month =:= 1, !, write('enero');
   Month =:= 2, !, write('febrero');
   Month =:= 3, !, write('marzo');
   Month =:= 4, !, write('abril');
   Month =:= 5, !, write('mayo');
   Month =:= 6, !, write('junio');
   Month =:= 7, !, write('julio');
   Month =:= 8, !, write('agosto');
   Month =:= 9, !, write('septiembre');
   Month =:= 10, !, write('octubre');
   Month =:= 11, !, write('noviembre');
   Month =:= 12, write('diciembre').
   
dimelahora :-
   get_time(X),
   convert_time(X,Year,Month,Day,Hour,Minute,Second,_),
    escribir_saludo(Hour),
     escribir_hora_y_fecha(Hour,Minute,Second,Day,Month,Year).

preguntar(Pregunta):-
    Pregunta==dimelahora, !, dimelahora;
    Pregunta == quediaestamoshoy, !,write('El cordinador de la carrera es el Ingeniero Roberto Jácome');
    Pregunta == cualeselcoordinadordelacarreradesistemas, !,write('El cordinador de la carrera de Sistemas es el Ingeniero Roberto Jácome');
    Pregunta == cualeslasecretariadelacarrera,!,write('La secretaria de la Carrera es la Licenciada Elisíta');
    Pregunta == cualeslafechadenacimientodediego, !,write('La fecha de nacimiento de diego es el: 29 de Enero del 1989');
    Pregunta == cuandoeselcumpleaniosdediego, !,write('El cumpleaños de Diego es el: 29 de Enero del 1989');
    Pregunta == cualeslafechadenacimientodevero,!,write('La fecha de nacimiento de Vero es el: 11 de Agosto del 1991');
    Pregunta == cuandoeselcumpleaniosdevero,!,write('El cumpleaños de Vero es el: 11 de Agosto del 1991');
    Pregunta == cualeslafechadenacimientodejinsop, !,write('La fecha de nacimiento de Jinsop es el: 2 de abril del 1991');
    Pregunta == cuandoeselcumpleaniosdejinsop, !,write('El cumpleaños de Jinsop es el: 2 de abril');
    Pregunta == cualeslaedaddediego, !,write('La edad de Diego es: 24');
    Pregunta == cualeslaedaddediego, !,write('La edad de Diego es: 24');
    Pregunta == cualeslaedaddevero,!,write('La edad de Vero es: 23');
    Pregunta == cualeslaedaddejinsop, !,write('La edad de Jinsop es: 23');
    Pregunta == cualesladirecciondediego, !,write('La Direccion de Diego es: Barrio Belen');
    Pregunta == dondevivediego, !,write('La Direccion de Diego es: Barrio Belen');
    Pregunta == cualesladirecciondejinsop,!,write('La dirección de Jinsop es: Barrio Tierras Coloradas');
    Pregunta == dondevivejinsop,!,write('La dirección de Jinsop es: Barrio Tierras Coloradas');
    Pregunta == cualesladirecciondevero, !, write('La direccion de Vero es: Barrio Consacola');
    Pregunta == dondevivevero, !, write('La direccion de Vero es: Barrio Consacola');
    Pregunta == cualessonlosingredientesdelacubalibre, !,write('Los ingredientes de la cubalibre son: '), write('Ron,cocacola,limon,hielo');
    Pregunta == cualessonlosingredientesdeelpadrino, !, write('Los ingredientes del padrino son: '),write('whisky,crema de cacao, hielo');
    Pregunta == cualessonlosingredientesdelamichelada, !, write('Los ingredientes de la michelada son: '),write('cerveza, sal, limon, pimienta, cubomaggy');
    Pregunta == cualessonlosingredientesdeltequila, !, write('Los ingredientes de la tequila son: '),write('tequila, cocacola, limon');
    Pregunta == cualessonlosingredientesdelsubmarino, !, write('Los ingredientes del submarino son: '),write('ron, cerveza, sal, limon');
    Pregunta == cualessonlosingredientesdelsaltamontes, !, write('Los ingredientes del saltamontes son: '),write('cremadementa, cacao, lechevaporada, vodka, hielo');
    Pregunta == cualessonlosingredientesdelcamaleon, !, write('Los ingredientes del camaleon son: '),write('ron, curasao, jugodenaranja, hielo');
    Pregunta == cualeseldocentedeinteligenciaartificial, !,write('El ingeniero Harman Torres es el docente de Inteligencia Artificial.');
    Pregunta == cualeseldocentedetrabajosdetitulacion, !,write('El ingeniero Mario Palma es el docente de trabajos de titulacion.');
    Pregunta == cualeseldocentedesistemasexpertos, !,write('El ingeniero Roberto Jacome es el docente de sistemas expertos');
    Pregunta == cualeseldocentedeeticaprofesional, !,write('El Doctor Luis Paz');
    Pregunta == cualeseldocentedesimulacion, !,write('El ingeniero Roberto Jacome es el docente de Simulacion');
    Pregunta == cualeseldocentedecontrolautomatizado, !,write('El Ingeniero Franco Salcedo es el docente de Control Automatico');
    Pregunta == comosellamalasenioradelbar, !,write('La señora del Bar se llama Bachita');
    Pregunta == quediastengointeligenciaartificial, !,write('Inteligencia artificial tienes los dias: Lunes de 7:30 hasta las 10:30 y el martes de 10:30 hasta las 13:30');
    Pregunta == quediastengotrabajodetitulcion, !,write('Trabajo de titulacion tienes los dias: Lunes de 10:30 hasta las 13:30 , el miercoles de 7:30 hasta las 10:30 y el viernes de 9:30 hasta las 13:30');
    Pregunta == quediastengosistemasexpertos, !,write('Sistemas expertos solo tienes el dia: Martes de 7:30 hasta las 10:30 ');
    Pregunta == quediastengoeticaprofesional, !,write('Etcia Profecional solo tienes el dia Miercoles de 10:30 hasta las 12:30');
    Pregunta == quediastengocontrolautomatizado, !,write('Control Automatizado solo tienes el dia: Viernes de 7:30 hasta las 9:30');
    Pregunta == puedofaltar, !,write('No puedes porque ya se termina el tiempo ');
    Pregunta == comomellamo, !,write('No encuentro tu nombre en la Base de Conocimientos ');
    Pregunta == quieneres, !,write('Soy tu asistente Personal de la Base de Conocimientos ');
    Pregunta == dondevives, !,write('Aqui estoy y aqui estare');
    Pregunta == comotellamas, !,write('Me llamo D.V.J');
    Pregunta == cualestunombre, !,write('Mi nombre es D.V.J');
    Pregunta == estasbien, !,write('Mejor que nunca');
    Pregunta == quientecreo, !,write('Mis creadores fueron veronica, diego y jinsop.');
    Pregunta == cuantosaniostienes, !,write('Tengo 3 dias de existencia.');
    Pregunta == cualestuedad, !,write('Tengo 3 dias de existencia.');
    Pregunta == cuantoscantonestienelaciudaddeloja, !,write('La ciudad de Loja tiene 16 cantones ');
    Pregunta == cualeslacapitaldelecuador, !,write('la capital del Ecuador es Quito.');
    Pregunta == enquepaisestoy, !,write('Estas en el País: Ecuador.');
    Pregunta == enqueciudadestoy, !,write('Estas en la Ciudad: Loja.');
    Pregunta == endondeestoy, !,write('Al sur de Loja exactamente en la Universidad Nacional de Loja.');
    Pregunta == sabesprogramar, !,write('creo saber lo suficiente jaba,p h p, c++, python y ultimamente prolog');
    Pregunta == cuandoeseldiadelpadre, !,write('Por lo general es el tercer domingo del mes de junio el dia del padre');
    Pregunta == cuandoeseldiadelamadre, !,write('Por lo genral es la segunda semana del mes de mayo el dia de la madre');
    Pregunta == cuandoeseldiadelabanderadeloja, !,write('El dia de la bandera de loja es el 26 de Septiembre');
    Pregunta == cuandoeseldiadelescudodeloja, !,write('El dia del escudo de loja es el 11 de noviembre');
    Pregunta == cuandoeseldiadelmaestrodeloja, !,write('El dia del maestro es el 13 de abril');
    Pregunta == cuandoeslaindependenciadeloja, !,write('La independencia de loja es el 18 de noviembre');
    Pregunta == cuandoeslafundaciondeloja, !,write('La fundación de loja es el 8 de diciembre');
    Pregunta == cuandoeseldiadelninio, !,write('El dia del niño por lo general es la primera semana de junio');
    Pregunta == cuandoeseldiadelninio, !,write('El dia del niño por lo general es la primera semana de junio');
    Pregunta == comoestas, !,write('Mejor que nunca Gracias');
    write('¡Por ahora no tengo informacion de tu pregunta....!'), write('Me puedes hacer otra pregunta....?').