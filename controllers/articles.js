var config = require('../config/configuration');
var mongoose = require("mongoose");
mongoose.connect(config.database);
mongoose.model('articles', require('../models/article').articles);

module.exports = {

	routes: {
		'articles': {
			'url': '/cms/articles',
			'method': 'get'
		},
		'create': {
			'url': '/cms/articles/create',
			'method': 'get'
		},
		'saveNew': {
			'url': '/cms/articles/create',
			'method': 'post'
		},
		'update': {
			'url': '/cms/articles/update/:id',
			'method': 'get'
		},
		'saveUpdate': {
			'url': '/cms/articles/update/:id',
			'method': 'post'
		}
	},
	
	articles: function(req, res){
		var articles = mongoose.model('articles');
		articles.find({}, function(err, docs){
			var live = [];
			var draft = []
			docs.forEach(function(record){
				if (record.doc.state == 0){
					draft.push(record.doc);
				} else {
					live.push(record.doc);
				}
			});
			res.partial('articles/articles', {
				locals: {
					live: live,
					draft: draft
				}
			});
		});
	},
	
	create: function(req, res){
		res.partial('articles/create');
	},
	
	saveNew: function(req, res){
		var articles = mongoose.model('articles');
		var article = new articles({
			title: req.body.title,
			body: req.body.body,
			state: req.body.state
		});
		article.save();
		articles.find({}, function(err, docs){
			var live = [];
			var draft = []
			docs.forEach(function(record){
				if (record.doc.state == 0){
					draft.push(record.doc);
				} else {
					live.push(record.doc);
				}
			});
			res.partial('articles/articles', {
				locals: {
					live: live,
					draft: draft,
					created: true
				}
			});
		});
	},
	
	update: function(req, res){
		var articles = mongoose.model('articles');
		articles.find({
			_id: req.params.id
		}, function(err, docs){
			res.partial('articles/update', {
				locals: {
					article: docs[0].doc
				}
			});
		});
	},
	
	saveUpdate: function(req, res){
		var articles = mongoose.model('articles');
		var match = {
			_id: req.params.id
		};
		articles.findById(req.params.id, function (err, article){
			article.body = req.body.body;
			article.title = req.body.title;
			article.state = req.body.state;
			article.save();
			articles.find(match, function(err, docs){
				res.partial('articles/update', {
					locals: {
						article: docs[0].doc
					}
				});
			});
		});
	}
	
};