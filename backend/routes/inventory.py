from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models import db, InventoryItem
from sqlalchemy import or_

inventory_bp = Blueprint('inventory', __name__)

@inventory_bp.route('/', methods=['GET'])
@jwt_required()
def get_inventory():
    search = request.args.get('search', '')
    query = InventoryItem.query
    if search:
        query = query.filter(or_(
            InventoryItem.name.ilike(f'%{search}%'),
            InventoryItem.sku.ilike(f'%{search}%')
        ))
    items = query.order_by(InventoryItem.created_at.desc()).all()
    return jsonify([i.to_dict() for i in items]), 200

@inventory_bp.route('/', methods=['POST'])
@jwt_required()
def create_inventory():
    data = request.get_json()
    
    if InventoryItem.query.filter_by(sku=data.get('sku')).first():
        return jsonify({"sku": ["An item with this SKU already exists."]}), 400

    item = InventoryItem(
        sku=data.get('sku'),
        name=data.get('name'),
        category=data.get('category', ''),
        stock=data.get('stock', 0),
        unit=data.get('unit', 'pcs'),
        reorder_level=data.get('reorder_level', 10),
        location=data.get('location', '')
    )
    db.session.add(item)
    db.session.commit()
    return jsonify(item.to_dict()), 201

@inventory_bp.route('/<int:id>/', methods=['GET'])
@jwt_required()
def get_item(id):
    item = InventoryItem.query.get_or_404(id)
    return jsonify(item.to_dict()), 200

@inventory_bp.route('/<int:id>/', methods=['PUT'])
@jwt_required()
def update_item(id):
    item = InventoryItem.query.get_or_404(id)
    data = request.get_json()
    
    for key, value in data.items():
        if hasattr(item, key):
            setattr(item, key, value)
            
    db.session.commit()
    return jsonify(item.to_dict()), 200

@inventory_bp.route('/<int:id>/', methods=['DELETE'])
@jwt_required()
def delete_item(id):
    item = InventoryItem.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return '', 204
