import can from 'can/';
import 'can/map/define/';

let VM = can.Map.extend({
  define: {
    // `files` is the gateway to get into the uploads. Set a list of files here
    // and it will be pushed into the uploads array.
    files: {
      set(files){
        return files;
      }
    },

    /**
     * The `done` attribute is a boolean that is false until there are no
     * `pending` or `uploading` files. Once it becomes true, it increments the
     * viewModel's `currentBatch` number.
     */
    done: {
      get(){
        let files = this.attr('files'),
          done = true;

        if (files.attr('length')){
          files.forEach(file => {
            let batch = file.attr('batch'),
              state = file.attr('state');

            if (batch === this.attr('currentBatch') && (state === 'pending' || state === 'uploading')) {
              done = false;
            }
          });
        } else {
          done = false;
        }
        // If we're done, increment the `currentBatch` number.
        if (done) {
          this.attr('currentBatch', this.attr('currentBatch') + 1);
        }
        return done;
      }
    },

    /**
     * `errored` is an array that contains all files with an `errorMessage`
     * attribute.
     */
    errored: {
      value: [],
      get(){
        let files = this.attr('files'),
          messages = [];

        files.each(file => {
          let message = file.attr('errorMessage');
          if (message) {
            messages.push(message);
          }
        });

        return messages;
      }
    },

    /**
     * `fileTypes` is configurable using a comma-separated string. It gets
     * converted to a map where each fileType as a key and the value is `true`
     * for efficient comparison like `if(fileTypes.jpg)`.
     */
    extensions: {
      set(value){
        let types = {},
          values = value.replace(' ', '').split(',');

        values.forEach(type => {
          types[type] = true;
        });
        return types;
      }
    },

    /**
     * `uploadingCount` is an integer that represents the number of files that
     * are currently `uploading`.
     */
    uploadingCount: {
      get(){
        let files = this.attr('files').attr();
        let uploading = files.filter(function(file){
          return file.state === 'uploading';
        });
        return uploading.length;
      }
    },

    /**
     * The `progress` attribute is an integer that represents the overall
     * percentage of completion.
     */
    progress: {
      get(){
        let files = this.attr('files'),
          done = this.attr('done'),
          progressSize = 0,
          totalSize = 0;

        files.each(file => {
          if (file.attr('batch') === this.attr('currentBatch')) {
            totalSize += parseInt(file.attr('size'));
            progressSize += parseInt(file.attr('progressSize'));
          }
        });

        let percentage = Math.round((progressSize / totalSize) * 100);
        if (done && !percentage) {
          percentage = 100;
        }
        return percentage || 0;
      }
    },

    /**
     * The maximum number of simultaneous uploads.
     */
    maxConcurrent: {
      value: 3,
      type: Number
    }
  },

  /**
   * `currentBatch` is an integer that represents the progress bar's batch
   * number. Whenever the `done` attribute is true, it increments this number
   * so that the next set of files added to the list get a progress bar that
   * starts at '0'.
   */
  currentBatch: 0,

  /**
   * If `autoUpload` is true, it will start uploading as soon as a file is pushed
   * into the `files` List.
   */
  autoUpload: true,

  /**
   * The maximum file size in bytes.
   */
  maxFileSize: null,

  /**
   * Send a single file to the server. If `keepGoing` is passed as `true`, it
   * will call `uploadAll()` once there is a response from the server.
   */
  upload(file, keepGoing){
    var self = this;

    file.attr('state', 'uploading');
    this.resetProgress(file);

    function checkKeepGoing(){
      if(keepGoing) {
        self.uploadAll();
      }
    }

    this.attr('model').create(file)
      .then(checkKeepGoing, checkKeepGoing);
  },
  uploadAll(){
    // Looks for 'pending' files only.
    var files = this.attr('files'),
      canUpload = (this.attr('maxConcurrent') - this.attr('uploadingCount')) > 0;

    // Prevent unnecessary looping.
    if (canUpload) {
      files.each(file => {
        let state = file.attr('state');
        canUpload = (this.attr('maxConcurrent') - this.attr('uploadingCount')) > 0;

        if (state === 'pending' && canUpload){
          this.upload(file, true);
        }
      });
    }
  },

  /**
   * Cancels the xhr request, if applicable, then sets the `state` to `"stopped"`.
   */
  stop(file){
    let xhr = file.attr('xhr');
    if (xhr) {
      xhr.abort();
    }
    file.attr('state', 'stopped');
    this.resetProgress(file);
  },

  /**
   * Calls `stop()` on all files.
   */
  stopAll(){
    let files = this.attr('files');

    files.forEach(file => {
      this.stop(file);
    });
  },

  /**
   * Stops the file upload, if applicable, then splices the file from the list.
   */
  remove(file){
    let files = this.attr('files'),
      index = files.indexOf(file);

    this.stop(file);
    files.splice(index, 1);
  },

  /**
   * Calls `remove()` on all files.
   */
  removeAll(){
    let files = this.attr('files');

    files.forEach(file => {
      this.remove(file);
    });
  },

  /**
   * Sets the progress-related attributes of a file to `0`;
   */
  resetProgress(file){
    file.attr('progressPercent', 0);
    file.attr('progressSize', 0);
  }
});

export default VM;
