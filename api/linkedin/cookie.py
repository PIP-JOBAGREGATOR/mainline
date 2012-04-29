import base64
import urllib
import urlparse
import hmac, hashlib
import oauth2
from linkedin_config import *

def validate_signature(credentials):
    if credentials['signature_version'] == '1':
        if 'signature_order' in credentials.keys() and \
        type(credentials['signature_order'] == type(list)):
            base_string = ''
            for key in credentials['signature_order']:
                if key in credentials:
                    base_string = '%s%s' % (base_string, credentials[key])
                else:
                    #missing signature parameter
                    return False
            hash_value = hmac.new(SECRET_KEY, base_string, hashlib.sha1).digest()
            signature = base64.b64encode(hash_value)
            if signature == credentials['signature']:
                #signature validation succeeded
                return True
            else:
                #signature validation failed
                return False
        else:
            #signature order missing
            return False
    else:
        #unknown cookie version
        return False


def exchange(credentials):
    consumer = oauth2.Consumer(API_KEY, SECRET_KEY)
    client = oauth2.Client(consumer)

    resp, content = client.request(ACCESS_TOKEN_URL, "POST", \
                    urllib.urlencode({'xoauth_oauth2_access_token':credentials['access_token']}))

    if resp['status'] == '200':
        oauth = dict(urlparse.parse_qsl(content))
        return oauth
    else:
        print resp['status']
        return None
