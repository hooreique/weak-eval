Set-Variable -Name dir -Value $(Get-Location) `
    && Start-Process `
        -FilePath "node" `
        -ArgumentList "index.mjs", $dir `
        -WorkingDirectory "$($HOME)\source\weak-eval" # Change this to the weak-eval source code path
