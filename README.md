# Minha Gameteca (Microsserviços com Node.js)

Este projeto é uma plataforma simples de coleção de jogos construída usando a arquitetura de **Microsserviços**. [cite_start]Em vez de fazer tudo em um servidor só (monolito), eu dividi o sistema em três partes independentes que conversam entre si via HTTP[cite: 3, 4, 5, 6].

Como a estrutura funciona

* **Catálogo-Service (Porta 3001):** Cuida só dos jogos. [cite_start]Tem as rotas para criar, listar e deletar os jogos disponíveis[cite: 25, 27, 28].
* **Usuários-Service (Porta 3002):** Cuida só das pessoas. [cite_start]Cria e lista os usuários da plataforma[cite: 29, 31, 32].
* **Biblioteca-Service (Porta 3000):** É o cérebro da operação. Ele não tem banco de dados de nomes ou títulos. [cite_start]Ele só guarda quem tem qual jogo e faz requisições pro Catálogo e pros Usuários para montar a resposta completa[cite: 33, 34, 37].

Como rodar o projeto na sua máquina

[cite_start]Como são serviços independentes, você precisa rodar cada um no seu próprio terminal[cite: 56, 71].

1. Abra 3 abas de terminal no seu VS Code.

2. No **Terminal 1**, entre na pasta do catálogo e rode:

   cd catalogo-service
   npm run dev

3. No Terminal 2, entre na pasta de usuários e rode:

cd usuarios-service
npm run dev

4. No Terminal 3, entre na pasta da biblioteca e rode:

cd biblioteca-service
npm run dev

Tudo verde? Beleza, os 3 servidores estão online!

Como testar (Exemplos de Requisições)Você pode usar o Insomnia ou o Thunder Client para testar. Aqui estão os testes principais:  

1. Ver todos os jogos (Catálogo):

GET http://localhost:3001/jogos

3. Adicionar um jogo na biblioteca de alguém:

POST http://localhost:3000/biblioteca

Body (JSON):

{
  "usuarioId": 1,
  "jogoId": 2
}

3. O Teste Principal (Ver a biblioteca completa de um usuário):

GET http://localhost:3000/biblioteca/1

O que acontece aqui: Esse GET vai fazer a porta 3000 disparar requisições para a 3001 e 3002 ao mesmo tempo (usando Promise.all) para buscar os dados bonitinhos e te devolver um JSON completo!  

Reflexão sobre Microsserviços
1. O que acontece se um serviço cair?
Se o catalogo-service ou o usuarios-service cair, a rota de GET da biblioteca-service quebra (ou, no meu caso, retorna um erro 503 dizendo que o serviço está indisponível, que foi o bônus da atividade). Isso acontece porque a biblioteca depende totalmente dos outros dois para formar a resposta.  

2. Quais as vantagens disso contra um Monolito?
A maior vantagem é a independência. Se eu quiser mudar a regra de negócio só dos jogos, eu mexo só na pasta do catálogo e os usuários nem ficam sabendo. Além disso, se o sistema ficar gigante, eu posso colocar o catálogo rodando em um servidor mais potente e deixar os usuários num servidor menor, escalando só o que precisa.  

3. Quais os novos problemas que surgem?
Trabalhar com microsserviços dá muito mais dor de cabeça com infraestrutura. Em vez de subir um servidor, eu tive que subir três. Além disso, a comunicação entre eles via HTTP (pela rede) pode falhar, ficar lenta ou dar timeout. No monolito, era só chamar uma função direto no código que a resposta era instantânea.
