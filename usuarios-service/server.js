import express from 'express';
import fs from 'fs/promises';

const app = express();
const PORT = 3002;

app.use(express.json());

const ARQUIVO = 'usuarios.json';

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

app.get('/usuarios', async (req, res) => {
    const usuarios = await lerDados();
    res.status(200).json(usuarios);
});

app.get('/usuarios/:id', async (req, res) => {
    const usuarios = await lerDados();
    const id = parseInt(req.params.id);
    const usuario = usuarios.find(u => u.id === id);
    
    if (!usuario) return res.status(404).json({ mensagem: "Usuário não encontrado" });
    
    res.status(200).json(usuario);
});

app.post('/usuarios', async (req, res) => {
    const usuarios = await lerDados();
    const { nome, email } = req.body;
    
    const novoUsuario = {
        id: usuarios.length > 0 ? usuarios[usuarios.length - 1].id + 1 : 1,
        nome,
        email
    };
    
    usuarios.push(novoUsuario);
    await salvarDados(usuarios);
    
    res.status(201).json(novoUsuario);
});

app.listen(PORT, () => {
    console.log(`Usuarios-Service rodando na porta ${PORT}`);
});
