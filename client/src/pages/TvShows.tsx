import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import HeroSlider from '@/components/HeroSlider';
import HorizontalSection from '@/components/HorizontalSection';
import { useAllContent, useContentByFeature, useContentByGenre } from '@/hooks/useContentQueries';

const TvShows = () => {
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
        <div className="text-foreground">Loading TV shows...</div>
      </div>
    );
  }

  // Filter shows for hero content (top 5 newest with "Type Hero" feature)
  const heroShows = shows?.filter(content => 
    content.content_type === 'Show' && content.show?.feature_in?.includes('Type Hero')
  )
  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  .slice(0, 5)
  .map(content => ({
    id: content.id,
    title: content.title,
    description: content.show?.description || content.description,
    rating: content.show?.rating_type || 'TV-14',
    year: content.show?.release_year?.toString() || content.created_at?.split('-')[0],
    score: content.show?.rating?.toString() || '8.0',
    image: content.show?.thumbnail_url || '',
    videoUrl: content.show?.episodes?.[0]?.video_url
  })) || [];

  // Filter TV shows for sections
  const getShowsFromContent = (contentArray: any[], featureType?: string) => {
    const showsToFilter = featureType ? contentArray : shows;
    return showsToFilter?.filter(content => {
      if (content.content_type !== 'Show') return false;
      if (featureType) {
        return content.show?.feature_in?.includes(featureType);
      }
      return true;
    }).map(content => ({
      id: content.id,
      title: content.title,
      rating: content.show?.rating_type || 'TV-PG',
      score: content.show?.rating?.toString() || '8.0',
      image: content.show?.thumbnail_url || '',
      year: content.show?.release_year?.toString() || content.created_at?.split('-')[0],
      description: content.show?.description || content.description,
      type: 'series'
    })) || [];
  };

  const sections = [
    { title: 'New Release', contents: getShowsFromContent(newReleases, 'Type New Release') },
    { title: 'Popular', contents: getShowsFromContent(popular, 'Type Popular') },
    { title: 'Action & Adventure', contents: getShowsFromContent(actionContent) },
    { title: 'Comedy', contents: getShowsFromContent(comedyContent) },
    { title: 'Crime', contents: getShowsFromContent(crimeContent) },
    { title: 'Drama', contents: getShowsFromContent(dramaContent) },
    { title: 'Horror', contents: getShowsFromContent(horrorContent) },
    { title: 'Family', contents: getShowsFromContent(familyContent) },
    { title: 'Thriller', contents: getShowsFromContent(thrillerContent) },
    { title: 'Sci-Fi', contents: getShowsFromContent(sciFiContent) },
  ];

  const handleSeeMore = (title: string, contents: any[]) => {
    navigate('/see-more', { state: { title, contents } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSlider contents={heroShows} />

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

export default TvShows;