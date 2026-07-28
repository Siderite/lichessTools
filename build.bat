@echo off
setlocal EnableExtensions

if "%~1"=="" (
  echo Usage: %~nx0 version
  echo Example: %~nx0 123
  exit /b 1
)

set "VERSION=V2_4_%~1"

echo Creating Firefox package...
copy /Y "manifest.json.ff" "manifest.json" >nul
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$zip = 'LiChessTools_%VERSION%_FF.zip';" ^
  "$files = Get-ChildItem -Recurse -File | Where-Object { $_.Name -ne 'context.md' -and $_.Name -ne 'manifest.json.chrome' -and $_.Name -ne 'manifest.json.edge' -and $_.Name -ne 'manifest.json.ff' -and $_.Extension -ne '.zip' };" ^
  "if (Test-Path $zip) { Remove-Item $zip -Force };" ^
  "Add-Type -AssemblyName System.IO.Compression.FileSystem;" ^
  "$archive = [System.IO.Compression.ZipFile]::Open($zip, 'Create');" ^
  "foreach ($f in $files) {" ^
  "  $rel = $f.FullName.Substring((Get-Location).Path.Length + 1).Replace('\', '/');" ^
  "  [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $f.FullName, $rel) | Out-Null" ^
  "};" ^
  "$archive.Dispose()"

echo Creating Edge package...
copy /Y "manifest.json.edge" "manifest.json" >nul
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$zip = 'LiChessTools_%VERSION%_ED.zip';" ^
  "$files = Get-ChildItem -Recurse -File | Where-Object { $_.Name -ne 'context.md' -and $_.Name -ne 'manifest.json.chrome' -and $_.Name -ne 'manifest.json.edge' -and $_.Name -ne 'manifest.json.ff' -and $_.Extension -ne '.zip' };" ^
  "if (Test-Path $zip) { Remove-Item $zip -Force };" ^
  "Add-Type -AssemblyName System.IO.Compression.FileSystem;" ^
  "$archive = [System.IO.Compression.ZipFile]::Open($zip, 'Create');" ^
  "foreach ($f in $files) {" ^
  "  $rel = $f.FullName.Substring((Get-Location).Path.Length + 1).Replace('\', '/');" ^
  "  [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $f.FullName, $rel) | Out-Null" ^
  "};" ^
  "$archive.Dispose()"

echo Creating Chrome package...
copy /Y "manifest.json.chrome" "manifest.json" >nul
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$zip = 'LiChessTools_%VERSION%.zip';" ^
  "$files = Get-ChildItem -Recurse -File | Where-Object { $_.Name -ne 'context.md' -and $_.Name -ne 'manifest.json.chrome' -and $_.Name -ne 'manifest.json.edge' -and $_.Name -ne 'manifest.json.ff' -and $_.Extension -ne '.zip' };" ^
  "if (Test-Path $zip) { Remove-Item $zip -Force };" ^
  "Add-Type -AssemblyName System.IO.Compression.FileSystem;" ^
  "$archive = [System.IO.Compression.ZipFile]::Open($zip, 'Create');" ^
  "foreach ($f in $files) {" ^
  "  $rel = $f.FullName.Substring((Get-Location).Path.Length + 1).Replace('\', '/');" ^
  "  [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $f.FullName, $rel) | Out-Null" ^
  "};" ^
  "$archive.Dispose()"

echo Done.
endlocal