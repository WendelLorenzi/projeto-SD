# Chat utilizando Sockets e Containers Docker

Este é um projeto de chat em tempo real que utiliza sockets para comunicação, e containers Docker para facilitar a implantação e execução em diferentes ambientes. O projeto foi desenvolvido em Node.js.

![chat-sd](https://github.com/WendelLorenzi/projeto-SD/assets/38894557/ca37d6cd-5575-4ae0-9a5c-4635a59122fc)

## Instalação

Siga os passos abaixo para configurar e executar o projeto em sua máquina local.

### Pré-requisitos

Certifique-se de ter o Docker e o Docker Compose instalados em sua máquina `docker -v`. Caso ainda não tenha, você pode baixá-los em [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/install/).

### Passos de Instalação

1. *Clone o repositório:*

    bash
    git clone https://github.com/WendelLorenzi/projeto-SD
    cd projeto-SD
    

2. *Construa e inicie os containers Docker:*

    bash
    docker-compose up -d
    

    Isso iniciará os containers em segundo plano.

3. *Acesse o chat:*

    Abra o navegador e acesse a URL especificada no projeto, por exemplo, `http://localhost:3000`.

    *Nota:* Se você estiver executando o Docker em uma máquina remota, você pode acessar a aplicação usando o endereço IP dessa máquina. Certifique-se de que as portas necessárias estejam abertas e redirecionadas, se necessário.

4. *Pronto!* 

    Agora você tem o chat em tempo real em execução localmente. Se estiver executando em uma máquina remota, outros usuários podem acessar a aplicação usando o endereço IP dessa máquina.

## Contribuições

Contribuições são bem-vindas! Se você encontrar problemas ou tiver sugestões de melhorias, sinta-se à vontade para abrir uma issue ou enviar um pull request.