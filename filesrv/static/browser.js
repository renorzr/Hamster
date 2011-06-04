function Browser(root_){
  var self=this;
  var path='/';
  var root=root_;
  var uploader=null;
  self.update=function(){
    $.getJSON('/ls?path='+path,function(r){
      root.html('');
      r['path']=path;
      $('#browser-template').tmpl(r).appendTo(root);
      $('.entry.dir').click(function(){
        path+=$(this).attr('name')+'/';
        self.update()
      });
      $('.entry.file').click(function(){
        window.open('/download?path='+path+$(this).attr('name'));
      });

      $('.up-button').click(function(){
        self.up();
      });

      $('.upload-button').click(function(){
        uploader=new Uploader($('#uploader'),'/',path);
        uploader.addListener('progress',function(data){
          var percent=Math.floor(data.sent/data.total*100);
          $('.progress').text(percent+'%');
        });
        uploader.upload();
      });

      $('.stop-button').click(function(){
        if (uploader.uploading())
          uploader.stop();
        else
          uploader.resume();
      });
    });
  }

  self.setPath=function(p){
    path=p;
  }

  self.getPath=function(){
    return path;
  }

  self.up=function(){
    path=path.replace(/\/[^/]+\/$/,'/');
    self.update();
  }
}
