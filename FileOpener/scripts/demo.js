(function (global) {
  var DemoViewModel,
//      url = "https://en.wikipedia.org/wiki/Safari",
      app = global.app = global.app || {};
  
  DemoViewModel = kendo.data.ObservableObject.extend({
    
    _openFile: function (file) {
      alert('opening: ' + file);
      cordova.plugins.fileOpener2.open(
        file,
        'image/png', // make sure this is the same mimetype as your file
        {
          error : function(e) {
            alert('Error status: ' + e.status + ' - Error message: ' + e.message);
          },
          success : function () {
            console.log('file opened successfully');
          }
        }
      );
    },
    
    localFile: function () {
      if (!this.checkSimulator()) {
        var that = this;

        // this code depends on the Cordova File plugin
        window.resolveLocalFileSystemURL(
          cordova.file.applicationDirectory + "www/styles/images/logo.png",
          function(fileEntry) {
            that._openFile(fileEntry.nativeURL);
          },
          this._fileErrorHandler);
      }
    },

    remoteFile: function () {
      if (!this.checkSimulator()) {
				var fileTransfer = new FileTransfer();
        var loadFrom = encodeURI("https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png");
        var saveTo = "cdvfile://localhost/persistent/downloaded_logo.png"
        var that = this;

        fileTransfer.download(
            loadFrom,
            saveTo,
            function(entry) {
              alert("download complete: " + entry.toURL());
              that._openFile(entry.toURL());
            },
            function(error) {
                alert("download error source " + error.source);
              //  alert("download error target " + error.target);
              //  alert("upload error code" + error.code);
            },
            false,
            {}
        );
      }
    },
    
    _fileErrorHandler: function(e) {
      var msg = '';
      switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
	        msg = 'QUOTA_EXCEEDED_ERR';
  	      break;
        case FileError.NOT_FOUND_ERR:
    	    msg = 'NOT_FOUND_ERR';
      	  break;
        case FileError.SECURITY_ERR:
	        msg = 'SECURITY_ERR';
  	      break;
        case FileError.INVALID_MODIFICATION_ERR:
    	    msg = 'INVALID_MODIFICATION_ERR';
      	  break;
        case FileError.INVALID_STATE_ERR:
	        msg = 'INVALID_STATE_ERR';
  	      break;
        default:
    	    msg = 'Unknown Error';
      };
      alert('Error: ' + msg);
    },

    checkSimulator: function() {
      if (window.navigator.simulator === true) {
        alert('This plugin is not available in the simulator.');
        return true;
      } else if (cordova.plugins === undefined || cordova.plugins.fileOpener2 === undefined) {
        alert('Plugin not found. Maybe you are running in AppBuilder Companion app which currently does not support this plugin.');
        return true;
      } else {
        return false;
      }
    }
  });

  app.demoService = {
    viewModel: new DemoViewModel()
  };
})(window);