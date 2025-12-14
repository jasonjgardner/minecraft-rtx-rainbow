#!/usr/bin/env pwsh
# WorldPainter Terrain Encoder Build Script
# Downloads WorldPainter dependencies and compiles/runs the terrain encoder

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$LibDir = Join-Path $ScriptDir "lib"
$OutputDir = Join-Path $ScriptDir "terrain-output"

# WorldPainter Maven coordinates
$WpVersion = "2.22.3"
$MavenBase = "https://repo1.maven.org/maven2/org/pepsoft/worldpainter"
$Jars = @(
    "WPCore/$WpVersion/WPCore-$WpVersion.jar",
    "WPGUI/$WpVersion/WPGUI-$WpVersion.jar"
)

function Download-Dependencies {
    Write-Host "=== Downloading WorldPainter Dependencies ===" -ForegroundColor Cyan
    
    if (-not (Test-Path $LibDir)) {
        New-Item -ItemType Directory -Path $LibDir | Out-Null
    }
    
    foreach ($jar in $Jars) {
        $url = "$MavenBase/$jar"
        $filename = Split-Path -Leaf $jar
        $outPath = Join-Path $LibDir $filename
        
        if (-not (Test-Path $outPath)) {
            Write-Host "  Downloading $filename..."
            try {
                Invoke-WebRequest -Uri $url -OutFile $outPath -UseBasicParsing
            } catch {
                Write-Warning "  Failed to download $filename from Maven. Trying alternative..."
                # Try WorldPainter's own repository
                $altUrl = "https://www.worldpainter.net/files/plugins/$filename"
                try {
                    Invoke-WebRequest -Uri $altUrl -OutFile $outPath -UseBasicParsing
                } catch {
                    Write-Error "  Could not download $filename. Please download WorldPainter manually."
                    exit 1
                }
            }
        } else {
            Write-Host "  $filename already exists, skipping..."
        }
    }
}

function Get-WorldPainterJar {
    # Try to find WorldPainter installation
    $wpPaths = @(
        "$env:LOCALAPPDATA\WorldPainter\app\WorldPainter.jar",
        "$env:ProgramFiles\WorldPainter\app\WorldPainter.jar",
        "${env:ProgramFiles(x86)}\WorldPainter\app\WorldPainter.jar",
        "C:\Program Files\WorldPainter\app\WorldPainter.jar"
    )
    
    foreach ($path in $wpPaths) {
        if (Test-Path $path) {
            return $path
        }
    }
    
    # Check lib directory
    $libJar = Get-ChildItem -Path $LibDir -Filter "WPCore*.jar" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($libJar) {
        return $libJar.FullName
    }
    
    return $null
}

function Compile-Encoder {
    Write-Host "`n=== Compiling Terrain Encoder ===" -ForegroundColor Cyan
    
    $wpJar = Get-WorldPainterJar
    if (-not $wpJar) {
        Write-Error "WorldPainter JAR not found. Please install WorldPainter or run with -Download flag."
        exit 1
    }
    
    Write-Host "  Using WorldPainter JAR: $wpJar"
    
    $srcFile = Join-Path $ScriptDir "TerrainEncoder.java"
    $classpath = $wpJar
    
    # Add all JARs in lib directory
    $libJars = Get-ChildItem -Path $LibDir -Filter "*.jar" -ErrorAction SilentlyContinue
    foreach ($jar in $libJars) {
        $classpath += [IO.Path]::PathSeparator + $jar.FullName
    }
    
    Write-Host "  Compiling TerrainEncoder.java..."
    & javac -cp $classpath -d $ScriptDir $srcFile
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Compilation failed!"
        exit 1
    }
    
    Write-Host "  Compilation successful!" -ForegroundColor Green
}

function Run-Encoder {
    param([string]$OutputPath = $OutputDir)
    
    Write-Host "`n=== Running Terrain Encoder ===" -ForegroundColor Cyan
    
    $wpJar = Get-WorldPainterJar
    if (-not $wpJar) {
        Write-Error "WorldPainter JAR not found."
        exit 1
    }
    
    $classpath = "$ScriptDir" + [IO.Path]::PathSeparator + $wpJar
    
    # Add all JARs in lib directory
    $libJars = Get-ChildItem -Path $LibDir -Filter "*.jar" -ErrorAction SilentlyContinue
    foreach ($jar in $libJars) {
        $classpath += [IO.Path]::PathSeparator + $jar.FullName
    }
    
    & java -cp $classpath TerrainEncoder $OutputPath
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Encoder failed!"
        exit 1
    }
}

# Main
$action = $args[0]

switch ($action) {
    "download" { Download-Dependencies }
    "compile" { Compile-Encoder }
    "run" { Run-Encoder -OutputPath ($args[1] ?? $OutputDir) }
    "all" {
        Download-Dependencies
        Compile-Encoder
        Run-Encoder -OutputPath ($args[1] ?? $OutputDir)
    }
    default {
        Write-Host @"
WorldPainter Terrain Encoder Build Script

Usage: .\build-terrain.ps1 <action> [output-dir]

Actions:
  download  - Download WorldPainter dependencies from Maven
  compile   - Compile the TerrainEncoder.java file
  run       - Run the encoder to generate .terrain files
  all       - Download, compile, and run

Examples:
  .\build-terrain.ps1 all
  .\build-terrain.ps1 run ./my-terrains
  .\build-terrain.ps1 compile

Note: Requires WorldPainter to be installed, or run 'download' first.
"@
    }
}
