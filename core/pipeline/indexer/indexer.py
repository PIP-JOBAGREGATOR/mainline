import MySQLdb
import simplejson as json
import sys
import os
from copy import copy

from lucene import *


sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), os.path.pardir)))

from pstep import PipelineStep

INDEX_PATH = 'job-index'

BOOSTED_FIELDS = {"title": 10.0, "description": 0.2}
DEFAULT_BOOST = 3.0

class IndexStep(PipelineStep): 
    def __init__(self):
        # Init lucene jvm
        initVM()

        # open store and init analyzer
        self.store = SimpleFSDirectory(File(INDEX_PATH))
        self.analyzer = StandardAnalyzer(Version.LUCENE_CURRENT)

        # Init writer
        self.writer = IndexWriter(self.store, self.analyzer, True, IndexWriter.MaxFieldLength.UNLIMITED) 

    def read(self):
        conn = MySQLdb.connect("localhost", "root", "root", "job_agregator")
        cursor = conn.cursor();
        cursor.execute("SELECT job_info FROM jobs")

        jobs = []
        for row in cursor.fetchall():    
            job_dict = json.loads(row[0]) 
            jobs.append(job_dict)
        return jobs

    def process_item(self, job):
        print job["url"]
        doc = Document()
        fields = {}
        for key, value in job.iteritems():      
            field = Field(key, str(value), Field.Store.YES, Field.Index.ANALYZED)
            if key in BOOSTED_FIELDS:
                print key
                field.setBoost(BOOSTED_FIELDS[key])
            else:
                field.setBoost(DEFAULT_BOOST)
            doc.add(field)

        return [doc]

    def close(self):            
        self.writer.close()
        self.store.close()

    def write(self, documents):
        for doc in documents:
            self.writer.addDocument(doc) 
