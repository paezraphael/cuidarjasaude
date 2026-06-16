/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GitHubIssue, Epic, ArchModule, IntegrationAPI, MVPDay, HealthUnit, TransitLine } from './types';

// EPICS Database
export const EPICS: Epic[] = [
  {
    id: 'epic-1',
    title: 'Acessibilidade & Onboarding Simplificado',
    description: 'Interface adaptada para idosos com baixa visibilidade, tremores nas mãos ou pouca experiência digital.',
    progress: 75
  },
  {
    id: 'epic-2',
    title: 'Localizador de Unidades de Saúde Próximas',
    description: 'Integração de mapa para identificação de Hospitais, UBS e UPAs ordenados por distância e acessibilidade.',
    progress: 50
  },
  {
    id: 'epic-3',
    title: 'Monitoramento & Transporte Público Adaptado',
    description: 'Visualização de linhas de ônibus acessíveis em tempo real e solicitação/agendamento de transporte acessível municipal.',
    progress: 25
  }
];

// GITHUB ISSUES Database (Epic + User Story + Technical Tasks merged)
export const GITHUB_ISSUES_BACKLOG: GitHubIssue[] = [
  // EPIC 1: Onboarding & Interface
  {
    id: 'issue-1',
    number: 101,
    title: 'Epic: Interface Ultra-Acessível para Idosos',
    description: 'Criar padrões de design para idosos com botões amplos, fontes redimensionáveis, layouts de alto contraste e guias visuais simplificados.',
    epic: 'epic-1',
    status: 'in-progress',
    priority: 'high',
    labels: ['UX', 'accessibility', 'MVP'],
    estimatedDays: 2
  },
  {
    id: 'issue-2',
    number: 102,
    title: 'User Story: Onboarding Seguro por Telefone ou Biometria',
    description: 'Como idoso, quero realizar meu primeiro cadastro no aplicativo apenas inserindo meu número de celular ou usando biometria simples, sem precisar lembrar de senhas complexas.',
    epic: 'epic-1',
    status: 'review',
    priority: 'high',
    labels: ['frontend', 'backend', 'accessibility', 'MVP'],
    estimatedDays: 2
  },
  {
    id: 'issue-3',
    number: 103,
    title: 'User Story: Atalho "Onde Dói" para busca intuitiva',
    description: 'Como um idoso que se sente mal, quero poder clicar em um botão visual indicando onde sinto dores para que o app recomende imediatamente o local de atendimento correto mais próximo.',
    epic: 'epic-1',
    status: 'backlog',
    priority: 'high',
    labels: ['frontend', 'UX', 'MVP'],
    estimatedDays: 1
  },
  {
    id: 'issue-4',
    number: 104,
    title: 'Task: Implementar Multiplicador de Fontes Dinâmico',
    description: 'Adicionar funcionalidade nas Configurações e Cabeçalho permitindo aumentar e diminuir o tamanho dos textos de forma global na aplicação.',
    epic: 'epic-1',
    status: 'done',
    priority: 'medium',
    labels: ['frontend', 'accessibility', 'MVP'],
    estimatedDays: 0.5
  },

  // EPIC 2: Hospitais Próximos
  {
    id: 'issue-5',
    number: 201,
    title: 'Epic: Busca de Unidades de Saúde Próximas',
    description: 'Apresentar no mapa e em lista as unidades de atendimento de saúde (públicas e privadas) com informações de infraestrutura de acessibilidade e tempo de espera.',
    epic: 'epic-2',
    status: 'in-progress',
    priority: 'high',
    labels: ['frontend', 'backend', 'MVP'],
    estimatedDays: 3
  },
  {
    id: 'issue-6',
    number: 202,
    title: 'User Story: Como usuário quero ver hospitais próximos',
    description: 'Como idoso, quero abrir a tela principal e visualizar instantaneamente uma lista clara de unidades de saúde ao meu redor com filtros fáceis de usar.',
    epic: 'epic-2',
    status: 'review',
    priority: 'high',
    labels: ['frontend', 'UX', 'MVP'],
    estimatedDays: 1.5
  },
  {
    id: 'issue-7',
    number: 203,
    title: 'User Story: Como usuário quero ver rota acessível até o local',
    description: 'Como cadeirante ou idoso com bengala, quero ver no mapa um trajeto recomendado livre de obstáculos (calçadas danificadas, escadarias sem rampa).',
    epic: 'epic-2',
    status: 'backlog',
    priority: 'medium',
    labels: ['frontend', 'accessibility', 'UX'],
    estimatedDays: 2
  },
  {
    id: 'issue-8',
    number: 204,
    title: 'Task: Desenvolver API de Busca Geográfica no Firebase',
    description: 'Criar uma query com geohashes (usando geofirestore) para retornar pontos de saúde mais próximos de um raio de 5km de lat/lng fornecidos.',
    epic: 'epic-2',
    status: 'done',
    priority: 'high',
    labels: ['backend', 'MVP'],
    estimatedDays: 1
  },

  // EPIC 3: Transporte Público e Adaptado
  {
    id: 'issue-9',
    number: 301,
    title: 'Epic: Mobilidade Urbana & Transporte Adaptado',
    description: 'Gerenciamento e consumo de transporte integrando ônibus acessíveis e o agendamento de frotas municipais adaptadas.',
    epic: 'epic-3',
    status: 'backlog',
    priority: 'high',
    labels: ['backend', 'frontend', 'MVP'],
    estimatedDays: 4
  },
  {
    id: 'issue-10',
    number: 302,
    title: 'User Story: Solicitar/Agendar Transporte Adaptado Gratuitamente',
    description: 'Como idoso com mobilidade reduzida severa, quero preencher um formulário simples para agendar um carro oficial adaptado (como Serviço ATENDE) para me levar a consultas médicas recurrentes.',
    epic: 'epic-3',
    status: 'in-progress',
    priority: 'high',
    labels: ['frontend', 'backend', 'UX', 'MVP'],
    estimatedDays: 2
  },
  {
    id: 'issue-11',
    number: 303,
    title: 'User Story: Como admin quero gerenciar pontos de transporte e frotas',
    description: 'Como operador administrativo da prefeitura, quero visualizar os pedidos de transporte pendentes, aprovar agendamentos e atribuir motoristas disponíveis.',
    epic: 'epic-3',
    status: 'backlog',
    priority: 'medium',
    labels: ['backend', 'frontend', 'enhancement'],
    estimatedDays: 2.5
  },
  {
    id: 'issue-12',
    number: 304,
    title: 'Bug: Tratar timeout na requisição de barramentos acessíveis de SPTrans/EMTU',
    description: 'Corrreção de erro de conexão quando a API municipal demora mais de 5 segundos para retornar coordenadas do barramento acessível.',
    epic: 'epic-3',
    status: 'done',
    priority: 'high',
    labels: ['backend', 'bug'],
    estimatedDays: 0.5
  }
];

// ARCHITECTURE DETAILS
export const ARCH_MODULES: ArchModule[] = [
  {
    id: 'arch-1',
    name: 'Módulo de Usuários e Acessibilidade (Auth & Profile)',
    icon: 'UserCheck',
    description: 'Responsável pelo cadastro sem senha (SMS/OTP) e salvamento de configurações de acessibilidade individuais (ajustes de contraste, tamanho de fontes e feedbacks sonoros).',
    subsystems: ['Firebase Auth (Recapcha & SMS OTP)', 'Firestore Users Collection', 'Configurações de UX persistidas localmente e em nuvem'],
    scalability: 'Escalabilidade automática através do Firebase Auth e cache local com IndexedDB.'
  },
  {
    id: 'arch-2',
    name: 'Módulo de Saúde (Health Locator Engine)',
    icon: 'HeartPulse',
    description: 'Gerencia as coordenadas de unidades de atendimento médico (SUS e farmácias conveniadas), calcula rotas acessíveis e consulta tempos de triagem.',
    subsystems: ['API Google Places para clínicas', 'Firestore Geospatial Collections (Geohash)', 'Engine de roteamento de calçadas amigáveis para idosos'],
    scalability: 'Uso de Redis no backend (ou cache de borda Cloudflare) para rotas estáticas e pontos de saúde públicos estáticos.'
  },
  {
    id: 'arch-3',
    name: 'Módulo de Mobilidade (Transit Tracker)',
    icon: 'Bus',
    description: 'Integra dados de geolocalização do transporte municipal em tempo real. Identifica barramentos com rampas pneumáticas e vagas de cadeira de rodas disponíveis.',
    subsystems: ['Consumo de GTFS-RT (General Transit Feed Specification)', 'API Olho Vivo / SPTrans (ou equivalente municipal)', 'Microserviço de Websockets / Firebase Realtime'],
    scalability: 'Conexões web-sockets ou assinaturas PubSub para atualizar posições de ônibus sem sobrecarregar o banco principal.'
  },
  {
    id: 'arch-4',
    name: 'Módulo de Agendamento Adaptado (Specialized Ride Booking)',
    icon: 'Wheelchair',
    description: 'Sistema administrativo e mobile para solicitar compartilhamento de vans adaptadas municipais (estilo ATENDE), gerenciar filas de prioridade e escala de motoristas.',
    subsystems: ['Distribuição heurística de rotas de motoristas', 'Cadastro de laudos de deficiência das agências de saúde', 'Fila de eventos de solicitação via mensageria'],
    scalability: 'Arquitetura baseada em eventos (Pub/Sub) para despachar corridas e processamento de caminhos eficientes offline.'
  }
];

// LIST OF COMPATIBLE REAL APIS IN BRAZIL
export const APIS_BRAZIL: IntegrationAPI[] = [
  {
    name: 'Google Maps & Places API',
    provider: 'Google Cloud Platform',
    purpose: 'Geomapeamento de alta precisão, busca textual de UBSs e traçado visual das rotas aéreas e viárias.',
    type: 'paid',
    details: 'Necessita faturamento. Possui cota gratuita de $200 mensais concedida pelo Google, ideal para lançar o MVP.'
  },
  {
    name: 'API Olho Vivo SPTrans (São Paulo)',
    provider: 'Prefeitura de São Paulo / SPTrans',
    purpose: 'Acesso às linhas de ônibus paulistanas, posição GPS de veículos em tempo real e indicativo se o veículo é acessível (adaptado para cadeirantes).',
    type: 'free',
    details: 'Pública e gratuita com cadastro prévio para obtenção de Token desenvolvedor SPTrans Olho Vivo.'
  },
  {
    name: 'DATASUS / CNES Georreferenciado',
    provider: 'Ministério da Saúde - Brasil',
    purpose: 'Cadastro Nacional de Estabelecimentos de Saúde. Download de planilhas e APIs para importar localização exata de todas as UBSs, UPAs e Hospitais do Brasil de forma definitiva.',
    type: 'free',
    details: 'Disponível publicamente via portal OpenDataSUS. Permite carga massiva inicial diretamente no banco Firestore.'
  },
  {
    name: 'OpenRouteService / OpenStreetMap (Acessibilidade)',
    provider: 'Projetos OpenSource de GIS',
    purpose: 'Definição de caminhos para cadeirantes baseados nos dados coletados de calçadas, lombadas e travessias amigáveis.',
    type: 'free',
    details: 'Totalmente gratuito. Pode rodar local de forma independente ou usando o servidor público com limites de requisição.'
  }
];

// MVP 7 DAYS ROADMAP PLAN
export const MVP_ROADMAP_7_DAYS: MVPDay[] = [
  {
    day: 1,
    title: 'Modelagem de Dados & Firebase Bootstrap',
    objectives: [
      'Configuração do projeto Firebase (Firestore, Auth/SMS e Hosting)',
      'Construção do esquema JSON e regras de escrita do Firestore',
      'Definição das coleções de unidades de saúde e usuários'
    ],
    tasks: [
      { title: 'Subir banco Firestore com regras iniciais de acesso', type: 'infra', mandatory: true },
      { title: 'Definir interfaces TypeScript e inicializador Firebase no app', type: 'backend', mandatory: true },
      { title: 'Desenhar wireframe interativo de tela única de cadastro rápido', type: 'ux', mandatory: false }
    ],
    validationMethod: 'Testar escrita e leitura inicial no painel do Firestore e validar autenticação simulada por SMS.'
  },
  {
    day: 2,
    title: 'Cadastro Direto por Telefone (Onboarding Sem Senha)',
    objectives: [
      'Garantir fluxo simples em que o idoso digita apenas o número e recebe código via SMS',
      'Criação automática do perfil com nível básico de acessibilidade preferencial'
    ],
    tasks: [
      { title: 'Implementar Firebase Auth OTP SMS ou Mock para testes locais rápidos', type: 'backend', mandatory: true },
      { title: 'Criar visual de Onboarding com botões gigantes e contrastantes', type: 'frontend', mandatory: true },
      { title: 'Implementar assistente falado em texto guiado para instruir o idoso', type: 'frontend', mandatory: false }
    ],
    validationMethod: 'Completar o ciclo de login em menos de 15 segundos usando dispositivo móvel via simulador de rede lenta.'
  },
  {
    day: 3,
    title: 'Mapa Acessível e Geolocalização Inicial',
    objectives: [
      'Capturar geolocalização do idoso de forma segura',
      'Carregar mapa simplificado sem excesso de dados visuais poluindo a tela'
    ],
    tasks: [
      { title: 'Requisição de permissão de geolocalização nativa do navegador', type: 'frontend', mandatory: true },
      { title: 'Renderizar mapa usando API OpenStreetMap / Leaflet ou Google Maps simplificado', type: 'frontend', mandatory: true },
      { title: 'Personalizar marcadores do mapa com ícones de alta visibilidade e alto contraste', type: 'frontend', mandatory: true }
    ],
    validationMethod: 'Mapa centralizado na localização real do usuário exibindo um ícone grande e pulsante de "Você está aqui".'
  },
  {
    day: 4,
    title: 'Localizador Intuitivo de Saúde ("Onde Dói")',
    objectives: [
      'Listar hospitais e UBSs próximas ordenando por acessibilidade física e distância',
      'Criação do teclado visual interativo gigante "Onde Dói?" para idosos não alfabetizados tecnologicamente'
    ],
    tasks: [
      { title: 'Montar banco de dados georreferenciado das UBSs locais (Seed no Firestore)', type: 'backend', mandatory: true },
      { title: 'Implementar query por geohash ou raio linear', type: 'backend', mandatory: true },
      { title: 'Desenvolver modal de feedback do "Teclado Onde Dói?" indicando sintomas', type: 'frontend', mandatory: true }
    ],
    validationMethod: 'Usuário clica em "Cabeça" ou "Gripe" e o app filtra automaticamente no mapa as UPAs e UBSs com melhor tempo de atendimento.'
  },
  {
    day: 5,
    title: 'Rotas de Navegação Super-Visuais e Guiadas',
    objectives: [
      'Fornecer navegação passo a passo com setas massivas e modo texto falado gigante',
      'Substituir mapas complexos tridimensionais por comandos diretos intuitivos'
    ],
    tasks: [
      { title: 'Traduzir direções de rota da API de direções em comandos textuais simplificados ("Siga em frente por 2 quadras")', type: 'backend', mandatory: true },
      { title: 'Criar interface de navegação com setas de alto contraste', type: 'frontend', mandatory: true },
      { title: 'Implementar modo visual noturno automático ultra forte', type: 'frontend', mandatory: false }
    ],
    validationMethod: 'Passar no teste de usabilidade mobile de rota com óculos simuladores de catarata e reflexos do sol.'
  },
  {
    day: 6,
    title: 'Monitoramento de Ônibus Acessível & Agendamento de Van',
    objectives: [
      'Prever barramentos munidos de rampa pneumática próximos',
      'Formulário com 3 cliques para solicitar o agendamento do transporte adaptado social da prefeitura'
    ],
    tasks: [
      { title: 'Exibir pontos de ônibus no mapa com marcador indicando se há acessibilidade', type: 'frontend', mandatory: true },
      { title: 'Criar tela de solicitação rápida do transporte adaptado social com comprovante digital', type: 'frontend', mandatory: true },
      { title: 'Armazenar solicitações na coleção Firestore de viagens em tempo real', type: 'backend', mandatory: true }
    ],
    validationMethod: 'Usuário abre o app, seleciona "Solicitar Van Adaptada", escolhe "Consulta Médica" e o comprovante com QR Code é impresso em tela com sucesso.'
  },
  {
    day: 7,
    title: 'Testes com Usuários Reais, Ajustes de Margens e Rollout',
    objectives: [
      'Remoção de bugs críticos de timeout',
      'Validação final de acessibilidade WCAG 2.1 (AA) de contraste e feedback sonoro',
      'Congelamento do MVP pronto para demonstração aos investidores/município'
    ],
    tasks: [
      { title: 'Fazer pente-fino de cores usando linter de acessibilidade visual', type: 'ux', mandatory: true },
      { title: 'Corrigir desalinhamentos de toques em telas menores ou tablets antigos', type: 'frontend', mandatory: true },
      { title: 'Ajustar limites de requisição e caching para evitar estourar cota gratuita do Firebase', type: 'infra', mandatory: true }
    ],
    validationMethod: 'Lançamento do simulador mobile em ambiente de demonstração com aprovação de 100% dos testes sem falhas de travamento.'
  }
];

// MOCK DATA FOR ACCESSIBILITY SIMULATOR HEALTH UNITS
export const SIM_HEALTH_UNITS: HealthUnit[] = [
  {
    id: 'unit-1',
    name: 'Hospital Geral de Pinheiros',
    type: 'Hospital SUS',
    distance: '850 metros',
    waitingTime: '15-20 min (Baixo)',
    accessibleEntrance: true,
    elevators: true,
    adaptedToilets: true,
    address: 'Av. Brigadeiro Faria Lima, 1200 - São Paulo',
    lat: -23.5684,
    lng: -46.6912,
    phone: '(11) 3214-5555'
  },
  {
    id: 'unit-2',
    name: 'UBS Jardim das Flores - Dr. Nelson',
    type: 'UBS',
    distance: '340 metros (Mais próxima)',
    waitingTime: '30-45 min (Médio)',
    accessibleEntrance: true,
    elevators: false, // Térreo
    adaptedToilets: true,
    address: 'Rua das Camélias, 88 - São Paulo',
    lat: -23.5670,
    lng: -46.6885,
    phone: '(11) 3241-1199'
  },
  {
    id: 'unit-3',
    name: 'UPA Vila Madalena Centro-Oeste',
    type: 'UPA',
    distance: '1.8 km',
    waitingTime: '55 min (Alto)',
    accessibleEntrance: true,
    elevators: true,
    adaptedToilets: true,
    address: 'Rua Harmonia, 540 - São Paulo',
    lat: -23.5555,
    lng: -46.6890,
    phone: '(11) 3810-7700'
  },
  {
    id: 'unit-4',
    name: 'Farmácia Popular Conveniada - Redemed',
    type: 'Farmácia Popular',
    distance: '150 metros (Muito perto)',
    waitingTime: '2 min (Rápido)',
    accessibleEntrance: false, // Escadão na frente
    elevators: false,
    adaptedToilets: false,
    address: 'Av. Rebouças, 2200 - São Paulo',
    lat: -23.5658,
    lng: -46.6850,
    phone: '(11) 3088-2233'
  }
];

// MOCK DATA FOR TRANSIT LINES
export const SIM_TRANSIT_LINES: TransitLine[] = [
  {
    id: 'line-1',
    code: '702U-10',
    name: 'Term. Bandeira - Cidade Universitária',
    etaMinutes: 4,
    accessibleRamp: true,
    wheelchairSpaces: 2,
    sensoryGuided: true
  },
  {
    id: 'line-2',
    code: '8700-10',
    name: 'Term. Campo Limpo - Pça. Ramos de Azevedo',
    etaMinutes: 11,
    accessibleRamp: true,
    wheelchairSpaces: 1,
    sensoryGuided: false
  },
  {
    id: 'line-3',
    code: '577T-10',
    name: 'Vila Madalena - Metrô Ana Rosa',
    etaMinutes: 18,
    accessibleRamp: false, // Ônibus antigo sem elevador!
    wheelchairSpaces: 0,
    sensoryGuided: false
  }
];
