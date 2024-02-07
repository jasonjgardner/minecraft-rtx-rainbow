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
            "--input $sbar render"
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

$sizes = @(16, 32, 64, 128, 256)

$sbsars = Get-ChildItem -Path "./" -File -Filter "*.sbsar"


foreach ($size in $sizes) {
    $files = Get-ChildItem -Path "./blocks/$size`x" -File -Recurse -Filter "*.png"

    New-Item -ItemType Directory -Force -Path "./pack/RP/subpacks/$size`x/textures/blocks" | Out-Null
    foreach ($file in $files) {
        foreach ($sbar in $sbsars) {
            RenderBlock -sbar $sbar -name "$($file.BaseName)" -size $size -color "./blocks/$size`x/$($file.BaseName).png"
        }
    }
}
