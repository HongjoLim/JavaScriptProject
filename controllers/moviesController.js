const Movie = require('../models/movie');

exports.new = (req, res) => {
    req.isAuthenticated();

    res.render('movies/new', {
      title: `New Movie Post`
    });
};

exports.create = async (req, res) => {
  if(!req.isAuthenticated()) 
    return res.status(401).send({error: "Not Authenticated"});

  // Add the current author to the movie
  req.body.movie.author = req.session.userId;

  Movie.create(req.body.movie)
    .then(() => res.status(200).send({success: "Movie created"}))
    .catch(err => res.status(404).send(err));
};

exports.index = (req, res) => {
  Movie.find()
  .populate('author')
  .then(movies => res.json(movies))
  .catch(err => res.status(404).json(error));
}

exports.show = (req, res) => {
  Movie.findOne({
    _id: req.params.id
  })
  .populate("author")
  .then(movie => res.json(movie))
  .catch(err => res.status(404).json(err));
};

// exports.drafts = (req, res) => {
//   req.isAuthenticated();
//     Movie.find({
//       author: req.session.userId
//     }).drafts()
//     .populate('author')
//       .then(drafts => {
//         res.render('movies/index', {
//           movies: drafts,
//           title: 'Drafts'
//         });
//       })
//       .catch(err => {
//         req.flash('error', `ERROR ${err}`);
//         res.redirect('/');
//       });
//   }
  
  
// exports.published = (req, res) => {
//   req.isAuthenticated();
//     Movie.find(({
//       author: req.session.userId
//     })).published()
//     .populate('author')
//       .then(published => {
//         res.render('movies/index', {
//           movies: published,
//           title: 'Published'
//         });
//       })
//       .catch(err => {
//         req.flash('error', `ERROR ${err}`);
//         res.redirect('/');
//       });
//   }

exports.edit = (req, res) => {
  if(!req.isAuthenticated()) 
    return res.status(401).send({error: "Not Authenticated"});

  Movie.findOne({
      _id: req.params.id,
      author: req.session.userId
    })
    .then(movie => res.send(movie))
    .catch(err => res.status(404).sned(err));
};

exports.update = (req, res) => {
  req.isAuthenticated();
  if(!req.isAuthenticated()) 
    return res.status(401).send({error: "Not Authenticated"});

  Movie.updateOne({
      _id: req.body.id,
      author: req.session.userId
    }, req.body.movie, {
      runValidators: true
    })
    .then(() => res.status(200).send({success: "Movie updated successfully"}))
    .catch(err => res.status(404).send(err));
};

exports.destroy = (req, res) => {
  if(!req.isAuthenticated()) 
    return res.status(401).send({error: "Not Authenticated"});


  Movie.deleteOne({
      _id: req.body.id,
      author: req.session.userId
    })
    .then(() => res.status(200).send({success: "Movie deleted successfully"}))
    .catch(err => res.status(404).send(err));
};