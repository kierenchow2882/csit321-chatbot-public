from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Profile

class Command(BaseCommand):
    help = 'Creates an admin user if one does not exist'

    def handle(self, *args, **options):
        # Check if admin user exists
        admin_user = User.objects.filter(email='admin@example.com').first()

        if not admin_user:
            # Create admin user
            admin_user = User.objects.create_superuser(
                username='admin@example.com',
                email='admin@example.com',
                password='admin'
            )
            self.stdout.write(self.style.SUCCESS('Admin user created successfully'))
        else:
            self.stdout.write(self.style.SUCCESS('Admin user already exists'))

        # Check if profile exists and has correct role
        try:
            profile = Profile.objects.get(user=admin_user)
            if profile.role != 'admin':
                profile.role = 'admin'
                profile.save()
                self.stdout.write(self.style.SUCCESS(f'Updated admin user role from {profile.role} to admin'))
            else:
                self.stdout.write(self.style.SUCCESS('Admin user already has admin role'))
        except Profile.DoesNotExist:
            # Create profile with admin role
            Profile.objects.create(user=admin_user, role='admin')
            self.stdout.write(self.style.SUCCESS('Created admin profile with admin role'))

        # Verify the setup
        final_profile = Profile.objects.get(user=admin_user)
        self.stdout.write(self.style.SUCCESS(f'Final verification - User: {admin_user.email}, Role: {final_profile.role}'))