import { CommunityRepository } from "../repository/communityRepository";

export class CommuintyService {
  async getMessagesService(courseId: string) {
    try {
      const res = await CommunityRepository.getMessages(courseId as string);

      return res;
    } catch (error: any) {
      console.error("Error in gettin msgs in service:", error.message);
      throw new Error(`${error.message}`);
    }
  }
}
