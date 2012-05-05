from core.lib.index_manager import IndexManager
import sys

query_string = "videochat"

manager = IndexManager()
results = manager.query(query_string, {"company": "RED"})

for result in results:
    print result.keys()
    print result["title"], result["url"], result["score"]

manager = IndexManager()
results = manager.query(query_string)

for result in results:
    print result.keys()
    print result["title"], result["url"], result["score"]
