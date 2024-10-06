/*let notas = [];  // Array para armazenar as notas
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
        // Para cada nota na lista de notas a serem exibidas, execute a função com os parâmetros 'nota' e 'index'.
        notasDiv.innerHTML += `
            <div class="anotacao">  <!-- Cria um contêiner para a nota, com a classe 'anotacao' -->
               
                <h3>${nota.titulo}</h3> <!-- Exibe o título da nota em um cabeçalho h3 -->  
                <p>${nota.conteudo}</p> <!-- Exibe o conteúdo da nota em um parágrafo -->
                <small>${nota.data}</small> <!-- Exibe a data da nota em um elemento pequeno -->
                <button class="edit" onclick="editarNota(${start + index})">Editar</button> <!-- Cria um botão para editar a nota. Chama a função 'editarNota' passando o índice da nota. -->        
                <button class="delete" onclick="apagarNota(${start + index})">Apagar</button> <!-- Cria um botão para apagar a nota. Chama a função 'apagarNota' passando o índice da nota. -->
                
            </div>
        `;
    });

    updatePaginationInfo(notasParaMostrar.length);  // Atualiza a informação da paginação com base no total de notas
}

// Função para adicionar uma nova nota
function adicionarNota() {
    const tituloInput = document.getElementById('titulo');
    const conteudoInput = document.getElementById('conteudo');
    const notaIndexInput = document.getElementById('notaIndex');

    if (!tituloInput || !conteudoInput) {
        console.error("Os elementos de título ou conteúdo não foram encontrados no DOM.");
        return;
    }

    const titulo = tituloInput.value;
    const conteudo = conteudoInput.value;
    const index = notaIndexInput ? notaIndexInput.value : null;

    if (titulo && conteudo) {
        const novaNota = {
            titulo,
            conteudo,
            data: new Date().toLocaleString('pt-BR'),
        };

        if (index) {
            // Atualizando uma nota existente
            novaNota.id = parseInt(index, 10); // Usa o índice existente como ID
            console.log("Atualizando nota:", { nota: novaNota, index });
            fetch('http://localhost:8000/notas', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novaNota)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao atualizar nota: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log(data.message);  // Mensagem de sucesso
                loadNotas();  // Recarregar as notas para ver a atualização
            })
            .catch(error => console.error('Erro ao atualizar nota:', error));            
        } else {
            // Adicionando uma nova nota
            fetch('http://localhost:8000/notas')
            .then(response => response.json())
            .then(notas => {
                // Encontra o maior ID atual
                const maxId = notas.reduce((max, nota) => nota.id > max ? nota.id : max, 0);
                novaNota.id = maxId + 1; // Atribui o próximo ID
                console.log("Adicionando nova nota:", novaNota);
                return fetch('http://localhost:8000/notas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(novaNota) // Salva como id
                });
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao adicionar nota: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log(data.message);
                loadNotas();
            })
            .catch(error => console.error('Erro ao adicionar nota:', error));
        }

        // Limpa os campos
        tituloInput.value = '';
        conteudoInput.value = '';
    } else {
        alert("Por favor, preencha todos os campos.");
    }
}



document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('salvar').addEventListener('click', adicionarNota);
});



function obterNovoId() {
    const ids = notas.map(nota => nota.id);
    return Math.max(...ids) + 1; // Gera um novo ID
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

// Função para editar uma nota
function editarNota(index) {
    const nota = notas[index]; // Obtém a nota do índice
    document.getElementById('titulo').value = nota.titulo; // Preenche o título
    document.getElementById('conteudo').value = nota.conteudo; // Preenche o conteúdo
    document.getElementById('notaIndex').value = index; // Armazena o índice da nota sendo editada
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
*/

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
        notasDiv.innerHTML = `<p>Nenhuma nota encontrada.</p>`;  // Exibe mensagem informando que não há notas
        return;  // Sai da função
    }

    // Para cada nota a ser exibida, adiciona seu conteúdo ao elemento 'notasDiv'
    notasParaExibir.forEach((nota, index) => {
        notasDiv.innerHTML += `
            <div class="anotacao">
                <h3>${nota.titulo}</h3>  
                <p>${nota.conteudo}</p>  
                <small>${nota.data}</small>  
                <button class="edit" onclick="editarNota(${start + index})">Editar</button>  
                <button class="delete" onclick="apagarNota(${start + index})">Apagar</button>  
            </div>
        `;
    });

    updatePaginationInfo(notasParaMostrar.length);  // Atualiza a informação da paginação com base no total de notas
}

// Função para adicionar ou editar uma nota
function adicionarNota() {
    const tituloInput = document.getElementById('titulo');  // Obtém o campo de entrada do título
    const conteudoInput = document.getElementById('conteudo');  // Obtém o campo de entrada do conteúdo
    const notaIndexInput = document.getElementById('notaIndex');  // Obtém o campo de índice da nota

    const titulo = tituloInput.value;  // Armazena o título inserido
    const conteudo = conteudoInput.value;  // Armazena o conteúdo inserido
    const index = notaIndexInput.value ? parseInt(notaIndexInput.value, 10) : null;  // Armazena o índice se existir

    if (titulo && conteudo) {  // Verifica se ambos os campos estão preenchidos
        const novaNota = {  // Cria um objeto com a nova nota
            titulo,
            conteudo,
            data: new Date().toLocaleString('pt-BR'),  // Obtém a data atual formatada
        };

        if (index !== null) {  // Se um índice for fornecido, atualiza uma nota existente
            novaNota.id = notas[index].id;  // Mantém o ID existente
            fetch('http://localhost:8000/notas', {
                method: 'PUT',  // Define o método da requisição como PUT
                headers: { 'Content-Type': 'application/json' },  // Define o cabeçalho como JSON
                body: JSON.stringify({ index, nota: novaNota })  // Envia índice e nota como JSON
            })
            .then(response => {
                if (!response.ok) {  // Verifica se a resposta não foi OK
                    throw new Error('Erro ao atualizar nota: ' + response.statusText);  // Lança erro
                }
                return response.json();  // Converte a resposta para JSON
            })
            .then(data => {
                console.log(data.message);  // Mensagem de sucesso no console
                loadNotas();  // Recarrega as notas para ver a atualização
            })
            .catch(error => console.error('Erro ao atualizar nota:', error));  // Captura e exibe erros
        } else {  // Se não houver índice, adiciona uma nova nota
            novaNota.id = obterNovoId();  // Gera um novo ID
            fetch('http://localhost:8000/notas', {
                method: 'POST',  // Define o método da requisição como POST
                headers: { 'Content-Type': 'application/json' },  // Define o cabeçalho como JSON
                body: JSON.stringify(novaNota)  // Envia a nova nota como JSON
            })
            .then(response => {
                if (!response.ok) {  // Verifica se a resposta não foi OK
                    throw new Error('Erro ao adicionar nota: ' + response.statusText);  // Lança erro
                }
                return response.json();  // Converte a resposta para JSON
            })
            .then(data => {
                console.log(data.message);  // Mensagem de sucesso no console
                loadNotas();  // Recarrega as notas para ver a nova nota
            })
            .catch(error => console.error('Erro ao adicionar nota:', error));  // Captura e exibe erros
        }

        // Limpa os campos de entrada
        tituloInput.value = '';  // Limpa o campo de título
        conteudoInput.value = '';  // Limpa o campo de conteúdo
        notaIndexInput.value = '';  // Limpa o campo de índice também
    } else {
        alert("Por favor, preencha todos os campos.");  // Exibe alerta se os campos não estiverem preenchidos
    }
}

// Função para obter um novo ID
function obterNovoId() {
    const ids = notas.map(nota => nota.id);  // Obtém todos os IDs das notas
    return Math.max(...ids) + 1;  // Gera um novo ID baseado no maior ID existente
}

// Função para filtrar notas
function filtrarNotas() {
    const filtro = document.getElementById('filtro').value.toLowerCase().trim();  // Obtém e formata o valor do filtro
    notasFiltradas = notas.filter(nota =>  // Filtra as notas com base no critério de busca
        nota.titulo.toLowerCase().includes(filtro) ||  // Verifica se o título contém o filtro
        nota.conteudo.toLowerCase().includes(filtro) ||  // Verifica se o conteúdo contém o filtro
        nota.data.toLowerCase().includes(filtro)  // Verifica se a data contém o filtro
    );
    currentPage = 1;  // Reseta a página atual para 1
    displayNotas(notasFiltradas);  // Exibe as notas filtradas
}

// Função para atualizar a informação da paginação
function updatePaginationInfo(totalNotas) {
    const paginationDiv = document.getElementById('pagination');  // Obtém o elemento da paginação
    const totalPages = Math.ceil(totalNotas / itemsPerPage);  // Calcula o total de páginas
    paginationDiv.innerHTML = `  
        <button onclick="previousPage()">Anterior</button>  
        <span>Página ${currentPage} de ${totalPages}</span>  
        <button onclick="nextPage()">Próxima</button>  
    `;
    const previousButton = paginationDiv.querySelector('button:first-child');  // Obtém o botão "Anterior"
    const nextButton = paginationDiv.querySelector('button:last-child');  // Obtém o botão "Próxima"
    
    previousButton.disabled = currentPage === 1;  // Desabilita o botão "Anterior" se estiver na primeira página
    nextButton.disabled = currentPage >= totalPages;  // Desabilita o botão "Próxima" se estiver na última página
}

// Funções de navegação da paginação
function nextPage() {
    if (currentPage * itemsPerPage < (notasFiltradas.length || notas.length)) {  // Verifica se há mais páginas
        currentPage++;  // Avança para a próxima página
        displayNotas(notasFiltradas.length > 0 ? notasFiltradas : notas);  // Exibe as notas da página atual
    }
}

function previousPage() {
    if (currentPage > 1) {  // Verifica se não está na primeira página
        currentPage--;  // Volta para a página anterior
        displayNotas(notasFiltradas.length > 0 ? notasFiltradas : notas);  // Exibe as notas da página atual
    }
}

// Função para editar uma nota
function editarNota(index) {
    const nota = notas[index];  // Obtém a nota pelo índice
    document.getElementById('titulo').value = nota.titulo;  // Define o título no campo de entrada
    document.getElementById('conteudo').value = nota.conteudo;  // Define o conteúdo no campo de entrada
    document.getElementById('notaIndex').value = index;  // Armazena o índice da nota sendo editada
}

// Função para apagar uma nota
function apagarNota(index) {
    const nota = notas[index];  // Obtém a nota pelo índice
    if (confirm(`Você realmente deseja apagar a nota: "${nota.titulo}"?`)) {  // Confirma a ação
        notas.splice(index, 1);  // Remove a nota do array
        displayNotas(notasFiltradas.length > 0 ? notasFiltradas : notas);  // Exibe as notas restantes
    }
}

// Função para exportar notas
function exportarNotas() {
    const jsonNotas = JSON.stringify(notasFiltradas.length > 0 ? notasFiltradas : notas, null, 2);  // Converte notas para JSON
    const blob = new Blob([jsonNotas], { type: 'application/json' });  // Cria um blob com o JSON
    const url = URL.createObjectURL(blob);  // Cria uma URL para o blob
    
    const a = document.createElement('a');  // Cria um elemento âncora para download
    a.href = url;  // Define a URL do blob
    a.download = 'notas.json';  // Define o nome do arquivo para download
    document.body.appendChild(a);  // Adiciona o elemento ao DOM
    a.click();  // Simula o clique para iniciar o download
    document.body.removeChild(a);  // Remove o elemento do DOM
    URL.revokeObjectURL(url);  // Revoga a URL criada
}

// Adiciona eventos aos botões
document.getElementById('salvar').addEventListener('click', adicionarNota);  // Adiciona evento ao botão de salvar
document.getElementById('filtro').addEventListener('input', filtrarNotas);  // Adiciona evento ao campo de filtro
document.getElementById('exportar').addEventListener('click', exportarNotas);  // Adiciona evento ao botão de exportar

// Carrega notas ao iniciar a página
loadNotas();  // Chama a função para carregar notas
