
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import HeroSlider from '@/components/HeroSlider';
import HorizontalSection from '@/components/HorizontalSection';
import { useAllContent, useContentByFeature, useContentByGenre } from '@/hooks/useContentQueries';

const WebSeries = () => {
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
        <div className="text-foreground">Loading web series...</div>
      </div>
    );
  }

  const webSeries = allContent?.webSeries || [];

  // Filter web series for hero content (top 5 newest with "Type Hero" feature, using season thumbnail)
  const heroWebSeries = webSeries?.filter(content => 
    content.content_type === 'Web Series' && content.web_series?.feature_in?.includes('Type Hero')
  )
  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  .slice(0, 5)
  .map(content => ({
    id: content.id,
    title: content.title,
    description: content.web_series?.description || content.description,
    rating: content.web_series?.rating_type || 'TV-MA',
    year: content.web_series?.release_year?.toString() || content.created_at?.split('-')[0],
    score: content.web_series?.rating?.toString() || '8.0',
    image: content.web_series?.seasons?.[0]?.thumbnail_url || '',
    videoUrl: content.web_series?.seasons?.[0]?.episodes?.[0]?.video_url
  })) || [];

  // Filter web series for sections
  const getWebSeriesFromContent = (contentArray: any[], featureType?: string) => {
    const seriesToFilter = featureType ? contentArray : webSeries;
    return seriesToFilter?.filter(content => {
      if (content.content_type !== 'Web Series') return false;
      if (featureType) {
        return content.web_series?.feature_in?.includes(featureType);
      }
      return true;
    }).map(content => ({
      id: content.id,
      title: content.title,
      rating: content.web_series?.rating_type || 'TV-MA',
      score: content.web_series?.rating?.toString() || '8.0',
      image: content.web_series?.thumbnail_url || '',
      year: content.web_series?.release_year?.toString() || content.created_at?.split('-')[0],
      description: content.web_series?.description || content.description,
      type: 'series'
    })) || [];
  };

  const sections = [
    { title: 'New Release', contents: getWebSeriesFromContent(newReleases, 'Type New Release') },
    { title: 'Popular', contents: getWebSeriesFromContent(popular, 'Type Popular') },
    { title: 'Action & Adventure', contents: getWebSeriesFromContent(actionContent) },
    { title: 'Comedy', contents: getWebSeriesFromContent(comedyContent) },
    { title: 'Crime', contents: getWebSeriesFromContent(crimeContent) },
    { title: 'Drama', contents: getWebSeriesFromContent(dramaContent) },
    { title: 'Horror', contents: getWebSeriesFromContent(horrorContent) },
    { title: 'Family', contents: getWebSeriesFromContent(familyContent) },
    { title: 'Thriller', contents: getWebSeriesFromContent(thrillerContent) },
    { title: 'Sci-Fi', contents: getWebSeriesFromContent(sciFiContent) },
  ];

  const handleSeeMore = (title: string, contents: any[]) => {
    navigate('/see-more', { state: { title, contents } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSlider contents={heroWebSeries} />
      
      <div className="container mx-auto px-6 py-4 space-y-4">
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

export default WebSeries;
