from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from models import db, Customer, Shipment, InventoryItem

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    # Counts
    total_customers = Customer.query.count()
    total_shipments = Shipment.query.count()
    
    # Inventory logic
    items = InventoryItem.query.all()
    total_inventory = sum(item.stock for item in items)
    low_stock_items = sum(1 for item in items if item.stock <= item.reorder_level)
    
    # Recent activity
    recent = Shipment.query.order_by(Shipment.created_at.desc()).limit(5).all()
    recent_shipments = [{
        'id': s.id,
        'hawb': s.hawb_number,
        'date': s.booking_date.isoformat() if s.booking_date else None,
        'status': s.status
    } for s in recent]

    return jsonify({
        'total_customers': total_customers,
        'active_shipments': total_shipments,
        'total_inventory': total_inventory,
        'low_stock_alerts': low_stock_items,
        'recent_shipments': recent_shipments
    }), 200
