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
    goals: [],
    rankings: [],
    stats: [],
    votes: [],
    admin: {
      lastUpdated: "",
      title: "TiiA Live Admin",
    },
  };
}
