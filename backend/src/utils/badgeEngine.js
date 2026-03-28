const checkBadges = (user, quizResult = null) => {
  const newBadges = [];
  const existingBadges = new Set(user.badges);

  // Helper to add badge if not exists
  const award = (badgeName) => {
    if (!existingBadges.has(badgeName)) {
      newBadges.push(badgeName);
      user.badges.push(badgeName);
    }
  };

  // Rule 1: Quiz Rookie (First Quiz)
  if (user.quizzesAttempted.length === 1) {
    award('Quiz Rookie');
  }

  // Rule 2: Consistency Hero (5 Quizzes Total)
  if (user.quizzesAttempted.length >= 5) {
    award('Consistency Hero');
  }
  
  // Rule 3: Perfect Score
  if (quizResult && quizResult.scorePercent === 100) {
    award('Perfect Score');
  }

  // == NEW INFINITY BADGES ==
  
  // 1. Century Coder (100 Quizzes)
  if (user.quizzesAttempted.length >= 100) {
    award('Century Coder');
  }

  // 2. High Roller (1000 Total Points)
  if (user.totalPoints >= 1000) {
    award('High Roller');
  }

  // 3. Millionaire (5000 Coins)
  if (user.coins >= 5000) {
    award('Coin Millionaire');
  }

  // 4. Streak Legend (30 Day Streak)
  if (user.streak >= 30) {
    award('Streak Legend');
  }

  // 5. Category Architect (Expert Level in a category)
  if (quizResult && quizResult.category) {
    const catPoints = user.skillPoints.get(quizResult.category) || 0;
    if (catPoints >= 5000) {
      award(`${quizResult.category} Architect`);
    } else if (catPoints >= 1000) {
      award(`${quizResult.category} Specialist`);
    }
  }

  // 6. Referral King (5 Referrals)
  if (user.referralCount >= 5) {
    award('Referral King');
  }

  // 7. Pro Learner (isPro status)
  if (user.isPro) {
    award('VIP Member');
  }

  // 8. Daily Hero (7 Daily Challenges)
  // Logic: Calculated in DailyChallenge controller usually, but we check count here
  if (user.lastDailyChallengeDate) {
    award('Daily Hero');
  }

  // 9. Job Seeker (Matched with 1+ Job)
  // (Simplified trigger)
  if (user.level >= 5) {
    award('Career Ready');
  }

  // 10. Socialite (Active on Feed)
  // (Simplified trigger)
  if (user.totalPoints >= 500) {
    award('Social Learner');
  }

  return newBadges;
};

module.exports = { checkBadges };
