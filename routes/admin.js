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

router.get('/complaints',ensureAuthenticated,adminController.getComplaints);

// cse complaints
router.get('/complaints/cse',ensureAuthenticated,adminController.getComplaintsCse);
// ece complaints
router.get('/complaints/ece',ensureAuthenticated,adminController.getComplaintsEce);
// eee complaints
router.get('/complaints/eee',ensureAuthenticated,adminController.getComplaintsEee);
//civil
router.get('/complaints/ce',ensureAuthenticated,adminController.getComplaintsCe);
// mech
router.get('/complaints/me',ensureAuthenticated,adminController.getComplaintsMe);
//resolve complaint
router.post('/resolve-complaint',adminController.postResolveComplaint);

module.exports = router;
