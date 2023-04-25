Set-Variable -Name dir -Value $(Get-Location) `
    && Start-Process `
        -FilePath "node" `
        -ArgumentList "index.mjs", $dir `
        -WorkingDirectory "$($HOME)\source\weak-eval"
