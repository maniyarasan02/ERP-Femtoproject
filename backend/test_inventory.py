import json
import urllib.request

base_url = "http://localhost:8000/api"

# Login to get token
req = urllib.request.Request(f"{base_url}/auth/login/", method="POST")
req.add_header('Content-Type', 'application/json')
data = json.dumps({"email": "admin@erp.com", "password": "admin123"}).encode('utf-8')

try:
    with urllib.request.urlopen(req, data=data) as resp:
        print("Login status:", resp.status)
        resp_data = json.loads(resp.read().decode('utf-8'))
        token = resp_data["access"]
except Exception as e:
    print("Login failed:", e)
    exit()

headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

# Add inventory
dataToSubmit = {
  "name": "Cardboard Box Large",
  "sku": "CB-LRG-01",
  "category": "Packaging",
  "stock": 50,
  "unit": "pcs",
  "reorder_level": 10,
  "location": "A1-Bin4"
}

req = urllib.request.Request(f"{base_url}/inventory/", method="POST")
for k, v in headers.items():
    req.add_header(k, v)
data = json.dumps(dataToSubmit).encode('utf-8')

try:
    with urllib.request.urlopen(req, data=data) as resp:
        print("Create Inventory status:", resp.status)
        print("Response:", json.loads(resp.read().decode('utf-8')))
except urllib.error.HTTPError as e:
    print("Create API HTTP Error:", e.code)
    print("Response:", e.read().decode('utf-8'))
except Exception as e:
    print("Create API Error:", e)
