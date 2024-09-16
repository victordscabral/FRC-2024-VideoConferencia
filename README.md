# FRC-2024

# Integrantes

- Gabriel Marcolino - 190087501
- Shaíne Oliveira - 190134810
- Victor Cabral - 190038900


# Como rodar o projeto

- Clonar o repositório

~~~bash
git@github.com:ShaineOliveira/FRC-2024.git
~~~

- Instalar as dependências

~~~bash
npm install
~~~

- Rodar na raiz do projeto:
 ~~~bash
node app.js
~~~

Fizemos o deploy usando o site ngrok, mas a versão grátis só permite que o domínio seja carregado quando está rodando o projeto no terminal na porta 3000

Foi necessário criar uma conta no site, instalar o ngrok na máquina. Após a instalação, recebemos um token para configurar e depois só configurar o static domain

Comando para configurar token
 ~~~bash
ngrok config add-authtoken <TOKEN>
~~~

Comando para configurar domínio
 ~~~bash
ngrok http --domain=keen-quagga-trivially.ngrok-free.app 3000
~~~
E ao rodar no terminar esse último comando, no terminal vai mostrar a url para a aplicação ser acessada.

# Link de apresentação do projeto

- Vídeo de apresentação do projeto: https://www.youtube.com/watch?v=pfXgswrdlng
