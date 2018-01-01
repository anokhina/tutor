/*
Copyright 2017 Veronica Anokhina.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
var UTILIO = (function() {
    var self = {
    };
    
    self.text2blob = function(text) {
        return new Blob([text], {type: "text/plain;charset=utf-8"});
    };
    
    self.saveAs = function(blob, filename) {
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
        } else {
            var elem = window.document.createElement('a');
            elem.href = window.URL.createObjectURL(blob);
            elem.download = filename;        
            document.body.appendChild(elem);
            elem.click();        
            document.body.removeChild(elem);
        }
    };
    
    UTIL.class(self, "FileOpener", null, {
        readFile : function(f) {
            console.log("read file:", f);
        },
        handleFileSelect: function(evt) {
            if (window.File && window.FileReader && window.FileList && window.Blob) {

            } else {
                alert('The File APIs are not fully supported in this browser.');
                return;
            }

            for (var i = 0, f; f = evt.target.files[i]; i++) {
                this.readFile(f);
            }
        }
    });
    UTIL.class(self, "FileOpenerText", self.FileOpener, {
        readAsText: function(f) {
            var me = this;
            var reader = new FileReader();
            reader.readAsText (f);
            reader.onload = function(e) {
                me.textProcessor(reader.result, f);
            };
        },
        readFile: function(f) {
            this.readAsText(f);
        },
        constructor: function(textProcessorFn) {
            this.textProcessor = textProcessorFn;
        }
    });
    
    return self;
})();
