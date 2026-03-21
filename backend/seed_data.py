from app import create_app, bcrypt
from models import db, User, Customer, InventoryItem

app = create_app()

def seed_database():
    with app.app_context():
        # Clean existing data
        db.drop_all()
        db.create_all()

        print("Seeding database...")

        # 1. Create Admin User
        hashed_pw = bcrypt.generate_password_hash("admin123").decode('utf-8')
        admin = User(
            first_name="System",
            last_name="Admin",
            email="admin@erp.com",
            username="admin@erp.com",
            password=hashed_pw,
        )
        db.session.add(admin)

        # 2. Customers
        customers = [
            Customer(name="Acme Corp", email="contact@acme.com", phone="9876543210", city="Mumbai", state="Maharashtra", pincode="400001", gstin="27AADCB2230M1Z2"),
            Customer(name="TechLogistics", email="info@techlogistics.in", phone="9876543211", city="Bangalore", state="Karnataka", pincode="560001", gstin="29BBDCB2230M1Z3"),
            Customer(name="Global Exports", email="sales@globalexports.com", phone="9876543212", city="Delhi", state="Delhi", pincode="110001", gstin="07CCDCB2230M1Z4"),
            Customer(name="Southern Spices", email="orders@southernspices.in", phone="9876543213", city="Chennai", state="Tamil Nadu", pincode="600001", gstin="33DDDCB2230M1Z5"),
            Customer(name="Western Textiles", email="supply@westerntextiles.com", phone="9876543214", city="Ahmedabad", state="Gujarat", pincode="380001", gstin="24EEEDCB2230M1Z6"),
            Customer(name="Highland Tea Estate", email="logistics@highlandtea.in", phone="9876543215", city="Kolkata", state="West Bengal", pincode="700001", gstin="19FFDCB2230M1Z7"),
        ]
        db.session.add_all(customers)

        # 3. Inventory Items
        inventory = [
            InventoryItem(sku="PBOX-L", name="Premium Corrugated Box Large", category="Packaging", stock=500, unit="pcs", reorder_level=100, location="Warehouse A, Rack 12"),
            InventoryItem(sku="PBOX-M", name="Premium Corrugated Box Medium", category="Packaging", stock=1200, unit="pcs", reorder_level=200, location="Warehouse A, Rack 13"),
            InventoryItem(sku="BUBBLE-50", name="Bubble Wrap Roll (50m)", category="Protective", stock=45, unit="rolls", reorder_level=50, location="Warehouse B, Rack 02"),
            InventoryItem(sku="TAPE-CLR", name="Clear Adherisve Tape (2 inch)", category="Tapes", stock=250, unit="rolls", reorder_level=50, location="Warehouse B, Rack 05"),
            InventoryItem(sku="STRAP-PL", name="Plastic Strapping Roll", category="Strapping", stock=12, unit="rolls", reorder_level=15, location="Warehouse B, Rack 08"),
            InventoryItem(sku="LBL-FR", name="Fragile Warning Labels", category="Labels", stock=5000, unit="pcs", reorder_level=1000, location="Warehouse A, Rack 01"),
            InventoryItem(sku="PAL-WD", name="Standard Wooden Pallet", category="Pallets", stock=80, unit="pcs", reorder_level=25, location="Yard 1"),
            InventoryItem(sku="FOAM-PN", name="Foam Peanuts (5kg Bag)", category="Protective", stock=30, unit="bags", reorder_level=20, location="Warehouse B, Rack 03"),
        ]
        db.session.add_all(inventory)

        db.session.commit()
        print("Database seeded successfully with Users, Customers, and Inventory.")
        print("Admin user: admin@erp.com / admin123")

if __name__ == '__main__':
    seed_database()
