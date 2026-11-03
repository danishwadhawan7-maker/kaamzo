Add-Type -AssemblyName System.Drawing

$wwwDir = Join-Path $PSScriptRoot "..\www"

function Generate-KaamzoIcon([int]$size, [string]$outputPath) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # Background: sleek rounded squircle
    $radius = [float]($size * 0.22)
    $pt1 = New-Object System.Drawing.PointF(0, 0)
    $pt2 = New-Object System.Drawing.PointF($size, $size)
    $c1 = [System.Drawing.ColorTranslator]::FromHtml("#0B0F19")
    $c2 = [System.Drawing.ColorTranslator]::FromHtml("#182234")
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($pt1, $pt2, $c1, $c2)
    
    # Create squircle path
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $rect = New-Object System.Drawing.RectangleF(0, 0, $size, $size)
    $dia = [float]($radius * 2)
    $path.AddArc($rect.X, $rect.Y, $dia, $dia, 180, 90)
    $path.AddArc([float]($rect.Right - $dia), $rect.Y, $dia, $dia, 270, 90)
    $path.AddArc([float]($rect.Right - $dia), [float]($rect.Bottom - $dia), $dia, $dia, 0, 90)
    $path.AddArc($rect.X, [float]($rect.Bottom - $dia), $dia, $dia, 90, 90)
    $path.CloseFigure()

    $g.FillPath($bgBrush, $path)

    # Subtle Golden Amber border
    $amberColor = [System.Drawing.ColorTranslator]::FromHtml("#F59E0B")
    $borderWidth = [float]([Math]::Max(1.5, $size * 0.04))
    $borderPen = New-Object System.Drawing.Pen($amberColor, $borderWidth)
    $g.DrawPath($borderPen, $path)

    # Letter K components
    $whiteColor = [System.Drawing.Color]::White
    $whiteBrush = New-Object System.Drawing.SolidBrush($whiteColor)
    $amberBrush = New-Object System.Drawing.SolidBrush($amberColor)

    $kX = [float]($size * 0.24)
    $kY = [float]($size * 0.20)
    $kH = [float]($size * 0.60)
    $kW = [float]($size * 0.14)

    # 1. Vertical stem of K
    $stemRect = New-Object System.Drawing.RectangleF($kX, $kY, $kW, $kH)
    $stemRadius = [float]($size * 0.035)
    $stemPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $sDia = [float]($stemRadius * 2)
    $stemPath.AddArc($stemRect.X, $stemRect.Y, $sDia, $sDia, 180, 90)
    $stemPath.AddArc([float]($stemRect.Right - $sDia), $stemRect.Y, $sDia, $sDia, 270, 90)
    $stemPath.AddArc([float]($stemRect.Right - $sDia), [float]($stemRect.Bottom - $sDia), $sDia, $sDia, 0, 90)
    $stemPath.AddArc($stemRect.X, [float]($stemRect.Bottom - $sDia), $sDia, $sDia, 90, 90)
    $stemPath.CloseFigure()
    $g.FillPath($whiteBrush, $stemPath)

    # 2. Upper diagonal arm of K (Golden Amber with smooth rounded caps)
    $armPen = New-Object System.Drawing.Pen($amberBrush, $kW)
    $armPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $armPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $armStart = New-Object System.Drawing.PointF([float]($kX + $kW * 0.7), [float]($kY + $kH * 0.46))
    $armEnd = New-Object System.Drawing.PointF([float]($size * 0.74), [float]($kY + $kW * 0.5))
    $g.DrawLine($armPen, $armStart, $armEnd)

    # 3. Lower diagonal leg of K (Pure White with smooth rounded caps)
    $legPen = New-Object System.Drawing.Pen($whiteBrush, $kW)
    $legPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $legPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $legStart = New-Object System.Drawing.PointF([float]($kX + $kW * 0.9), [float]($kY + $kH * 0.44))
    $legEnd = New-Object System.Drawing.PointF([float]($size * 0.65), [float]($kY + $kH - $kW * 0.4))
    $g.DrawLine($legPen, $legStart, $legEnd)

    # 4. Signature vibrant amber dot '.' (Kaamzo Trademark)
    $dotDia = [float]($size * 0.14)
    $dotX = [float]($size * 0.74)
    $dotY = [float]($kY + $kH - $dotDia)
    $g.FillEllipse($amberBrush, $dotX, $dotY, $dotDia, $dotDia)

    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $armPen.Dispose()
    $legPen.Dispose()
    $borderPen.Dispose()
    $whiteBrush.Dispose()
    $amberBrush.Dispose()
    $bgBrush.Dispose()
    $g.Dispose()
    $bmp.Dispose()
    Write-Output "Successfully created: $outputPath ($size x $size)"
}

# Generate all standard favicon & PWA icon sizes
Generate-KaamzoIcon 48 (Join-Path $wwwDir "favicon-48x48.png")
Generate-KaamzoIcon 96 (Join-Path $wwwDir "favicon-96x96.png")
Generate-KaamzoIcon 180 (Join-Path $wwwDir "apple-touch-icon.png")
Generate-KaamzoIcon 192 (Join-Path $wwwDir "pwa-192x192.png")
Generate-KaamzoIcon 192 (Join-Path $wwwDir "icon.png")
Generate-KaamzoIcon 512 (Join-Path $wwwDir "pwa-512x512.png")

# Also copy 48x48 as favicon.png
Copy-Item (Join-Path $wwwDir "favicon-48x48.png") (Join-Path $wwwDir "favicon.png") -Force

Write-Output "All Kaamzo PNG brand icons successfully generated!"
