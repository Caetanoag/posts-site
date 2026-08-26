# Sistema de postagens com Express, Docker, PostgreSQL, Redis e Nginx
Decidi programar esse sistema pra praticar um pouco de arquitetura de software e as tecnologias básicas da minha stack. Vou implementar ainda um sistema de login com JWT e suporte a imagens nos postes, porém não acho que eu vá avançar muito mais nesse projeto.
### Pré-requisitos de sistema:
- Yarn: Responsável por iniciar o servidor
- Docker: Responsável por criar o ambiente com postgres, redis e frontend
- Node: Reponsável por rodar o Typescript
### Como rodar:
Execute os comandos nessa ordem, na raiz:
```bash
#Subindo os containers
docker-compose up -d
# Se quiser logs do servidor
docker-compose logs app -f
```
O frontend vai estar disponivel na porta que for colocado no .env, pode usar o .env.example mesmo, ele já vem pronto pra rodar. O padrão é 3000 para frontend, 6767 pra backend.
### Endpoints da API
- GET posts/
  - Retorna todos os posts
- POST posts/
  - Cria um novo post, recebendo um json
- GET posts/id
  - Retorna as informações do post desse id
- POST posts/id/like
  - Adiciona um like no post