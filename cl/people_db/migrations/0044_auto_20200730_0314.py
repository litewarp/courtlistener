# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2020-07-30 10:14
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('people_db', '0043_auto_20200722_2210'),
    ]

    operations = [
        migrations.AlterField(
            model_name='position',
            name='date_granularity_start',
            field=models.CharField(blank=True, choices=[(b'%Y', b'Year'), (b'%Y-%m', b'Month'), (b'%Y-%m-%d', b'Day')], max_length=15),
        ),
    ]
