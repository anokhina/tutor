/*
Copyright 2018 Veronica Anokhina.

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
CKEDITOR.plugins.add( 'fileopen', {
    icons: 'fileopen,filesave',
    init: function( editor ) {
        var script;
        if (typeof(UTIL) === 'undefined') {
            script = document.createElement('script');
            script.src = "jslib/UTIL.js";
            document.head.appendChild(script);
        }
        if (typeof(UTILIO) === 'undefined') {
            script = document.createElement('script');
            script.src = "jslib/UTILIO.js";
            document.head.appendChild(script);
        }
//https://docs.ckeditor.com/ckeditor4/docs/#!/guide/plugin_sdk_sample_1
//https://docs.ckeditor.com/ckeditor4/docs/#!/guide/plugin_sdk_sample
        var mePlugin = this;
        editor.addCommand( 'fileopen', {
            exec: function( editor ) {
                if (this.fakeButton) {} else {
                    console.log("create fakeButton");
                    var el = document.createElement("input");
                    this.fakeButton = el;
                    el.type = "file";
                    el.addEventListener('change', 
                        function(evt) {
                            new UTILIO.FileOpenerText(function(text, file){
                                editor.setData(text);
                                mePlugin.openedFile = file;
                            }).handleFileSelect(evt);
                        }, false);
                }
                this.fakeButton.click();
            }
        });
        editor.addCommand( 'filesave', {
            exec: function( editor ) {
                var fileName = "Unnamed";
                if (mePlugin.openedFile) {
                    //File.webkitRelativePath 
                    fileName = mePlugin.openedFile.name;
                }
                UTILIO.saveAs(UTILIO.text2blob(editor.getData()), fileName);
            }
        });
        editor.ui.addButton( 'FileOpen', {
            label: 'File open',
            command: 'fileopen',
            toolbar: 'document,0'
        });
        editor.ui.addButton( 'FileSave', {
            label: 'File save',
            command: 'filesave',
            toolbar: 'document,0'
        });
    }
});
