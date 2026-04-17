/**
 * 50 static mock rows for the table data page (local state only).
 * @typedef {{ id: number; name: string; role: string; experience: number }} TableUser
 */

const FIRST_NAMES = [
  'Alex',
  'Jordan',
  'Taylor',
  'Riley',
  'Casey',
  'Morgan',
  'Quinn',
  'Avery',
  'Cameron',
  'Skyler',
  'Jamie',
  'Reese',
  'Dakota',
  'Rowan',
  'Emerson',
]

const LAST_NAMES = [
  'Nguyen',
  'Patel',
  'Garcia',
  'Kim',
  'Silva',
  'Brown',
  'Chen',
  'Martinez',
  'Singh',
  'Walker',
  'Lopez',
  'Hall',
  'Young',
  'King',
  'Wright',
]

const ROLES = [
  'Software Engineer',
  'Product Designer',
  'Engineering Manager',
  'Data Analyst',
  'QA Engineer',
  'DevOps Engineer',
  'Tech Lead',
  'Scrum Master',
  'Frontend Developer',
  'Backend Developer',
]

/** @type {TableUser[]} */
export const MOCK_TABLE_USERS = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[(i * 7) % LAST_NAMES.length]}`,
  role: ROLES[i % ROLES.length],
  experience: 1 + (i % 15),
}))
