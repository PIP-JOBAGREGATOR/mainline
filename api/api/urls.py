from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    (r'linkedin.html$', 'views.linkedin'),
    (r'^api/search/$', 'views.search'),
    (r'^api/oauth/$', 'views.oauth'),
    (r'^api/cv/refresh/$', 'views.cv_refresh'),
    (r'^api/cv/get/$', 'views.cv_get'),
    # Examples:
    # url(r'^$', 'api.views.home', name='home'),
    # url(r'^api/', include('api.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)
