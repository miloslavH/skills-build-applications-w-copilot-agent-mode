import { Router } from 'express'
import type { Model } from 'mongoose'
import {
  ActivityModel,
  LeaderboardModel,
  TeamModel,
  UserModel,
  WorkoutModel,
} from '../models/index.js'

function createResourceRouter<T>(resourceModel: Model<T>) {
  const router = Router()

  router.get('/', async (_request, response, next) => {
    try {
      response.json(await resourceModel.find().lean())
    } catch (error) {
      next(error)
    }
  })

  router.post('/', async (request, response, next) => {
    try {
      const item = await resourceModel.create(request.body)
      response.status(201).json(item)
    } catch (error) {
      next(error)
    }
  })

  router.get('/:id', async (request, response, next) => {
    try {
      const item = await resourceModel.findById(request.params.id).lean()
      if (!item) {
        response.status(404).json({ error: 'Not found' })
        return
      }
      response.json(item)
    } catch (error) {
      next(error)
    }
  })

  router.put('/:id', async (request, response, next) => {
    try {
      const item = await resourceModel.findByIdAndUpdate(request.params.id, request.body, {
        returnDocument: 'after',
        runValidators: true,
      })
      if (!item) {
        response.status(404).json({ error: 'Not found' })
        return
      }
      response.json(item)
    } catch (error) {
      next(error)
    }
  })

  router.delete('/:id', async (request, response, next) => {
    try {
      const result = await resourceModel.findByIdAndDelete(request.params.id)
      if (!result) {
        response.status(404).json({ error: 'Not found' })
        return
      }
      response.status(204).end()
    } catch (error) {
      next(error)
    }
  })

  return router
}

export const apiRouter = Router()

apiRouter.use('/users', createResourceRouter(UserModel))
apiRouter.use('/teams', createResourceRouter(TeamModel))
apiRouter.use('/activities', createResourceRouter(ActivityModel))
apiRouter.use('/leaderboard', createResourceRouter(LeaderboardModel))
apiRouter.use('/workouts', createResourceRouter(WorkoutModel))