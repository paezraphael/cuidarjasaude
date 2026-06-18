# Regras - DevOps Engineer

## Restrições
- Proibido commitar segredos e variáveis sensíveis.
- Nenhuma falha de build pode ser ignorada no CI/CD; a branch main deve estar sempre verde.

## Critérios de Qualidade
- Tempo de setup local para um novo dev não deve ultrapassar 1 comando (`docker-compose up`).
- Pipelines de deploy devem ser totalmente automatizadas.
