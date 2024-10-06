
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
                <small>Data de Criação: ${nota.data}</small><br>  
                <small>Última Atualização: ${nota.update}</small> <br><br>   
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
    const notaIndexInput = document.getElementById('notaIndex');  // Obtém o campo que armazena o índice da nota a ser editada

    const titulo = tituloInput.value;  // Armazena o valor do título
    const conteudo = conteudoInput.value;  // Armazena o valor do conteúdo
    const index = notaIndexInput.value ? parseInt(notaIndexInput.value, 10) : null;  // Converte o índice para inteiro ou define como null

    if (titulo && conteudo) {  // Verifica se os campos de título e conteúdo não estão vazios
        let novaNota = {};  // Inicializa um objeto para a nova nota

        if (index !== null) {  // Se estamos atualizando uma nota existente
            const notaExistente = notas[index];  // Obtém a nota existente
            novaNota = {
                id: notaExistente.id,  // Mantém o ID da nota existente
                titulo,  // Adiciona o novo título
                conteudo,  // Adiciona o novo conteúdo
                data: notaExistente.data,  // Mantém a data de criação inalterada
                update: new Date().toLocaleString('pt-BR'),  // Atualiza a data de modificação
            };

            fetch('http://localhost:8000/notas', {  // Faz uma requisição para atualizar a nota
                method: 'PUT',  // Método da requisição é PUT para atualizar
                headers: { 'Content-Type': 'application/json' },  // Define o cabeçalho como JSON
                body: JSON.stringify({ index, nota: novaNota })  // Envia índice e nova nota como JSON
            })
            .then(response => {  // Trata a resposta da requisição
                if (!response.ok) {  // Verifica se a resposta não é um sucesso
                    throw new Error('Erro ao atualizar nota: ' + response.statusText);  // Lança um erro
                }
                return response.json();  // Converte a resposta para JSON
            })
            .then(data => {  // Trata os dados da resposta
                console.log(data.message);  // Exibe a mensagem de sucesso no console
                loadNotas();  // Recarrega as notas para ver a atualização
            })
            .catch(error => console.error('Erro ao atualizar nota:', error));  // Captura e exibe erros no console
        } else {  // Caso contrário, estamos adicionando uma nova nota
            novaNota = {  // Cria um novo objeto para a nova nota
                id: obterNovoId(),  // Gera um novo ID
                titulo,  // Adiciona o título da nova nota
                conteudo,  // Adiciona o conteúdo da nova nota
                data: new Date().toLocaleString('pt-BR'),  // Define a data de criação
                update: new Date().toLocaleString('pt-BR'),  // Define a data de modificação
            };

            fetch('http://localhost:8000/notas', {  // Faz uma requisição para adicionar a nova nota
                method: 'POST',  // Método da requisição é POST para adicionar
                headers: { 'Content-Type': 'application/json' },  // Define o cabeçalho como JSON
                body: JSON.stringify(novaNota)  // Envia a nova nota como JSON
            })
            .then(response => {  // Trata a resposta da requisição
                if (!response.ok) {  // Verifica se a resposta não é um sucesso
                    throw new Error('Erro ao adicionar nota: ' + response.statusText);  // Lança um erro
                }
                return response.json();  // Converte a resposta para JSON
            })
            .then(data => {  // Trata os dados da resposta
                console.log(data.message);  // Exibe a mensagem de sucesso no console
                loadNotas();  // Recarrega as notas
            })
            .catch(error => console.error('Erro ao adicionar nota:', error));  // Captura e exibe erros no console
        }

        // Limpa os campos
        tituloInput.value = '';  // Limpa o campo de título
        conteudoInput.value = '';  // Limpa o campo de conteúdo
        notaIndexInput.value = '';  // Limpa o campo de índice
    } else {  // Se os campos não estiverem preenchidos
        alert("Por favor, preencha todos os campos.");  // Exibe um alerta solicitando o preenchimento
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
        nota.data.toLowerCase().includes(filtro) ||  // Verifica se a data contém o filtro
        nota.update.toLowerCase().includes(filtro)  // Verifica se a data de atualização contém o filtro
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

    // Rola para o topo da página
    window.scrollTo({ top: 0, behavior: 'smooth' });  // Rola suavemente para o topo
}

// Função para apagar uma nota
function apagarNota(index) {
    const nota = notas[index];  // Obtém a nota pelo índice
    if (confirm(`Você realmente deseja apagar a nota: "${nota.titulo}"?`)) {  // Confirma a ação
        fetch(`http://localhost:8000/notas/${nota.id}`, {  // Faz uma requisição DELETE para o servidor
            method: 'DELETE',  // Método da requisição é DELETE
            headers: { 'Content-Type': 'application/json' }  // Define o cabeçalho como JSON
        })
        .then(response => {
            console.log(response);  // Log da resposta para depuração
            if (!response.ok) {  // Verifica se a resposta não é um sucesso
                throw new Error('Erro ao apagar nota: ' + response.statusText);  // Lança um erro
            }
            return response.json();  // Tenta obter a resposta como JSON
        })
        .then(data => {  // Aqui você pode usar a resposta do servidor se necessário
            console.log(data);  // Log dos dados da resposta
            notas.splice(index, 1);  // Remove a nota do array local
            displayNotas(notasFiltradas.length > 0 ? notasFiltradas : notas);  // Exibe as notas restantes
        })
        .catch(error => console.error('Erro ao apagar nota:', error));  // Captura e exibe erros no console
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
