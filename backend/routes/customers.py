from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models import db, Customer
from sqlalchemy import or_

customers_bp = Blueprint('customers', __name__)

@customers_bp.route('/', methods=['GET'])
@jwt_required()
def get_customers():
    search = request.args.get('search', '')
    query = Customer.query
    if search:
        query = query.filter(or_(
            Customer.name.ilike(f'%{search}%'),
            Customer.city.ilike(f'%{search}%')
        ))
    customers = query.order_by(Customer.created_at.desc()).all()
    return jsonify([c.to_dict() for c in customers]), 200

@customers_bp.route('/', methods=['POST'])
@jwt_required()
def create_customer():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    email = data.get('email', '').strip().lower()
    name = data.get('name', '').strip()
    
    if not email or not name:
        return jsonify({"error": "Name and Email are required"}), 400

    if Customer.query.filter_by(email=email).first():
        return jsonify({"error": "A customer with this email already exists."}), 400

    customer = Customer(
        name=name,
        email=email,
        phone=data.get('phone', '').strip(),
        city=data.get('city', '').strip(),
        state=data.get('state', '').strip(),
        pincode=data.get('pincode', '').strip(),
        gstin=data.get('gstin', '').strip(),
        address=data.get('address', '').strip()
    )
    db.session.add(customer)
    db.session.commit()
    return jsonify(customer.to_dict()), 201

@customers_bp.route('/<int:id>/', methods=['GET'])
@jwt_required()
def get_customer(id):
    customer = Customer.query.get_or_404(id)
    return jsonify(customer.to_dict()), 200

@customers_bp.route('/<int:id>/', methods=['PUT'])
@jwt_required()
def update_customer(id):
    customer = Customer.query.get_or_404(id)
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    for key, value in data.items():
        if hasattr(customer, key):
            if isinstance(value, str):
                value = value.strip()
            setattr(customer, key, value)
            
    db.session.commit()
    return jsonify(customer.to_dict()), 200

@customers_bp.route('/<int:id>/', methods=['DELETE'])
@jwt_required()
def delete_customer(id):
    customer = Customer.query.get_or_404(id)
    db.session.delete(customer)
    db.session.commit()
    return '', 204
