from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required
from models import db, User
from app import bcrypt

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register/', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    first_name = data.get('first_name', '').strip()
    last_name = data.get('last_name', '').strip()
    phone = data.get('phone', '').strip()
    
    # Simple formatting for name if only 'name' was provided
    if not first_name and data.get('name'):
        parts = data.get('name').strip().split(' ', 1)
        first_name = parts[0]
        last_name = parts[1] if len(parts) > 1 else ""

    if not email or not password or not first_name:
        return jsonify({"error": "Name, Email and password are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "This email is already registered."}), 400

    if not "@" in email or not "." in email:
        return jsonify({"error": "Please provide a valid email address."}), 400

    hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(
        first_name=first_name,
        last_name=last_name,
        email=email,
        username=email, # Use email as username for simplicity
        password=hashed_pw,
        phone=phone
    )
    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=str(new_user.id))
    refresh_token = create_refresh_token(identity=str(new_user.id))

    return jsonify({
        'message': 'Account created successfully.',
        'user': new_user.to_dict(),
        'access': access_token,
        'refresh': refresh_token
    }), 201


@auth_bp.route('/login/', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password."}), 401

    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    return jsonify({
        'message': 'Login successful.',
        'user': user.to_dict(),
        'access': access_token,
        'refresh': refresh_token
    }), 200


@auth_bp.route('/refresh/', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    new_access_token = create_access_token(identity=identity)
    return jsonify({
        'access': new_access_token
    }), 200


@auth_bp.route('/me/', methods=['GET'])
@jwt_required()
def me():
    identity = get_jwt_identity()
    user = User.query.get(identity)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict()), 200
