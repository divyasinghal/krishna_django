# Generated by Django 3.0.3 on 2020-09-10 12:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0002_auto_20200910_1244'),
    ]

    operations = [
        migrations.AlterField(
            model_name='layerinfo',
            name='admin_allowed',
            field=models.BooleanField(blank=True, default=True, null=True),
        ),
        migrations.AlterField(
            model_name='layerinfo',
            name='user_allowed',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
    ]
