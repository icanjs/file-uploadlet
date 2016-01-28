# `<file-uploadlet>`
A UI-less Component that helps automate the tedious stuff associated with doing file uploads.  BYO-UI

[![npm version](https://badge.fury.io/js/file-uploadlet.svg)](https://badge.fury.io/js/file-uploadlet)

[![NPM](https://nodei.co/npm/file-uploadlet.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/file-uploadlet/)

## Installation
```
npm install file-uploadlet --save
```

You can use any of the builds in the dist folder to meet your project needs.

Using CanJS's built-in support for StealJS, you can now import the module directly inside your templates.  For example:
```html
<can-import from="file-uploadlet"/>

<file-uploadlet {(files)}="files"
  {model}="model"
  extensions="jpeg,png,jpg"
  max-concurrent="3">

  <!-- Insert UI Here -->

</file-uploadlet>
```


## Usage
The `<file-uploadlet>` UI-less, so Bring Your Own UI.  It is meant to be used as a wrapper for your UI.  Set up the bindings in your template on the viewModel/HTML attributes and you have a sweet little uploader.

Once you have your template ready to go, you'll need to setup a `UploadModel` in the parent component.

## Setting up an `UploadModel`
This package includes a handy `makeUploadModel` utility to get file uploads working quickly.  Import it into your parent component's viewModel and set it up like this:
```js
import {makeUploadModel} from 'file-uploadlet';

// TODO: Finish this.
```

For an easy way to input files, install the `file-droplet` component from NPM and wrap it around this one.  
```html
<can-import from="file-droplet"/>

<file-droplet>
  <file-uploadlet {(files)}="files"
      {model}="model"
      extensions="tiff,jpeg,png,jpg,csv,pdf,txt"
      max-concurrent="3">
</file-droplet
```

You can also install the `file-input-button` from NPM and put it inside this component to use the browser's file select dialog.
```html

```

## HTML Attributes for Configuration / Input
 - `extensions`: A comma-separated list of the allowed file extensions. If it's not provided, all extensions are allowed.  Use `"no-ext"` to allow files without extensions. A file with the wrong extension it will have its `state` set to `errored`.
 - `min-file-size`: The minimum file size in bytes. A file that is too small will have its `state` set to `errored`.
 - `max-file-size`: The maximum file size in bytes. A file that is too big will have its `state` set to `errored`.

## HTML Attributes for One-Way Binding


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


## Contributing
Pull requests are welcome. Analyze the code. See where it needs improvement, and let me know. Please, help make it better!

## Authors

- [Marshall Thompson](https://github.com/marshallswain)

[![Built with StealJS](./dist/build-with-stealjs.jpg)](http://StealJS.com)
