/*
 * Copyright 2018 Veronica Anokhina.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package ru.org.sevn.imgbase64;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.json.JSONArray;
import org.json.JSONObject;

public class LessonsCfg {
    public static String EXT = ".txt";
    
    static class Elem {
        private String name;
        private String tp;
        private Object content;
        
        public Elem() {}
        
        public Elem(String tp, String name) {
            setTp(tp);
            setName(name);
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getTp() {
            return tp;
        }

        public void setTp(String tp) {
            this.tp = tp;
        }

        public Object getContent() {
            return content;
        }

        public void setContent(Object content) {
            this.content = content;
        }
        
        public JSONObject toJSONObject() {
            JSONObject ret = new JSONObject();
            ret.put("name", getName());
            ret.put("type", getTp());
            if (content != null) {
                if (content instanceof ArrayList) {
                    JSONArray arr = new JSONArray();
                    ArrayList<Elem> elems = (ArrayList<Elem>)content;
                    for (Elem el : elems) {
                        arr.put(el.toJSONObject());
                    }
                    ret.put("content", arr);
                } else {
                    ret.put("content", content.toString());
                }
            }
            return ret;
        }
        
    }
    
    public static ArrayList<Elem> makeElems(String fullPath, File data, String excl) {
        ArrayList<Elem> ret = new ArrayList<>();
        if (data.exists()) {
            File[] files = data.listFiles();
            for (File fl : files) {
                Elem el = new Elem();
                if (!excl.contains(fl.getName())) {
                    if (fl.isDirectory()) {
                        el.setTp("folder");
                        el.setName(fl.getName());
                        el.setContent(makeElems(fullPath + data.getName() + "/", fl, excl));
                        ret.add(el);
                    } else if (fl.getName().toLowerCase().endsWith(EXT)) {
                        String nm = fl.getName();
                        nm = nm.substring(0, nm.length() - EXT.length());
                        el.setName(nm);
                        try {
                            String repl = "img:" + data.getName() + "/";
                            String repl2 = "img:" + fullPath + data.getName() + "/";
                            String cnt = new String(Files.readAllBytes(fl.toPath()), "UTF-8");
                            cnt = cnt.replace(repl, repl2);
                            el.setContent(cnt);
                        } catch (IOException ex) {
                            Logger.getLogger(LessonsCfg.class.getName()).log(Level.SEVERE, null, ex);
                        }
                        ret.add(el);
                    }
                }
            }
        }
        
        return ret;
    }
    public static void main(String[] args) throws IOException {
        File data = new File("../../data");
        ArrayList<Elem> res = makeElems("", data, "rusread");
        JSONArray jarr = new JSONArray();
        for (Elem el : res) {
            jarr.put(el.toJSONObject());
        }
        File studyWords = new File("../../studyWords.js");
        String out = "lessonsCfg = " + jarr.toString(2) + ";";
        Files.write(studyWords.toPath(), out.getBytes("UTF-8"));
        System.out.println(">>>" + out);
    }    
}
