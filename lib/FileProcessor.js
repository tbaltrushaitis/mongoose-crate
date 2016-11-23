'use strict'

class FileProcessor {

    createFieldSchema () {
        return {
            size: Number
          , name: String
          , type: {
                type: String
            }
          , url:    String
          , path:   String
          , link:   String
        }
    }

    process (attachment, storageProvider, model, callback) {
        storageProvider.save(attachment, (error, url, path) => {
            model.size = attachment.size
            model.name = attachment.name
            model.type = attachment.type
            model.url   =   url
            model.path  =   path
            model.link  =   url

            callback(error);
        })
    }

    willOverwrite (model) {
        return !!model.url;
    }

    remove (storageProvider, model, callback) {
        if (!model.url) {
            return callback();
        }

        storageProvider.remove(model, callback);
    }

}

module.exports = FileProcessor
