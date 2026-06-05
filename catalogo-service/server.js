import express from 'express';
import fs from 'fs/promises'; // Importa a biblioteca de manipulação de arquivos do Node

const app = express();
const PORT = 3001;

app.use(express.json());

const ARQUIVO = 'jogos.json';

// Função para ler o arquivo JSON
const lerDados = async () => {
    try {
        const dados = await fs.readFile(ARQUIVO, 'utf-8');
        return JSON.parse(dados);
    } catch (erro) {
        return []; // Se der erro (ex: arquivo não existe), devolve array vazio
    }
};

// Função para reescrever o arquivo JSON
const salvarDados = async (dados) => {
    // O "null, 2" serve para o arquivo ficar formatado e bonitinho
    await fs.writeFile(ARQUIVO, JSON.stringify(dados, null, 2));
};

// Rota: Listar todos os jogos
app.get('/jogos', async (req, res) => {
    const jogos = await lerDados();
    res.status(200).json(jogos);
});

// Rota: Retornar um jogo específico
app.get('/jogos/:id', async (req, res) => {
    const jogos = await lerDados();
    const id = parseInt(req.params.id);
    const jogo = jogos.find(j => j.id === id);
    
    if (!jogo) return res.status(404).json({ mensagem: "Jogo não encontrado" });
    
    res.status(200).json(jogo);
});

// Rota: Cadastrar um novo jogo
app.post('/jogos', async (req, res) => {
    const jogos = await lerDados(); // Lê como está agora
    const { titulo, plataforma, genero } = req.body;
    
    const novoJogo = {
        id: jogos.length > 0 ? jogos[jogos.length - 1].id + 1 : 1,
        titulo,
        plataforma,
        genero
    };
    
    jogos.push(novoJogo); // Adiciona na memória
    await salvarDados(jogos); // Salva no arquivo de verdade!
    
    res.status(201).json(novoJogo);
});

// Rota: Remover um jogo
app.delete('/jogos/:id', async (req, res) => {
    const jogos = await lerDados();
    const id = parseInt(req.params.id);
    const index = jogos.findIndex(j => j.id === id);
    
    if (index === -1) return res.status(404).json({ mensagem: "Jogo não encontrado" });
    
    jogos.splice(index, 1);
    await salvarDados(jogos);
    
    res.status(200).json({ mensagem: "Jogo removido com sucesso" });
});

app.listen(PORT, () => {
    console.log(`🎮 Catalogo-Service rodando na porta ${PORT}`);
});