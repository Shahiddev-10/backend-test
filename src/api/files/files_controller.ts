// Files Controller
// ./src/files/files_controller.ts
import { readFileSync, writeFileSync, existsSync } from 'fs';

export class files_controller {
  public save = async (save: JSON): Promise<{ status: number; data: JSON }> => {
    writeFileSync('save.json', JSON.stringify(save));
    return { status: 200, data: save };
  };
  public load = async (): Promise<{ status: number; data: JSON }> => {
    try {
      if (existsSync('save.json')) {
        let load = JSON.parse(readFileSync('save.json', 'utf8'));
        return { status: 200, data: load };
      }
      return { status: 500, data: JSON.parse('{ "error": "File not found! Call *save*"}') };
    } catch (err) {
      return { status: 500, data: JSON.parse('{ "error": "File not found! Call *save*"}') };
    }
  };
  public another = async (): Promise<{ status: number; data: number }> => {
    return { status: 200, data: 2 };
  };
}
