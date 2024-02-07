$directory = ".\textures\block"

Get-ChildItem -Path $directory | ForEach-Object {
    $newName = $_.Name -replace "_baseColor.png$", ".png"
    if ($newName -ne $_.Name) {
        Rename-Item -Path $_.FullName -NewName $newName
    }
}

