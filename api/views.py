import json
import os.path
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), os.path.pardir, 'core', 'lib')))

print sys.path

from index_manager import IndexManager
from django.http import HttpResponse

def search(request):
    response = HttpResponse()

    if request.method == 'POST':
        content = request.POST.get('content')
        data = json.loads(content)

        offset = data["offset"]
        size = data["size"]
        queryString = data["queryString"]
        cv = data["cv"]

        index = IndexManager()

        temp = index.simple_query(queryString)
        results = '['
        for job in temp:
            title = job['title']
            description = job['description']
            link = job['link']

            duplicat = '{"duplicate":[{"titlu":"%s","descriere":"%s","link":"%s"}]}' % (title, description, link)
            temp = '%s,%s' % (temp, duplicat)
        results = '%s]' % (results,)

        response.content = json.dumps(results)
        response.status_code = 200
    else:
        response.status_code = 400

    return response;

