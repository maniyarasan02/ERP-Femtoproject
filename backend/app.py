import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from models import db

bcrypt = Bcrypt()
jwt = JWTManager()

def create_app():
    app = Flask(__name__, static_folder="frontend/assets")

    # Ensure frontend dir exists for the catch-all route if needed
    frontend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'frontend')
    
    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///db.sqlite3')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'default-dev-secret-key')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=8)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=7)

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    
    # Allow standard development ports for Vite (5173), Next/React (3000), and Angular (4200)
    CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://localhost:3000", "http://localhost:4200", "http://127.0.0.1:4200", "http://127.0.0.1:5173", "http://127.0.0.1:3000"]}})

    # Register Blueprints
    from routes.auth import auth_bp
    from routes.customers import customers_bp
    from routes.inventory import inventory_bp
    from routes.shipments import shipments_bp
    from routes.dashboard import dashboard_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(customers_bp, url_prefix='/api/customers')
    app.register_blueprint(inventory_bp, url_prefix='/api/inventory')
    app.register_blueprint(shipments_bp, url_prefix='/api/shipments')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    
    # Frontend serve for single-server production run
    frontend_dir = os.path.join(app.root_path, 'frontend')

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists(os.path.join(frontend_dir, path)):
            return send_from_directory(frontend_dir, path)
        response = send_from_directory(frontend_dir, 'index.html')
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
        return response

    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
        # Auto-seed admin if no users exist (fix for new deployments)
        from models import User
        if User.query.count() == 0:
            print("No users found. Seeding default accounts...")
            
            # Default Admin
            admin_hash = bcrypt.generate_password_hash("admin123").decode('utf-8')
            admin = User(
                first_name="System", last_name="Admin",
                email="admin@erp.com", username="admin@erp.com",
                password=admin_hash,
            )
            db.session.add(admin)

            # User's Requested Account (Mani)
            mani_hash = bcrypt.generate_password_hash("mani@123").decode('utf-8')
            mani = User(
                first_name="Mani", last_name="Yarasan",
                email="maniyarasanvetriselvan@gmail.com", username="maniyarasanvetriselvan@gmail.com",
                password=mani_hash,
            )
            db.session.add(mani)

            db.session.commit()
            print("Database seeded: admin@erp.com and maniyarasanvetriselvan@gmail.com")

    # Support Render's dynamic port and binding requirement
    port = int(os.environ.get("PORT", 8000))
    app.run(host='0.0.0.0', port=port, debug=False)
