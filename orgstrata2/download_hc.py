import os
import urllib.request

js_dir = r"c:\ws\orgstrata2\vendor\js"

hc_files = [
    ("https://code.highcharts.com/highcharts.js", os.path.join(js_dir, "highcharts.js")),
    ("https://code.highcharts.com/highcharts-more.js", os.path.join(js_dir, "highcharts-more.js")),
    ("https://code.highcharts.com/modules/exporting.js", os.path.join(js_dir, "exporting.js")),
]

req_headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    'Referer': 'https://www.highcharts.com/'
}

for url, target_path in hc_files:
    print(f"Downloading Highcharts asset: {url}")
    try:
        req = urllib.request.Request(url, headers=req_headers)
        with urllib.request.urlopen(req) as response, open(target_path, 'wb') as out_file:
            out_file.write(response.read())
        print(f"  Success: {os.path.basename(target_path)} ({os.path.getsize(target_path)} bytes)")
    except Exception as e:
        print(f"  Failed: {e}")
