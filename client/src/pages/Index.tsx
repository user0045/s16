import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import HomeHero from '@/components/HomeHero';
import HorizontalSection from '@/components/HorizontalSection';
import { useAllContent, useContentByFeature, useContentByGenre } from '@/hooks/useContentQueries';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { data: allContent, isLoading: allContentLoading } = useAllContent();
  const { data: heroContent } = useContentByFeature('Home Hero');
  const { data: newReleases } = useContentByFeature('Home New Release');
  const { data: popular } = useContentByFeature('Home Popular');
  const { data: actionContent } = useContentByGenre('Action');
  const { data: comedyContent } = useContentByGenre('Comedy');
  const { data: crimeContent } = useContentByGenre('Crime');
  const { data: dramaContent } = useContentByGenre('Drama');
  const { data: horrorContent } = useContentByGenre('Horror');
  const { data: familyContent } = useContentByGenre('Family');
  const { data: thrillerContent } = useContentByGenre('Thriller');
  const { data: sciFiContent } = useContentByGenre('Sci-Fi');

  if (allContentLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading content...</div>
      </div>
    );
  }

  // Transform database content to display format
  const transformContent = (contentArray: any[]) => {
    return contentArray?.map(content => {
      let contentData;
      let type = 'movie';
      let thumbnailUrl = '';

      if (content.content_type === 'Movie') {
        contentData = content.movie;
        type = 'movie';
        thumbnailUrl = content.movie?.thumbnail_url || '';
      } else if (content.content_type === 'Show') {
        contentData = content.show;
        type = 'series';
        thumbnailUrl = content.show?.thumbnail_url || '';
      } else if (content.content_type === 'Web Series') {
        contentData = content.web_series;
        type = 'series';
        thumbnailUrl = content.web_series?.thumbnail_url || '';
      }

      return {
        id: content.id,
        title: content.title,
        rating: contentData?.rating_type || 'PG-13',
        score: contentData?.rating?.toString() || '8.0',
        image: thumbnailUrl,
        year: contentData?.release_year?.toString() || content.created_at?.split('-')[0],
        description: contentData?.description || content.description,
        type
      };
    }) || [];
  };

  // Filter content for home page (Movies and Web Series only)
  const filterHomeContent = (contentArray: any[]) => {
    return contentArray?.filter(content => 
      content.content_type === 'Movie' || content.content_type === 'Web Series'
    ) || [];
  };

  // Get latest content for hero (newest content regardless of feature since Home Hero is removed)
  const getLatestHeroContent = () => {
    const allContentArray = allContent?.movies?.concat(allContent?.webSeries || [], allContent?.shows || [])
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) || [];
    
    return allContentArray.length > 0 ? [allContentArray[0]] : [];
  };

  const sections = [
    { title: 'New Release', contents: transformContent(filterHomeContent(newReleases)) },
    { title: 'Popular', contents: transformContent(filterHomeContent(popular)) },
    { title: 'Action & Adventure', contents: transformContent(filterHomeContent(actionContent)) },
    { title: 'Comedy', contents: transformContent(filterHomeContent(comedyContent)) },
    { title: 'Crime', contents: transformContent(filterHomeContent(crimeContent)) },
    { title: 'Drama', contents: transformContent(filterHomeContent(dramaContent)) },
    { title: 'Horror', contents: transformContent(filterHomeContent(horrorContent)) },
    { title: 'Family', contents: transformContent(filterHomeContent(familyContent)) },
    { title: 'Thriller', contents: transformContent(filterHomeContent(thrillerContent)) },
    { title: 'Sci-Fi', contents: transformContent(filterHomeContent(sciFiContent)) },
  ];

  const handleSeeMore = (title: string, contents: any[]) => {
    navigate('/see-more', { state: { title, contents } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HomeHero content={transformContent(getLatestHeroContent())} />

      <div className="container mx-auto px-6 py-8 space-y-8">
        {sections.map((section) => (
          <HorizontalSection
            key={section.title}
            title={section.title}
            contents={section.contents}
            onSeeMore={() => handleSeeMore(section.title, section.contents)}
          />
        ))}
      </div>
    </div>
  );
};

export default Index;