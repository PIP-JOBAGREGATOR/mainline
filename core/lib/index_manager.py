import os

from lucene import *

INDEX_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), os.path.pardir, 'pipeline', 'job-index'))

class IndexManager():
    def __init__(self):
        getVMEnv().attachCurrentThread()
        self.store = SimpleFSDirectory(File(INDEX_PATH))
        self.analyzer = StandardAnalyzer(Version.LUCENE_CURRENT)
        self.searcher = IndexSearcher(self.store, True)
        self.reader = IndexReader.open(self.store, False)

    def doc_to_dict(self, doc):
        fields = self.reader.getFieldNames(IndexReader.FieldOption.ALL)
        job_dict = {}
        for field in fields:
            try:
                job_dict[field] = doc[field]
            except:
                pass
        return job_dict

    def scoredocs_to_jobs(self, scoreDocs):
        docs = []
        for score_doc in scoreDocs:
            docid = score_doc.doc
            doc = self.searcher.doc(docid)
            job_dict = self.doc_to_dict(doc)
            job_dict["score"] = score_doc.score
            docs.append(job_dict)
        return docs
 
    def build_query(self, query_string, additional_fields):
        should = BooleanClause.Occur.SHOULD
        must = BooleanClause.Occur.MUST

        field_names = ["title", "description"]
        field_values = [query_string, query_string]
        for key, value in additional_fields.iteritems():
            field_names.append(key)
            field_values.append(value)

        flags = [must, should]
        flags.extend([should] * len(additional_fields))

        query = MultiFieldQueryParser.parse(Version.LUCENE_CURRENT,
                                            field_values,
                                            field_names,
                                            flags,
                                            self.analyzer)
        return query

    def close(self):
        self.searcher.close()
        self.reader.close()
        self.store.close()

    def query(self, query_string, additional_fields={}):
        query = self.build_query(query_string, additional_fields)
        topDocs = self.searcher.search(query, 20)
        return self.scoredocs_to_jobs(topDocs.scoreDocs)
