import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const gig = await prisma.gig.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          },
        },
        category: true,
      },
    });

    if (!gig) {
      return NextResponse.json({ error: "Gig not found" }, { status: 404 });
    }

    const formattedGig = {
      id: gig.id,
      title: gig.title,
      description: gig.description,
      price: gig.price,
      timeEstimate: gig.timeEstimate,
      category: gig.category.name,
      codeSnippet: gig.codeSnippet,
      postedAt: formatTime(gig.createdAt),
      postedBy: {
        id: gig.author.id,
        name: gig.author.name,
        username:
          gig.author.username ||
          gig.author.name?.toLowerCase().replace(/\s+/g, "") ||
          "user",
        avatar: gig.author.image || `/placeholder.svg?height=40&width=40`,
      },
    };

    return NextResponse.json(formattedGig, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

function formatTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
}
