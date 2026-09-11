// Unit verification for computeMatchPercentage and edge cases
const assert = require('assert');

function normalizeTag(tag) {
  return tag.trim().toLowerCase();
}

function computeDetailedMatch(
  userSkills = [],
  projectSkills = [],
  userInterests = [],
  projectCategory = ''
) {
  const normUserSkills = Array.from(new Set(userSkills.map(normalizeTag).filter(Boolean)));
  const normProjectSkills = Array.from(new Set(projectSkills.map(normalizeTag).filter(Boolean)));
  const normInterests = Array.from(new Set(userInterests.map(normalizeTag).filter(Boolean)));
  const normCategory = normalizeTag(projectCategory);

  if (normProjectSkills.length === 0) {
    return { percentage: 100, matchingSkills: [], missingSkills: [], interestBonus: false };
  }

  if (normUserSkills.length === 0) {
    return { percentage: 0, matchingSkills: [], missingSkills: normProjectSkills, interestBonus: false };
  }

  const userSkillSet = new Set(normUserSkills);
  const matchingSkills = normProjectSkills.filter((s) => userSkillSet.has(s));
  const missingSkills = normProjectSkills.filter((s) => !userSkillSet.has(s));

  const coverage = matchingSkills.length / normProjectSkills.length;
  const unionSet = new Set([...normUserSkills, ...normProjectSkills]);
  const jaccard = unionSet.size > 0 ? matchingSkills.length / unionSet.size : 0;

  const interestBonus = normInterests.some(
    (interest) =>
      normCategory.includes(interest) ||
      interest.includes(normCategory) ||
      normCategory.split(/[\s&,/]+/).some((word) => interest.includes(word))
  );

  let rawScore;
  if (coverage === 1) {
    rawScore = 1.0;
  } else if (matchingSkills.length === 0) {
    rawScore = interestBonus ? 0.05 : 0.0;
  } else {
    rawScore = 0.80 * coverage + 0.15 * jaccard + (interestBonus ? 0.05 : 0.0);
  }

  const percentage = Math.min(100, Math.max(0, Math.round(rawScore * 100)));
  return { percentage, matchingSkills, missingSkills, interestBonus };
}

console.log("Running SkillMatch Algorithm Verification Tests...\n");

// Test 1: Empty user skills
const t1 = computeDetailedMatch([], ['React', 'TypeScript']);
assert.strictEqual(t1.percentage, 0, "Empty user skills must yield 0%");
console.log("✓ Test 1 Passed: Empty user skills -> 0%");

// Test 2: Exact 100% match
const t2 = computeDetailedMatch(['React', 'TypeScript'], ['React', 'TypeScript']);
assert.strictEqual(t2.percentage, 100, "Exact match must yield 100%");
console.log("✓ Test 2 Passed: Exact match -> 100%");

// Test 3: Partial match (1 of 2 skills)
const t3 = computeDetailedMatch(['React'], ['React', 'Python']);
assert(t3.percentage >= 40 && t3.percentage <= 60, `Partial match should be around 45-55%, got ${t3.percentage}%`);
console.log(`✓ Test 3 Passed: Partial match -> ${t3.percentage}%`);

// Test 4: Case-insensitivity & whitespace trimming
const t4 = computeDetailedMatch([' react ', 'TYPESCRIPT '], ['React', 'typescript']);
assert.strictEqual(t4.percentage, 100, "Case insensitivity check failed");
console.log("✓ Test 4 Passed: Case and trim normalization -> 100%");

// Test 5: Open project (no required skills)
const t5 = computeDetailedMatch(['Rust'], []);
assert.strictEqual(t5.percentage, 100, "Open project without requirements -> 100%");
console.log("✓ Test 5 Passed: Zero-skill project -> 100%");

console.log("\nAll algorithm tests passed successfully! 🚀");
