import { GigCard } from "@/components/gig-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TabsTrigger } from "@radix-ui/react-tabs";
import { count } from "console";
import { Badge, Filter, Search } from "lucide-react";

interface Gig {
  id: string;
  title: string;
  description: string;
  price: number;
  timeEstimate: string;
  category: string;
  postedAt: string;
  postedBy: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  codeSnippet?: string;
}

async function getGigs(category = "all"): Promise<Gig[]> {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/gigs";

  const url =
    category === "all"
      ? apiUrl
      : `${apiUrl}?category=${encodeURIComponent(category)}`;

  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch gigs");
  }

  return res.json();
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { gigs: true },
      },
    },
  });

  return categories.map(category => ({
    name: category.name,
    count: category._count.gigs,
  }));
}

export default async function Home() {
  const gigs = await getGigs();
  const categories = await getCategories();

  return (
    <main className="container py-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Find Developer Gigs
          </h1>
          <p className="text-muted-foreground">
            Browse quick developer tasks and earn money by helping others with
            their code.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-[1fr_250px]">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search gigs..."
                  className="w-full pl-8"
                />
              </div>
              <Button variant="outline" className="h-10 sm:w-[120px]">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Gigs</TabsTrigger>
                {/* list of catgories */}
              </TabsList>
              <TabsContent value="all" className="mt-4 frid gap-4">
                {gigs.length > 0 ? (
                  gigs.map(gig => <GigCard key={gig.id} gig={gig} />)
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">
                      No gigs found, Be the first one to post!
                    </p>
                  </div>
                )}
              </TabsContent>
              {categories.slice(0, 3).map(category => (
                <TabsContent
                  key={category.name}
                  value={category.name.toLowerCase()}
                  className="mt-4 grid gap-4"
                >
                  {gigs
                    .filter(
                      gig =>
                        gig.category.toLowerCase() ===
                        category.name.toLowerCase()
                    )
                    .map(gig => (
                      <GigCard key={gig.id} gig={gig} />
                    ))}
                </TabsContent>
              ))}
            </Tabs>
          </div>
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                {categories.map(category => (
                  <Button
                    key={category.name}
                    variant="ghost"
                    className="justify-start"
                  >
                    {category.name}{" "}
                    <Badge className="ml-auto">{category.count}</Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Price Range</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button variant="ghost" className="justify-start">
                  Under £10
                </Button>
                <Button variant="ghost" className="justify-start">
                  £10 - £20
                </Button>
                <Button variant="ghost" className="justify-start">
                  £20 - £30
                </Button>
                <Button variant="ghost" className="justify-start">
                  Over £30
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
