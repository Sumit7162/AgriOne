import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const forumTopics = [
  {
    id: 1,
    title: "Best practices for wheat cultivation in dry regions?",
    author: "Ramesh Kumar",
    avatar: "https://picsum.photos/seed/ramesh/100/100",
    replies: 12,
    likes: 34,
    excerpt: "I'm looking for advice on water-efficient irrigation techniques and drought-resistant wheat varieties. What has worked for you all in areas with less rainfall? Any specific government schemes I should look into?",
  },
  {
    id: 2,
    title: "Organic pesticide recommendations for tomato plants",
    author: "Sunita Devi",
    avatar: "https://picsum.photos/seed/sunita/100/100",
    replies: 8,
    likes: 22,
    excerpt: "My tomato crop is suffering from whitefly infestation. I want to avoid chemical pesticides. Can anyone suggest effective organic solutions? I've heard about neem oil but would like to know more options.",
  },
  {
    id: 3,
    title: "How to get a fair price at the local mandi?",
    author: "Amit Singh",
    avatar: "https://picsum.photos/seed/amit/100/100",
    replies: 21,
    likes: 56,
    excerpt: "The prices I'm being offered for my potato harvest seem very low compared to the market rate. What are some negotiation strategies or platforms I can use to connect directly with buyers and get a better price?",
  },
];

export default function ForumsPage() {
  return (
    <>
      <Header>Community Forums</Header>
      <div className="flex-1 p-4 md:p-8">
        <div className="space-y-6">
          <div className="flex justify-end">
             <Button>Start New Discussion</Button>
          </div>
          {forumTopics.map((topic) => (
            <Card key={topic.id} className="transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={topic.avatar} alt={topic.author} data-ai-hint="person avatar"/>
                    <AvatarFallback>{topic.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="font-headline text-lg">{topic.title}</CardTitle>
                    <CardDescription>by {topic.author}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{topic.excerpt}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" /> {topic.replies} Replies
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" /> {topic.likes} Likes
                  </span>
                </div>
                <Button variant="outline">Read More</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
