/**
 * BlogController
 *
 * @description :: Server-side logic for managing blogs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  list: function (req, res) {
    // Getting params
    var page = (req.param('page') && !isNaN(req.param('page'))) ? req.param('page') : 1;
    var limit = (req.param('limit') && !isNaN(req.param('limit'))) ? req.param('limit') : 20;
    var sortby = req.param('sortby') || 'createdAt';
    var sortdir = (req.param('sortdir')
    && ['ASC', 'DESC'].indexOf(req.param('sortdir').toUpperCase()) !== -1) ? req.param('sortdir').toUpperCase() : 'ASC';

    Blog.count({}, (err, count) => {
      Blog.find({limit: 20, skip: (page - 1) * limit}, (err, blogs) => {
        if (err) {
          res.badRequest(err);
          return;
        }
        res.json({
          count : count,
          blogs : blogs
        });
      })
    });
  },
  create: function (req, res) {
    var blog = _.pick(req.body,['title','text']);
    if (!blog.title || !blog.text) {
      res.badRequest('Missing params (title && text) are mandatory.');
      return;
    }
    Blog.create(blog,(err,blog) => {
      if (err) {
        res.serverError(err);
        return;
      }
      res.json(blog);
    });
  },
  deleteAll : function (req, res) {
    Blog.destroy({},(err, blogs) => {
       if (err) {
         res.serverError(err);
         return;
       }
       res.json(blogs);
    });
  }
};

