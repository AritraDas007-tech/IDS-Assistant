export type Message = {
  id: number;
  content: string;
  isBot: boolean;
  createdAt: Date;
};

class MemoryStorage {
  private messages: Message[] = [];
  private currentId = 1;

  async getMessages(): Promise<Message[]> {
    return this.messages;
  }

  async createMessage(data: { content: string; isBot: boolean }): Promise<Message> {
    const msg: Message = {
      id: this.currentId++,
      content: data.content,
      isBot: data.isBot,
      createdAt: new Date(),
    };

    this.messages.push(msg);
    return msg;
  }

  async clearMessages(): Promise<void> {
    this.messages = [];
    this.currentId = 1;
  }
}

export const storage = new MemoryStorage();
