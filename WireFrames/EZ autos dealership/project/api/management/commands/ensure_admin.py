from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Profile

class Command(BaseCommand):
    help = 'Creates an admin user if one does not exist'

    def handle(self, *args, **options):
        if not User.objects.filter(email='admin@example.com').exists():
            admin_user = User.objects.create_superuser(
                username='admin@example.com',
                email='admin@example.com',
                password='admins'
            )
            Profile.objects.create(user=admin_user, role='admin')
            self.stdout.write(self.style.SUCCESS('Admin user created successfully'))
        else:
            self.stdout.write(self.style.SUCCESS('Admin user already exists'))