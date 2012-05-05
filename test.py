from core.lib.index_manager import IndexManager
import sys
from lucene import *

query_string = sys.argv[1]

initVM()
manager = IndexManager()
results = manager.query(query_string)

for result in results:
    print result["title"], result["id_url"], result["score"]
