import { Request, Response } from "express";
import { CommuintyService } from "../services/communityService";

export class CommunityController {
  private communityServices: CommuintyService;

  constructor(communityServices: CommuintyService) {
    this.communityServices = communityServices;
  }

  async getMessags(req: Request, res: Response): Promise<any | void> {
    try {
      const { courseId } = req.params;

      const response = await this.communityServices.getMessagesService(
        courseId
      );
      if (response) {
        res.status(200).json(response);
      }
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }
}
