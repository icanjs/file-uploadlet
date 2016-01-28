## `<file-uploadlet>`
The `<file-uploadlet>` component is a UI-less utility that helps automate the tedious stuff associated with doing file uploads.

## HTML Attributes
 - `extensions`: A comma-separated list of the allowed file extensions. If it's not provided, all extensions are allowed.  Use `"no-ext"` to allow files without extensions. A file with the wrong extension it will have its `state` set to `errored`.
 - `min-file-size`: The minimum file size in bytes. A file that is too small will have its `state` set to `errored`.
 - `max-file-size`: The maximum file size in bytes. A file that is too big will have its `state` set to `errored`.

## File `state`
A file can have one of the following states:
 - `pending`
 - `uploading`
 - `uploaded`
 - `stopped`
 - `errored`: Whenever a file is set to `errored`, the error message will be available on the files `errorMessage` attribute.

## Overall Progress
A few of the included attributes exist to help with creating progress bars.

### Progress Batches
Each file's `batch` attribute keeps track of which files belong to the current overall progress. The component's `currentBatch`  increments after all current `files` have their status set to `uploaded`, `stopped`, or `errored`. A file's `batch` number is set to the `currentBatch` any time downloading begins.  When a file is `stopped`, `errored`, its `batch` property is set to `"none"`, which removes it from the current progress.  Once the current batch resolves and the `currentBatch` number increments, the `batch` attribute is removed from the files in the finished batch.
