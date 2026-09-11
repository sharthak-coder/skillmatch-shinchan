/**
 * ==============================================================================
 * SKILL-MATCH ALGORITHM
 * Pure function computing complementary fit between a student and a project.
 * ==============================================================================
 * 
 * MATHEMATICAL FORMULATION:
 * Let U be the set of normalized user skills, and P be the set of required project skills.
 * Let I be the user's interests, and C be the project category.
 * 
 * 1. Intersection:
 *    M = U ∩ P (set of skills the user possesses that the project requires)
 * 
 * 2. Primary Coverage Ratio (Weight: 80% / 0.80):
 *    Coverage = |M| / |P|
 *    Measures how much of the project's actual requirements the student satisfies.
 *    If |P| == 0, Coverage = 1.0 (no requirements means 100% accessible).
 * 
 * 3. Jaccard Overlap Index (Weight: 15% / 0.15):
 *    Jaccard = |M| / |U ∪ P|
 *    Penalizes unrelated excess skills slightly to favor candidates whose focus aligns
 *    closely with the project scope.
 * 
 * 4. Interest & Category Affinity Bonus (Weight: 5% / 0.05):
 *    Affinity = 1.0 if any user interest matches or is contained in the project category,
 *    else 0.0.
 * 
 * 5. Composite Score:
 *    RawScore = (0.80 * Coverage) + (0.15 * Jaccard) + (0.05 * Affinity)
 *    MatchPercentage = round(RawScore * 100)
 *    Clamped strictly to [0, 100].
 * 
 * Edge Cases:
 * - If user has no skills: MatchPercentage = 0%
 * - If project has no required skills: MatchPercentage = 100%
 * - If user satisfies all required skills with affinity: MatchPercentage = 100% (snap lock-in!)
 */

import { SkillMatchResult } from '@/lib/types';

export function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase();
}

export function computeDetailedMatch(
  userSkills: string[] = [],
  projectSkills: string[] = [],
  userInterests: string[] = [],
  projectCategory: string = ''
): SkillMatchResult {
  // Normalize all tags for case/spacing consistency
  const normUserSkills = Array.from(new Set(userSkills.map(normalizeTag).filter(Boolean)));
  const normProjectSkills = Array.from(new Set(projectSkills.map(normalizeTag).filter(Boolean)));
  const normInterests = Array.from(new Set(userInterests.map(normalizeTag).filter(Boolean)));
  const normCategory = normalizeTag(projectCategory);

  // If project requires no specific skills, it's open to anyone
  if (normProjectSkills.length === 0) {
    return {
      percentage: 100,
      matchingSkills: [],
      missingSkills: [],
      interestBonus: false,
    };
  }

  // If user has zero skills, match is 0%
  if (normUserSkills.length === 0) {
    return {
      percentage: 0,
      matchingSkills: [],
      missingSkills: normProjectSkills,
      interestBonus: false,
    };
  }

  // Calculate intersection and differences
  const userSkillSet = new Set(normUserSkills);
  const projectSkillSet = new Set(normProjectSkills);

  const matchingSkills = normProjectSkills.filter((s) => userSkillSet.has(s));
  const missingSkills = normProjectSkills.filter((s) => !userSkillSet.has(s));

  // 1. Coverage Ratio: |U ∩ P| / |P|
  const coverage = matchingSkills.length / normProjectSkills.length;

  // 2. Jaccard Similarity: |U ∩ P| / |U ∪ P|
  const unionSet = new Set([...normUserSkills, ...normProjectSkills]);
  const jaccard = unionSet.size > 0 ? matchingSkills.length / unionSet.size : 0;

  // 3. Interest & Category Affinity Bonus
  const interestBonus = normInterests.some(
    (interest) =>
      normCategory.includes(interest) ||
      interest.includes(normCategory) ||
      normCategory.split(/[\s&,/]+/).some((word) => interest.includes(word))
  );

  // 4. Weighted Composite
  // If coverage is 100% (all required skills covered), we award full 100%
  let rawScore: number;
  if (coverage === 1) {
    rawScore = 1.0;
  } else if (matchingSkills.length === 0) {
    // If no skills match, base is 0, give at most tiny 5% curiosity if interest matches
    rawScore = interestBonus ? 0.05 : 0.0;
  } else {
    rawScore = 0.80 * coverage + 0.15 * jaccard + (interestBonus ? 0.05 : 0.0);
  }

  // Clamp strictly between 0 and 100
  const percentage = Math.min(100, Math.max(0, Math.round(rawScore * 100)));

  return {
    percentage,
    matchingSkills,
    missingSkills,
    interestBonus,
  };
}

export function computeMatchPercentage(
  userSkills: string[] = [],
  projectSkills: string[] = [],
  userInterests: string[] = [],
  projectCategory: string = ''
): number {
  return computeDetailedMatch(userSkills, projectSkills, userInterests, projectCategory).percentage;
}
