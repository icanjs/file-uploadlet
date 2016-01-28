import $ from 'jquery';
import Model from 'can/model/';

export default function(config) {

  if (!config.url) {
    throw new Error('You must pass a URL in the makeModel configuration object.');
  }
  if (config.contentType === undefined) {
    config.contentType = 'application/json';
  }
  if (config.processData === undefined) {
    config.processData = true;
  }
  if (!config.formRequestData) {
    throw new Error('The formRequestData function is required for makeUploadModel.');
  }
  if (!config.successCallback) {
    throw new Error('The successCallback function is required for makeUploadModel.');
  }
  if (!config.failureCallback) {
    throw new Error('The failureCallback function is required for makeUploadModel.');
  }

  return Model.extend({
    create: function(fileData) {
      let params = config.formRequestData(fileData);
      var request = $.ajax({
        xhr: function() {
          var xhr = new window.XMLHttpRequest();
          // Download progress
          xhr.upload.addEventListener('progress', function(event) {
            if (event.lengthComputable) {
              let percent = Math.round((event.loaded / event.total) * 100);
              fileData.attr('progressPercent', percent);
              fileData.attr('progressSize', percent * fileData.attr('size') / 100);
            }
          }, false);
          return xhr;
        },
        url: config.url,
        contentType: config.contentType,
        processData: config.processData,
        type: config.type || 'POST',
        data: params
      })
        .success(function(response) {
          fileData.attr('state', 'uploaded');
          config.successCallback(response, fileData);
        })
        .fail(function(e) {
          fileData.attr('state', 'errored');
          fileData.attr('error', e);
          config.failureCallback(e, fileData);
        });

      // Set up the xhr on the file so we can reference it later, if needed.
      fileData.attr('xhr', request);
      
      return request;
    }
  }, {});
}
