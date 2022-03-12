from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
# 指定数据库连接还有库名
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:wyh980124@10.11.16.246:3306/data?charset=utf8'

# 指定配置，用来省略提交操作
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
CORS(app, supports_credentials=True)

db = SQLAlchemy()
db.init_app(app)

# 生成model的命令
# flask-sqlacodegen "mysql+pymysql://root:wyh980124@10.11.16.246/data" --outfile "model.py" --flask
