"""
MongoDB Test Data Population Script for EZ Autos

This script helps you populate your MongoDB database with comprehensive test data
to test all the functionality of the EZ Autos website.

Run this script to add:
- Vehicles with detailed specifications
- Test drive bookings
- Chat conversations
- Customer feedback
- Team members
- Financing applications

Usage:
    python mongodb_test_data.py
"""

import os
import sys
from datetime import datetime, timedelta
import random
from bson import ObjectId

# Add the project root to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

try:
    import django
    django.setup()
except Exception as e:
    print(f"Error setting up Django: {e}")
    sys.exit(1)

# Import MongoDB functions
from api.mongodb_models import (
    create_vehicle, create_test_drive, save_chat_message, 
    save_feedback, create_team_member,
    vehicles_collection, test_drives_collection, 
    chat_history_collection, feedback_collection, 
    team_members_collection
)

def create_sample_vehicles():
    """Create a comprehensive set of sample vehicles"""
    print("Creating sample vehicles...")
    
    vehicles = [
        {
            "make": "BMW",
            "model": "X5",
            "year": 2023,
            "price": 65000,
            "mileage": 2500,
            "fuel_type": "Gasoline",
            "transmission": "Automatic",
            "color": "Space Gray",
            "image_url": "https://images.pexels.com/photos/892522/pexels-photo-892522.jpeg",
            "featured": True,
            "description": "Luxury SUV with premium features, advanced technology, and exceptional performance. Perfect for families who demand the best.",
            "status": "available",
            "vin": "WBAJA7C50JCE67890",
            "engine": "3.0L Twin-Turbo I6",
            "drivetrain": "AWD",
            "exterior_color": "Space Gray Metallic",
            "interior_color": "Black Vernasca Leather",
            "mpg_city": 21,
            "mpg_highway": 26,
            "features": ["Panoramic Sunroof", "Harman Kardon Audio", "Gesture Control", "Wireless Charging", "Adaptive Cruise Control"]
        },
        {
            "make": "Tesla",
            "model": "Model Y",
            "year": 2023,
            "price": 52000,
            "mileage": 1200,
            "fuel_type": "Electric",
            "transmission": "Automatic",
            "color": "Pearl White",
            "image_url": "https://images.pexels.com/photos/7234518/pexels-photo-7234518.jpeg",
            "featured": True,
            "description": "All-electric compact SUV with cutting-edge technology, impressive range, and minimal environmental impact.",
            "status": "available",
            "vin": "5YJYGDEE5JF123456",
            "engine": "Dual Motor Electric",
            "drivetrain": "AWD",
            "exterior_color": "Pearl White Multi-Coat",
            "interior_color": "Black Premium",
            "range": 326,
            "charging_time": "10 hours (240V)",
            "features": ["Autopilot", "Over-the-Air Updates", "Supercharging", "Glass Roof", "HEPA Air Filter"]
        },
        {
            "make": "Mercedes-Benz",
            "model": "C-Class",
            "year": 2023,
            "price": 48000,
            "mileage": 3500,
            "fuel_type": "Gasoline",
            "transmission": "Automatic",
            "color": "Polar White",
            "image_url": "https://images.pexels.com/photos/11413034/pexels-photo-11413034.jpeg",
            "featured": True,
            "description": "Elegant luxury sedan with sophisticated design, advanced safety features, and refined performance.",
            "status": "available",
            "vin": "WDDWF4HB5JR123456",
            "engine": "2.0L Turbo 4-Cylinder",
            "drivetrain": "RWD",
            "exterior_color": "Polar White",
            "interior_color": "Black Artico Leather",
            "mpg_city": 23,
            "mpg_highway": 32,
            "features": ["MBUX Infotainment", "Active Brake Assist", "Blind Spot Assist", "LED Headlights", "Dual-Zone Climate"]
        },
        {
            "make": "Audi",
            "model": "A4",
            "year": 2023,
            "price": 42000,
            "mileage": 4200,
            "fuel_type": "Gasoline",
            "transmission": "Automatic",
            "color": "Glacier White",
            "image_url": "https://images.pexels.com/photos/1104768/pexels-photo-1104768.jpeg",
            "featured": False,
            "description": "Premium compact sedan with quattro all-wheel drive, virtual cockpit, and sporty handling.",
            "status": "available",
            "vin": "WAUENAF40JN123456",
            "engine": "2.0L TFSI Turbo",
            "drivetrain": "AWD",
            "exterior_color": "Glacier White Metallic",
            "interior_color": "Black Leather",
            "mpg_city": 24,
            "mpg_highway": 31,
            "features": ["Virtual Cockpit", "MMI Touch", "Audi Pre Sense", "LED Headlights", "Heated Seats"]
        },
        {
            "make": "Lexus",
            "model": "ES",
            "year": 2023,
            "price": 45000,
            "mileage": 2800,
            "fuel_type": "Hybrid",
            "transmission": "Automatic",
            "color": "Atomic Silver",
            "image_url": "https://images.pexels.com/photos/7929342/pexels-photo-7929342.jpeg",
            "featured": True,
            "description": "Luxury hybrid sedan with exceptional fuel economy, whisper-quiet cabin, and renowned reliability.",
            "status": "available",
            "vin": "58ABK1GG5JU123456",
            "engine": "2.5L Hybrid 4-Cylinder",
            "drivetrain": "FWD",
            "exterior_color": "Atomic Silver",
            "interior_color": "Parchment Leather",
            "mpg_city": 43,
            "mpg_highway": 44,
            "features": ["Lexus Safety System+", "Mark Levinson Audio", "Wireless Charging", "Heated/Ventilated Seats", "Head-Up Display"]
        },
        {
            "make": "Honda",
            "model": "Pilot",
            "year": 2023,
            "price": 38000,
            "mileage": 6500,
            "fuel_type": "Gasoline",
            "transmission": "Automatic",
            "color": "Modern Steel",
            "image_url": "https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg",
            "featured": False,
            "description": "Reliable three-row SUV with spacious interior, advanced safety features, and excellent value.",
            "status": "available",
            "vin": "5FNYF6H50JB123456",
            "engine": "3.5L V6",
            "drivetrain": "AWD",
            "exterior_color": "Modern Steel Metallic",
            "interior_color": "Gray Leather",
            "mpg_city": 20,
            "mpg_highway": 27,
            "features": ["Honda Sensing", "Apple CarPlay", "Tri-Zone Climate", "Power Tailgate", "Remote Start"]
        },
        {
            "make": "Toyota",
            "model": "Highlander",
            "year": 2023,
            "price": 40000,
            "mileage": 5200,
            "fuel_type": "Hybrid",
            "transmission": "Automatic",
            "color": "Blueprint",
            "image_url": "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg",
            "featured": False,
            "description": "Efficient hybrid SUV with three rows of seating, advanced safety technology, and outstanding fuel economy.",
            "status": "available",
            "vin": "5TDJZRFH5JS123456",
            "engine": "2.5L Hybrid 4-Cylinder",
            "drivetrain": "AWD",
            "exterior_color": "Blueprint",
            "interior_color": "Black SofTex",
            "mpg_city": 36,
            "mpg_highway": 35,
            "features": ["Toyota Safety Sense", "JBL Audio", "Wireless Charging", "Power Liftgate", "Tri-Zone Climate"]
        },
        {
            "make": "Ford",
            "model": "Mustang",
            "year": 2023,
            "price": 35000,
            "mileage": 3800,
            "fuel_type": "Gasoline",
            "transmission": "Manual",
            "color": "Race Red",
            "image_url": "https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg",
            "featured": True,
            "description": "Iconic American sports car with powerful V8 engine, aggressive styling, and thrilling performance.",
            "status": "available",
            "vin": "1FA6P8TH5J5123456",
            "engine": "5.0L V8",
            "drivetrain": "RWD",
            "exterior_color": "Race Red",
            "interior_color": "Ebony Leather",
            "mpg_city": 16,
            "mpg_highway": 25,
            "features": ["SYNC 4", "Performance Package", "Brembo Brakes", "Recaro Seats", "Track Apps"]
        },
        {
            "make": "Chevrolet",
            "model": "Corvette",
            "year": 2023,
            "price": 75000,
            "mileage": 1500,
            "fuel_type": "Gasoline",
            "transmission": "Automatic",
            "color": "Torch Red",
            "image_url": "https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg",
            "featured": True,
            "description": "Mid-engine supercar with breathtaking performance, cutting-edge technology, and stunning design.",
            "status": "available",
            "vin": "1G1YB2D40J5123456",
            "engine": "6.2L V8",
            "drivetrain": "RWD",
            "exterior_color": "Torch Red",
            "interior_color": "Jet Black Leather",
            "mpg_city": 15,
            "mpg_highway": 27,
            "features": ["Performance Data Recorder", "Magnetic Ride Control", "Bose Audio", "Head-Up Display", "Carbon Fiber Package"]
        },
        {
            "make": "Porsche",
            "model": "Macan",
            "year": 2023,
            "price": 62000,
            "mileage": 2100,
            "fuel_type": "Gasoline",
            "transmission": "Automatic",
            "color": "Carrara White",
            "image_url": "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg",
            "featured": True,
            "description": "Compact luxury SUV with sports car DNA, exceptional handling, and premium craftsmanship.",
            "status": "available",
            "vin": "WP1AB2A50JLB12345",
            "engine": "2.0L Turbo 4-Cylinder",
            "drivetrain": "AWD",
            "exterior_color": "Carrara White Metallic",
            "interior_color": "Black Leather",
            "mpg_city": 20,
            "mpg_highway": 25,
            "features": ["Porsche Communication Management", "Air Suspension", "Sport Chrono Package", "Bose Audio", "Panoramic Roof"]
        }
    ]
    
    created_count = 0
    for vehicle_data in vehicles:
        try:
            # Check if vehicle already exists by VIN
            if vehicles_collection is not None and vehicles_collection.find_one({"vin": vehicle_data["vin"]}):
                print(f"Vehicle {vehicle_data['make']} {vehicle_data['model']} already exists, skipping...")
                continue
                
            result = create_vehicle(vehicle_data)
            print(f"✓ Created: {vehicle_data['year']} {vehicle_data['make']} {vehicle_data['model']}")
            created_count += 1
        except Exception as e:
            print(f"✗ Error creating {vehicle_data['make']} {vehicle_data['model']}: {str(e)}")
    
    print(f"Created {created_count} new vehicles")
    return created_count

def create_sample_test_drives():
    """Create sample test drive bookings"""
    print("\nCreating sample test drives...")
    
    if test_drives_collection is None or vehicles_collection is None:
        print("Collections not available, skipping test drives")
        return 0
    
    # Get some vehicle IDs
    vehicles = list(vehicles_collection.find().limit(8))
    if not vehicles:
        print("No vehicles found, cannot create test drives")
        return 0
    
    customer_names = [
        "John Smith", "Sarah Johnson", "Michael Brown", "Emily Davis",
        "David Wilson", "Lisa Anderson", "Robert Taylor", "Jennifer Martinez",
        "Christopher Lee", "Amanda White", "Matthew Garcia", "Jessica Rodriguez"
    ]
    
    statuses = ["pending", "approved", "completed", "cancelled"]
    
    created_count = 0
    for i in range(20):
        try:
            vehicle = random.choice(vehicles)
            customer_name = random.choice(customer_names)
            booking_date = datetime.now() + timedelta(days=random.randint(-10, 30))
            
            test_drive_data = {
                "user_id": str(random.randint(1, 10)),
                "vehicle_id": str(vehicle["_id"]),
                "booking_date": booking_date.isoformat(),
                "customer_name": customer_name,
                "customer_email": customer_name.lower().replace(" ", ".") + "@example.com",
                "customer_phone": f"(555) {random.randint(100, 999)}-{random.randint(1000, 9999)}",
                "status": random.choice(statuses),
                "notes": f"Interested in test driving the {vehicle['make']} {vehicle['model']}. Looking for a family vehicle with good fuel economy."
            }
            
            result = create_test_drive(test_drive_data)
            print(f"✓ Created test drive: {customer_name} - {vehicle['make']} {vehicle['model']}")
            created_count += 1
        except Exception as e:
            print(f"✗ Error creating test drive {i+1}: {str(e)}")
    
    print(f"Created {created_count} test drive bookings")
    return created_count

def create_sample_chat_history():
    """Create sample chat conversations"""
    print("\nCreating sample chat history...")
    
    if chat_history_collection is None:
        print("Chat history collection not available, skipping")
        return 0
    
    conversations = [
        [
            ("Hello! I'm looking for a reliable family car under $50,000", "user"),
            ("Hello! I'd be happy to help you find a reliable family car under $50,000. We have several excellent options including the Honda Pilot, Toyota Highlander, and Audi A4. What size family do you have?", "bot"),
            ("We're a family of 5, so we need something spacious", "user"),
            ("Perfect! For a family of 5, I'd recommend the Honda Pilot or Toyota Highlander. Both have three rows of seating and excellent safety ratings. The Highlander also comes in a hybrid version for better fuel economy. Would you like to schedule a test drive?", "bot"),
            ("Yes, I'd like to test drive the Toyota Highlander Hybrid", "user"),
            ("Excellent choice! I can help you schedule a test drive for the Toyota Highlander Hybrid. What day works best for you this week?", "bot")
        ],
        [
            ("What financing options do you have available?", "user"),
            ("We offer several financing options to fit your budget: Traditional auto loans starting at 2.9% APR, lease agreements with low monthly payments, and special promotional rates for qualified buyers. We also work with multiple lenders to find you the best rate. What's your preferred monthly payment range?", "bot"),
            ("I'm looking for something around $400-500 per month", "user"),
            ("That's a great budget range! With $400-500 monthly, you could finance a vehicle in the $25,000-$35,000 range depending on your down payment and loan term. Would you like me to show you vehicles in that price range?", "bot"),
            ("Yes, please show me what's available", "user"),
            ("Perfect! We have several vehicles in that range including the Honda Pilot ($38,000), Ford Mustang ($35,000), and Audi A4 ($42,000). All of these would fit your monthly budget with the right financing terms. Which type of vehicle interests you most?", "bot")
        ],
        [
            ("Do you have any electric vehicles?", "user"),
            ("Yes! We have several electric vehicles including the Tesla Model Y and Tesla Model 3. Both offer impressive range, cutting-edge technology, and zero emissions. The Model Y is a compact SUV perfect for families, while the Model 3 is a luxury sedan. Are you interested in learning more about either?", "bot"),
            ("Tell me more about the Model Y", "user"),
            ("The Tesla Model Y is an excellent choice! It features: 326-mile range, dual motor all-wheel drive, autopilot capability, over-the-air software updates, and a spacious interior with a glass roof. It's priced at $52,000 with only 1,200 miles. Would you like to schedule a test drive?", "bot"),
            ("What about charging? How long does it take?", "user"),
            ("Great question! The Model Y can charge at home using a 240V outlet in about 10 hours for a full charge, or you can use Tesla's Supercharger network for rapid charging - about 30 minutes for 80% charge. We can also help you find charging solutions for your home. Would you like more information about home charging installation?", "bot")
        ],
        [
            ("I'm interested in trading in my current vehicle", "user"),
            ("We'd be happy to help with your trade-in! We accept all makes and models and offer competitive valuations. To give you an accurate estimate, I'll need some information about your current vehicle: What year, make, and model is it?", "bot"),
            ("It's a 2018 Honda Accord with about 65,000 miles", "user"),
            ("A 2018 Honda Accord is a great trade-in vehicle! Based on current market values and the mileage you mentioned, you could expect a trade-in value in the $18,000-$22,000 range, depending on condition and trim level. We'd need to do a physical inspection for an exact quote. Would you like to bring it in for a free appraisal?", "bot"),
            ("Yes, when can I bring it in?", "user"),
            ("You can bring your Honda Accord in any time during our business hours: Monday-Friday 9AM-8PM, Saturday 10AM-6PM, or Sunday 11AM-5PM. No appointment necessary for appraisals! Our team can have your trade-in value ready in about 30 minutes. Would you also like to look at any specific vehicles while you're here?", "bot")
        ],
        [
            ("What are your business hours?", "user"),
            ("Our business hours are: Monday through Friday 9:00 AM to 8:00 PM, Saturday 10:00 AM to 6:00 PM, and Sunday 11:00 AM to 5:00 PM. We're here to help you find your perfect vehicle! Is there a specific time you'd like to visit?", "bot"),
            ("I can only come in on weekends", "user"),
            ("No problem! We're open both Saturday and Sunday. Saturday we're open 10AM-6PM and Sunday 11AM-5PM. Our full sales team is available on weekends to help you. Would you like to schedule an appointment or just drop by?", "bot")
        ]
    ]
    
    created_count = 0
    for conv_index, conversation in enumerate(conversations):
        session_id = f"session_{conv_index + 1}_{random.randint(1000, 9999)}"
        user_id = str(random.randint(1, 10))
        
        for message_text, sender in conversation:
            try:
                message_data = {
                    "user_id": user_id if sender == "user" else None,
                    "session_id": session_id,
                    "message": message_text,
                    "sender": sender
                }
                
                result = save_chat_message(message_data)
                created_count += 1
            except Exception as e:
                print(f"✗ Error creating chat message: {str(e)}")
    
    print(f"✓ Created {created_count} chat messages across {len(conversations)} conversations")
    return created_count

def create_sample_feedback():
    """Create sample customer feedback"""
    print("\nCreating sample feedback...")
    
    if feedback_collection is None or vehicles_collection is None:
        print("Collections not available, skipping feedback")
        return 0
    
    # Get some vehicle IDs
    vehicles = list(vehicles_collection.find().limit(6))
    if not vehicles:
        print("No vehicles found, cannot create feedback")
        return 0
    
    feedback_data = [
        {
            "rating": 5,
            "comment": "Excellent service from start to finish! The sales team was knowledgeable and not pushy at all. Very happy with my new BMW X5.",
            "category": "Service"
        },
        {
            "rating": 5,
            "comment": "The Tesla Model Y exceeded all my expectations. The technology is incredible and the driving experience is amazing. Highly recommend!",
            "category": "Product"
        },
        {
            "rating": 4,
            "comment": "Great selection of vehicles and competitive pricing. The financing process was smooth and transparent. Will definitely recommend to friends.",
            "category": "Financing"
        },
        {
            "rating": 5,
            "comment": "Outstanding customer service! They went above and beyond to help me find the perfect car for my family. The test drive was well organized.",
            "category": "Service"
        },
        {
            "rating": 4,
            "comment": "The website made it easy to browse inventory and get information. The online chat feature was very helpful for quick questions.",
            "category": "Website"
        },
        {
            "rating": 5,
            "comment": "Love my new Lexus ES! The hybrid system is so smooth and quiet. The fuel economy is even better than advertised.",
            "category": "Product"
        },
        {
            "rating": 4,
            "comment": "Professional and courteous staff. They took time to explain all the features of the Mercedes C-Class. Very satisfied with the purchase.",
            "category": "Service"
        },
        {
            "rating": 5,
            "comment": "The trade-in process was fair and transparent. Got a great value for my old car and found the perfect replacement. Highly recommend!",
            "category": "Trade-in"
        },
        {
            "rating": 4,
            "comment": "Quick response to my inquiries and very professional service throughout. The delivery process was seamless.",
            "category": "Support"
        },
        {
            "rating": 5,
            "comment": "Amazing experience buying my first Porsche! The team made sure I understood all the features and performance capabilities.",
            "category": "Service"
        },
        {
            "rating": 4,
            "comment": "The Honda Pilot is perfect for our family. Spacious, reliable, and great value. The sales process was straightforward.",
            "category": "Product"
        },
        {
            "rating": 5,
            "comment": "Exceptional service department! They explained everything clearly and completed the work on time. Very trustworthy.",
            "category": "Service"
        }
    ]
    
    created_count = 0
    for i, feedback in enumerate(feedback_data):
        try:
            vehicle = random.choice(vehicles) if vehicles else None
            
            feedback_entry = {
                "user_id": str(random.randint(1, 10)),
                "rating": feedback["rating"],
                "comment": feedback["comment"],
                "category": feedback["category"],
                "status": "active"
            }
            
            if vehicle:
                feedback_entry["vehicle_id"] = str(vehicle["_id"])
            
            result = save_feedback(feedback_entry)
            print(f"✓ Created feedback: {feedback['rating']} stars - {feedback['category']}")
            created_count += 1
        except Exception as e:
            print(f"✗ Error creating feedback {i+1}: {str(e)}")
    
    print(f"Created {created_count} feedback entries")
    return created_count

def create_sample_team_members():
    """Create sample team members"""
    print("\nCreating sample team members...")
    
    if team_members_collection is None:
        print("Team members collection not available, skipping")
        return 0
    
    team_data = [
        {
            "name": "Michael Rodriguez",
            "email": "michael.rodriguez@ezautos.com",
            "role": "Senior Sales Consultant",
            "department": "Sales",
            "phone": "(555) 123-4580",
            "status": "active",
            "hire_date": "2019-05-15",
            "bio": "Michael has over 8 years of experience in luxury automotive sales and specializes in BMW and Mercedes-Benz vehicles."
        },
        {
            "name": "Jennifer Chen",
            "email": "jennifer.chen@ezautos.com",
            "role": "Finance Manager",
            "department": "Finance",
            "phone": "(555) 123-4581",
            "status": "active",
            "hire_date": "2020-09-10",
            "bio": "Jennifer helps customers secure the best financing options and has partnerships with over 20 lending institutions."
        },
        {
            "name": "Robert Thompson",
            "email": "robert.thompson@ezautos.com",
            "role": "Service Manager",
            "department": "Service",
            "phone": "(555) 123-4582",
            "status": "active",
            "hire_date": "2018-03-20",
            "bio": "Robert oversees our service department and ensures all vehicles receive the highest quality maintenance and repairs."
        },
        {
            "name": "Amanda Foster",
            "email": "amanda.foster@ezautos.com",
            "role": "Customer Relations Specialist",
            "department": "Customer Service",
            "phone": "(555) 123-4583",
            "status": "active",
            "hire_date": "2021-11-05",
            "bio": "Amanda handles customer inquiries and ensures every customer has an exceptional experience with EZ Autos."
        },
        {
            "name": "Daniel Kim",
            "email": "daniel.kim@ezautos.com",
            "role": "Inventory Manager",
            "department": "Operations",
            "phone": "(555) 123-4584",
            "status": "active",
            "hire_date": "2020-01-15",
            "bio": "Daniel manages our vehicle inventory and works with manufacturers to ensure we have the latest models available."
        },
        {
            "name": "Rachel Martinez",
            "email": "rachel.martinez@ezautos.com",
            "role": "Digital Marketing Coordinator",
            "department": "Marketing",
            "phone": "(555) 123-4585",
            "status": "active",
            "hire_date": "2022-07-20",
            "bio": "Rachel manages our online presence and digital marketing campaigns to help customers discover our services."
        }
    ]
    
    created_count = 0
    for member_data in team_data:
        try:
            # Check if team member already exists
            if team_members_collection.find_one({"email": member_data["email"]}):
                print(f"Team member {member_data['name']} already exists, skipping...")
                continue
                
            result = create_team_member(member_data)
            print(f"✓ Created team member: {member_data['name']} - {member_data['role']}")
            created_count += 1
        except Exception as e:
            print(f"✗ Error creating team member {member_data['name']}: {str(e)}")
    
    print(f"Created {created_count} team members")
    return created_count

def main():
    """Main function to populate all MongoDB collections"""
    print("🚗 EZ Autos MongoDB Test Data Population")
    print("=" * 50)
    
    try:
        # Check MongoDB connection
        if vehicles_collection is None:
            print("❌ MongoDB connection not available. Please check your connection settings.")
            return
        
        print("✅ MongoDB connection successful")
        print("\nStarting data population...\n")
        
        # Create sample data
        vehicles_created = create_sample_vehicles()
        test_drives_created = create_sample_test_drives()
        chat_messages_created = create_sample_chat_history()
        feedback_created = create_sample_feedback()
        team_members_created = create_sample_team_members()
        
        # Summary
        print("\n" + "=" * 50)
        print("📊 POPULATION SUMMARY")
        print("=" * 50)
        print(f"✅ Vehicles created: {vehicles_created}")
        print(f"✅ Test drives created: {test_drives_created}")
        print(f"✅ Chat messages created: {chat_messages_created}")
        print(f"✅ Feedback entries created: {feedback_created}")
        print(f"✅ Team members created: {team_members_created}")
        
        total_created = vehicles_created + test_drives_created + chat_messages_created + feedback_created + team_members_created
        print(f"\n🎉 Total records created: {total_created}")
        
        if total_created > 0:
            print("\n🔧 NEXT STEPS:")
            print("1. Start your Django server: python manage.py runserver")
            print("2. Start your React frontend: npm run dev")
            print("3. Login as admin: admin@example.com / admin")
            print("4. Explore the admin dashboard to see your data")
            print("5. Test the vehicle search and filtering")
            print("6. Try the chatbot functionality")
            print("7. View analytics and reports")
        
    except Exception as e:
        print(f"❌ Error during population: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()