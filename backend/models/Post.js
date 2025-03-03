const mongoose = require('mongoose');

// Definición del esquema de publicación
const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String }, // URL o nombre del archivo de la imagen
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Relación con el modelo User
}, {
    timestamps: true // Agrega las fechas de creación y actualización automáticamente
});

// Crear y exportar el modelo de publicación
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
