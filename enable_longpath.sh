#!/bin/bash

echo "Enabling Win32 long paths in Windows Registry..."

powershell.exe -Command '
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -Type DWord
'

echo "Done. Restart your computer to apply changes."
