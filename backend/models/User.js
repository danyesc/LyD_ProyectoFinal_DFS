const mongoose = require('mongoose');

// Definición del esquema de usuario
const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, {
    timestamps: true // Agrega las fechas de creación y actualización automáticamente
});

// Crear y exportar el modelo de usuario
const User = mongoose.model('User', userSchema);

module.exports = User;
