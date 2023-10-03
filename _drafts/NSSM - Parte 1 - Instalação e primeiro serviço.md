---
layout: post
title: NSSM - Parte 1 - Instalação e primeiro serviço
---

# NSSM - Parte 1 - Instalação e primeiro serviço

## Introdução

Ao utilizar servidores, inevitavelmente você irá ter que lidar com serviços. Serviços são uma forma de executar um **_script_** ou aplicação em segundo plano (**_background_**). No universo de servidores Linux o **_systemd_** [1] é comumente usado para esse propósito. No Windows Server, as coisas são um pouco mais complicadas. O sistema Windows traz consigo uma aplicação chamada **_sc.exe_** ou **_sc_**.

> O SDK do Windows contém uma ferramenta de linha de comando, Sc.exe, que pode ser utilizada para controlar um serviço. Seus comandos correspondem à funções providas pelo SCM.
>
> -- <cite>Microsoft documentation</cite> [2]

O **_sc_** permite criar serviços a partir de arquivos **_.exe_** integrando-se bem ao sistema. As vantagens de utilizar o **_sc_** incluem sua natureza nativa, forte integração com o sistema e uma boa documentação. Entretanto, existe uma limitação: o arquivo precisa ser **_.exe_** para ser executado pelo serviço. Para contornar essa limitação, teríamos que criar um **_wrapper_** ou encapsulador utilizando **_C#_**, por exemplo. Este encapsulador, que deve ser registrado como serviço, é um arquivo **_.exe_** que executa o **_script_** desejado. Esse formato de criação de serviços pode não ser muito prático, principalmente para usuários mais acostumados com Linux.

Em contrapartida, graças ao **_systemd_**, executar um script como serviço em um ambiente Linux é mais simples para usuários com experiência no sistema. Para facilitar a vida de alguns sysadmins (como eu), existem ferramentas que permitem que a criação de serviços no Windows Server seja próxima ao que existe no Linux. Uma dessas ferramentas é o **_NSSM_** (Non-Sucking Service Manager).

## Instalação

A instalação pode ser realizada atravês de duas formas:

- Chocolatey

- Download Direto do Site.

### Instalação via Chocolatey (Recomendado)

**_Chocolatey_** é um gerenciador de pacotes. Um gerenciador de pacotes é um conjunto de ferramentas que permitem a automatização da instalação de aplicações. Com um gerenciador de pacotes as aplicações são instaladas através de um terminal, como o **_powershell_** por exemplo.

Para instalar o **_NSSM_** através do **_Chocolatey_** é necessário instalá-lo. Isso pode ser realizado executando o comando abaixo no powershell que deve ser aberto com permissões de administrador [4].

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

Após realizar a instalação feche o powershell, abra novamente e execute o comando para instalar o **_NSSM_**:

```powershell
choco install nssm
```

Será perguntado se tem certeza que quer instalar. Digite **_y_** e pressione **_enter_**.

### Instalação via Download Direto do Site

Para realizar a instalação pelo download é necessário acessar o [site](https://nssm.cc/download) do nssm. O link está presente na seção **_Latest release_**. O download será um arquivo **_.zip_**. Extraia esse arquivo utilizando qualquer aplicação de descompactação de sua preferência, como WinRAR ou 7-Zip. Navegue até a pasta **_win64_** dentro da pasta que foi descompactada. O **_nssm_** deve ser executado via terminal, portanto, copie o caminho da pasta **_win64_** do explorer, abra uma nova janela do powershell e digite o seguinte comando alterando o [caminho_copiado] para o caominho que você copiou do explorer:

```powershell
cd [caminho_copiado]
```

No meu caso ficou:

```powershell
cd  C:\Users\thiagobaldino\Downloads\nssm-2.24\nssm-2.24\win64
```

Com isso o **_NSSM_** está, teoricamente, instalado. Porém, sempre que você quiser executa-lo, terá que navegar manualmente até a pasta descompactada. Para poder executar o comando sem precisar navegar até a pasta deve-se adiciona-la ao [**_PATH_**](<https://en.wikipedia.org/wiki/PATH_(variable)>) . **_PATH_** é uma variável que o sistema usa para buscar os binários de programas para executar. Ele possui diversos caminhos e, quando você executa algum comando no terminal, o sistema busca por algum binário para esse comando nos caminhos registrados no **_PATH_** [5]. Adicionar uma pasta ao **_PATH_** pode ser feito dessa maneira: [Como adicionar uma pasta ao **_PATH_**](https://www.architectryan.com/2018/03/17/add-to-the-path-on-windows-10/) [6].

## Criação de um novo serviço

A utilização, para a criação de um novo serviço, do **_NSSM_** pode ser através de uma interface gráfica ou através de comandos no terminal. Ambas serão demonstradas mais a frente. Porém, para iniciar a interface gráfica é necessária a execução do comando no terminal.

![nssm_gui.png](/Volumes/macExternal/Documents/blog/assets/images/posts/2023-09-21-criando_servicos_com_nssm/nssm_gui.png)

_Interface gráfica_

Pela imagem acima, pode-se observar que eu precisei executar o seguinte comando no powershell para que a interface gráfica fosse aberta.

```powershell
nssm install
```

O _**NSSM**_ permite a criação somente através dos comandos no terminal.

### Preparações

Nós iremos realizar a instalação de um serviço que executa um simples servidor web excrito utilizando **_NodeJS_**. Para que o script possa executado, é necessário a instalação do NodeJS. Caso você ainda não tenha, ele pode ser instalado utilizando o chocolatey através do comando [7]:

```powershell
choco install nodejs.install
```

Copie o código abaixo e salve em um arquivo com o nome de **_index.js_** [8].

```javascript
const http = require("http");

const host = "localhost";
const port = 8000;

const requestListener = function (req, res) {
  res.writeHead(200);
  res.end("My first server!");
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
```

### Instalação de um serviço utilizando somente o terminal

Essa forma de criação é recomendada quando uma interface gráfica não está disponível. Um exemplo é a criação de um serviço utilizando **_SSH_** ou acesso remoto somente via terminal.

Para criar um serviço utilizando somente o terminal é necessário executar um comando no seguinte formato.

```powershell
nssm install <servicename> <program> [<arguments>]
```

- servicename: É o nome que o serviço terá. Esse nome será utilizado para parar, iniciar dentre outras ações. É o identificador do serviço.

- program: É o programa que será executado. Alguns exemplos são python, node.

- arguments: Parâmetros que serão passados para o programa a ser executado. Pode-se passar o caminho de um **_script_** para um programa **_python_** por exemplo.

Para criar o serviço do servidor web simples escrito em **_NodeJS_** é necessário executar o comando trocando o valor de [caminho_para_index.js] para o caminho do seu arquivo index.js:

```powershell
nssm install "exemplo_web_server" "node" "[caminho_para_index.js]"
```

No meu caso ficou:

```powershell
nssm install "exemplo_web_server" "node" "C:\Users\thiagobaldino\Documents\index.js"
```

Esse comando irá criar um serviço com o nome **"exemplo_web_server"**. Porém, o serviço ainda não foi inicializado. Na seção de testes será demonstrado como inicializar o serviço.

### Instalação de um serviço utilizando interface gráfica

Para instalar um serviço utilizando a interface gráfica deve-se, primeiramente, abrir o powershell executar o seguinte comando.

```powershell
nssm install
```

Uma janela como mostrada na imagem abaixo irá aparecer. Os seguinter campos devem ser preenchidos:

- Path: Caminho para a aplicação que será executada. Caso o executável esteja presente na variável **_PATH_** é possível somente escrever o nome da aplicação como **_node_**.

- Startup directory: Caminho em que o executavel irá ser executado.

- Arguments: Os argumentos que serão passados ao executar a aplicação definida no campo _path_.

- Service name: Nome de identificação do serviço que deve ser único entre todos os serviços.

![install_gui.png](/Volumes/macExternal/Documents/blog/assets/images/posts/2023-09-21-criando_servicos_com_nssm/install_gui.png)

Para criar o serviço para o servidor web acima deve-se colocar o valor "**_node_**" no campo **_path_**, o valor do caminho para o arquivo index.js no campo **_arguments_**. O campo startup directory pode ser deixado em branco.

No meu caso, os campos ficaram com os seguintes valores:

- Path: node

- Startup directory:

- Arguments: C:\Users\thiagobaldino\Documents\index.js

- Service name: exemplo_web_server

> :warning: Caso o **_NodeJS_** não esteja presente na variável **_PATH_**, você terá que indicar o caminho completo no campo "_Path_" para o binário do **_NodeJS_** ou a pasta que ele está presente no campo Startup directory.

Em seguida, para instalar, aperte no botão "**install service**". Porém, o serviço ainda não foi inicializado. Na seção de testes será demonstrado como inicializar o serviço.

## Testando

Para iniciar deve-se executar o seguinte comando:

```powershell
nssm start "exemplo_web_server"
```

O comando acima irá iniciar o serviço. Para conferir se o serviço está sendo executado pode-se abrir um navegador de internet e acessar o endereço **http://localhost:8000**.

![api_response.png](/Volumes/macExternal/Documents/blog/assets/images/posts/2023-09-21-criando_servicos_com_nssm/api_response.png)

O serviço também estará presente nas configurações de serviços do windows que pode ser acessada buscando "**_services_**" na busca de aplicativos do sistema.

![services.png](/Volumes/macExternal/Documents/blog/assets/images/posts/2023-09-21-criando_servicos_com_nssm/services.png)

### Bibliografia

1 - [systemd (Português) - ArchWiki](<https://wiki.archlinux.org/title/Systemd_(Portugu%C3%AAs)>)
2 - [sc - documentation]([Controlling a Service Using SC - Win32 apps | Microsoft Learn](https://learn.microsoft.com/en-us/windows/win32/services/controlling-a-service-using-sc))

3 - [nssm - site](https://nssm.cc/)

4 - [Chocolatey Software | Installing Chocolatey](https://chocolatey.org/install#individual)

5 - [PATH (variable) - Wikipedia](<https://en.wikipedia.org/wiki/PATH_(variable)>)

6 - [Como adcionar uma pasta ao PATH](https://www.architectryan.com/2018/03/17/add-to-the-path-on-windows-10/)

7 - [choco nodejs.install](https://community.chocolatey.org/packages/nodejs.install)

8 - [How To Create a Web Server in Node.js with the HTTP Module | DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-create-a-web-server-in-node-js-with-the-http-module)

9 - [NSSM - commands](https://nssm.cc/commands)
