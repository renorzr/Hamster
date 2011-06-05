function UploadPanel(uploader){
  var self=this;
  uploader.addListener('progress',function(evt){
    $('.progress').text(evt.sent+'/'+evt.total);
  });

  self.inflate=function(){
    var file=uploader.file();
    var r={filename:file.name,filesize:file.size};
    return $('#upload-panel-tmpl').tmpl(r);
  }
}
