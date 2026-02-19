import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
        "DATABASE_URL", "sqlite:////data/blog.db"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret-change-me")

    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)

    from .routes.blog import blog_bp

    app.register_blueprint(blog_bp, url_prefix="/api/blog")

    with app.app_context():
        db.create_all()

    return app
