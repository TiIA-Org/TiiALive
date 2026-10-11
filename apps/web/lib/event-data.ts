export type EventGoal = {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  status: string;
};

export type EventRanking = {
  id: string;
  name: string;
  amount: string;
  badge: string;
};

export type EventStat = {
  id: string;
  label: string;
  value: string;
  change: string;
};

export type EventVoteOption = {
  id: string;
  label: string;
  votes: number;
};

export type EventVote = {
  id: string;
  question: string;
  options: EventVoteOption[];
};

export type EventAdminData = {
  lastUpdated: string;
  title: string;
};

export type EventData = {
  goals: EventGoal[];
  rankings: EventRanking[];
  stats: EventStat[];
  votes: EventVote[];
  admin: EventAdminData;
};

export function getDefaultEventData(): EventData {
  return {
    goals: [
      {
        id: "donations-5k",
        title: "€5.000 em donativos",
        current: 4280,
        target: 5000,
        unit: "€",
        status: "Quase lá",
      },
      {
        id: "donations-10k",
        title: "€10.000 em donativos",
        current: 6320,
        target: 10000,
        unit: "€",
        status: "Em progresso",
      },
      {
        id: "followers-goal",
        title: "Followers",
        current: 32640,
        target: 50000,
        unit: "",
        status: "Meta ativa",
      },
      {
        id: "subs-goal",
        title: "Subs",
        current: 1820,
        target: 3000,
        unit: "",
        status: "Novos inscritos",
      },
      {
        id: "hours-goal",
        title: "Horas de stream",
        current: 48,
        target: 72,
        unit: "h",
        status: "Disponível",
      },
      {
        id: "gta-challenge",
        title: "Desafio GTA",
        current: 2,
        target: 3,
        unit: "",
        status: "Desbloqueio próximo",
      },
    ],
    rankings: [
      { id: "rank-1", name: "Rafael M.", amount: "€1.250", badge: "#1" },
      { id: "rank-2", name: "Ana V.", amount: "€980", badge: "#2" },
      { id: "rank-3", name: "Pedro C.", amount: "€760", badge: "#3" },
      { id: "rank-4", name: "Marta K.", amount: "€620", badge: "#4" },
    ],
    stats: [
      { id: "donations-total", label: "Donativos", value: "€12.430", change: "+18%" },
      { id: "followers-total", label: "Followers", value: "32.6K", change: "+9%" },
      { id: "subs-total", label: "Subs", value: "1.8K", change: "+12%" },
      { id: "viewers-total", label: "Viewers", value: "4.8K", change: "+21%" },
      { id: "hours-total", label: "Tempo de transmissão", value: "48h", change: "+6h" },
      { id: "challenge-total", label: "Desafios concluídos", value: "11/18", change: "+3" },
    ],
    votes: [
      {
        id: "community-vote",
        question: "Qual missão deve acontecer no próximo desafio?",
        options: [
          { id: "vote-1", label: "Parar no cassino", votes: 28 },
          { id: "vote-2", label: "Matar o alvo principal", votes: 38 },
          { id: "vote-3", label: "Explorar a cidade em modo arcade", votes: 20 },
          { id: "vote-4", label: "Completar desafio em equipa", votes: 14 },
        ],
      },
    ],
    admin: {
      lastUpdated: new Date().toISOString(),
      title: "TiiA Live Admin",
    },
  };
}
