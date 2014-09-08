define(
// Dependencies
[ 'underscore', 'leaflet', 'mosaic-commons' ],
// Module
function(_, L, Mosaic) {

    /**
     * This utility class allows to associate data with non-transparent pixels
     * of images drawn on canvas.
     */
    var IndexedCanvas = Mosaic.Class.extend({

        /**
         * Initializes internal fields of this class.
         * 
         * @param options.canvas
         *            mandatory canvas object used to draw images
         * @param options.resolution
         *            optional resolution field defining precision of image
         *            areas associated with data; by default it is 4x4 pixel
         *            areas (resolution = 4)
         */
        initialize : function(options) {
            this.setOptions(options);
            var resolution = this.options.reisolution || 4;
            this.options.resolutionX = this.options.resolutionX || resolution;
            this.options.resolutionY = this.options.resolutionY || //
            this.options.resolutionX || resolution;
            this._canvas = this.options.canvas;
            this._maskWidth = this._getMaskX(this._canvas.width);
            this._maskHeight = this._getMaskY(this._canvas.height);
            this._dataIndex = {};
        },

        /**
         * Draws the specified image in the given position on the underlying
         * canvas.
         */
        draw : function(image, x, y, data) {
            // Draw the image on the canvas
            var g = this._canvas.getContext('2d');
            g.drawImage(image, x, y);
            // Associate non-transparent pixels of the image with data
            this._addToCanvasMask(image, x, y, data);
        },

        /** Returns data associated with the specified position on the canvas. */
        getData : function(x, y) {
            var maskX = this._getMaskX(x);
            var maskY = this._getMaskY(y);
            var pos = maskY * this._maskWidth + maskX;
            var result = this._dataIndex[pos];
            return result;
        },

        /**
         * Removes all data from internal indexes and cleans up underlying
         * canvas.
         */
        reset : function() {
            this._dataIndex = {};
            if (this._maskIndex) {
                this._maskIndex = {};
            }
            var g = this._canvas.getContext('2d');
            g.clearRect(0, 0, this._canvas.width, this._canvas.height);
        },

        // ------------------------------------------------------------------
        // Private methods

        /**
         * Adds all pixels occupied by the specified image to a data mask
         * associated with canvas.
         */
        _addToCanvasMask : function(image, shiftX, shiftY, data) {
            var mask = this._getImageMask(image);
            var imageMaskWidth = this._getMaskX(image.width);
            var maskShiftX = this._getMaskX(shiftX);
            var maskShiftY = this._getMaskY(shiftY);
            for (var i = 0; i < mask.length; i++) {
                if (!mask[i])
                    continue;
                var x = maskShiftX + (i % imageMaskWidth);
                var y = maskShiftY + Math.floor(i / imageMaskWidth);
                if (x >= 0 && x < this._maskWidth && y >= 0 && //
                y < this._maskHeight) {
                    this._dataIndex[y * this._maskWidth + x] = data;
                }
            }
        },

        /**
         * Returns a mask corresponding to the specified image.
         */
        _getImageMask : function(image) {
            var maskIndex = this._getImageMaskIndex();
            var imageId = this._getImageKey(image);
            var mask = maskIndex[imageId];
            if (!mask) {
                mask = this._buildImageMask(image);
                maskIndex[imageId] = mask;
            }
            return mask;
        },

        /** Returns a unique key of the specified image. */
        _getImageKey : function(image) {
            var key = image._key = image._key || _.uniqueId('img-');
            return key;
        },

        /**
         * This method maintain an index of image masks associated with the
         * provided canvas. This method could be overloaded to implement a
         * global index of image masks.
         */
        _getImageMaskIndex : function() {
            if (this.options.maskIndex)
                return this.options.maskIndex;
            this._maskIndex = this._maskIndex || {};
            return this._maskIndex;
        },

        /** Creates and returns an image mask. */
        _buildImageMask : function(image) {
            var canvas = this._newCanvas();
            var g = canvas.getContext('2d');
            canvas.width = image.width;
            canvas.height = image.height;
            g.drawImage(image, 0, 0);
            var data = g.getImageData(0, 0, image.width, image.height).data;
            var maskWidth = this._getMaskX(image.width);
            var maskHeight = this._getMaskY(image.height);
            var mask = new Array(image.width * image.height);
            for (var y = 0; y < image.height; y++) {
                for (var x = 0; x < image.width; x++) {
                    var idx = (y * image.width + x) * 4 + 3;
                    var maskX = this._getMaskX(x);
                    var maskY = this._getMaskY(y);
                    mask[maskY * maskWidth + maskX] = data[idx] ? 1 : 0;
                }
            }
            return mask;
        },

        _newCanvas : function() {
            return document.createElement('canvas');
        },

        /** Transforms an X coordinate on canvas to X coordinate in the mask. */
        _getMaskX : function(x) {
            var resolutionX = this.options.resolutionX;
            return Math.round(x / resolutionX);
        },

        /** Transforms a Y coordinate on canvas to Y coordinate in the mask. */
        _getMaskY : function(y) {
            var resolutionY = this.options.resolutionY;
            return Math.round(y / resolutionY);
        }
    });

    return IndexedCanvas;

});
