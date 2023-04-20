Set-Variable -Name dir -Value $(Get-Location) `
  && Start-Process `
    -FilePath "node" `
    -ArgumentList "index.js", $dir `
    -WorkingDirectory "$($HOME)\source\weak-eval"
