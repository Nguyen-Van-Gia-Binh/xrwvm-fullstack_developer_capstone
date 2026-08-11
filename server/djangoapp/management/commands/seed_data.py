"""
Management command to create superuser and seed CarMake/CarModel data.
Run: python manage.py seed_data
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from djangoapp.models import CarMake, CarModel


class Command(BaseCommand):
    help = 'Seed database with initial data'

    def handle(self, *args, **kwargs):
        # Create superuser
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@xautomotive.com', 'admin123')
            self.stdout.write(self.style.SUCCESS('Superuser created: admin / admin123'))
        else:
            self.stdout.write('Superuser already exists')

        # Create test user
        if not User.objects.filter(username='testuser').exists():
            User.objects.create_user('testuser', 'test@test.com', 'testpass123',
                                     first_name='Test', last_name='User')
            self.stdout.write(self.style.SUCCESS('Test user created: testuser / testpass123'))

        # Car Makes
        car_makes_data = [
            {'name': 'Toyota', 'description': 'Japanese automaker known for reliability', 'country_of_origin': 'Japan'},
            {'name': 'Honda', 'description': 'Japanese manufacturer known for efficiency', 'country_of_origin': 'Japan'},
            {'name': 'Ford', 'description': 'American automobile manufacturer', 'country_of_origin': 'USA'},
            {'name': 'Chevrolet', 'description': 'American automobile manufacturer (GM)', 'country_of_origin': 'USA'},
            {'name': 'BMW', 'description': 'German luxury automobile manufacturer', 'country_of_origin': 'Germany'},
            {'name': 'Mercedes-Benz', 'description': 'German luxury automobile brand', 'country_of_origin': 'Germany'},
            {'name': 'Nissan', 'description': 'Japanese automobile manufacturer', 'country_of_origin': 'Japan'},
            {'name': 'Tesla', 'description': 'American electric vehicle manufacturer', 'country_of_origin': 'USA'},
        ]

        car_models_data = {
            'Toyota': [
                ('Camry', 'SEDAN', 2023), ('Corolla', 'SEDAN', 2023),
                ('RAV4', 'SUV', 2024), ('Highlander', 'SUV', 2023),
                ('Tacoma', 'TRUCK', 2024),
            ],
            'Honda': [
                ('Accord', 'SEDAN', 2023), ('Civic', 'SEDAN', 2023),
                ('CR-V', 'SUV', 2024), ('Pilot', 'SUV', 2023),
            ],
            'Ford': [
                ('Mustang', 'COUPE', 2024), ('Explorer', 'SUV', 2023),
                ('F-150', 'TRUCK', 2024), ('Bronco', 'SUV', 2023),
            ],
            'Chevrolet': [
                ('Equinox', 'SUV', 2024), ('Silverado', 'TRUCK', 2023),
                ('Malibu', 'SEDAN', 2023), ('Tahoe', 'SUV', 2024),
            ],
            'BMW': [
                ('3 Series', 'SEDAN', 2024), ('5 Series', 'SEDAN', 2023),
                ('X5', 'SUV', 2024), ('M4', 'COUPE', 2023),
            ],
            'Mercedes-Benz': [
                ('C-Class', 'SEDAN', 2024), ('E-Class', 'SEDAN', 2023),
                ('GLE', 'SUV', 2024), ('A-Class', 'HATCHBACK', 2023),
            ],
            'Nissan': [
                ('Altima', 'SEDAN', 2023), ('Rogue', 'SUV', 2024),
                ('Sentra', 'SEDAN', 2023), ('Pathfinder', 'SUV', 2023),
            ],
            'Tesla': [
                ('Model 3', 'SEDAN', 2024), ('Model Y', 'SUV', 2024),
                ('Model S', 'SEDAN', 2023), ('Model X', 'SUV', 2023),
            ],
        }

        for make_data in car_makes_data:
            make, created = CarMake.objects.get_or_create(
                name=make_data['name'],
                defaults=make_data
            )
            if created:
                self.stdout.write(f'Created CarMake: {make.name}')

            # Add models for this make
            if make.name in car_models_data:
                for model_name, car_type, year in car_models_data[make.name]:
                    model, m_created = CarModel.objects.get_or_create(
                        car_make=make,
                        name=model_name,
                        defaults={'type': car_type, 'year': year}
                    )
                    if m_created:
                        self.stdout.write(f'  Created CarModel: {make.name} {model_name}')

        self.stdout.write(self.style.SUCCESS('\nSeed data created successfully!'))
        self.stdout.write(f'CarMakes: {CarMake.objects.count()}')
        self.stdout.write(f'CarModels: {CarModel.objects.count()}')
