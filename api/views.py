import json
import os.path
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), os.path.pardir, 'core', 'lib')))

print sys.path

from index_manager import IndexManager
from django.http import HttpResponse

def search(request):
    if request.method == 'POST':
        content = request.POST.get('content')
        data = json.loads(content)

        offset = data["offset"]
        size = data["size"]
        queryString = data["queryString"]
        cv = data["cv"]

        index = IndexManager()
        results = index.simple_query(queryString)
        response = HttpResponse()
        response.content = json.dumps(results)
        response.status_code = 200

        return response;

