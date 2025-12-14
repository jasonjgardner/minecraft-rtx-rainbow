function RenderBlock() {
    param(
        [Parameter(Mandatory = $true)]
        [string]$color,
        [Parameter(Mandatory = $true)]
        [string]$sbar,
        [Parameter(Mandatory = $true)]
        [string]$name,
        [Parameter(Mandatory = $true)]
        [int]$size
    )

    $processOptions = @{
        FilePath               = "sbsrender.exe"
        ArgumentList           = @(
            "render"
            "--input `"$sbar`""
            "--output-name $name`_{inputGraphUrl}_{outputUsages}"
            "--output-path ./pack/RP/subpacks/$size`x/textures/blocks"
            "--set-value '`$outputsize@$size,$size'"
            "--set-entry color@$color"
        )
        Wait                   = $true
        NoNewWindow            = $true
        PassThru               = $true
        RedirectStandardOutput = "output.json"
        RedirectStandardError  = "error.txt"
    }
    
    $res = Start-Process @processOptions

    if ($res.ExitCode -ne 0) {
        Write-Host "Error: $($res.ExitCode)"
        Get-Content "error.txt"
        exit $res.ExitCode
    }
}

function CreateTextureSet() {
    param(
        [Parameter(Mandatory = $true)]
        [string]$name
    )

    $textureSet = @{
        "format_version"        = "1.16.100"
        "minecraft:texture_set" = @{
            "color"                        = "$name`_baseColor"
            "metalness_emissive_roughness" = "$name`_mer"
            "normal"                       = "$name`_normal"
        }
    }

    $json = $textureSet | ConvertTo-Json

    return $json
}

$sizes = @(512, 1024)

$sbsars = Get-ChildItem -Path "D:\Game Development\Minecraft\minecraft-rtx-rainbow\assets" -File -Filter "*.sbsar"
$dir = "D:\Game Development\Minecraft\minecraft-rtx-rainbow\v3\bedrock\RP\subpacks";
$src = "D:\Game Development\Minecraft\minecraft-rtx-rainbow\assets\colors";

foreach ($size in $sizes) {
    Write-Host "Rendering $size`x textures"

    $files = Get-ChildItem -Path "$src" -File -Recurse -Filter "*.png"

    $files = $files | Where-Object { $_.Name -notmatch "baseColor|normal|mer" }

    Write-Host "Found $($files.Count) files to render"

    New-Item -ItemType Directory -Force -Path "./pack/RP/subpacks/$size`x/textures/blocks" | Out-Null
    foreach ($file in $files) {
        foreach ($sbar in $sbsars) {
            Write-Host "Rendering $($file.BaseName) with $($sbar.Name)"
            $sbarPath = Join-Path -Path $sbar.DirectoryName -ChildPath $sbar.Name
            RenderBlock -sbar "$sbarPath" -name "$($file.BaseName)" -size $size -color "./blocks/$size`x/$($file.BaseName).png"
        }
    }
    Write-Host "Finished rendering $size`x textures"
}
