let notas = [];
let notasFiltradas = [];
let currentPage = 1;
const itemsPerPage = 10;

// Função para carregar notas do arquivo JSON
function loadNotas() {
    fetch('http://localhost:8000/notas')
        .then(response => response.json())
        .then(data => {
            notas = data;
            displayNotas();
        })
        .catch(error => console.error('Erro ao carregar notas:', error));
}

// Função para exibir notas
function displayNotas(notasParaMostrar = notas) {
    const notasDiv = document.getElementById('anotacoes');
    notasDiv.innerHTML = ''; // Limpa as notas antes de adicionar novas

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const notasParaExibir = notasParaMostrar.slice(start, end);

    if (notasParaExibir.length === 0) {
        notasDiv.innerHTML = `<p>Nenhuma nota encontrada.</p>`;
        return;
    }

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

    updatePaginationInfo(notasParaMostrar.length);
}

// Função para adicionar uma nova nota
function adicionarNota() {
    const titulo = document.getElementById('titulo').value;
    const conteudo = document.getElementById('conteudo').value;
    const data = new Date().toLocaleString('pt-BR');

    if (titulo && conteudo) {
        const novaNota = { titulo, conteudo, data };
        fetch('http://localhost:8000/notas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novaNota)
        })
        .then(() => {
            loadNotas();
            document.getElementById('titulo').value = '';
            document.getElementById('conteudo').value = '';
        })
        .catch(error => console.error('Erro ao salvar nota:', error));
    } else {
        alert("Por favor, preencha todos os campos.");
    }
}

// Função para filtrar notas
function filtrarNotas() {
    const filtro = document.getElementById('filtro').value.toLowerCase().trim();

    notasFiltradas = notas.filter(nota => 
        nota.titulo.toLowerCase().includes(filtro) ||
        nota.conteudo.toLowerCase().includes(filtro) ||
        nota.data.toLowerCase().includes(filtro)
    );

    //console.log('Notas filtradas:', notasFiltradas);

    currentPage = 1; // Reinicia a página para 1 sempre que o filtro mudar
    displayNotas(notasFiltradas);
}

// Função para atualizar a informação da paginação
function updatePaginationInfo(totalNotas) {
    const paginationDiv = document.getElementById('pagination');
    const totalPages = Math.ceil(totalNotas / itemsPerPage);
    
    paginationDiv.innerHTML = `
        <button onclick="previousPage()">Anterior</button>
        <span>Página ${currentPage} de ${totalPages}</span>
        <button onclick="nextPage()">Próxima</button>
    `;

    // Desabilitar botões de paginação quando apropriado
    const previousButton = paginationDiv.querySelector('button:first-child');
    const nextButton = paginationDiv.querySelector('button:last-child');
    
    previousButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage >= totalPages;
}

// Funções de navegação da paginação
function nextPage() {
    if (currentPage * itemsPerPage < (notasFiltradas.length || notas.length)) {
        currentPage++;
        displayNotas(notasFiltradas.length > 0 ? notasFiltradas : notas);
    }
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayNotas(notasFiltradas.length > 0 ? notasFiltradas : notas);
    }
}

// Função para apagar uma nota
function apagarNota(index) {
    const nota = notas[index];

    if (confirm(`Você realmente deseja apagar a nota: "${nota.titulo}"?`)) {
        notas.splice(index, 1); // Remove a nota do array
        displayNotas(notasFiltradas.length > 0 ? notasFiltradas : notas); // Atualiza a exibição
    }
}

// Adiciona eventos aos botões
document.getElementById('salvar').addEventListener('click', adicionarNota);
document.getElementById('filtro').addEventListener('input', filtrarNotas);

// Carrega notas ao iniciar a página
loadNotas();
