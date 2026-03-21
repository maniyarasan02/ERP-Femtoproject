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
        shipper_name=data.get('shipper_name'),
        shipper_address=data.get('shipper_address', ''),
        shipper_city=data.get('shipper_city', ''),
        shipper_state=data.get('shipper_state', ''),
        shipper_pincode=data.get('shipper_pincode', ''),
        shipper_phone=data.get('shipper_phone', ''),
        shipper_email=data.get('shipper_email', ''),
        shipper_gstin=data.get('shipper_gstin', ''),

        # Receiver
        receiver_name=data.get('receiver_name'),
        receiver_address=data.get('receiver_address', ''),
        receiver_city=data.get('receiver_city', ''),
        receiver_state=data.get('receiver_state', ''),
        receiver_pincode=data.get('receiver_pincode', ''),
        receiver_phone=data.get('receiver_phone', ''),
        receiver_email=data.get('receiver_email', ''),
        receiver_gstin=data.get('receiver_gstin', ''),

        # Info
        service_type=data.get('service_type', 'standard'),
        transport_mode=data.get('transport_mode', 'surface'),
        origin=data.get('origin', ''),
        destination=data.get('destination', ''),
        reference_number=data.get('reference_number', ''),
        status=data.get('status', 'draft'),

        # Weight
        total_actual_weight=float(data.get('total_actual_weight', 0) or 0),
        total_volumetric_weight=float(data.get('total_volumetric_weight', 0) or 0),
        chargeable_weight=float(data.get('chargeable_weight', 0) or 0),

        # Routing
        eway_bill_number=data.get('eway_bill_number', ''),
        carrier_name=data.get('carrier_name', ''),
        vehicle_number=data.get('vehicle_number', ''),
        tracking_id=data.get('tracking_id', ''),

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

@shipments_bp.route('/<int:id>/', methods=['GET'])
@jwt_required()
def get_shipment(id):
    shipment = Shipment.query.get_or_404(id)
    return jsonify(shipment.to_dict()), 200

@shipments_bp.route('/<int:id>/', methods=['DELETE'])
@jwt_required()
def delete_shipment(id):
    shipment = Shipment.query.get_or_404(id)
    db.session.delete(shipment)
    db.session.commit()
    return '', 204
