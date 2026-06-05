import express from 'express';
import proxy from 'express-http-proxy';

const app = express();
const PORT = 4000; 

app.use('/jogos', proxy('http://127.0.0.1:3001', {
    proxyReqPathResolver: (req) => {
        return '/jogos' + req.url; 
    }
}));

app.use('/usuarios', proxy('http://127.0.0.1:3002', {
    proxyReqPathResolver: (req) => {
        return '/usuarios' + req.url;
    }
}));

app.use('/biblioteca', proxy('http://127.0.0.1:3000', {
    proxyReqPathResolver: (req) => {
        return '/biblioteca' + req.url;
    }
}));

app.listen(PORT, () => {
    console.log(`🌍 API Gateway rodando na porta ${PORT}`);
    console.log(`-> O front-end agora só precisa acessar http://localhost:4000/`);
});
