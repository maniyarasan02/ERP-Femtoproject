from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Shipment, CartonDetail
import uuid
import string
import random
from datetime import datetime

shipments_bp = Blueprint('shipments', __name__)

def generate_hawb():
    num = ''.join(random.choices(string.digits, k=8))
    return f"FLSK{num}"

@shipments_bp.route('/', methods=['GET'])
@jwt_required()
def get_shipments():
    shipments = Shipment.query.order_by(Shipment.created_at.desc()).all()
    return jsonify([s.to_dict() for s in shipments]), 200

@shipments_bp.route('/', methods=['POST'])
@jwt_required()
def create_shipment():
    data = request.get_json()
    user_id = get_jwt_identity()

    # Create Shipment instance
    shipment = Shipment(
        hawb_number=generate_hawb(),
        created_by_id=user_id,
        
        # Shipper
        shipper_name=data.get('shipper_name', '').strip(),
        shipper_address=data.get('shipper_address', '').strip(),
        shipper_city=data.get('shipper_city', '').strip(),
        shipper_state=data.get('shipper_state', '').strip(),
        shipper_pincode=data.get('shipper_pincode', '').strip(),
        shipper_phone=data.get('shipper_phone', '').strip(),
        shipper_email=data.get('shipper_email', '').strip().lower(),
        shipper_gstin=data.get('shipper_gstin', '').strip(),

        # Receiver
        receiver_name=data.get('receiver_name', '').strip(),
        receiver_address=data.get('receiver_address', '').strip(),
        receiver_city=data.get('receiver_city', '').strip(),
        receiver_state=data.get('receiver_state', '').strip(),
        receiver_pincode=data.get('receiver_pincode', '').strip(),
        receiver_phone=data.get('receiver_phone', '').strip(),
        receiver_email=data.get('receiver_email', '').strip().lower(),
        receiver_gstin=data.get('receiver_gstin', '').strip(),

        # Info
        service_type=data.get('service_type', 'standard').strip(),
        transport_mode=data.get('transport_mode', 'surface').strip(),
        origin=data.get('origin', '').strip(),
        destination=data.get('destination', '').strip(),
        reference_number=data.get('reference_number', '').strip(),
        status=data.get('status', 'draft').strip(),

        # Weight
        total_actual_weight=float(data.get('total_actual_weight', 0) or 0),
        total_volumetric_weight=float(data.get('total_volumetric_weight', 0) or 0),
        chargeable_weight=float(data.get('chargeable_weight', 0) or 0),

        # Routing
        eway_bill_number=data.get('eway_bill_number', '').strip(),
        carrier_name=data.get('carrier_name', '').strip(),
        vehicle_number=data.get('vehicle_number', '').strip(),
        tracking_id=data.get('tracking_id', '').strip(),

        # Insurance
        is_insured=bool(data.get('is_insured', False)),
        declared_value=float(data.get('declared_value', 0) or 0)
    )

    # Convert booking string to date object
    if 'booking_date' in data:
        try:
            shipment.booking_date = datetime.strptime(data['booking_date'], "%Y-%m-%d").date()
        except ValueError:
            return jsonify({'booking_date': ['Date has wrong format. Use one of these formats instead: YYYY-MM-DD.']}), 400

    db.session.add(shipment)
    db.session.flush() # get shipment.id

    # Handle Nested Cartons
    cartons_data = data.get('cartons', [])
    for c_data in cartons_data:
        carton = CartonDetail(
            shipment_id=shipment.id,
            length=float(c_data.get('length', 0) or 0),
            width=float(c_data.get('width', 0) or 0),
            height=float(c_data.get('height', 0) or 0),
            quantity=int(c_data.get('quantity', 1) or 1),
            actual_weight=float(c_data.get('actual_weight', 0) or 0),
            volumetric_weight=float(c_data.get('volumetric_weight', 0) or 0)
        )
        db.session.add(carton)

    db.session.commit()
    return jsonify(shipment.to_dict()), 201

@shipments_bp.route('/search/', methods=['GET'])
@jwt_required()
def search_shipment():
    hawb = request.args.get('hawb', '').strip().upper()
    if not hawb:
        return jsonify({'error': 'HAWB number is required'}), 400
    shipment = Shipment.query.filter(
        Shipment.hawb_number.ilike(f'%{hawb}%')
    ).first()
    if not shipment:
        return jsonify({'error': f'No shipment found with HAWB: {hawb}'}), 404
    return jsonify(shipment.to_dict()), 200

@shipments_bp.route('/<int:id>/', methods=['GET'])
@jwt_required()
def get_shipment(id):
    shipment = Shipment.query.get_or_404(id)
    return jsonify(shipment.to_dict()), 200

@shipments_bp.route('/<int:id>/', methods=['PUT'])
@jwt_required()
def update_shipment(id):
    shipment = Shipment.query.get_or_404(id)
    data = request.get_json()
    allowed = ['draft', 'booked', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled']
    if 'status' in data:
        if data['status'] not in allowed:
            return jsonify({'error': 'Invalid status value'}), 400
        shipment.status = data['status']
    db.session.commit()
    return jsonify(shipment.to_dict()), 200

@shipments_bp.route('/<int:id>/', methods=['DELETE'])
@jwt_required()
def delete_shipment(id):
    shipment = Shipment.query.get_or_404(id)
    db.session.delete(shipment)
    db.session.commit()
    return '', 204
