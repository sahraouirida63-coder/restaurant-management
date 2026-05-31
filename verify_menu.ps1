$ErrorActionPreference = "Stop"
try {
    # 1. Login
    $body = '{"email":"reda@waiter","password":"1234"}'
    $login = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/api/login' -Method POST -ContentType 'application/json' -Body $body
    $token = $login.token
    Write-Host "Login OK - token acquired"

    # 2. Get menu items
    $headers = @{ Authorization = "Bearer $token"; Accept = "application/json" }
    $menu = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/api/menu' -Headers $headers
    Write-Host "Total menu items: $($menu.Count)"
    Write-Host "---"
    foreach ($item in $menu) {
        Write-Host "[$($item.id)] $($item.name) | $($item.category) | `$$($item.price)"
        Write-Host "    image_url: $($item.image_url)"
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
}
