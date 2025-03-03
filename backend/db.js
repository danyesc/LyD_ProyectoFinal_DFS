const { MongoClient } = require('mongodb'); // Importar la librería MongoClient
require('dotenv').config();  // Cargar las variables de entorno desde el archivo .env

// Obtener la URI de conexión desde el archivo .env
const uri = process.env.MONGODB_URI; // Asegúrate de usar la variable correcta

// Crear la conexión a la base de datos
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Conexión exitosa a MongoDB');
    const db = client.db(process.env.DB_NAME); // Seleccionamos la base de datos
    // Aquí puedes interactuar con la base de datos, como obtener colecciones o realizar consultas
  })
  .catch(err => {
    console.error('Error al conectar con la base de datos MongoDB:', err.message);
  });
