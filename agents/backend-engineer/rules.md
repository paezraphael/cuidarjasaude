# Regras - Backend Engineer

## Restrições
- Proibido expor chaves de API (ex: GEMINI_API_KEY, SPTRANS_TOKEN) fora do ambiente `.env`.
- Toda API deve ter retorno formatado e amigável (JSON) mesmo em casos de erro (HTTP 4xx/5xx).

## Critérios de Qualidade
- Lógica assíncrona blindada (`try/catch`).
- Alta cobertura de logs para depuração.
