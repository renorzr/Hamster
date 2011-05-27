from django.http import HttpResponse
from django.template import Context, Template
from django.utils import simplejson
import os
from models import Folder

class JsonResponse(HttpResponse):
    """ JSON response class"""
    def __init__(self,content='',mimetype="application/json",*args,**kwargs):
        if not content:
            content=[]
        content=simplejson.dumps(content)
        super(JsonResponse,self).__init__(content,mimetype,*args,**kwargs)

def ls(request):
    path=request.GET.get('path')
    if path[0]=='/':
      path=path[1:]
    if path=='':
      data=map(lambda x:{'name':x.name,'dir':True},Folder.objects.all())
    else:
      idx=path.find('/')
      root=path[:idx]
      folders=Folder.objects.filter(name=root)
      if len(folders)>0:
        folder=os.path.join(folders[0].path,path[idx+1:])
      data=map(lambda x:{'name':x,'dir':os.path.isdir(os.path.join(folder,x))},os.listdir(folder))
    return JsonResponse({'status':'ok','data':data})
