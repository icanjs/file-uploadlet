import can from 'can/';
import 'can/map/define/';
import viewModel from './view-model';
import './styles.less!';
import makeUploadModel from './make-model';

/**
 * The file-upload component is a UI-less component. The viewModel attributes and
 * methods are exposed to any child component, so you can implement a custom UI as
 * a child component.
 */
can.Component.extend({
  tag:'file-uploadlet',
  viewModel,
  events: {
    /**
     * When a new file is added, mark it as `state=pending`, add the `batch`
     * number, and set the progressPercent to 0. If `autoUpload` is enabled and
     * upload isn't in progress, start uploading files.
     */
    '{files} add': function(files, ev, attr){
      let newFile = attr[0],
        batch = this.viewModel.attr('currentBatch'),
        autoUpload = this.viewModel.attr('autoUpload');

      // Check the file extension.
      let p = newFile.attr('name').lastIndexOf('.'),
        ext = (p >= 0) ? newFile.attr('name').substring(p + 1) : 'no-ext',
        extensions = this.viewModel.attr('extensions');

      if (!extensions[ext]) {
        newFile.attr('state', 'errored');
        newFile.attr('errorMessage', 'Invalid file extension: ' + ext);
      }

      // Check the max file size.
      let maxFileSize = this.viewModel.attr('maxFileSize'),
        fileSize = newFile.attr('size');

      if (maxFileSize) {
        if(fileSize > maxFileSize){
          newFile.attr('state', 'errored');
          newFile.attr('errorMessage', 'This file\'s size (' + fileSize + ') is larger than the allowed ' + maxFileSize + 'bytes.');
        }
      }

      // Check the min file size.
      let minFileSize = this.viewModel.attr('minFileSize');

      if (minFileSize) {
        if(fileSize < minFileSize){
          newFile.attr('state', 'errored');
          newFile.attr('errorMessage', 'This file\'s size (' + fileSize + ') is smaller than the allowed ' + minFileSize + 'bytes.');
        }
      }

      // It passed validation. Prepare for upload.
      if (newFile.attr('state') !== 'errored') {
        newFile.attr('batch', batch);
        newFile.attr('progressPercent', 0);
        newFile.attr('progressSize', 0);
        newFile.attr('state', 'pending');
      }

      if (autoUpload) {
        this.viewModel.uploadAll();
      }
    }
  }
});

export {makeUploadModel};
