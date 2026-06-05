import express from 'express';
import fs from 'fs/promises';

const app = express();
const PORT = 3001;

app.use(express.json());

const ARQUIVO = 'jogos.json';

const lerDados = async () => {
    try {
        const dados = await fs.readFile(ARQUIVO, 'utf-8');
        return JSON.parse(dados);
    } catch (erro) {
        return [];
    }
};

const salvarDados = async (dados) => {
    await fs.writeFile(ARQUIVO, JSON.stringify(dados, null, 2));
};

app.get('/jogos', async (req, res) => {
    const jogos = await lerDados();
    res.status(200).json(jogos);
});

app.get('/jogos/:id', async (req, res) => {
    const jogos = await lerDados();
    const id = parseInt(req.params.id);
    const jogo = jogos.find(j => j.id === id);
    
    if (!jogo) return res.status(404).json({ mensagem: "Jogo não encontrado" });
    
    res.status(200).json(jogo);
});

app.post('/jogos', async (req, res) => {
    const jogos = await lerDados();
    const { titulo, plataforma, genero } = req.body;
    
    const novoJogo = {
        id: jogos.length > 0 ? jogos[jogos.length - 1].id + 1 : 1,
        titulo,
        plataforma,
        genero
    };
    
    jogos.push(novoJogo);
    await salvarDados(jogos);
    
    res.status(201).json(novoJogo);
});

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
