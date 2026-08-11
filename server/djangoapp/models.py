from django.db import models
from django.utils.timezone import now


class CarMake(models.Model):
    """Model representing a car manufacturer/make."""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, default='')
    country_of_origin = models.CharField(max_length=100, default='USA')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Car Make'
        verbose_name_plural = 'Car Makes'


class CarModel(models.Model):
    """Model representing a specific car model under a make."""
    CAR_TYPES = [
        ('SEDAN', 'Sedan'),
        ('SUV', 'SUV'),
        ('WAGON', 'Wagon'),
        ('TRUCK', 'Truck'),
        ('COUPE', 'Coupe'),
        ('CONVERTIBLE', 'Convertible'),
        ('HATCHBACK', 'Hatchback'),
        ('MINIVAN', 'Minivan'),
        ('VAN', 'Van'),
    ]

    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE, related_name='models')
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=CAR_TYPES, default='SUV')
    year = models.IntegerField(default=2023)
    dealer_id = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.car_make.name} {self.name} ({self.year})"

    class Meta:
        verbose_name = 'Car Model'
        verbose_name_plural = 'Car Models'
