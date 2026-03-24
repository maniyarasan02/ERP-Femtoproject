from app import create_app
from models import db, User, Customer, InventoryItem, Shipment

app = create_app()

def view_data():
    with app.app_context():
        print("\n--- USERS ---")
        users = User.query.all()
        for u in users:
            print(f"ID: {u.id} | Email: {u.email} | Name: {u.first_name} {u.last_name}")

        print("\n--- CUSTOMERS ---")
        customers = Customer.query.all()
        for c in customers:
            print(f"ID: {c.id} | Name: {c.name} | City: {c.city} | Email: {c.email}")

        print("\n--- INVENTORY ---")
        items = InventoryItem.query.all()
        for i in items:
            print(f"ID: {i.id} | SKU: {i.sku} | Name: {i.name} | Stock: {i.stock}")

if __name__ == '__main__':
    view_data()
