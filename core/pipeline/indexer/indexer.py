import MySQLdb
import simplejson as json
import sys
import os
from copy import copy
from time import time

from lucene import *


sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), os.path.pardir)))

from pstep import PipelineStep

INDEX_PATH = 'job-index'

BOOSTED_FIELDS = {"title": 10.0, "description": 0.2}
DEFAULT_BOOST = 3.0

UPDATE = "U"
REMOVE = "R"

class IndexStep(PipelineStep): 
    def __init__(self):
        # Init lucene jvm
        initVM()

        self.last_timestamp = int(time()) - 86400
        self.before_last_timestamp = int(time()) - 86400

    def open(self):
        # open store and init analyzer
        self.store = SimpleFSDirectory(File(INDEX_PATH))
        self.analyzer = StandardAnalyzer(Version.LUCENE_CURRENT)

        # Init writer
        self.writer = IndexWriter(self.store, self.analyzer, IndexWriter.MaxFieldLength.UNLIMITED) 

    def read(self):
        conn = MySQLdb.connect("localhost", "root", "root", "job_agregator")
        cursor = conn.cursor();
        # Reading new and updated jobs
        cursor.execute("SELECT job_info FROM jobs WHERE last_update > %s", [self.last_timestamp])

        jobs = []
        for row in cursor.fetchall():    
            job_dict = json.loads(row[0]) 
            jobs.append((job_dict, UPDATE))

        # Reading deleted jobs
        cursor = conn.cursor()
        cursor.execute("SELECT job_info FROM jobs WHERE last_crawled < %s AND last_crawled > %s", [self.last_timestamp, self.before_last_timestamp])
        for row in cursor.fetchall():
            job_dict = json.loads(row[0])
            jobs.append((job_dict, REMOVE))
        return jobs

    def process_item(self, item):
        action = item[1]
        job = item[0]

        doc = Document()
        fields = {}
        for key, value in job.iteritems():      
            field = Field(key, str(value), Field.Store.YES, Field.Index.ANALYZED)
            if key in BOOSTED_FIELDS:             
                field.setBoost(BOOSTED_FIELDS[key])
            else:
                field.setBoost(DEFAULT_BOOST)

            doc.add(field)

        return [(doc, action, job["id_url"])]

    def close(self):            
        self.writer.close()
        self.store.close()

        self.before_last_timestamp = self.last_timestamp
        self.last_timestamp = time()

    def write(self, documents):
        self.open()

        for doc, action, id_url in documents:
            self.writer.deleteDocuments(Term("id_url", id_url))

            if action == UPDATE:
                self.writer.addDocument(doc)
        self.close()
