import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Clock, DollarSign } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export interface Gig {
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

interface GigCardProps {
  gig: Gig;
}

export const GigCard = ({ gig }: GigCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{gig.title}</CardTitle>
            <CardDescription className="mt-1">
              {gig.description}
            </CardDescription>
          </div>
          <Badge variant="outline">{gig.category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{gig.price}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{gig.timeEstimate}</span>
        </div>
        <div className="text-muted-foreground">Posted {gig.postedAt}</div>
      </CardContent>
      <CardFooter>
        <Link href={`/gig/${gig.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
