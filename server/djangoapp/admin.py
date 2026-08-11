from django.contrib import admin
from .models import CarMake, CarModel


class CarModelInline(admin.TabularInline):
    """Inline display of CarModels within CarMake admin."""
    model = CarModel
    extra = 2


@admin.register(CarMake)
class CarMakeAdmin(admin.ModelAdmin):
    """Admin view for CarMake model."""
    list_display = ['name', 'country_of_origin', 'description']
    search_fields = ['name']
    inlines = [CarModelInline]


@admin.register(CarModel)
class CarModelAdmin(admin.ModelAdmin):
    """Admin view for CarModel model."""
    list_display = ['name', 'car_make', 'type', 'year', 'dealer_id']
    list_filter = ['type', 'year', 'car_make']
    search_fields = ['name', 'car_make__name']
