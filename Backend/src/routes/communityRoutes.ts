import {Router} from 'express'
import { CommuintyService } from '../services/communityService'
import { CommunityController } from '../controllers/communityController'


const route = Router()

const communiyService = new CommuintyService()
const communityController = new CommunityController(communiyService)

route.get('/messages/:courseId', communityController.getMessags.bind(communityController))

export default route;