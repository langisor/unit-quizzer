import { UnitRepository } from "../repos/unit.repo";

class UnitService {
  private readonly unitRepository = new UnitRepository();
  private static instance: UnitService;

  async getAll() {
    return this.unitRepository.getAll();
  }

  async search(query: string) {
    return this.unitRepository.search(query);
  }

  static async getInstance(): Promise<UnitService> {
    if (!UnitService.instance) {
      UnitService.instance = new UnitService();
    }
    return UnitService.instance;
  }
}

export const unitService = await UnitService.getInstance();