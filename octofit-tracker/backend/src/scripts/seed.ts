import mongoose, { type Model } from 'mongoose'
import {
  ActivityModel,
  LeaderboardModel,
  TeamModel,
  UserModel,
  WorkoutModel,
} from '../models/index.js'

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db'
const ids = {
  users: {
    maya: new mongoose.Types.ObjectId('650000000000000000000001'),
    leo: new mongoose.Types.ObjectId('650000000000000000000002'),
    priya: new mongoose.Types.ObjectId('650000000000000000000003'),
  },
  teams: {
    trailblazers: new mongoose.Types.ObjectId('650000000000000000000011'),
    morningMiles: new mongoose.Types.ObjectId('650000000000000000000012'),
  },
}

/**
 * Seed the octofit_db database with test data
 */
async function upsert<T>(model: Model<T>, id: mongoose.Types.ObjectId, data: Partial<T>) {
  await model.findByIdAndUpdate(id, { $set: data }, {
    upsert: true,
    returnDocument: 'after',
    setDefaultsOnInsert: true,
  })
}

async function seedDatabase() {
  try {
    await mongoose.connect(connectionString)

    console.log('Connected to octofit_db')
    console.log('Seed the octofit_db database with test data')

    const now = Date.now()
    const daysAgo = (days: number) => new Date(now - days * 24 * 60 * 60 * 1000)

    await Promise.all([
      upsert(UserModel, ids.users.maya, {
        username: 'maya-chen',
        email: 'maya.chen@example.test',
        displayName: 'Maya Chen',
      }),
      upsert(UserModel, ids.users.leo, {
        username: 'leo-martinez',
        email: 'leo.martinez@example.test',
        displayName: 'Leo Martinez',
      }),
      upsert(UserModel, ids.users.priya, {
        username: 'priya-shah',
        email: 'priya.shah@example.test',
        displayName: 'Priya Shah',
      }),
    ])

    await Promise.all([
      upsert(TeamModel, ids.teams.trailblazers, {
        name: 'Trailblazers',
        description: 'A weekend running and hiking crew.',
        members: [ids.users.maya, ids.users.priya],
        points: 425,
      }),
      upsert(TeamModel, ids.teams.morningMiles, {
        name: 'Morning Miles',
        description: 'Consistent early workouts, whatever the weather.',
        members: [ids.users.leo, ids.users.maya],
        points: 390,
      }),
    ])

    const activities = [
      { id: '650000000000000000000021', userId: ids.users.maya, type: 'running' as const, durationMinutes: 32, distanceKm: 5.2, points: 52, date: daysAgo(1), notes: 'Steady neighborhood run.' },
      { id: '650000000000000000000022', userId: ids.users.maya, type: 'strength' as const, durationMinutes: 40, points: 40, date: daysAgo(3), notes: 'Bodyweight strength circuit.' },
      { id: '650000000000000000000023', userId: ids.users.leo, type: 'cycling' as const, durationMinutes: 48, distanceKm: 14.5, points: 58, date: daysAgo(1), notes: 'Bike path intervals.' },
      { id: '650000000000000000000024', userId: ids.users.leo, type: 'walking' as const, durationMinutes: 35, distanceKm: 2.8, points: 28, date: daysAgo(2), notes: 'Recovery walk after school.' },
      { id: '650000000000000000000025', userId: ids.users.priya, type: 'running' as const, durationMinutes: 27, distanceKm: 4.1, points: 41, date: daysAgo(2), notes: 'Easy conversational pace.' },
      { id: '650000000000000000000026', userId: ids.users.priya, type: 'strength' as const, durationMinutes: 30, points: 30, date: daysAgo(4), notes: 'Core and mobility session.' },
    ]
    await Promise.all(activities.map(({ id, ...activity }) => (
      upsert(ActivityModel, new mongoose.Types.ObjectId(id), activity)
    )))

    const leaderboardEntries = [
      { id: '650000000000000000000031', userId: ids.users.maya, period: 'monthly', score: 92, rank: 1 },
      { id: '650000000000000000000032', userId: ids.users.leo, period: 'monthly', score: 86, rank: 2 },
      { id: '650000000000000000000033', userId: ids.users.priya, period: 'monthly', score: 71, rank: 3 },
      { id: '650000000000000000000034', teamId: ids.teams.trailblazers, period: 'monthly', score: 425, rank: 1 },
      { id: '650000000000000000000035', teamId: ids.teams.morningMiles, period: 'monthly', score: 390, rank: 2 },
    ]
    await Promise.all(leaderboardEntries.map(({ id, ...entry }) => (
      upsert(LeaderboardModel, new mongoose.Types.ObjectId(id), entry)
    )))

    const workouts = [
      { id: '650000000000000000000041', title: 'Beginner Run-Walk', description: 'Alternate brisk walking and easy jogging to build aerobic endurance.', level: 'beginner' as const, activityType: 'running', durationMinutes: 25, userId: ids.users.maya },
      { id: '650000000000000000000042', title: 'Cycling Intervals', description: 'Warm up, then alternate two-minute fast efforts with easy recovery.', level: 'intermediate' as const, activityType: 'cycling', durationMinutes: 35, userId: ids.users.leo },
      { id: '650000000000000000000043', title: 'Full-Body Basics', description: 'Complete controlled squats, push-ups, lunges, and planks with rest between rounds.', level: 'beginner' as const, activityType: 'strength', durationMinutes: 30, userId: ids.users.priya },
      { id: '650000000000000000000044', title: 'Mobility Reset', description: 'A gentle sequence for hips, hamstrings, shoulders, and back.', level: 'beginner' as const, activityType: 'mobility', durationMinutes: 15 },
    ]
    await Promise.all(workouts.map(({ id, ...workout }) => (
      upsert(WorkoutModel, new mongoose.Types.ObjectId(id), workout)
    )))

    console.log('Seeded 3 users, 2 teams, 6 activities, 5 leaderboard entries, and 4 workouts.')
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

await seedDatabase()
