# SISTEMA DE MONITORAMENTO METEOROLÓGICO
## Relatório Técnico de Desenvolvimento

**Autor:** [Seu Nome]  
**Data:** 10 de Maio de 2026

---

## Índice
1. [Introdução](#1-introdução)
2. [Desenvolvimento do Sistema](#2-desenvolvimento-do-sistema)
    - 2.1 [Arquitetura](#21-arquitetura)
    - 2.2 [Funcionalidades](#22-funcionalidades)
3. [Base de Dados](#3-base-de-dados)
4. [Conclusão](#4-conclusão)
5. [Bibliografia](#5-bibliografia)

---

## 1. Introdução
O presente relatório descreve o desenvolvimento de um **Sistema de Monitoramento Meteorológico (WeatherSystem)**. Este sistema foi concebido para fornecer informações meteorológicas em tempo real, permitindo a gestão de utilizadores e a exportação de dados históricos para análise.

O objetivo principal é oferecer uma plataforma robusta e intuitiva que integre tecnologias modernas de desenvolvimento web para garantir performance e escalabilidade.

---

## 2. Desenvolvimento do Sistema

### 2.1 Arquitetura
A arquitetura do sistema segue o modelo cliente-servidor, dividida em duas partes principais:

*   **Frontend**: Desenvolvido em **Angular**, utilizando uma estrutura modular para facilitar a manutenção e garantir uma interface reativa.
*   **Backend**: Implementado em **PHP Puro**, garantindo rapidez na execução de scripts de API e integração direta com o servidor web Apache.

> [!NOTE]  
> **[imagem aqui]** - Diagrama da Arquitetura do Sistema

### 2.2 Funcionalidades
O sistema oferece as seguintes funcionalidades críticas:

1.  **Autenticação Segura**: Sistema de login e registo com recuperação de senha via token.
2.  **Consulta em Tempo Real**: Integração com APIs externas (como OpenWeather) para obter dados climáticos precisos.
3.  **Gestão Administrativa**: Painel de controlo para gestão de utilizadores, logs de sistema e estatísticas de uso.
4.  **Exportação**: Geração de relatórios de histórico em formatos CSV e PDF.

> [!NOTE]  
> **[imagem aqui]** - Captura de Ecrã do Dashboard Principal

---

## 3. Base de Dados
A base de dados foi modelada de forma relacional utilizando **MySQL**. As tabelas principais incluem utilizadores (`users`), histórico de pesquisas (`history`) e favoritos (`favorites`).

A estrutura foi otimizada para garantir consultas rápidas mesmo com um volume elevado de registos históricos.

> [!NOTE]  
> **[imagem aqui]** - Modelo Entidade-Relacionamento (ER) da Base de Dados

---

## 4. Conclusão
O desenvolvimento do **WeatherSystem** permitiu consolidar conhecimentos em integração de APIs de terceiros, segurança em aplicações web e gestão de estado no frontend. O sistema cumpre todos os requisitos estabelecidos e demonstra ser uma ferramenta escalável para o monitoramento climático.

Para fases futuras, planeia-se a implementação de alertas via notificação push para condições meteorológicas extremas.

---

## 5. Bibliografia
*   **Documentação Oficial do Angular**: [https://angular.io/docs](https://angular.io/docs)
*   **Manual do PHP**: [https://www.php.net/manual/pt_BR/](https://www.php.net/manual/pt_BR/)
*   **API OpenWeather**: [https://openweathermap.org/api](https://openweathermap.org/api)
*   **Boas Práticas de Segurança (OWASP)**: [https://owasp.org/](https://owasp.org/)
