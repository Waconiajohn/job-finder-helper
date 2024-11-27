export class TokenManager {
  private tokens: Map<string, string> = new Map();
  
  async getToken(source: string): Promise<string | null> {
    return this.tokens.get(source) || null;
  }
  
  async setToken(source: string, token: string): Promise<void> {
    this.tokens.set(source, token);
  }
  
  async clearToken(source: string): Promise<void> {
    this.tokens.delete(source);
  }
}