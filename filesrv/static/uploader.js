function Uploader(fileElem,url,remotePath,callbacks){
  var self=this;
  var file=fileElem.get(0).files[0];
  var start=0;
  var lastStart=-1;
  var intervalId=-1;
  var blockSize=1024*1024*10;
  var chunkStartTime=0;
  var EXP_CHUNK_TIME=1000;

  self.check=function(callback){
    $.getJSON(url+'check',{targetPath:remotePath+file.name},function(r){
      start=r.data.received;
      if (callback) callback();
    });
  }

  self.upload=function(){
    intervalId=setInterval(function(){self.uploadChunk()},EXP_CHUNK_TIME);
  }

  self.stop=function(){
    if (intervalId!=-1) clearInterval(intervalId);
  }

  self.uploadChunk=function(){
    console.log('lastStart='+lastStart+' start='+start);
    if (lastStart>=start) return;
    lastStart=start

    chunkStartTime=new Date();

    var chunk=self.getChunk();

    var req=new XMLHttpRequest();
    req.open('post',url+'upload',true);
    req.setRequestHeader("Cache-Control", "no-cache");
    req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    req.setRequestHeader("X-Chunk-Offset", start);
    req.setRequestHeader("X-Chunk-Size", chunk.size);
    req.setRequestHeader("X-File-Size", file.size);
    req.setRequestHeader("X-CSRFToken", $.cookie('csrftoken'));
    req.setRequestHeader("X-Target-Path", remotePath+file.name);
     
    req.onreadystatechange=function(){
      if (req.readyState==4 && req.status==200) {
//        var chunkTime=new Date()-chunkStartTime;
//        blockSize=blockSize/chunkTime*EXP_CHUNK_TIME
//        console.log('blockSize='+blockSize,' chunkTime='+chunkTime);
        start+=chunk.size;
      }
    }

    console.log('send '+chunk.size);
    req.send(chunk);
  }

  self.resume=function(){
    self.check(function(){self.upload();});
  }

  self.getChunk=function(){
    var end=start+blockSize;
    if (end>file.size) end=file.size;
    if (file.mozSlice) {
      return file.mozSlice(start, end);
    } else if (file.webkitSlice) {
      return file.webkitSlice(start, end);
    } else if (file.slice) {
      return file.slice(start, end);
    } else {
      return false;
    }
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
