const express = require('express');
const {ensureAuthenticated} = require('../helpers/auth');

const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/add-update => GET
router.get('/add-update',ensureAuthenticated, adminController.getAddUpdate);

// /admin/updates => GET
router.get('/updates', ensureAuthenticated,adminController.getUpdates);

// /admin/add-updates => POST
router.post('/add-update', ensureAuthenticated,adminController.postAddUpdate);

router.get('/edit-update/:updateId', ensureAuthenticated,adminController.getEditUpdate);

router.post('/edit-update',ensureAuthenticated, adminController.postEditUpdate);

router.post('/delete-update',ensureAuthenticated, adminController.postDeleteUpdate);

module.exports = router;
