const Update = require('../models/update');
const db = require('../util/db');
const nodemailer = require('nodemailer');
const sendGrid = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendGrid({
  auth:{
    api_key:'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'
  }
}));

exports.getAddUpdate = (req, res, next) => {
  var access_level = res.locals.user.access_level;
  res.render('admin/add-update', {
    title: 'Add Update',
    path: '/admin/add-update',
    editing: false,
    access_level : access_level
  });
};

exports.postAddUpdate = (req, res, next) => {
  const title = req.body.title;
  const level = req.body.level;
  const description = req.body.description;
  const expiry = req.body.expiry;
  Update.create({
    title: title,
    level: level,
    expiry: expiry,
    description: description
  })
  .then(result => {
    res.redirect('/admin/updates');
  })
  .catch(err => {
    console.log(err);
  });
};

exports.getEditUpdate = (req, res, next) => {
  const editMode = req.query.edit;
  var access_level = res.locals.user.access_level;
  if (!editMode) {
    return res.redirect('/');
  }
  const updateId = req.params.updateId;
  const title = "Editing"
  Update.findByPk(updateId)
    .then(update => {
    if (!update) {
      return res.redirect('/');
    }
    res.render('admin/edit-update', {
      pageTitle: 'Edit Update',
      path: '/admin/edit-update',
      editing: editMode,
      update: update,
      title : title,
      access_level: access_level
    });
  })
  .catch(err => console.log(err));
};

exports.postEditUpdate = (req, res, next) => {
  const updateId = req.body.id;
  const updatedTitle = req.body.title;
  const updatedLevel = req.body.level;
  const updatedExpiry = req.body.expiry;
  const updatedDesc = req.body.description;
  console.log(updateId,updatedTitle,updatedLevel,updatedExpiry,updatedDesc);
  Update.update(
    { 
      title: updatedTitle,
      description : updatedDesc,
      level : updatedLevel,
      expiry : updatedExpiry
    },
    { where: { id: updateId } }
   )
   .then(result =>{
    res.redirect('/admin/updates');
   })
   .catch(err=> console.log(err));
};

exports.getUpdates = (req, res, next) => {
  var access = res.locals.user.access;
  var access_level = res.locals.user.access_level;
  if(access == "root"){
    Update.findAll()
    .then(updates => {
      res.render('admin/updates', {
        updates: updates,
        title: 'Admin Updates',
        path: '/admin/updates'
      });
    })
    .catch(err => console.log(err));
  }else{
    Update.findAll({
      where: {
        level: access_level
      }
    })
    .then(updates => {
      res.render('admin/updates', {
        updates: updates,
        title: 'Admin Updates',
        path: '/admin/updates'
      });
    })
    .catch(err => console.log(err));
  }
};

exports.postDeleteUpdate = (req, res, next) => {
  const updateId = req.body.updateId;
  Update.findByPk(updateId)
    .then(update => {
      return update.destroy();
    })
    .then(result => {
      res.redirect('/admin/updates');
    })
    .catch(err => console.log(err));
};

exports.getComplaints = (req,res,next) =>{
  var access_level = res.locals.user.access_level;
  res.render('complaints/complaints', {
    title: 'View Complaints',
    path: '/admin/complaints',
    editing: false,
    access : access_level
  });
}
//generating SQL
function generateSql(branch) {
  var b = String(branch);
  var sql = 'SELECT * from '+b+'_complaints WHERE status="Unresolved";';
  return sql;
}

// cse
exports.getComplaintsCse = (req,res,next) =>{
  var sql = generateSql('cse');
  db.execute(sql)
  .then(([rows , fieldData]) =>{
    res.render('complaints/display', {
      rows: rows,
      title: 'CSE Complaints',
      path: '/admin/CseComplaints',
      branch:'cse'
    });
  })
  .catch(err=>{
    console.log(err);
  });
}
// ece
exports.getComplaintsEce = (req,res,next) =>{
  var sql = generateSql('ece');
  db.execute(sql)
  .then(([rows , fieldData]) =>{
    res.render('complaints/display', {
      rows: rows,
      title: 'ECE Complaints',
      path: '/admin/CseComplaints',
      branch:'ece'
    });
  })
  .catch(err=>{
    console.log(err);
  });
}
// eee
exports.getComplaintsEee = (req,res,next) =>{
  var sql = generateSql('eee');
  db.execute(sql)
  .then(([rows , fieldData]) =>{
    res.render('complaints/display', {
      rows: rows,
      title: 'EEE Complaints',
      path: '/admin/CseComplaints',
      barnch:'eee'
    });
  })
  .catch(err=>{
    console.log(err);
  });
}
// ce
exports.getComplaintsCe = (req,res,next) =>{
  var sql = generateSql('ce');
  db.execute(sql)
  .then(([rows , fieldData]) =>{
    res.render('complaints/display', {
      rows: rows,
      title: 'Civil Complaints',
      path: '/admin/CseComplaints',
      branch:'ce'
    });
  })
  .catch(err=>{
    console.log(err);
  });
}
// me
exports.getComplaintsMe = (req,res,next) =>{
  var sql = generateSql('me');
  db.execute(sql)
  .then(([rows , fieldData]) =>{
    res.render('complaints/display', {
      rows: rows,
      title: 'Mech Complaints',
      path: '/admin/CseComplaints',
      branch:'me'
    });
  })
  .catch(err=>{
    console.log(err);
  });
}

exports.postResolveComplaint = (req,res,next) => {
  const complaintId = req.body.complaintId;
  const branch = req.body.branch;
  const comments = req.body.comments;
  const email = req.body.email;
  var redirect = '/admin/complaints/'+String(branch);
  var html = '<h2>'+comments+'</h2>';
  var sql = 'UPDATE '+String(branch)+'_complaints set status = "Resolved" WHERE id='+complaintId;
  db.execute(sql)
  .then(result=>{
    res.redirect(redirect);
    return transporter.sendMail({
      to:email,
      from:'webmaster@college.edu.in',
      subject:'Issue resolved',
      html:html
    }).catch(err=> console.log(err));
  })
  .catch(err=>{
    console.log(err);
  });
}
