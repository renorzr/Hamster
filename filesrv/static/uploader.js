function Uploader(fileElem,url,remotePath,callbacks){
  var self=this;
  var file=fileElem.get(0).files[0];
  var start=0;
  var lastStart=-1;
  var intervalId=null;
  var chunkSize=1024*1024*10;
  var chunkStartTime=0;
  var EXP_CHUNK_TIME=10000;
  var MAX_CHUNK_SIZE=1024*1024*50;
  var MIN_CHUNK_SIZE=1024*1024;
  var listeners=[];
  var xhr;
  var UPDATE_INTERVAL=1000;

  self.check=function(callback){
    $.getJSON(url+'check',{path:remotePath+file.name},function(r){
      start=r.data.received;
      if (callback) callback();
    });
  }

  self.upload=function(){
    if (!self.uploading())
      intervalId=setInterval(function(){self.uploadChunk();self.updateProgress()},UPDATE_INTERVAL);
  }

  self.stop=function(){
    if (self.uploading()) {
      clearInterval(intervalId);
      xhr.abort();
      intervalId=null;
      self.fireEvent('done');
    }
  }

  self.updateProgress=function(){
    var elapsed=(new Date()-chunkStartTime);
    var chunkSent=elapsed/EXP_CHUNK_TIME*chunkSize;
    if (chunkSent>chunkSize) chunkSent=chunkSize;
    self.fireEvent('progress',{sent:start+chunkSent,total:file.size});
  }

  self.uploadChunk=function(){
    if (lastStart>=start) return;
    lastStart=start

    chunkStartTime=new Date();

    var chunk=self.getChunk();
    if (!chunk) {
      self.stop();
      return;
    }

    xhr=new XMLHttpRequest();
    xhr.open('post',url+'upload',true);
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("X-Chunk-Offset", start);
    xhr.setRequestHeader("X-Chunk-Size", chunk.size);
    xhr.setRequestHeader("X-File-Size", file.size);
    xhr.setRequestHeader("X-CSRFToken", $.cookie('csrftoken'));
    xhr.setRequestHeader("X-Target-Path", remotePath+file.name);
     
    xhr.onreadystatechange=function(){
      if (xhr.readyState==4 && xhr.status==200) {
        var chunkTime=new Date()-chunkStartTime;
        chunkSize=chunkSize/chunkTime*EXP_CHUNK_TIME
        if (chunkSize>MAX_CHUNK_SIZE) chunkSize=MAX_CHUNK_SIZE;
        if (chunkSize<MIN_CHUNK_SIZE) chunkSize=MIN_CHUNK_SIZE;
        start+=chunk.size;
        self.fireEvent('progress',
            {sent:start,total:file.size,chunkSize:chunkSize,chunkTime:chunkTime});
      }
    }

    xhr.send(chunk);
  }

  self.resume=function(){
    if (!self.uploading())
      self.check(function(){self.upload();});
  }

  self.getChunk=function(){
    if (start>=file.size) return false;
    var end=start+chunkSize;
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

  self.uploading=function(){
    return intervalId!=null;
  }

  self.fireEvent=function(eventName,params){
    for (var i in listeners){
      var l=listeners[i];
      if (l.eventName==eventName){
        l.callback(params);
      }
    }
  }

  self.addListener=function(eventName,callback){
    listeners.push({eventName:eventName,callback:callback});
    return listeners.length-1;
  }

  self.removeListener=function(index){
    listeners[index]=eventHandler.pop();
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
