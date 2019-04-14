const Update = require('../models/update');

exports.getAddUpdate = (req, res, next) => {
  var access_level = res.locals.user.access_level;
  res.render('admin/add-update', {
    title: 'Add Product',
    path: '/admin/add-product',
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
    console.log('Created Product');
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
      console.log('DESTROYED Update');
      res.redirect('/admin/updates');
    })
    .catch(err => console.log(err));
};
