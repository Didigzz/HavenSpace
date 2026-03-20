export interface IDatabaseConnection {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  transaction<T>(callback: (db: unknown) => Promise<T>): Promise<T>;
}