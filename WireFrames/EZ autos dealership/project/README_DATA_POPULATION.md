# Database Population Guide for EZ Autos

This guide explains how to populate both MongoDB and Django databases with comprehensive sample data for testing.

## 🗄️ Database Structure Overview

### Django Database (SQLite)
- **Users & Profiles**: Authentication and user management
- **Knowledge Base**: FAQ articles and help content
- **Chatbot Settings**: Bot configuration and responses
- **Vehicle Inquiries**: Customer inquiries about vehicles
- **Newsletter Subscriptions**: Email marketing data

### MongoDB Database
- **Vehicles**: Complete vehicle inventory with specs
- **Test Drives**: Customer test drive bookings
- **Chat History**: All chatbot conversations
- **Feedback**: Customer reviews and ratings
- **Team Members**: Staff information and profiles
- **Financing Applications**: Loan applications and status
- **Vehicle Images**: Multiple images per vehicle

## 🚀 How to Populate the Databases

### Method 1: Automatic Population Script (Recommended)

1. **Run the population script:**
   ```bash
   python populate_data.py
   ```

2. **What it creates:**
   - **Django Database:**
     - 4 additional users (customers, sales, manager)
     - 5 knowledge base articles
     - 3 chatbot setting configurations
     - 10 vehicle inquiries
     - 25 newsletter subscriptions

   - **MongoDB Database:**
     - 5 additional vehicles (Honda, Toyota, Ford, Chevrolet, Nissan)
     - 15 test drive bookings with various statuses
     - 50 chat conversation messages
     - 30 customer feedback entries
     - 3 additional team members
     - 12 financing applications

### Method 2: Manual Population via Admin Interface

#### Django Admin Interface

1. **Access Django Admin:**
   ```
   http://localhost:8000/admin
   ```
   Login with: `admin@example.com` / `admin`

2. **Add data manually:**
   - **Users**: Create new users in Auth > Users
   - **Profiles**: Assign roles in Api > Profiles
   - **Knowledge Base**: Add FAQ articles in Api > Knowledge bases
   - **Chatbot Settings**: Configure bot responses in Api > Chatbot settings

#### MongoDB via API Endpoints

1. **Add Vehicles** (POST to `/api/vehicles/`):
   ```json
   {
     "make": "Honda",
     "model": "Civic",
     "year": 2023,
     "price": 25000,
     "mileage": 10000,
     "fuel_type": "Gasoline",
     "transmission": "Manual",
     "color": "Blue",
     "description": "Reliable compact car",
     "featured": false
   }
   ```

2. **Add Test Drives** (POST to `/api/test-drives/`):
   ```json
   {
     "vehicle_id": "vehicle_object_id",
     "booking_date": "2024-01-15T14:00:00",
     "customer_name": "John Doe",
     "customer_email": "john@example.com",
     "customer_phone": "(555) 123-4567",
     "notes": "Interested in financing options"
   }
   ```

3. **Add Feedback** (POST to `/api/feedback/`):
   ```json
   {
     "vehicle_id": "vehicle_object_id",
     "rating": 5,
     "comment": "Excellent service!",
     "category": "Service"
   }
   ```

### Method 3: Using MongoDB Compass (GUI Tool)

1. **Install MongoDB Compass:**
   Download from: https://www.mongodb.com/products/compass

2. **Connect to your MongoDB:**
   Use your `MONGODB_URI` from the `.env` file

3. **Add documents manually:**
   - Navigate to your database collections
   - Use the "Insert Document" button
   - Add JSON documents directly

## 📊 Sample Data Included

### Vehicles (11 total)
- **Luxury**: BMW 5 Series, Audi Q7, Mercedes GLE, Porsche Taycan
- **Mainstream**: Honda Accord, Toyota Camry, Nissan Altima
- **Electric**: Tesla Model 3, Porsche Taycan
- **Trucks/SUVs**: Ford F-150, Chevrolet Tahoe, Lexus RX

### Users & Roles
- **Admin**: admin@example.com (full access)
- **Manager**: manager@ezautos.com (management access)
- **Sales**: sales@ezautos.com (sales functions)
- **Customers**: customer1@example.com, customer2@example.com

### Test Data Scenarios
- **Pending test drives**: For admin approval workflow
- **Chat conversations**: Various customer inquiries
- **Feedback**: Mix of ratings and categories
- **Financing applications**: Different approval statuses

## 🔧 Customizing the Data

### Adding More Vehicles
Edit the `additional_vehicles` list in `populate_data.py`:

```python
{
    "make": "Your Make",
    "model": "Your Model",
    "year": 2023,
    "price": 30000,
    "mileage": 5000,
    "fuel_type": "Gasoline",
    "transmission": "Automatic",
    "color": "Red",
    "image_url": "https://your-image-url.com/image.jpg",
    "featured": True,
    "description": "Your description",
    "status": "available",
    "vin": "YOUR_VIN_NUMBER",
    "engine": "2.0L Turbo",
    "drivetrain": "AWD",
    "features": ["Feature 1", "Feature 2"]
}
```

### Adding Team Members
Add to the `additional_team` list:

```python
{
    "name": "Your Name",
    "email": "your.email@ezautos.com",
    "role": "Your Role",
    "department": "Your Department",
    "phone": "(555) 123-4567",
    "status": "active",
    "bio": "Your bio description"
}
```

## 🧪 Testing Different Scenarios

### Test Drive Workflow
1. Customer books test drive (pending status)
2. Admin reviews and approves/rejects
3. Test drive completed
4. Customer provides feedback

### Chat System
1. Customer starts chat session
2. Bot responds with pre-configured messages
3. Conversation history saved
4. Admin can review chat logs

### Vehicle Search & Filtering
1. Search by make, model, year
2. Filter by price range, fuel type
3. Sort by various criteria
4. View featured vehicles

### Admin Dashboard
1. View analytics and statistics
2. Manage team members
3. Review customer feedback
4. Monitor test drive bookings

## 🔍 Verifying Data Population

### Check Django Data
```bash
python manage.py shell
```

```python
from django.contrib.auth.models import User
from api.models import Profile, KnowledgeBase

print(f"Users: {User.objects.count()}")
print(f"Profiles: {Profile.objects.count()}")
print(f"KB Articles: {KnowledgeBase.objects.count()}")
```

### Check MongoDB Data
Access MongoDB shell or use the API endpoints:
- `GET /api/vehicles/` - View all vehicles
- `GET /api/test-drives/` - View test drives (admin only)
- `GET /api/feedback/` - View feedback (admin only)
- `GET /api/team-members/` - View team members (admin only)

## 🚨 Troubleshooting

### MongoDB Connection Issues
1. Check your `.env` file has correct `MONGODB_URI`
2. Ensure MongoDB Atlas allows your IP address
3. Verify database name in `MONGODB_NAME`

### Django Database Issues
1. Run migrations: `python manage.py migrate`
2. Create superuser: `python manage.py createsuperuser`
3. Check database file exists: `db.sqlite3`

### Permission Errors
1. Ensure admin user exists and has admin role
2. Check user authentication in API calls
3. Verify CORS settings for frontend requests

## 📈 Next Steps

After populating the data:

1. **Test the frontend**: Browse vehicles, search, filter
2. **Try the admin dashboard**: Login as admin and explore features
3. **Test user flows**: Register, login, book test drives
4. **Use the chatbot**: Start conversations and see responses
5. **Submit feedback**: Rate vehicles and services
6. **Explore analytics**: View charts and statistics in admin panel

The populated data provides a realistic testing environment that demonstrates all the website's functionality!