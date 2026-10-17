import { notFound } from "next/navigation";
import { QueryClient } from "@tanstack/react-query";
import { Footer, MobileNavbar, WebNavbar } from "@/components/platform";
import { getBlogStory } from "@/features/blog/server/get.blog.story.action";
import { BlogStoryDetail } from "@/features/blog/components/ui/blog-story-detail";

/** Serves a published story at its public URL and returns a 404 for unavailable stories. */
export default async function BlogStoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const queryClient = new QueryClient();
    const story = await queryClient.fetchQuery({ queryKey: ["blog", "story", slug], queryFn: () => getBlogStory(slug), retry: false });
    if (!story) notFound();
    return (
        <>
            <MobileNavbar appearance="solid" />
            <WebNavbar appearance="solid" showGetStarted={false} />
            <main className="min-h-screen bg-background pt-16 pb-[calc(6rem+env(safe-area-inset-bottom))] xl:pb-0">
                <BlogStoryDetail story={story} />
            </main>
            <Footer />
        </>
    );
}
