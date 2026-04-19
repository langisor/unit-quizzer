import { BaseRepository } from "./base.repo";
import { Noun } from "@/quizzers/types/noun.types";
import { JSONProvider } from "@/quizzers/json-provider/json.provider";

export class NounsRepository extends BaseRepository<Noun> {
  private readonly file_path = "src/quizzers/data/nouns.json";

  async getAll(): Promise<Noun[]> {
    return JSONProvider.load<Noun[]>(this.file_path);
  }

  async getByRank(rank: number): Promise<Noun | undefined> {
    const nouns = await this.getAll();
    return nouns.find((n) => n.rank === rank);
  }

  async search(query: string): Promise<Noun[]> {
    const nouns = await this.getAll();
    const lowerQuery = query.toLowerCase();
    return nouns.filter(
      (noun) =>
        noun.noun_urdu.includes(lowerQuery) ||
        noun.singular.includes(lowerQuery) ||
        noun.meaning_en.toLowerCase().includes(lowerQuery),
    );
  }
}