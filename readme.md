# Gerenciador de Anotações

Um simples e eficiente gerenciador de anotações que permite ao usuário criar, visualizar, filtrar e apagar notas. Esta aplicação é construída com HTML, CSS e JavaScript para a interface do usuário, enquanto um servidor Python gerencia as requisições e o armazenamento das notas em um arquivo JSON.

## Estrutura do Projeto

O projeto é estruturado em três componentes principais:

- **Frontend**: Utiliza HTML, CSS e JavaScript para criar a interface do usuário.
- **Backend**: Um servidor Python que lida com requisições e manipulação de dados.
- **Armazenamento**: As notas são salvas em um arquivo JSON, garantindo uma forma simples e eficiente de persistência de dados.

**Cuidados com os Dados:**

- Assegure-se de não excluir ou modificar o arquivo `notas.json` diretamente, para evitar a perda de dados.
- O servidor manipula automaticamente as notas, garantindo integridade e segurança.

## Funcionalidades

- **Adicionar Notas**: Crie novas notas com título e conteúdo.
- **Visualizar Notas**: Exiba todas as notas salvas.
- **Filtrar Notas**: Pesquise notas por título, conteúdo ou data.
- **Paginação**: Navegue pelas notas, visualizando 10 por vez.
- **Apagar Notas**: Remova notas indesejadas.

## Tecnologias Utilizadas

- HTML
- CSS
- JavaScript
- Python (para o servidor local)

## Instalação

1. Clone este repositório:
   `git clone https://github.com/JeffersonEstevo/Agenda-Simples.git`  

2. Navegue até a pasta do projeto:
   `cd gerenciador-anotacoes`

3. Inicie o servidor local (certifique-se de ter Python instalado):
   `python server.py`

4. Abra o arquivo `index.html` em seu navegador.

## Como Utilizar

### Interface Principal
Na interface principal, você verá campos para adicionar um título e conteúdo para sua nova nota, além de botões para salvar, filtrar e exportar notas.

### Adicionando uma Nota
1. Preencha o campo Título e o campo Conteúdo.
2. Clique no botão Salvar Nota.
3. A nova nota aparecerá na lista abaixo.

### Filtrando Notas
Use o campo Filtrar para buscar notas. A pesquisa considera título, conteúdo e data. As notas serão atualizadas automaticamente conforme você digita.

### Navegando pelas Notas
As notas são paginadas, exibindo 10 por vez. Use os botões Anterior e Próxima para navegar entre as páginas.

### Apagando uma Nota
Clique no botão Apagar ao lado da nota que você deseja remover. Uma confirmação será solicitada para garantir que você deseja excluir a nota.

## Contribuições
Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.

## Licença
Este projeto está licenciado sob a MIT License - veja o arquivo LICENSE para detalhes.

## Contato
Para dúvidas ou sugestões, entre em contato comigo:

Email: jefferson.estevo@gmail.com  
GitHub: JeffersonEstevo
