$outputFile = "resultats.txt"
Remove-Item $outputFile -ErrorAction SilentlyContinue

$jobs = @()

1..30 | ForEach-Object {

    $amount = $_

    $jobs += Start-Job -ScriptBlock {
        param($amount)

        try {
            $body = @{
                senderAccountId   = 2
                receiverAccountId = 1
                amount            = $amount
                typeV             = "virement"
            } | ConvertTo-Json

            $response = Invoke-RestMethod -Uri "http://localhost:7003/transactions" `
                -Method POST `
                -ContentType "application/json" `
                -Body $body

            "SUCCESS - Amount: $amount - Response: $($response | ConvertTo-Json -Compress)"
        }
        catch {
            "ERROR - Amount: $amount - Message: $($_.Exception.Message)"
        }

    } -ArgumentList $amount
}

# Affichage en temps réel
while ($jobs.State -contains "Running") {

    foreach ($job in $jobs) {
        $result = Receive-Job $job -Keep
        if ($result) {
            # Echo explicite dans la console
            Write-Host $result

            $result | Tee-Object -FilePath $outputFile -Append
        }
    }

    Start-Sleep -Milliseconds 200
}
 

$jobs | Remove-Job

Write-Host "Transactions envoyees"
Write-Host "Resultats enregistres dans resultats.txt"