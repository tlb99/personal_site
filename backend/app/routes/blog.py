from flask import Blueprint, jsonify, request
from slugify import slugify
from .. import db
from ..models import BlogPost

blog_bp = Blueprint("blog", __name__)


@blog_bp.route("/", methods=["GET"])
def list_posts():
    published_only = request.args.get("published", "true").lower() == "true"
    query = BlogPost.query
    if published_only:
        query = query.filter_by(published=True)
    posts = query.order_by(BlogPost.created_at.desc()).all()
    return jsonify([p.to_dict(include_content=False) for p in posts])


@blog_bp.route("/<slug>", methods=["GET"])
def get_post(slug):
    post = BlogPost.query.filter_by(slug=slug).first_or_404()
    return jsonify(post.to_dict())


@blog_bp.route("/", methods=["POST"])
def create_post():
    data = request.get_json()
    if not data or not data.get("title") or not data.get("content"):
        return jsonify({"error": "title and content are required"}), 400

    slug = data.get("slug") or slugify(data["title"])
    # Ensure uniqueness
    base_slug = slug
    counter = 1
    while BlogPost.query.filter_by(slug=slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    post = BlogPost(
        title=data["title"],
        slug=slug,
        summary=data.get("summary", ""),
        content=data["content"],
        published=data.get("published", False),
    )
    db.session.add(post)
    db.session.commit()
    return jsonify(post.to_dict()), 201


@blog_bp.route("/<int:post_id>", methods=["PUT"])
def update_post(post_id):
    post = BlogPost.query.get_or_404(post_id)
    data = request.get_json()
    if not data:
        return jsonify({"error": "no data provided"}), 400

    if "title" in data:
        post.title = data["title"]
    if "slug" in data:
        post.slug = data["slug"]
    if "summary" in data:
        post.summary = data["summary"]
    if "content" in data:
        post.content = data["content"]
    if "published" in data:
        post.published = data["published"]

    db.session.commit()
    return jsonify(post.to_dict())


@blog_bp.route("/<int:post_id>", methods=["DELETE"])
def delete_post(post_id):
    post = BlogPost.query.get_or_404(post_id)
    db.session.delete(post)
    db.session.commit()
    return jsonify({"message": "deleted"}), 200
