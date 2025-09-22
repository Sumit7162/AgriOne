"use client";

import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/context/language-context";

export default function ForumsPage() {
  const { t } = useTranslation();

  const forumTopics = [
    {
      id: 1,
      title: t('forums.topic1_title'),
      author: "Ramesh Kumar",
      avatar: "https://picsum.photos/seed/ramesh/100/100",
      replies: 12,
      likes: 34,
      excerpt: t('forums.topic1_excerpt'),
    },
    {
      id: 2,
      title: t('forums.topic2_title'),
      author: "Sunita Devi",
      avatar: "https://picsum.photos/seed/sunita/100/100",
      replies: 8,
      likes: 22,
      excerpt: t('forums.topic2_excerpt'),
    },
    {
      id: 3,
      title: t('forums.topic3_title'),
      author: "Amit Singh",
      avatar: "https://picsum.photos/seed/amit/100/100",
      replies: 21,
      likes: 56,
      excerpt: t('forums.topic3_excerpt'),
    },
  ];

  return (
    <>
      <Header>{t('forums.title')}</Header>
      <div className="flex-1 p-4 md:p-8">
        <div className="space-y-6">
          <div className="flex justify-end">
             <Button>{t('forums.new_discussion_button')}</Button>
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
                    <CardDescription>{t('forums.by_author', { author: topic.author })}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{topic.excerpt}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" /> {topic.replies} {t('forums.replies')}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" /> {topic.likes} {t('forums.likes')}
                  </span>
                </div>
                <Button variant="outline">{t('forums.read_more_button')}</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
