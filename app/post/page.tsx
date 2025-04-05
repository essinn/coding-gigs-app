"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

const PostPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    timeEstimate: "",
  });

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubitting(true);

    try {
      const gigData = {
        ...formData,
        price: Number.parseFloat(formData.price),
      };

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || ""}/api/gigs`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gigData),
      });

      if (!response.ok) {
        throw new Error("Failed to post gig");
      }

      const data = await response.json();

      router.push("/");
    } catch (error) {
      console.log("Error posting gig: ", error);
    } finally {
      setIsSubitting(false);
    }
  };

  return (
    <main className="container py-6">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to gigs
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Post a New Gig</CardTitle>
            <CardDescription>
              Describe your task and set a fair price for the work required.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="title">Gig Title</Label>
                <Input
                  id="title"
                  placeholder="E.g., Fix React useEffect dependency bug"
                  required
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your task in detail. Include what you need help with, any error messages, and relevant code snippets."
                  className="min-h-32"
                  required
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    required
                    onValueChange={value =>
                      handleSelectChange("category", value)
                    }
                    value={formData.category}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="React">React</SelectItem>
                      <SelectItem value="CSS">CSS</SelectItem>
                      <SelectItem value="Node.js">Node.js</SelectItem>
                      <SelectItem value="SQL">SQL</SelectItem>
                      <SelectItem value="DevOps">DevOps</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Budget (£)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="5"
                    placeholder="15"
                    required
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="timeEstimate">Time Estimate</Label>
                <Select
                  required
                  onValueChange={value =>
                    handleSelectChange("timeEstimate", value)
                  }
                  value={formData.timeEstimate}
                >
                  <SelectTrigger id="timeEstimate">
                    <SelectValue placeholder="Select time estimate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Less than 1 hour">
                      Less than 1 hour
                    </SelectItem>
                    <SelectItem value="1-2 hours">1-2 hours</SelectItem>
                    <SelectItem value="2-4 hours">2-4 hours</SelectItem>
                    <SelectItem value="4-8 hours">4-8 hours</SelectItem>
                    <SelectItem value="More than 8 hours">
                      More than 8 hours
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Posting..." : "Post Gig"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
};

export default PostPage;
