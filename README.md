# projeto-SD
Projeto final da disciplina de Sistemas Distribuidos, chat utilizando sockets e containers Docker para comunicação em tempo real usando javascript


![chat-sd](https://github.com/WendelLorenzi/projeto-SD/assets/38894557/ca37d6cd-5575-4ae0-9a5c-4635a59122fc)

### Docker

- verificar se existe o Docker instalado `docker -v`

  - Executar o comando `docker build -t chat .` para montar a imagem da aplicação
  - Executar o comando `docker run -p 3000:3000 -d chat` para rodar a aplicação na porta 3000
  - Acessar pagina http://localhost:3000 para verificar o funcionamento
  
