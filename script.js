let notas = [];  // Array para armazenar as notas
let notasFiltradas = [];  // Array para armazenar notas filtradas com base no critério de busca
let currentPage = 1;  // Página atual da lista de notas
const itemsPerPage = 10;  // Número de notas a serem exibidas por página

// Função para carregar notas do arquivo JSON
function loadNotas() {
    fetch('http://localhost:8000/notas')  // Faz uma requisição GET para buscar as notas
        .then(response => response.json())  // Converte a resposta para JSON
        .then(data => {
            notas = data;  // Armazena as notas no array 'notas'
            displayNotas();  // Chama a função para exibir as notas
        })
        .catch(error => console.error('Erro ao carregar notas:', error));  // Captura e exibe erros no console
}

// Função para exibir notas
function displayNotas(notasParaMostrar = notas) {  // Permite que notas a serem mostradas sejam passadas como argumento
    const notasDiv = document.getElementById('anotacoes');  // Obtém o elemento onde as notas serão exibidas
    notasDiv.innerHTML = '';  // Limpa as notas exibidas antes de adicionar novas

    const start = (currentPage - 1) * itemsPerPage;  // Calcula o índice inicial para a página atual
    const end = start + itemsPerPage;  // Calcula o índice final para a página atual
    const notasParaExibir = notasParaMostrar.slice(start, end);  // Obtém as notas a serem exibidas na página atual

    if (notasParaExibir.length === 0) {  // Verifica se não há notas para exibir
        notasDiv.innerHTML = `<p>Nenhuma nota encontrada.</p>`;  // Exibe uma mensagem informando que não há notas
        return;  // Sai da função
    }

    // Para cada nota a ser exibida, adiciona seu conteúdo ao elemento 'notasDiv'
    notasParaExibir.forEach((nota, index) => {
        notasDiv.innerHTML += `
            <div class="anotacao">
                <h3>${nota.titulo}</h3>
                <p>${nota.conteudo}</p>
                <small>${nota.data}</small>
                <button class="delete" onclick="apagarNota(${start + index})">Apagar</button>
            </div>
        `;
    });

    updatePaginationInfo(notasParaMostrar.length);  // Atualiza a informação da paginação com base no total de notas
}

// Função para adicionar uma nova nota
function adicionarNota() {
    const titulo = document.getElementById('titulo').value; // Obtém o título
    const conteudo = document.getElementById('conteudo').value; // Obtém o conteúdo
    const data = new Date().toLocaleString('pt-BR'); // Obtém a data atual

    if (titulo && conteudo) { // Verifica se os campos estão preenchidos
        const novaNota = { titulo, conteudo, data }; // Cria a nova nota
        console.log('Salvando nota:', novaNota); // Log para depuração

        fetch('http://localhost:8000/notas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novaNota) // Envia a nova nota como JSON
        })
        .then(response => {
            if (!response.ok) { // Verifica se a resposta é ok
                throw new Error('Erro na requisição: ' + response.statusText);
            }
            return response.text(); // Pode ser alterado para response.json() se necessário
        })
        .then(() => {
            loadNotas(); // Recarrega as notas
            document.getElementById('titulo').value = ''; // Limpa o campo de título
            document.getElementById('conteudo').value = ''; // Limpa o campo de conteúdo
        })
        .catch(error => console.error('Erro ao salvar nota:', error)); // Log de erro
    } else {
        alert("Por favor, preencha todos os campos."); // Alerta se campos estão vazios
    }
}


// Função para filtrar notas
function filtrarNotas() {
    const filtro = document.getElementById('filtro').value.toLowerCase().trim();  // Obtém o valor do campo de filtro, em letras minúsculas

    // Filtra as notas com base no título, conteúdo ou data
    notasFiltradas = notas.filter(nota => 
        nota.titulo.toLowerCase().includes(filtro) ||
        nota.conteudo.toLowerCase().includes(filtro) ||
        nota.data.toLowerCase().includes(filtro)
    );

    currentPage = 1;  // Reinicia a página para 1 sempre que o filtro mudar
    displayNotas(notasFiltradas);  // Chama a função para exibir as notas filtradas
}

// Função para atualizar a informação da paginação
function updatePaginationInfo(totalNotas) {
    const paginationDiv = document.getElementById('pagination');  // Obtém o elemento de paginação
    const totalPages = Math.ceil(totalNotas / itemsPerPage);  // Calcula o total de páginas

    // Atualiza o HTML da paginação
    paginationDiv.innerHTML = `
        <button onclick="previousPage()">Anterior</button>
        <span>Página ${currentPage} de ${totalPages}</span>
        <button onclick="nextPage()">Próxima</button>
    `;

    // Desabilitar botões de paginação quando apropriado
    const previousButton = paginationDiv.querySelector('button:first-child');  // Obtém o botão "Anterior"
    const nextButton = paginationDiv.querySelector('button:last-child');  // Obtém o botão "Próxima"
    
    previousButton.disabled = currentPage === 1;  // Desabilita o botão "Anterior" se estiver na primeira página
    nextButton.disabled = currentPage >= totalPages;  // Desabilita o botão "Próxima" se estiver na última página
}

// Funções de navegação da paginação
function nextPage() {
    // Verifica se há mais notas a serem exibidas na próxima página
    if (currentPage * itemsPerPage < (notasFiltradas.length || notas.length)) {
        currentPage++;  // Avança para a próxima página
        displayNotas(notasFiltradas.length > 0 ? notasFiltradas : notas);  // Exibe notas filtradas ou todas as notas
    }
}

function previousPage() {
    // Verifica se a página atual é maior que 1
    if (currentPage > 1) {
        currentPage--;  // Retorna para a página anterior
        displayNotas(notasFiltradas.length > 0 ? notasFiltradas : notas);  // Exibe notas filtradas ou todas as notas
    }
}

// Função para apagar uma nota
function apagarNota(index) {
    const nota = notas[index];  // Obtém a nota a ser apagada pelo índice

    // Pergunta ao usuário se ele realmente deseja apagar a nota
    if (confirm(`Você realmente deseja apagar a nota: "${nota.titulo}"?`)) {
        notas.splice(index, 1);  // Remove a nota do array
        displayNotas(notasFiltradas.length > 0 ? notasFiltradas : notas);  // Atualiza a exibição
    }
}

function exportarNotas() {
    const jsonNotas = JSON.stringify(notasFiltradas.length > 0 ? notasFiltradas : notas, null, 2); // Converte as notas para JSON
    const blob = new Blob([jsonNotas], { type: 'application/json' }); // Cria um Blob com o conteúdo JSON
    const url = URL.createObjectURL(blob); // Cria um URL para o Blob
    
    const a = document.createElement('a'); // Cria um elemento <a>
    a.href = url; // Define o href como o URL do Blob
    a.download = 'notas.json'; // Define o nome do arquivo a ser baixado
    document.body.appendChild(a); // Adiciona o <a> ao corpo do documento
    a.click(); // Simula o clique no <a> para iniciar o download
    document.body.removeChild(a); // Remove o <a> do corpo
    URL.revokeObjectURL(url); // Libera o URL criado
}


// Adiciona eventos aos botões
document.getElementById('salvar').addEventListener('click', adicionarNota);  // Adiciona um evento de clique ao botão de salvar
document.getElementById('filtro').addEventListener('input', filtrarNotas);  // Adiciona um evento de entrada ao campo de filtro
document.getElementById('exportar').addEventListener('click', exportarNotas);  // Adiciona um evento para exportar as notas para o arquivi JSON


// Carrega notas ao iniciar a página
loadNotas();  // Chama a função para carregar notas assim que a página é carregada
