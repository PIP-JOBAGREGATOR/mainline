import json
import os.path
import sys
import urllib
import MySQLdb

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), os.path.pardir, 'core', 'lib')))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'linkedin')))

#from index_manager import IndexManager
from django.http import HttpResponse
from linkedin_config import *
from cookie import *
from query import *

RESULTS_PER_PAGE = 10

def search(request):
    response = HttpResponse()

    if request.method == 'POST':
        content = request.POST.get('content')
        data = json.loads(content)

        offset = data.get("offset", 0)
        size = data.get("size", RESULTS_PER_PAGE)
        queryString = data["queryString"]
        cv = data.get("cv", "")

        index = IndexManager()

        temp = index.query(queryString)
        results = []
        for job in temp:
            result = {}
            result["titlu"] = job['title']
            result["descriere"] = job['description'][:200]
            result["link"] = job['url']
            results.append(result)

        response.content = json.dumps(results)
        response.status_code = 200
        index.close()
    else:
        response.status_code = 400

    return response;


def linkedin(request):
    f = open('linkedin.html', 'r')
    return HttpResponse(f.read())


#exchange JSAPI Token for REST API OAuth Token
#and store it in a session
def oauth(request):
    response = HttpResponse()

    cookie_name = 'linkedin_oauth_%s' % API_KEY
    if cookie_name not in request.COOKIES:
        response.content = '%s cookie not found' % (cookie_name,)
        response.status_code = 404
    else:
        credentials_json = urllib.unquote(request.COOKIES[cookie_name])
        credentials = json.loads(credentials_json)

        bearer_token = credentials['access_token']
        member_id = credentials['member_id']

        #signature validation succeeded
        if validate_signature(credentials) == True:
            oauth = exchange(credentials)
            if oauth is not None:
                request.session['token'] = oauth
                response.content = 'token exchange ok'
                response.status_code = 200
            else:
                response.content = 'token exchange failed'
                response.status_code = 404
        #signature validation failed
        else:
            response.content = 'signature validation failed'
            response.status_code = 404

    return response


#update resume from linkedin
def cv_refresh(request):
    response = HttpResponse()

    oauth = request.session['token']
    pers_id = get_id(oauth)
    cv_json =  get_cv(oauth)

    if pers_id is not None and cv_json is not None:
        conn = MySQLdb.connect("localhost", "root", "root", "job_agregator")
        cursor = conn.cursor()
        cursor.execute("SELECT id "
                       "FROM resume "
                       "WHERE id = %s", [pers_id])

        insert = True
        for row in cursor.fetchall():
            insert = False

        if insert == True:
            cursor.execute("INSERT INTO resume "
                           "VALUES(%s, %s)", [pers_id, cv_json])
        else:
            cursor.execute("UPDATE resume "
                           "SET text = %s "
                           "WHERE id = %s", [cv_json, pers_id])
        cursor.close()
        conn.commit()
        conn.close()

        response.content = 'refresh successful'
        response.status_code = 200
    else:
        response.content = 'refresh resume failed'
        response.status_code = 404

    return response


def cv_get(request):
    response = HttpResponse()

    oauth = request.session['token']
    pers_id = get_id(oauth)

    if pers_id is not None:
        conn = MySQLdb.connect("localhost", "root", "root", "job_agregator")
        cursor = conn.cursor()
        cursor.execute("SELECT text "
                       "FROM resume "
                       "WHERE id = %s", [pers_id])

        if cursor.rowcount == 0:
            response.content = 'no resume stored'
            response.status_code = 404
        else:
            row = cursor.fetchone()
            response.content = row[0]
            response.status_code = 200

        cursor.close()
        conn.close()
    else:
        response.content = 'error'
        response.status_code = 404

    return response
