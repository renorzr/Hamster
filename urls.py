from django.conf.urls.defaults import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'filesrv.views.index'),
    url(r'^ls$', 'filesrv.views.ls'),
    url(r'^download$', 'filesrv.views.download'),
    url(r'^upload$', 'filesrv.views.upload'),
    url(r'^check$', 'filesrv.views.check'),
    # url(r'^Hamster/', include('Hamster.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)
