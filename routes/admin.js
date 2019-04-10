const express = require('express');
const {ensureAuthenticated} = require('../helpers/auth');

const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/add-update => GET
router.get('/add-update', adminController.getAddUpdate);

// /admin/updates => GET
router.get('/updates', ensureAuthenticated,adminController.getUpdates);

// /admin/add-updates => POST
router.post('/add-update', adminController.postAddUpdate);

router.get('/edit-update/:updateId', adminController.getEditUpdate);

router.post('/edit-update', adminController.postEditUpdate);

router.post('/delete-update', adminController.postDeleteUpdate);

module.exports = router;
