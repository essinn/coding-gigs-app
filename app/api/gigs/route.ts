import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse, userAgent } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryName = searchParams.get("category");

    const where: { category?: { name: { equals: string; mode: string } } } = {};

    if (categoryName && categoryName !== "all") {
      where["category"] = {
        name: {
          equals: categoryName,
          mode: "insensitive",
        },
      };
    }

    const gigs = await prisma.gig.findMany({
      where,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedGigs = gigs.map(gig => ({
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
    }));

    return NextResponse.json(formattedGigs);
  } catch (error) {
    return NextResponse.json(
      { error: "failed to fetch gigs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, price, timeEstimate, category, codeSnippet } =
      body;

    if (!title || !description || !price || !timeEstimate || !category) {
      return NextResponse.json(
        { error: "Must fill in all fields" },
        { status: 400 }
      );
    }

    let categoryRecord = await prisma.category.findUnique({
      where: { name: category },
    });

    if (!categoryRecord) {
      categoryRecord = await prisma.category.create({
        data: { name: category },
      });
    }

    const gig = await prisma.gig.create({
      data: {
        title,
        description,
        price: Number.parseFloat(price),
        timeEstimate,
        codeSnippet,
        author: {
          connect: { id: user.id },
        },
        category: {
          connect: { id: categoryRecord.id },
        },
      },
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

    const formattedGig = {
      id: gig.id,
      title: gig.title,
      description: gig.description,
      price: gig.price,
      timeEstimate: gig.timeEstimate,
      category: gig.category.name,
      codeSnippet: gig.codeSnippet,
      postedAt: "Just now",
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

    return NextResponse.json(formattedGig, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "failed to fetch gigs" },
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
