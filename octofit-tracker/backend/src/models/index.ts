import { model, Schema, type Types } from 'mongoose'

interface User {
  username: string
  email: string
  displayName: string
}

interface Team {
  name: string
  description?: string
  members: Types.ObjectId[]
  points: number
}

interface Activity {
  userId: Types.ObjectId
  type: 'running' | 'walking' | 'strength' | 'cycling' | 'other'
  durationMinutes: number
  distanceKm?: number
  points: number
  date: Date
  notes?: string
}

interface LeaderboardEntry {
  userId?: Types.ObjectId
  teamId?: Types.ObjectId
  period: string
  score: number
  rank: number
}

interface Workout {
  title: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  activityType: string
  durationMinutes: number
  userId?: Types.ObjectId
}

const userSchema = new Schema<User>({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  displayName: { type: String, required: true, trim: true },
}, { timestamps: true })

const teamSchema = new Schema<Team>({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  points: { type: Number, default: 0, min: 0 },
}, { timestamps: true })

const activitySchema = new Schema<Activity>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['running', 'walking', 'strength', 'cycling', 'other'], required: true },
  durationMinutes: { type: Number, required: true, min: 1 },
  distanceKm: { type: Number, min: 0 },
  points: { type: Number, default: 0, min: 0 },
  date: { type: Date, default: Date.now },
  notes: { type: String, trim: true },
}, { timestamps: true })

const leaderboardSchema = new Schema<LeaderboardEntry>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  teamId: { type: Schema.Types.ObjectId, ref: 'Team' },
  period: { type: String, required: true, default: 'monthly' },
  score: { type: Number, required: true, min: 0 },
  rank: { type: Number, required: true, min: 1 },
}, { timestamps: true })

const workoutSchema = new Schema<Workout>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  activityType: { type: String, required: true, trim: true },
  durationMinutes: { type: Number, required: true, min: 1 },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

export const UserModel = model<User>('User', userSchema, 'users')
export const TeamModel = model<Team>('Team', teamSchema, 'teams')
export const ActivityModel = model<Activity>('Activity', activitySchema, 'activities')
export const LeaderboardModel = model<LeaderboardEntry>('Leaderboard', leaderboardSchema, 'leaderboard')
export const WorkoutModel = model<Workout>('Workout', workoutSchema, 'workouts')