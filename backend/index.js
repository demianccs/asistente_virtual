const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const pool = require("./config/bd");

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // '*' allows any origin, you can specify specific origins as well
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

app.use('/asistente', require('./routes/asistente'));

const server = http.createServer(app);

const io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
    pingTimeout: 3000, 
    pingInterval: 5000
  });

const historialConversacion = {};

io.on('connection', (socket) => {
  console.log('Usuario conectado');

  socket.on('nuevo-usuario', (usuario) => {
    if (!historialConversacion[usuario]) {
      historialConversacion[usuario] = [];
    }
    
    socket.emit('historial-conversacion', historialConversacion[usuario]);
  });

  socket.on('nuevo-mensaje', async (data) => {
    const { usuario, mensaje, tabla } = data;

    // console.log(usuario, mensaje, tabla );
    var respuestaAsistente
    if(!tabla){
      // respuestaAsistente = 'Proximamente implementaremos nuevas funciones, Por favor seleccion una opcion'
      respuestaAsistente = await obtenerRespuestaInput(mensaje, usuario, tabla);
    }
    else{
      respuestaAsistente = await obtenerRespuestaAsistente(mensaje, usuario, tabla);
    }    
    
    // console.log(respuestaAsistente)    

    // historialConversacion[usuario].push({ usuario: 'DOC', respuesta: respuestaAsistente });
    // historialConversacion[usuario].push({ usuario: usuario, respuesta: mensaje });
    

    socket.emit('respuesta-asistente', { usuario: 'DOC', respuesta: respuestaAsistente });
    socket.emit('respuesta-usuario', { usuario: 'DOC', respuesta: respuestaAsistente });
    // console.log(historialConversacion)
    
  });

  socket.on('borrar-historial', (usuario) => {
    
    
    if (historialConversacion[usuario]) {
      historialConversacion[usuario] = [];

      const respuestaVacia = '';
      
      // Envia una respuesta vacía al cliente para borrar el historial del asistente
      socket.emit('respuesta-asistente', { usuario: 'DOC', respuesta: respuestaVacia });
      socket.emit('historial-conversacion', historialConversacion[usuario]);
      
    }
  });

  socket.on('disconnect', () => {
    const usuarioDesconectado = Object.keys(socket.rooms)[1];

    delete historialConversacion[usuarioDesconectado];

    if (historialConversacion[usuarioDesconectado]) {
      delete historialConversacion[usuarioDesconectado];
    }

    console.log('Usuario desconectado');
    
  });
});

// Función para obtener una respuesta del asistente (simulada)
async function obtenerRespuestaAsistente(mensaje, usuario, tabla) {  
  var resp = '';
  resp = await consultarBaseDeDatos(mensaje, usuario, tabla);
  return resp;
}

// Funcion de conexion a bd Asistente
async function consultarBaseDeDatos(mensaje, usuario, tabla) {
  // console.log("SELECT * FROM "+tabla+" WHERE id_primero="+mensaje+"")
  var opciones_tabla = ''
  if(tabla=='segundo'){opciones_tabla='opciones_primero'}
  else if(tabla=='tercero'){opciones_tabla='opciones_segundo'}
  else if(tabla=='cuarto'){opciones_tabla='opciones_tercero'}
  try {
  const consultaSql = "SELECT * FROM "+tabla+" WHERE "+opciones_tabla+"='"+mensaje+"'"; 
  const [rows] = await pool.promise().query(consultaSql);
  var resultadoConsulta = rows;
  return resultadoConsulta;
  
  } catch (error) {
      // console.error('Error al realizar la consulta:', error);
      return 'Proximamente implementaremos nuevas funciones, Por favor seleccion una opcion';
  }    
}

// Funcion de conexion a bd Asistente Input
async function obtenerRespuestaInput(mensaje) {
  const subcadenas = mensaje.split(' ');
  const subcadenasConComillas = subcadenas.map(subcadena => `"${subcadena}"`);
  // console.log("SELECT * FROM input WHERE palabras in ("+subcadenasConComillas+")")
  try {
  const consultaSql = "SELECT * FROM input WHERE palabras in ("+subcadenasConComillas+") AND estado=1"; 
  const [rows] = await pool.promise().query(consultaSql);
  var resultadoConsulta = rows;
  if (resultadoConsulta.length==0){resultadoConsulta='Proximamente implementaremos nuevas funciones, Por favor seleccion una opcion'}
  return resultadoConsulta;
  
  } catch (error) {
      // console.error('Error al realizar la consulta:', error);
      return 'Proximamente implementaremos nuevas funciones, Por favor seleccion una opcion';
  }    
}


const port = process.env.PORT || 3200;

server.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
