import { handlers } from "@havenspace/auth/config";

// Type assertion to work around Next.js version mismatch in types
const handlerWrapper = async (request: Request) => {
  return (handlers.GET as unknown as (req: Request) => Promise<Response>)(request);
};

const postHandler = async (request: Request) => {
  return (handlers.POST as unknown as (req: Request) => Promise<Response>)(request);
};

export { handlerWrapper as GET, postHandler as POST };
