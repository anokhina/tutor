/*
 * Copyright 2017 Veronica Anokhina.
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
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.Base64;

public class ImgBase64 {

    public static void main(String[] args) throws IOException {
        if (args.length < 2) {
            System.out.println("Usage: " + ImgBase64.class.getName() + " from_file to_file");
            return;
        }
        File listFile = new File(args[0]);
        File listFileOut = new File(args[1]);
        String listFileContent = new String(Files.readAllBytes(listFile.toPath()), "UTF-8");
        String[] content = listFileContent.split(",");
        OutputStreamWriter fw = new OutputStreamWriter(new FileOutputStream(listFileOut), StandardCharsets.UTF_8);
        fw.write("<delimeter>|</delimeter>");
        for(int i = 0; i < content.length; i++) {
            if (content[i].startsWith("img:")) {
                String imgPath = content[i].substring("img:".length());
                File imgFile = new File(listFile.getParentFile().getParentFile(), imgPath);
                byte[] imageBytes = Files.readAllBytes(imgFile.toPath());
                content[i] = "img:data:image/png;base64,"+Base64.getEncoder().encodeToString(imageBytes);
                //System.out.println("----------"+content[i]);
            }
            if (i > 0)fw.write("|");
            fw.write(content[i].trim());
        }
        fw.close();
    }
}
