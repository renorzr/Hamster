function Browser(root_){
  var self=this;
  var path='/';
  var root=root_;
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
        var u=new Uploader($('#uploader'));
        u.upload('/upload',path,function(progress){
          if (progress.done){
            self.update();
          }
        });
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