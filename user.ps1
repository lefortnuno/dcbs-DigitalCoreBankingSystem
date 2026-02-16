$outputFile = "resultats.txt"
Remove-Item $outputFile -ErrorAction SilentlyContinue

$jobs = @()

1..1 | ForEach-Object {

    $nbr = $_

    $jobs += Start-Job -ScriptBlock {
        param($nbr)

        try {
            $body = @{
                idUser   = "user-001"
                username = "admin" 
            } | ConvertTo-Json

            $response = Invoke-RestMethod -Uri "http://localhost:7001/users" `
                -Method POST `
                -ContentType "application/json" `
                -Body $body

            "SUCCESS - User: $nbr - Response: $($response | ConvertTo-Json -Compress)"
        }
        catch {
            "ERROR - User: $nbr - Message: $($_.Exception.Message)"
        }

    } -ArgumentList $nbr
}

while ($jobs.State -contains "Running") {

    foreach ($job in $jobs) {

        $results = Receive-Job $job

        foreach ($result in $results) { 
            Write-Host $result 
            Add-Content -Path $outputFile -Value $result
        }
    }

    Start-Sleep -Milliseconds 200
}

# récupérer les résultats restants
foreach ($job in $jobs) {
    $results = Receive-Job $job
    foreach ($result in $results) {
        Write-Host $result
        Add-Content -Path $outputFile -Value $result
    }
}

$jobs | Remove-Job

Write-Host "01 Utilisateur crée"
Write-Host "Resultats enregistres dans resultats.txt"
