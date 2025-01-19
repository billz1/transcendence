from django.contrib.auth.models import AbstractUser
from django.db import models
#from django.contrib.auth.models import AbstractUser, Group, Permission


class CustomUser(AbstractUser):
    avatar = models.URLField(blank=True, null=True)
class GameStat(models.Model):
    user = models.ForeignKey('core.CustomUser', on_delete=models.CASCADE)
    matches_played = models.PositiveIntegerField(default=0)
    wins = models.PositiveIntegerField(default=0)
    losses = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s stats"
