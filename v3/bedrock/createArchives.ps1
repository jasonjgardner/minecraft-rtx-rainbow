# Function to create a zip archive without compression
function New-UncompressedZip {
    param (
        [string]$SourcePath,
        [string]$DestinationPath
    )

    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $compressionLevel = [System.IO.Compression.CompressionLevel]::NoCompression
    [System.IO.Compression.ZipFile]::CreateFromDirectory($SourcePath, $DestinationPath, $compressionLevel, $false)
}

# Create output directory if it doesn't exist
$outputDir = "./build"
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

# Process BP subdirectories to .mcaddon
if (Test-Path "./bedrock/BP") {
    Get-ChildItem "./bedrock/BP" -Directory | ForEach-Object {
        $addonPath = Join-Path $outputDir "$($_.Name).mcaddon"
        Write-Host "Creating $addonPath"
        New-UncompressedZip -SourcePath $_.FullName -DestinationPath $addonPath
    }
}

# Process RP directory to .mcpack
if (Test-Path "./bedrock/RP") {
    $mcpackPath = Join-Path $outputDir "rainbow.mcpack"
    Write-Host "Creating $mcpackPath"
    New-UncompressedZip -SourcePath "./bedrock/RP" -DestinationPath $mcpackPath
}

# Process WP directory to .mcworld
if (Test-Path "./bedrock/WP") {
    $mcworldPath = Join-Path $outputDir "rainbow.mcworld"
    Write-Host "Creating $mcworldPath"
    New-UncompressedZip -SourcePath "./bedrock/WP" -DestinationPath $mcworldPath
}

Write-Host "Archive creation completed"