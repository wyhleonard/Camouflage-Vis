# coding: utf-8
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class AmazonEmbedding(db.Model):
    __tablename__ = 'amazon_embedding'

    id = db.Column(db.Integer, primary_key=True)
    x = db.Column(db.Float)
    y = db.Column(db.Float)

class AmazonFeature(db.Model):
    __tablename__ = 'amazon_features'

    id = db.Column(db.Integer, primary_key=True)
    f2 = db.Column(db.Float)
    f3 = db.Column(db.Float)
    f4 = db.Column(db.Float)
    f5 = db.Column(db.Float)
    f6 = db.Column(db.Float)
    f7 = db.Column(db.Float)
    f8 = db.Column(db.Float)
    f9 = db.Column(db.Float)
    f10 = db.Column(db.Float)
    f11 = db.Column(db.Float)
    f12 = db.Column(db.Float)
    f13 = db.Column(db.Float)
    f14 = db.Column(db.Float)
    f15 = db.Column(db.Float)
    f16 = db.Column(db.Float)
    f17 = db.Column(db.Float)
    f18 = db.Column(db.Float)
    f19 = db.Column(db.Float)
    f20 = db.Column(db.Float)
    f21 = db.Column(db.Float)
    f22 = db.Column(db.Float)
    f23 = db.Column(db.Float)
    f24 = db.Column(db.Float)
    f25 = db.Column(db.Float)
    f26 = db.Column(db.Float)

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
