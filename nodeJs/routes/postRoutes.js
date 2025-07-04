const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/postController');

router.post('/', postCtrl.createPost);
router.get('/', postCtrl.getAllPosts);
router.get('/:id', postCtrl.getPostById);
router.put('/:id', postCtrl.updatePost);
router.delete('/:id', postCtrl.deletePost);

module.exports = router;
