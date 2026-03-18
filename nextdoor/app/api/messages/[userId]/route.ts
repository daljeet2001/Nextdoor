import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: any) {
  const { userId } = await context.params;

  const session = await auth()

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: (session as any).user.id, receiverId: userId },
        { senderId: userId, receiverId: (session as any).user.id },
      ],
    },
    orderBy: { createdAt: "asc" },
    include: {
      sender: { select: { id: true, name: true, email: true } },
      receiver: { select: { id: true, name: true, email: true } },
    },
  });

  return NextResponse.json(messages);
}
