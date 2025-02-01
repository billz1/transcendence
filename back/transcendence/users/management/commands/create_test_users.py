from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from faker import Faker
import random

User = get_user_model()
fake = Faker()

class Command(BaseCommand):
    help = 'Creates test users for development'

    def add_arguments(self, parser):
        parser.add_argument('total', type=int, help='Number of users to create')

    def handle(self, *args, **kwargs):
        total = kwargs['total']
        
        for i in range(total):
            username = fake.user_name()[:15]
            while User.objects.filter(username=username).exists():
                username = fake.user_name()
                
            user = User.objects.create_user(
                username=username,
                email=fake.email(),
                password='Testpass123!'
            )
            
            self.stdout.write(f'Created user: {username}')

        self.stdout.write(self.style.SUCCESS(f'Successfully created {total} users'))