function Uploader(fileElem,url,remotePath,callbacks){
  var self=this;
  var file=fileElem.get(0).files[0];
  var data=file.getAsBinary();
  var start=0;

  self.check=function(callback){
    $.getJSON(url+'check',{targetPath:remotePath+file.name},function(r){
      start=r.data.received;
      if (callback) callback();
    });
  }

  self.upload=function(){
    var chunk;
    if (file.mozSlice) {
      chunk=file.mozSlice(start, file.size);
    } else if (file.webkitSlice) {
      chunk=file.webkitSlice(start, file.size);
    } else if (file.slice) {
      chunk=file.slice(start, file.size);
    } else {
      return false;
    }

    var req=new XMLHttpRequest();
    req.open('post',url+'upload',true);
    req.setRequestHeader("Cache-Control", "no-cache");
    req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    req.setRequestHeader("X-File-Size", file.size);
    req.setRequestHeader("X-CSRFToken", $.cookie('csrftoken'));
    req.setRequestHeader("X-Target-Path", remotePath+file.name));
    for (var e in callbacks){
      req.addEventListener(e,callbacks[e]);
    }
     
    req.send(chunk);
  }

  self.resume=function(){
    self.check(function(){self.upload();});
  }
}

function upload(url,data,remotePath,callback){
  $.ajax({
    type: 'POST',
    url: url,
    data: data,
    success: function(){callback({done:true})},
    headers: {'x-target-path': remotePath, 'X-CSRFToken':$.cookie('csrftoken')}
  });
}
