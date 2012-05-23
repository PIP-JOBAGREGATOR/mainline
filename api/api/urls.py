from django.conf.urls import patterns, include, url
from django.conf import settings

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    (r'^$', 'views.index'),
    (r'^index.html$', 'views.index'),
    (r'^api/search/$', 'views.search'),
    (r'^api/oauth/$', 'views.oauth'),
    (r'^api/cv/refresh/$', 'views.cv_refresh'),
    (r'^api/cv/get/$', 'views.cv_get'),
    (r'^api/cv/set/$', 'views.cv_set'),
    # Examples:
    # url(r'^$', 'api.views.home', name='home'),
    # url(r'^api/', include('api.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)

if settings.DEBUG:
    urlpatterns += patterns('',
        url(r'^(?P<path>.*)$', 'django.views.static.serve', {
            'document_root': '../ui/',
            }),
    )
