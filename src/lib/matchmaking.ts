export type BusinessStage = 'ideation' | 'validation' | 'bootstrapper' | 'scale' | 'high_performance';
export type Endgame = 'bootstrapper' | 'vc_backed';

export interface UserProfile {
  id: string;
  superpower: string;
  mrr: number;
  endgame: Endgame;
  timezone: string;
}

export interface MastermindGroup {
  id: string;
  tier: BusinessStage;
  members: UserProfile[];
}

export function getBusinessStage(mrr: number): BusinessStage {
  if (mrr === 0) return 'ideation';
  if (mrr <= 1000) return 'validation';
  if (mrr <= 10000) return 'bootstrapper';
  if (mrr <= 50000) return 'scale';
  return 'high_performance';
}

export function findPotentialMatch(user: UserProfile, pool: UserProfile[]): MastermindGroup | null {
  const userStage = getBusinessStage(user.mrr);
  
  // Filter pool by same stage and endgame philosophy
  const compatibleUsers = pool.filter(p => 
    getBusinessStage(p.mrr) === userStage && 
    p.endgame === user.endgame &&
    p.id !== user.id
  );

  if (compatibleUsers.length >= 3) {
    // Form a group of 4 (User + 3 from pool)
    return {
      id: `group_${Date.now()}`,
      tier: userStage,
      members: [user, ...compatibleUsers.slice(0, 3)]
    };
  }

  return null;
}
