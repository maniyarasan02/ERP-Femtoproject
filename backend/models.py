from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
import uuid

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20), nullable=True)

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'full_name': self.full_name
        }


class Customer(db.Model):
    __tablename__ = 'customers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), default="")
    pincode = db.Column(db.String(20), default="")
    gstin = db.Column(db.String(50), default="")
    address = db.Column(db.Text, default="")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'city': self.city,
            'state': self.state,
            'pincode': self.pincode,
            'gstin': self.gstin,
            'address': self.address,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class Shipment(db.Model):
    __tablename__ = 'shipments'
    id = db.Column(db.Integer, primary_key=True)
    hawb_number = db.Column(db.String(50), unique=True, nullable=False)
    created_by_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)

    created_by = db.relationship('User', backref='shipments')

    # Shipper
    shipper_name = db.Column(db.String(255), nullable=False)
    shipper_address = db.Column(db.Text, default="")
    shipper_city = db.Column(db.String(100), default="")
    shipper_state = db.Column(db.String(100), default="")
    shipper_pincode = db.Column(db.String(20), default="")
    shipper_phone = db.Column(db.String(20), default="")
    shipper_email = db.Column(db.String(255), default="")
    shipper_gstin = db.Column(db.String(50), default="")

    # Receiver
    receiver_name = db.Column(db.String(255), nullable=False)
    receiver_address = db.Column(db.Text, default="")
    receiver_city = db.Column(db.String(100), default="")
    receiver_state = db.Column(db.String(100), default="")
    receiver_pincode = db.Column(db.String(20), default="")
    receiver_phone = db.Column(db.String(20), default="")
    receiver_email = db.Column(db.String(255), default="")
    receiver_gstin = db.Column(db.String(50), default="")

    # Shipment Info
    service_type = db.Column(db.String(50), default="standard")
    transport_mode = db.Column(db.String(50), default="surface")
    origin = db.Column(db.String(100), default="")
    destination = db.Column(db.String(100), default="")
    reference_number = db.Column(db.String(100), default="")
    booking_date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(50), default="draft")

    # Weight & Charges
    total_actual_weight = db.Column(db.Float, default=0.0)
    total_volumetric_weight = db.Column(db.Float, default=0.0)
    chargeable_weight = db.Column(db.Float, default=0.0)

    # E-Way & Carrier
    eway_bill_number = db.Column(db.String(100), default="")
    carrier_name = db.Column(db.String(255), default="")
    vehicle_number = db.Column(db.String(50), default="")
    tracking_id = db.Column(db.String(100), default="")

    # Insurance
    is_insured = db.Column(db.Boolean, default=False)
    declared_value = db.Column(db.Float, default=0.0)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    cartons = db.relationship('CartonDetail', backref='shipment', cascade="all, delete-orphan", lazy=True)

    def to_dict(self):
        created_by_name = ""
        if self.created_by:
            created_by_name = self.created_by.full_name or self.created_by.username

        # Format status string similar to Django's get_status_display
        status_display = self.status.replace('_', ' ').title()

        return {
            'id': self.id,
            'hawb_number': self.hawb_number,
            'created_by': self.created_by_id,
            'created_by_name': created_by_name,
            'shipper_name': self.shipper_name,
            'shipper_address': self.shipper_address,
            'shipper_city': self.shipper_city,
            'shipper_state': self.shipper_state,
            'shipper_pincode': self.shipper_pincode,
            'shipper_phone': self.shipper_phone,
            'shipper_email': self.shipper_email,
            'shipper_gstin': self.shipper_gstin,
            'receiver_name': self.receiver_name,
            'receiver_address': self.receiver_address,
            'receiver_city': self.receiver_city,
            'receiver_state': self.receiver_state,
            'receiver_pincode': self.receiver_pincode,
            'receiver_phone': self.receiver_phone,
            'receiver_email': self.receiver_email,
            'receiver_gstin': self.receiver_gstin,
            'service_type': self.service_type,
            'transport_mode': self.transport_mode,
            'origin': self.origin,
            'destination': self.destination,
            'reference_number': self.reference_number,
            'booking_date': self.booking_date.isoformat() if self.booking_date else None,
            'status': self.status,
            'status_display': status_display,
            'total_actual_weight': str(self.total_actual_weight),
            'total_volumetric_weight': str(self.total_volumetric_weight),
            'chargeable_weight': str(self.chargeable_weight),
            'eway_bill_number': self.eway_bill_number,
            'carrier_name': self.carrier_name,
            'vehicle_number': self.vehicle_number,
            'tracking_id': self.tracking_id,
            'is_insured': self.is_insured,
            'declared_value': str(self.declared_value),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'cartons': [c.to_dict() for c in self.cartons]
        }


class CartonDetail(db.Model):
    __tablename__ = 'carton_details'
    id = db.Column(db.Integer, primary_key=True)
    shipment_id = db.Column(db.Integer, db.ForeignKey('shipments.id'), nullable=False)
    length = db.Column(db.Float, default=0.0)
    width = db.Column(db.Float, default=0.0)
    height = db.Column(db.Float, default=0.0)
    quantity = db.Column(db.Integer, default=1)
    actual_weight = db.Column(db.Float, default=0.0)
    volumetric_weight = db.Column(db.Float, default=0.0)

    def to_dict(self):
        return {
            'id': self.id,
            'shipment': self.shipment_id,
            'length': str(self.length),
            'width': str(self.width),
            'height': str(self.height),
            'quantity': self.quantity,
            'actual_weight': str(self.actual_weight),
            'volumetric_weight': str(self.volumetric_weight)
        }


class InventoryItem(db.Model):
    __tablename__ = 'inventory_items'
    id = db.Column(db.Integer, primary_key=True)
    sku = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(100), default="")
    stock = db.Column(db.Integer, default=0)
    unit = db.Column(db.String(20), default="pcs")
    reorder_level = db.Column(db.Integer, default=10)
    location = db.Column(db.String(100), default="")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        stock_status = 'in_stock'
        if self.stock == 0:
            stock_status = 'out_of_stock'
        elif self.stock <= self.reorder_level:
            stock_status = 'low_stock'

        return {
            'id': self.id,
            'sku': self.sku,
            'name': self.name,
            'category': self.category,
            'stock': self.stock,
            'unit': self.unit,
            'reorder_level': self.reorder_level,
            'location': self.location,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'stock_status': stock_status
        }
