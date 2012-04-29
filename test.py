from core.lib.index_manager import IndexManager
import sys

query_string = sys.argv[1]
print query_string

manager = IndexManager()
results = manager.query(query_string, {"company": "RED"})

for result in results:
    print result["title"], result["score"]
