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
            "--output-path ./pack/java/$size`x/assets/minecraft/textures/blocks"
            "--set-value `$outputsize@$size,$size"
            "--set-entry color@$color"
            "--cpu-count 4"
        )
        Wait                   = $true
        NoNewWindow            = $true
        PassThru               = $true
        RedirectStandardOutput = "log/$name.json"
        RedirectStandardError  = "error.txt"
    }
    
    $res = Start-Process @processOptions

    if ($res.ExitCode -ne 0) {
        Write-Host "Error: $($res.ExitCode)"
        Get-Content "error.txt"
        exit $res.ExitCode
    }
}

$sizes = @(256)

$inputs = Get-ChildItem -Path "./blocks/colors" -File -Filter "*.png"
foreach ($i in $inputs) {
    foreach ($size in $sizes) {
        New-Item -ItemType Directory -Force -Path "./pack/java/$size`x/assets/minecraft/textures/blocks" | Out-Null
        RenderBlock -sbar "./JavaBlock.sbsar" -name "$($i.BaseName)" -size $size -color "./blocks/colors/$($i.BaseName).png"
    }
}