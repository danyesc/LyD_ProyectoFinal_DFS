const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Post = require('../models/Post');  // Modelo de MongoDB
const authenticateToken = require('../middleware/auth');

// Asegurar que el directorio 'uploads' exista
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configuración de Multer para la subida de imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
            return cb(new Error('Solo se permiten imágenes (.jpg, .jpeg, .png)'));
        }
        cb(null, true);
    },
});

// Obtener publicaciones
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;

    try {
        const posts = await Post.find()
            .skip(offset)
            .limit(limit)
            .populate('user_id', 'nombre') // Esto reemplaza el JOIN con MongoDB
            .exec();

        res.json({ page, limit, results: posts });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear una nueva publicación (protegida con JWT)
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
    if (req.fileValidationError) {
        return res.status(400).json({ error: req.fileValidationError });
    }

    const { title, content, location } = req.body;
    const user_id = req.user.id; // Se obtiene del token

    const image = req.file ? req.file.filename : null;

    try {
        const newPost = new Post({
            title,
            content,
            location,
            user_id,
            image,
        });

        const savedPost = await newPost.save();

        const imageUrl = image ? `/uploads/${image}` : null;
        res.status(201).json({ message: 'Post created', id: savedPost._id, imageUrl });
    } catch (err) {
        console.error('Error creando publicación:', err);
        res.status(500).json({ error: err.message });
    }
});

// Eliminar una publicación (protegida con JWT)
router.delete('/:id', authenticateToken, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id; // Se obtiene del token

    try {
        const post = await Post.findOneAndDelete({ _id: postId, user_id: userId });

        if (!post) {
            return res.status(404).json({ error: "Publicación no encontrada o no tienes permiso para eliminarla" });
        }

        res.status(200).json({ message: "Publicación eliminada exitosamente" });
    } catch (err) {
        console.error("Error al eliminar publicación:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
module.exports.upload = upload;
