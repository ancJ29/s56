export interface ClientSpecificCustomHandler {
  isAdmin?: (_: unknown) => boolean;
  isSystemAdmin?: (_: unknown) => boolean;
  task?: {
    statusMapper?: (status: string) => number;
    statusValidator?: (_: number) => boolean;
  },
}
