# Generated by Django 5.2 on 2025-05-08 15:31

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('itinerary_app', '0002_itinerary_activities'),
    ]

    operations = [
        migrations.AlterField(
            model_name='itinerary',
            name='activities',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), blank=True, default=list, size=21),
        ),
    ]
