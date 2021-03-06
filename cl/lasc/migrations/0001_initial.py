# -*- coding: utf-8 -*-
# Generated by Django 1.11.22 on 2019-08-29 21:54
from __future__ import unicode_literals

import cl.lib.model_helpers
import cl.lib.storage
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='Action',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateTimeField(auto_now_add=True, db_index=True, help_text=b'The time when this item was created')),
                ('date_modified', models.DateTimeField(auto_now=True, db_index=True, help_text=b'The last moment when the item was modified.')),
                ('date_of_action', models.DateTimeField(help_text=b'Date of the action entry')),
                ('description', models.TextField(blank=True, help_text=b'Short description of the document')),
                ('additional_information', models.TextField(blank=True, help_text=b'Additional information stored as HTML')),
            ],
            options={
                'verbose_name': 'Action Entry',
                'managed': True,
                'verbose_name_plural': 'Action Entries',
            },
        ),
        migrations.CreateModel(
            name='CrossReference',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateTimeField(auto_now_add=True, db_index=True, help_text=b'The time when this item was created')),
                ('date_modified', models.DateTimeField(auto_now=True, db_index=True, help_text=b'The last moment when the item was modified.')),
                ('date_cross_reference', models.DateTimeField(blank=True, help_text=b'Cross reference date', null=True)),
                ('cross_reference_docket_number', models.TextField(blank=True, help_text=b'Cross reference docket number')),
                ('cross_reference_type', models.TextField(blank=True, help_text=b'A description of the type of cross reference')),
            ],
            options={
                'verbose_name': 'Cross Reference',
                'verbose_name_plural': 'Cross References',
            },
        ),
        migrations.CreateModel(
            name='Docket',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateTimeField(auto_now_add=True, db_index=True, help_text=b'The time when this item was created')),
                ('date_modified', models.DateTimeField(auto_now=True, db_index=True, help_text=b'The last moment when the item was modified')),
                ('date_checked', models.DateTimeField(blank=True, db_index=True, help_text=b'Datetime case was last pulled or checked from LASC', null=True)),
                ('date_filed', models.DateField(blank=True, help_text=b'The date the case was filed', null=True)),
                ('date_disposition', models.DateField(blank=True, help_text=b'The date the case was disposed by the court', null=True)),
                ('docket_number', models.CharField(db_index=True, help_text=b'Docket number for the case. E.g. 19LBCV00507, 19STCV28994, or even 30-2017-00900866-CU-AS-CJC.', max_length=300)),
                ('district', models.CharField(blank=True, help_text=b'District is a 2-3 character code representing court locations; For Example BUR means Burbank', max_length=10)),
                ('division_code', models.CharField(blank=True, help_text=b'Division. E.g. civil (CV), civil probate (CP), etc.', max_length=10)),
                ('disposition_type', models.TextField(blank=True, help_text=b'Disposition type')),
                ('disposition_type_code', models.CharField(blank=True, help_text=b'Disposition type code', max_length=10)),
                ('case_type_str', models.TextField(blank=True, help_text=b'Case type description')),
                ('case_type_code', models.CharField(blank=True, help_text=b'Case type code', max_length=10)),
                ('case_name', models.TextField(blank=True, help_text=b'The name of the case')),
                ('judge_code', models.CharField(blank=True, help_text=b'Internal judge code assigned to the case', max_length=10)),
                ('judge_name', models.TextField(blank=True, help_text=b'The judge that the case was assigned to')),
                ('courthouse_name', models.TextField(blank=True, help_text=b'The courthouse name')),
                ('date_status', models.DateTimeField(blank=True, help_text=b'Date status was updated', null=True)),
                ('status_code', models.CharField(blank=True, help_text=b'Court status code associated with current status', max_length=20)),
                ('status_str', models.TextField(blank=True, help_text=b'The status of the case')),
            ],
        ),
        migrations.CreateModel(
            name='DocumentFiled',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateTimeField(auto_now_add=True, db_index=True, help_text=b'The time when this item was created')),
                ('date_modified', models.DateTimeField(auto_now=True, db_index=True, help_text=b'The last moment when the item was modified.')),
                ('date_filed', models.DateTimeField(help_text=b'Date a document was filed')),
                ('memo', models.TextField(blank=True, help_text=b'Memo describing document filed')),
                ('document_type', models.TextField(blank=True, help_text=b"Document type, whether it's an Answer, a Complaint, etc.")),
                ('party_str', models.TextField(blank=True, help_text=b'Filing party for the document')),
                ('docket', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='documents_filed', to='lasc.Docket')),
            ],
            options={
                'verbose_name_plural': 'Documents Filed',
            },
        ),
        migrations.CreateModel(
            name='DocumentImage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateTimeField(auto_now_add=True, db_index=True, help_text=b'The time when this item was created')),
                ('date_modified', models.DateTimeField(auto_now=True, db_index=True, help_text=b'The last moment when the item was modified.')),
                ('date_processed', models.DateTimeField(blank=True, help_text=b'The date the document was created in the lasc system, whether by attorney upload, clerk processing, etc.', null=True)),
                ('date_filed', models.DateTimeField(blank=True, help_text=b'The date the document was filed in the system', null=True)),
                ('doc_id', models.CharField(help_text=b'Internal document ID in LASC system used for uniquely identifying the document', max_length=30)),
                ('page_count', models.IntegerField(blank=True, help_text=b'Page count for this document', null=True)),
                ('document_type', models.TextField(blank=True, help_text=b'Type of document. Typically blank; still exploring possible meaning in LASC system.')),
                ('document_type_code', models.CharField(blank=True, help_text=b'Type of document as a code. We believe this corresponds to the document_type field.', max_length=20)),
                ('image_type_id', models.CharField(blank=True, help_text=b'Image type ID. Still exploring possible meanings in LASC system.', max_length=20)),
                ('app_id', models.TextField(blank=True, help_text=b'ID for filing application, if any.')),
                ('odyssey_id', models.TextField(blank=True, help_text=b'Typically null; likely a vendor-provided code. Still exploring possible meanings in LASC system.')),
                ('is_downloadable', models.BooleanField(help_text=b'Did the user who got the docket have permission to download this item?')),
                ('security_level', models.CharField(blank=True, help_text=b'Document security level', max_length=10)),
                ('description', models.TextField(blank=True, help_text=b'Document description')),
                ('volume', models.TextField(blank=True, help_text=b'Document volume. Still exploring possible meanings in LASC system.')),
                ('doc_part', models.TextField(blank=True, help_text=b'Document part. Still exploring possible meanings in LASC system.')),
                ('is_available', models.BooleanField(help_text=b'Has the document been downloaded')),
                ('docket', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='document_images', to='lasc.Docket')),
            ],
            options={
                'verbose_name': 'Document Image',
                'verbose_name_plural': 'Document Images',
            },
        ),
        migrations.CreateModel(
            name='LASCJSON',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateTimeField(auto_now_add=True, db_index=True, help_text=b'The time when this item was created')),
                ('date_modified', models.DateTimeField(auto_now=True, db_index=True, help_text=b'The last moment when the item was modified.')),
                ('object_id', models.PositiveIntegerField()),
                ('filepath', models.FileField(blank=True, help_text=b'The path of the file in the local storage area.', max_length=150, storage=cl.lib.storage.UUIDFileSystemStorage(), upload_to=cl.lib.model_helpers.make_json_path)),
                ('upload_type', models.SmallIntegerField(choices=[(1, b'JSON Docket')], help_text=b'The type of JSON file that is uploaded')),
                ('sha1', models.CharField(help_text=b'SHA1 hash of case data. Generated by hashing a copy of the JSON with whitespace removed.', max_length=128)),
                ('content_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.ContentType')),
            ],
            options={
                'verbose_name': 'LASC JSON File',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='LASCPDF',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateTimeField(auto_now_add=True, db_index=True, help_text=b'The date the file was imported to Local Storage.')),
                ('date_modified', models.DateTimeField(auto_now=True, db_index=True, help_text=b'Timestamp of last update.')),
                ('sha1', models.CharField(blank=True, help_text=b'The ID used for a document in RECAP', max_length=40)),
                ('page_count', models.IntegerField(blank=True, help_text=b'The number of pages in the document, if known', null=True)),
                ('file_size', models.IntegerField(blank=True, help_text=b'The size of the file in bytes, if known', null=True)),
                ('filepath_local', models.FileField(blank=True, db_index=True, help_text=b'The path of the file in the local storage area.', max_length=1000, storage=cl.lib.storage.IncrementingFileSystemStorage(), upload_to=cl.lib.model_helpers.make_pdf_path)),
                ('filepath_ia', models.CharField(blank=True, help_text=b'The URL of the file in IA', max_length=1000)),
                ('ia_upload_failure_count', models.SmallIntegerField(blank=True, help_text=b'Number of times the upload to the Internet Archive failed.', null=True)),
                ('thumbnail', models.FileField(blank=True, help_text=b'A thumbnail of the first page of the document', null=True, storage=cl.lib.storage.IncrementingFileSystemStorage(), upload_to=cl.lib.model_helpers.make_pdf_thumb_path)),
                ('thumbnail_status', models.SmallIntegerField(choices=[(0, b'Thumbnail needed'), (1, b'Thumbnail completed successfully'), (2, b'Unable to generate thumbnail')], default=0, help_text=b'The status of the thumbnail generation')),
                ('plain_text', models.TextField(blank=True, help_text=b'Plain text of the document after extraction using pdftotext, wpd2txt, etc.')),
                ('ocr_status', models.SmallIntegerField(blank=True, choices=[(1, b'OCR Complete'), (2, b'OCR Not Necessary'), (3, b'OCR Failed'), (4, b'OCR Needed')], help_text=b'The status of OCR processing on this item.', null=True)),
                ('object_id', models.PositiveIntegerField()),
                ('filepath', models.FileField(blank=True, help_text=b'The path of the file in the local storage area.', max_length=150, upload_to=cl.lib.model_helpers.make_pdf_path)),
                ('docket_number', models.CharField(db_index=True, help_text=b'Docket number for the case. E.g. 19LBCV00507, 19STCV28994, or even 30-2017-00900866-CU-AS-CJC.', max_length=300)),
                ('document_id', models.CharField(db_index=True, help_text=b'Internal Document Id', max_length=40)),
                ('content_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.ContentType')),
            ],
            options={
                'verbose_name': 'LASC PDF',
            },
        ),
        migrations.CreateModel(
            name='Party',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateTimeField(auto_now_add=True, db_index=True, help_text=b'The time when this item was created')),
                ('date_modified', models.DateTimeField(auto_now=True, db_index=True, help_text=b'The last moment when the item was modified.')),
                ('attorney_name', models.TextField(blank=True, help_text=b'Attorney name')),
                ('attorney_firm', models.TextField(blank=True, help_text=b'Attorney firm')),
                ('entity_number', models.TextField(blank=True, help_text=b'Order entity/party joined cases system')),
                ('party_name', models.TextField(blank=True, help_text=b'Full name of the party')),
                ('party_flag', models.TextField(blank=True, help_text=b'Court code representing party')),
                ('party_type_code', models.TextField(blank=True, help_text=b'Court code representing party position')),
                ('party_description', models.TextField(blank=True, help_text=b'Description of the party')),
                ('docket', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='parties', to='lasc.Docket')),
            ],
            options={
                'verbose_name_plural': 'Parties',
            },
        ),
        migrations.CreateModel(
            name='Proceeding',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateTimeField(auto_now_add=True, db_index=True, help_text=b'The time when this item was created')),
                ('date_modified', models.DateTimeField(auto_now=True, db_index=True, help_text=b'The last moment when the item was modified.')),
                ('past_or_future', models.SmallIntegerField(blank=True, choices=[(1, b'Proceedings in the past'), (2, b'Proceedings in the future')], help_text=b'Is this event in the past or future?', null=True)),
                ('date_proceeding', models.DateTimeField(help_text=b'Date of the past proceeding')),
                ('proceeding_time', models.TextField(blank=True, help_text=b'Time of the past proceeding in HH:MM string')),
                ('am_pm', models.TextField(blank=True, help_text=b'Was the proceeding in the AM or PM')),
                ('memo', models.TextField(blank=True, help_text=b'Memo about the proceeding')),
                ('courthouse_name', models.TextField(blank=True, help_text=b'Courthouse name for the proceeding')),
                ('address', models.TextField(blank=True, help_text=b'Address of the proceeding')),
                ('proceeding_room', models.TextField(blank=True, help_text=b'The court room of the proceeding')),
                ('result', models.TextField(blank=True, help_text=b'Result of the proceeding')),
                ('judge_name', models.TextField(blank=True, help_text=b'Judge in the proceeding')),
                ('event', models.TextField(blank=True, help_text=b'Event that occurred. E.g. "Jury Trial"')),
                ('docket', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='proceedings', to='lasc.Docket')),
            ],
        ),
        migrations.CreateModel(
            name='QueuedCase',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateTimeField(auto_now_add=True, db_index=True, help_text=b'The time when this item was created')),
                ('date_modified', models.DateTimeField(auto_now=True, db_index=True, help_text=b'The last moment when the item was modified')),
                ('internal_case_id', models.CharField(blank=True, db_index=True, help_text=b'Internal case ID. Typically a combination of the docket number, district, and division code.', max_length=300)),
                ('judge_code', models.CharField(blank=True, help_text=b"Internal judge code assigned to the case. First letter of judge's last name, and then four digits.", max_length=10)),
                ('case_type_code', models.CharField(blank=True, help_text=b"A code representing the type of case (similar to the federal nature of suit code in PACER). E.g. '1601' represents 'Fraud (no contract) (General Jurisdiction)'.", max_length=10)),
            ],
            options={
                'verbose_name': 'Queued Case',
            },
        ),
        migrations.CreateModel(
            name='QueuedPDF',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateTimeField(auto_now_add=True, db_index=True, help_text=b'The time when this item was created')),
                ('date_modified', models.DateTimeField(auto_now=True, db_index=True, help_text=b'The last moment when the item was modified')),
                ('internal_case_id', models.CharField(db_index=True, help_text=b'Internal case ID. Typically a combination of the docket number, district, and division code.', max_length=300)),
                ('document_id', models.CharField(db_index=True, help_text=b'Internal Document Id', max_length=40)),
                ('docket', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='queued_pdfs', to='lasc.Docket')),
            ],
            options={
                'verbose_name': 'Queued PDF',
            },
        ),
        migrations.CreateModel(
            name='TentativeRuling',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateTimeField(auto_now_add=True, db_index=True, help_text=b'The time when this item was created')),
                ('date_modified', models.DateTimeField(auto_now=True, db_index=True, help_text=b'The last moment when the item was modified.')),
                ('date_creation', models.DateTimeField(blank=True, help_text=b'Still exploring possible meanings in LASC system.', null=True)),
                ('date_hearing', models.DateTimeField(blank=True, help_text=b'The date of the hearing leading to the ruling.', null=True)),
                ('department', models.TextField(blank=True, help_text=b'Internal court code for department')),
                ('ruling', models.TextField(blank=True, help_text=b'The court ruling as HTML')),
                ('docket', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tentative_rulings', to='lasc.Docket')),
            ],
            options={
                'verbose_name': 'Tentative Ruling',
            },
        ),
        migrations.AlterIndexTogether(
            name='docket',
            index_together=set([('docket_number', 'district', 'division_code')]),
        ),
        migrations.AddField(
            model_name='crossreference',
            name='docket',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cross_references', to='lasc.Docket'),
        ),
        migrations.AddField(
            model_name='action',
            name='docket',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='actions', to='lasc.Docket'),
        ),
    ]
