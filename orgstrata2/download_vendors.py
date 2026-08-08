import os
import urllib.request

css_dir = r"c:\ws\orgstrata2\vendor\css"
js_dir = r"c:\ws\orgstrata2\vendor\js"

os.makedirs(css_dir, exist_ok=True)
os.makedirs(js_dir, exist_ok=True)

downloads = [
    # CSS
    ("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css", os.path.join(css_dir, "fontawesome.all.min.css")),
    ("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css", os.path.join(css_dir, "leaflet.css")),
    ("https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/main.min.css", os.path.join(css_dir, "fullcalendar.min.css")),
    ("https://unpkg.com/bpmn-js@11.1.0/dist/assets/bpmn-js.css", os.path.join(css_dir, "bpmn-js.css")),
    ("https://cdn.datatables.net/1.13.4/css/jquery.dataTables.min.css", os.path.join(css_dir, "jquery.dataTables.min.css")),

    # JS
    ("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js", os.path.join(js_dir, "leaflet.js")),
    ("https://code.highcharts.com/highcharts.js", os.path.join(js_dir, "highcharts.js")),
    ("https://code.highcharts.com/highcharts-more.js", os.path.join(js_dir, "highcharts-more.js")),
    ("https://code.highcharts.com/modules/exporting.js", os.path.join(js_dir, "exporting.js")),
    ("https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/main.min.js", os.path.join(js_dir, "fullcalendar.min.js")),
    ("https://unpkg.com/bpmn-js@11.1.0/dist/bpmn-navigated-viewer.development.js", os.path.join(js_dir, "bpmn-navigated-viewer.js")),
    ("https://code.jquery.com/jquery-3.6.0.min.js", os.path.join(js_dir, "jquery.min.js")),
    ("https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js", os.path.join(js_dir, "jquery.dataTables.min.js")),
    ("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js", os.path.join(js_dir, "three.min.js")),
]

req_headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
}

for url, target_path in downloads:
    print(f"Downloading {url} -> {target_path}")
    try:
        req = urllib.request.Request(url, headers=req_headers)
        with urllib.request.urlopen(req) as response, open(target_path, 'wb') as out_file:
            out_file.write(response.read())
        print(f"  Success: {os.path.basename(target_path)} ({os.path.getsize(target_path)} bytes)")
    except Exception as e:
        print(f"  Failed to download {url}: {e}")

print("Vendor downloads completed!")
