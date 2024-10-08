import json  # Importa a biblioteca json para manipulação de dados em formato JSON
from http.server import BaseHTTPRequestHandler, HTTPServer
from datetime import datetime

class RequestHandler(BaseHTTPRequestHandler):  # Define a classe RequestHandler que herda de BaseHTTPRequestHandler

    def do_GET(self):  # Método chamado para processar requisições GET
        if self.path == '/':  # Verifica se a rota é a raiz
            self.send_response(200)  # Responde com status 200 (OK)
            self.send_header('Content-type', 'text/html; charset=utf-8')  # Define o tipo de conteúdo da resposta
            self.send_header('Access-Control-Allow-Origin', '*')  # Permite acesso de qualquer origem (CORS)
            self.end_headers()  # Finaliza os cabeçalhos da resposta
            with open('index.html', 'r', encoding='utf-8') as file:  # Abre o arquivo index.html para leitura
                self.wfile.write(file.read().encode('utf-8'))  # Envia o conteúdo do arquivo como resposta

        elif self.path == '/notas':  # Verifica se a rota é /notas
            self.send_response(200)  # Responde com status 200 (OK)
            self.send_header('Content-type', 'application/json; charset=utf-8')  # Define o tipo de conteúdo como JSON
            self.send_header('Access-Control-Allow-Origin', '*')  # Permite acesso de qualquer origem (CORS)
            self.end_headers()  # Finaliza os cabeçalhos da resposta
            with open('notas.json', 'r', encoding='utf-8') as file:  # Abre o arquivo notas.json para leitura
                notas = json.load(file)  # Carrega as notas do arquivo JSON
                self.wfile.write(json.dumps(notas, ensure_ascii=False).encode('utf-8'))  # Envia as notas como resposta

        elif self.path == '/index.html':  # Verifica se a rota é /index.html
            self.send_response(200)  # Responde com status 200 (OK)
            self.send_header('Content-type', 'text/html; charset=utf-8')  # Define o tipo de conteúdo como HTML
            self.send_header('Access-Control-Allow-Origin', '*')  # Permite acesso de qualquer origem (CORS)
            self.end_headers()  # Finaliza os cabeçalhos da resposta
            with open('index.html', 'r', encoding='utf-8') as file:  # Abre o arquivo index.html para leitura
                self.wfile.write(file.read().encode('utf-8'))  # Envia o conteúdo do arquivo como resposta

        elif self.path == '/style.css':  # Verifica se a rota é /style.css
            self.send_response(200)  # Responde com status 200 (OK)
            self.send_header('Content-type', 'text/css; charset=utf-8')  # Define o tipo de conteúdo como CSS
            self.send_header('Access-Control-Allow-Origin', '*')  # Permite acesso de qualquer origem (CORS)
            self.end_headers()  # Finaliza os cabeçalhos da resposta
            with open('style.css', 'r', encoding='utf-8') as file:  # Abre o arquivo style.css para leitura
                self.wfile.write(file.read().encode('utf-8'))  # Envia o conteúdo do arquivo como resposta

        elif self.path == '/script.js':  # Verifica se a rota é /script.js
            self.send_response(200)  # Responde com status 200 (OK)
            self.send_header('Content-type', 'application/javascript; charset=utf-8')  # Define o tipo de conteúdo como JavaScript
            self.send_header('Access-Control-Allow-Origin', '*')  # Permite acesso de qualquer origem (CORS)
            self.end_headers()  # Finaliza os cabeçalhos da resposta
            with open('script.js', 'r', encoding='utf-8') as file:  # Abre o arquivo script.js para leitura
                self.wfile.write(file.read().encode('utf-8'))  # Envia o conteúdo do arquivo como resposta

        else:  # Se a rota não corresponder a nenhuma das anteriores
            self.send_response(404)  # Responde com status 404 (Not Found)
            self.end_headers()  # Finaliza os cabeçalhos da resposta

    def do_POST(self):  # Método chamado para processar requisições POST
        if self.path == '/notas':  # Verifica se a rota é /notas
            content_length = int(self.headers['Content-Length'])  # Obtém o comprimento do conteúdo da requisição
            post_data = self.rfile.read(content_length).decode('utf-8')  # Lê os dados da requisição e decodifica
            nova_nota = json.loads(post_data)  # Carrega a nova nota a partir dos dados JSON recebidos

            with open('notas.json', 'r', encoding='utf-8') as file:  # Abre o arquivo notas.json para leitura
                notas = json.load(file)  # Carrega as notas existentes do arquivo JSON
            notas.append(nova_nota)  # Adiciona a nova nota à lista de notas

            with open('notas.json', 'w', encoding='utf-8') as file:  # Abre o arquivo notas.json para escrita
                json.dump(notas, file, ensure_ascii=False, indent=4)  # Salva a lista atualizada de notas no arquivo JSON

            self.send_response(200)  # Responde com status 200 (OK)
            self.send_header('Content-type', 'text/plain; charset=utf-8')  # Define o tipo de conteúdo como texto simples
            self.send_header('Access-Control-Allow-Origin', '*')  # Permite acesso de qualquer origem (CORS)
            self.end_headers()  # Finaliza os cabeçalhos da resposta
            self.wfile.write(b'Nota salva com sucesso!')  # Envia uma mensagem de sucesso como resposta
        else:  # Se a rota não corresponder a /notas
            self.send_response(404)  # Responde com status 404 (Not Found)
            self.end_headers()  # Finaliza os cabeçalhos da resposta
    
    def do_OPTIONS(self):
        self.send_response(200)  # Envia resposta 200 (OK)
        self.send_header('Access-Control-Allow-Origin', '*')  # Permite qualquer origem
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')  # Métodos permitidos
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')  # Cabeçalhos permitidos
        self.end_headers()  # Finaliza cabeçalhos

    def do_PUT(self):
        if self.path == '/notas':  # Verifica se o caminho é '/notas'
            try:
                content_length = int(self.headers['Content-Length'])  # Obtém comprimento do conteúdo
                post_data = self.rfile.read(content_length).decode('utf-8')  # Lê dados da requisição
                data = json.loads(post_data)  # Converte JSON para dicionário

                index = int(data.get('index', -1))  # Obtém índice da nota
                nota_editada = data.get('nota', {})  # Obtém nova nota

                with open('notas.json', 'r', encoding='utf-8') as file:  # Lê notas do arquivo
                    notas = json.load(file)

                if 0 <= index < len(notas):  # Verifica se índice é válido
                    nota_editada['id'] = notas[index]['id']  # Adiciona ID da nota existente
                    nota_editada['data'] = notas[index]['data']  # Mantém a data original da nota

                    notas[index] = nota_editada  # Atualiza nota no índice

                    with open('notas.json', 'w', encoding='utf-8') as file:  # Escreve notas atualizadas no arquivo
                        json.dump(notas, file, ensure_ascii=False, indent=4)

                    self.send_response(200)  # Envia resposta 200 (OK)
                    self.send_header('Content-Type', 'application/json')  # Define tipo de conteúdo como JSON
                    self.end_headers()  # Finaliza cabeçalhos
                    self.wfile.write(json.dumps({"message": "Nota editada com sucesso!"}).encode('utf-8'))  # Envia mensagem de sucesso
                else:
                    self.send_response(404)  # Envia resposta 404 (Não encontrado)
                    self.end_headers()
            except Exception as e:
                self.send_response(500)  # Envia resposta 500 (Erro interno)
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))  # Envia mensagem de erro
        else:
            self.send_response(404)  # Envia resposta 404 (Não encontrado)
            self.end_headers()
        

    def do_DELETE(self):
        if self.path.startswith('/notas/'):  # Verifica se o caminho da requisição começa com '/notas/'
            try:
                nota_id = int(self.path.split('/')[-1])  # Obtém o ID da nota da URL, extraindo o último elemento após a barra
                
                with open('notas.json', 'r', encoding='utf-8') as file:  # Abre o arquivo notas.json para leitura
                    notas = json.load(file)  # Carrega as notas existentes do arquivo JSON

                # Encontra a nota que será apagada
                nota_apagada = next((nota for nota in notas if nota['id'] == nota_id), None)  # Busca a nota a ser apagada

                if nota_apagada:  # Verifica se a nota foi encontrada
                    notas = [nota for nota in notas if nota['id'] != nota_id]  # Filtra as notas para remover a que possui o ID correspondente
                    
                    # Atualiza o arquivo notas.json
                    with open('notas.json', 'w', encoding='utf-8') as file:  # Abre o arquivo notas.json para escrita
                        json.dump(notas, file, ensure_ascii=False, indent=4)  # Salva as notas atualizadas (sem a nota removida) no arquivo JSON

                    # Adiciona a nota apagada ao arquivo apagadas.json
                    try:
                        with open('apagadas.json', 'r', encoding='utf-8') as file:  # Tenta abrir apagadas.json para leitura
                            apagadas = json.load(file)  # Carrega as notas apagadas existentes
                    except FileNotFoundError:  # Se o arquivo não existir
                        apagadas = []  # Inicializa uma nova lista

                    apagadas.append(nota_apagada)  # Adiciona a nota apagada à lista de notas apagadas

                    with open('apagadas.json', 'w', encoding='utf-8') as file:  # Abre o arquivo apagadas.json para escrita
                        json.dump(apagadas, file, ensure_ascii=False, indent=4)  # Salva as notas apagadas no arquivo

                    self.send_response(200)  # Envia uma resposta 200 (OK) ao cliente
                    self.send_header('Content-Type', 'application/json')  # Define o tipo de conteúdo da resposta como JSON
                    self.end_headers()  # Finaliza os cabeçalhos da resposta
                    
                    self.wfile.write(json.dumps({"message": "Nota apagada com sucesso!"}).encode('utf-8'))  # Envia uma mensagem de sucesso informando que a nota foi apagada
                else:
                    self.send_response(404)  # Se a nota não foi encontrada, envia uma resposta 404 (Não encontrado)
                    self.end_headers()  # Finaliza os cabeçalhos da resposta
            except Exception as e:  # Em caso de erro
                self.send_response(500)  # Envia uma resposta 500 (Erro interno do servidor)
                self.end_headers()  # Finaliza os cabeçalhos da resposta
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))  # Envia uma mensagem de erro em formato JSON
        else:
            self.send_response(404)  # Se o caminho não for encontrado, envia uma resposta 404 (Não encontrado)
            self.end_headers()  # Finaliza os cabeçalhos da resposta


def run(server_class=HTTPServer, handler_class=RequestHandler):  # Função para iniciar o servidor
    server_address = ('', 8000)  # Define o endereço e a porta do servidor
    httpd = server_class(server_address, handler_class)  # Cria uma instância do servidor HTTP
    print("Servidor rodando na porta 8000")  # Imprime uma mensagem informando que o servidor está em execução
    httpd.serve_forever()  # Inicia o loop de atendimento a requisições

if __name__ == "__main__":  # Verifica se o script está sendo executado diretamente
    run()  # Chama a função para iniciar o servidor
