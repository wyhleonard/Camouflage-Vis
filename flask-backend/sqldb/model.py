# coding: utf-8
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class AmazonEmbedding(db.Model):
    __tablename__ = 'amazon_embedding'

    id = db.Column(db.Integer, primary_key=True)
    x = db.Column(db.Float)
    y = db.Column(db.Float)

class AmazonLabel(db.Model):
    __tablename__ = 'amazon_labels'

    id = db.Column(db.Integer, primary_key=True)
    gnn_label = db.Column(db.Integer)
    fcn_label = db.Column(db.Integer)
    ground_truth = db.Column(db.Integer)

class AmazonRelation0Datum(db.Model):
    __tablename__ = 'amazon_relation0_data'

    source = db.Column(db.Integer, primary_key=True, nullable=False)
    target = db.Column(db.Integer, primary_key=True, nullable=False)
    weight_source = db.Column(db.Integer, nullable=False)
    weight_target = db.Column(db.Integer, nullable=False)

class AmazonRelation1Datum(db.Model):
    __tablename__ = 'amazon_relation1_data'

    source = db.Column(db.Integer, primary_key=True, nullable=False)
    target = db.Column(db.Integer, primary_key=True, nullable=False)
    weight_source = db.Column(db.Integer, nullable=False)
    weight_target = db.Column(db.Integer, nullable=False)

class AmazonRelation2Datum(db.Model):
    __tablename__ = 'amazon_relation2_data'

    source = db.Column(db.Integer, primary_key=True, nullable=False)
    target = db.Column(db.Integer, primary_key=True, nullable=False)
    weight_source = db.Column(db.Integer, nullable=False)
    weight_target = db.Column(db.Integer, nullable=False)

class AmazonScore(db.Model):
    __tablename__ = 'amazon_scores'

    id = db.Column(db.Integer, primary_key=True)
    gnn_score0 = db.Column(db.Float)
    gnn_score1 = db.Column(db.Float)
    fcn_score0 = db.Column(db.Float)
    fcn_score1 = db.Column(db.Float)

class AmazonTrainTestSplit(db.Model):
    __tablename__ = 'amazon_train_test_split'

    id = db.Column(db.Integer, primary_key=True)
    is_train = db.Column(db.Integer)
