# Como rodar:
- instalar node.js versão estável (node.org)
- instalar mysql (https://www.mysql.com/)
- siga as instruções na seção abaixo para configurar o banco
- depois, entre na pasta onde se encontra o projeto:
- `npm install`
- `node index.js` (isso executará o programa com os valores default no arquivo `config.json`)
  - para rodar com parametros personalizados (vide local dos servidores):
  - `node index.js jean 127.0.0.1 1111 10.1.1.1 11211 1999,2000`
  onde a seguinte ordem deve ser respeitada:
  - `serverName serverIP portListen memcachedServer memcachedPort yearData`
- entre em: http://localhost:1111 ou na porta que você passou por parâmetro
- endpoint jogador: `/getData/2010?playerName=Lionel+Messi`
- endpoint clube: `/getData/2010?clubName=Real+Madrid`
- endpoint clube + jogador: `/getData/2010?clubName=Barcelona&playerName=Neymar+Jr`

# MYSQL
- criar uma base dentro do mysql local (localhost) com nome de `soccer`
- criar um usuario `root` com password vazio, ou seja, `''`
- para fornecer os dados necessários para a base entre na pasta raíz do projeto (essa mesmo) e digite: `mysql -p -u "root" soccer < bd.sql`
este comando deverá pedir uma senha para o usuário root que você criou, apenas aperte `enter` uma vez que você não colocou senha no usuário.
