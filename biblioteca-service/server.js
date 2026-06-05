import express from 'express';
import axios from 'axios';
import fs from 'fs/promises';

const app = express();
const PORT = 3000;

app.use(express.json());

const ARQUIVO = 'biblioteca.json';
const URL_USUARIOS = 'http://127.0.0.1:3002/usuarios';
const URL_CATALOGO = 'http://127.0.0.1:3001/jogos';

// Funções de persistência
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

// Rota POST
app.post('/biblioteca', async (req, res) => {
    const biblioteca = await lerDados();
    const { usuarioId, jogoId } = req.body;

    const novaRelacao = { usuarioId, jogoId };
    biblioteca.push(novaRelacao);
    await salvarDados(biblioteca);
    
    res.status(201).json({ mensagem: "Jogo adicionado à biblioteca", novaRelacao });
});

// Rota GET
app.get('/biblioteca/:usuarioId', async (req, res) => {
    const usuarioId = parseInt(req.params.usuarioId);

    try {
        const respostaUsuario = await axios.get(`${URL_USUARIOS}/${usuarioId}`);
        const usuarioDados = respostaUsuario.data;

        const biblioteca = await lerDados(); // Agora lê do arquivo!
        const relacoesDoUsuario = biblioteca.filter(b => b.usuarioId === usuarioId);
        
        if (relacoesDoUsuario.length === 0) {
            return res.status(200).json({ ...usuarioDados, jogos: [] });
        }

        const promessasDeJogos = relacoesDoUsuario.map(relacao => {
            return axios.get(`${URL_CATALOGO}/${relacao.jogoId}`);
        });

        const respostasJogos = await Promise.all(promessasDeJogos);
        const jogosDados = respostasJogos.map(resposta => resposta.data);

        const respostaFinal = {
            id: usuarioDados.id,
            nome: usuarioDados.nome,
            email: usuarioDados.email,
            jogos: jogosDados
        };

        res.status(200).json(respostaFinal);

    } catch (erro) {
        console.error("Erro ao comunicar com os serviços:", erro.message);
        if (erro.response && erro.response.status === 404) {
             return res.status(404).json({ mensagem: "Recurso (Usuário ou Jogo) não encontrado nos serviços."});
        }
        res.status(503).json({ mensagem: "Serviço temporariamente indisponível. Verifique se o Catálogo e os Usuários estão rodando." });
    }
});

app.listen(PORT, () => {
    console.log(`📚 Biblioteca-Service rodando na porta ${PORT}`);
});