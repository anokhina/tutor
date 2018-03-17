"C:\Program Files\7-Zip\7z.exe" a -tzip ../htmlprog%1dif.zip -i@"build/%1/mkrel_files_to_include.txt" -x@"build/%1/mkrel_files_to_exclude.txt" 
"C:\Program Files\7-Zip\7z.exe" a -tzip ../htmlprog%1.zip -i@"build/mkrel_files_to_include.txt" -x@"build/mkrel_files_to_exclude.txt" 

rem  "C:\Program Files\7-Zip\7z.exe" a -tzip ../htmlprog%1.zip -ir@"build/mkrel_files_to_include.txt" -xr@"build/mkrel_files_to_exclude.txt" 
