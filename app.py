import json
from http.server import BaseHTTPRequestHandler, HTTPServer

class RequestHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        if self.path == '/notas':
            self.send_response(200)
            self.send_header('Content-type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            with open('notas.json', 'r', encoding='utf-8') as file:
                notas = json.load(file)
                self.wfile.write(json.dumps(notas, ensure_ascii=False).encode('utf-8'))
        elif self.path == '/index.html':
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            with open('index.html', 'r', encoding='utf-8') as file:
                self.wfile.write(file.read().encode('utf-8'))
        elif self.path == '/style.css':
            self.send_response(200)
            self.send_header('Content-type', 'text/css; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            with open('style.css', 'r', encoding='utf-8') as file:
                self.wfile.write(file.read().encode('utf-8'))
        elif self.path == '/script.js':
            self.send_response(200)
            self.send_header('Content-type', 'application/javascript; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            with open('script.js', 'r', encoding='utf-8') as file:
                self.wfile.write(file.read().encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path == '/notas':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')
            nova_nota = json.loads(post_data)

            with open('notas.json', 'r', encoding='utf-8') as file:
                notas = json.load(file)
            notas.append(nova_nota)

            with open('notas.json', 'w', encoding='utf-8') as file:
                json.dump(notas, file, ensure_ascii=False, indent=4)

            self.send_response(200)
            self.send_header('Content-type', 'text/plain; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(b'Nota salva com sucesso!')
        else:
            self.send_response(404)
            self.end_headers()

def run(server_class=HTTPServer, handler_class=RequestHandler):
    server_address = ('', 8000)
    httpd = server_class(server_address, handler_class)
    print("Servidor rodando na porta 8000")
    httpd.serve_forever()

if __name__ == "__main__":
    run()
