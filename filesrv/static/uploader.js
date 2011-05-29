function Uploader(fileElem){
  var self=this;
  var file=fileElem.get(0).files[0];
  var data=file.getAsBinary();

  self.upload=function(url,remotePath,callback){
    $.ajax({
      type: 'POST',
      url: url,
      data: data,
      success: callback,
      headers: {'x-target-path': remotePath+file.name, 'X-CSRFToken':$.cookie('csrftoken')}
    });
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
