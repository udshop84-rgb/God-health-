/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeSection } from './components/HomeSection';
import { BlogSection } from './components/BlogSection';
import { VideoSection } from './components/VideoSection';
import { FavoritesSection } from './components/FavoritesSection';
import { ProfileSection } from './components/ProfileSection';
import { BlogDetailModal } from './components/BlogDetailModal';
import { VideoDetailModal } from './components/VideoDetailModal';
import { CreateBlogPostModal } from './components/CreateBlogPostModal';
import { UploadVideoModal } from './components/UploadVideoModal';
import { LeftMenuDrawer } from './components/LeftMenuDrawer';
import { Footer } from './components/Footer';
import { YouTubeBottomNav } from './components/YouTubeBottomNav';
import { ContactSignModal } from './components/ContactSignModal';
import { 
  BlogPost, 
  HealthVideo, 
  BlogCategory, 
  BlogComment, 
  UserProfile, 
  MainViewSection 
} from './types';
import { INITIAL_BLOG_POSTS } from './data/blogData';
import { INITIAL_HEALTH_VIDEOS } from './data/videoData';
import { INITIAL_USER_PROFILE } from './data/profileData';

const LOCAL_STORAGE_POSTS_KEY = 'health_is_everything_posts_v3';
const LOCAL_STORAGE_VIDEOS_KEY = 'health_is_everything_videos_v3';
const LOCAL_STORAGE_SAVED_POSTS_KEY = 'health_is_everything_saved_posts_v3';
const LOCAL_STORAGE_SAVED_VIDEOS_KEY = 'health_is_everything_saved_videos_v3';
const LOCAL_STORAGE_FAVORITE_VIDEOS_KEY = 'health_is_everything_fav_videos_v3';
const LOCAL_STORAGE_PROFILE_KEY = 'health_is_everything_profile_v3';

export default function App() {
  // Navigation View State
  const [activeSection, setActiveSection] = useState<MainViewSection>('home');

  // Modals State
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isUploadVideoModalOpen, setIsUploadVideoModalOpen] = useState(false);
  const [isContactSignModalOpen, setIsContactSignModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<HealthVideo | null>(null);
  const [editingVideo, setEditingVideo] = useState<HealthVideo | null>(null);

  // Category & Search State
  const [activeCategory, setActiveCategory] = useState<BlogCategory>('all');
  const [activeBlogTab, setActiveBlogTab] = useState<'all' | 'featured' | 'trending' | 'saved' | 'drafts'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Blog Posts State with Persistence
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_POSTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (err) {
      console.error('Failed to parse blog posts from localStorage', err);
    }
    return INITIAL_BLOG_POSTS;
  });

  // 2. Health Videos State with Persistence
  const [videos, setVideos] = useState<HealthVideo[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_VIDEOS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (err) {
      console.error('Failed to parse videos from localStorage', err);
    }
    return INITIAL_HEALTH_VIDEOS;
  });

  // 3. Saved Bookmarks (Posts & Videos)
  const [savedPostIds, setSavedPostIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_SAVED_POSTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (err) {
      console.error('Failed to parse saved posts from localStorage', err);
    }
    return [];
  });

  const [savedVideoIds, setSavedVideoIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_SAVED_VIDEOS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (err) {
      console.error('Failed to parse saved videos from localStorage', err);
    }
    return [];
  });

  const [favoriteVideoIds, setFavoriteVideoIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_FAVORITE_VIDEOS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (err) {
      console.error('Failed to parse favorite videos from localStorage', err);
    }
    return [];
  });

  // 4. User Profile State with Persistence
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (err) {
      console.error('Failed to parse profile from localStorage', err);
    }
    return INITIAL_USER_PROFILE;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_POSTS_KEY, JSON.stringify(posts));
    } catch (e) {
      console.error(e);
    }
  }, [posts]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_VIDEOS_KEY, JSON.stringify(videos));
    } catch (e) {
      console.error(e);
    }
  }, [videos]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_SAVED_POSTS_KEY, JSON.stringify(savedPostIds));
    } catch (e) {
      console.error(e);
    }
  }, [savedPostIds]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_SAVED_VIDEOS_KEY, JSON.stringify(savedVideoIds));
    } catch (e) {
      console.error(e);
    }
  }, [savedVideoIds]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_FAVORITE_VIDEOS_KEY, JSON.stringify(favoriteVideoIds));
    } catch (e) {
      console.error(e);
    }
  }, [favoriteVideoIds]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  }, [profile]);

  // Section Navigation Helper
  const navigateToSection = (section: MainViewSection) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Article Action Handlers
  const handleToggleSavePost = (postId: string) => {
    setSavedPostIds((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const handleClapPost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, clapsCount: p.clapsCount + 1 } : p))
    );
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost((prev) => (prev ? { ...prev, clapsCount: prev.clapsCount + 1 } : null));
    }
  };

  const handleAddCommentPost = (
    postId: string,
    newCommentData: Omit<BlogComment, 'id' | 'createdAt' | 'likes'>
  ) => {
    const newComment: BlogComment = {
      id: `hc-${Date.now()}`,
      authorName: newCommentData.authorName,
      content: newCommentData.content,
      createdAt: 'Just now',
      likes: 0,
    };

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [newComment, ...p.comments] } : p
      )
    );

    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost((prev) =>
        prev ? { ...prev, comments: [newComment, ...prev.comments] } : null
      );
    }
  };

  const handleCreatePost = (newPost: BlogPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setActiveSection('blog');
    if (newPost.status === 'published') {
      setSelectedPost(newPost);
      setActiveBlogTab('all');
    } else {
      setActiveBlogTab('drafts');
    }
  };

  const handleOpenEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setIsCreatePostModalOpen(true);
  };

  const handleUpdatePost = (updatedPost: BlogPost) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    );
    if (selectedPost && selectedPost.id === updatedPost.id) {
      setSelectedPost(updatedPost);
    }
    setEditingPost(null);
  };

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setSavedPostIds((prev) => prev.filter((id) => id !== postId));
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(null);
    }
  };

  const handleOpenPost = (post: BlogPost) => {
    setSelectedPost(post);
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, viewsCount: p.viewsCount + 1 } : p))
    );
  };

  // Video Action Handlers
  const handleToggleSaveVideo = (videoId: string) => {
    setSavedVideoIds((prev) =>
      prev.includes(videoId) ? prev.filter((id) => id !== videoId) : [...prev, videoId]
    );
  };

  const handleToggleFavoriteVideo = (videoId: string) => {
    setFavoriteVideoIds((prev) =>
      prev.includes(videoId) ? prev.filter((id) => id !== videoId) : [...prev, videoId]
    );
  };

  const handleLikeVideo = (videoId: string) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === videoId ? { ...v, likesCount: v.likesCount + 1 } : v))
    );
    if (selectedVideo && selectedVideo.id === videoId) {
      setSelectedVideo((prev) => (prev ? { ...prev, likesCount: prev.likesCount + 1 } : null));
    }
  };

  const handleAddCommentVideo = (
    videoId: string,
    newCommentData: Omit<BlogComment, 'id' | 'createdAt' | 'likes'>
  ) => {
    const newComment: BlogComment = {
      id: `vc-${Date.now()}`,
      authorName: newCommentData.authorName,
      content: newCommentData.content,
      createdAt: 'Just now',
      likes: 0,
    };

    setVideos((prev) =>
      prev.map((v) =>
        v.id === videoId ? { ...v, comments: [newComment, ...v.comments] } : v
      )
    );

    if (selectedVideo && selectedVideo.id === videoId) {
      setSelectedVideo((prev) =>
        prev ? { ...prev, comments: [newComment, ...prev.comments] } : null
      );
    }
  };

  const handleUploadVideo = (newVideo: HealthVideo) => {
    setVideos((prev) => [newVideo, ...prev]);
    setActiveSection('video');
    setSelectedVideo(newVideo);
    setEditingVideo(null);
  };

  const handleOpenEditVideo = (video: HealthVideo) => {
    setEditingVideo(video);
    setIsUploadVideoModalOpen(true);
  };

  const handleUpdateVideo = (updatedVideo: HealthVideo) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === updatedVideo.id ? updatedVideo : v))
    );
    if (selectedVideo && selectedVideo.id === updatedVideo.id) {
      setSelectedVideo(updatedVideo);
    }
    setEditingVideo(null);
  };

  const handleDeleteVideo = (videoId: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== videoId));
    setSavedVideoIds((prev) => prev.filter((id) => id !== videoId));
    if (selectedVideo && selectedVideo.id === videoId) {
      setSelectedVideo(null);
    }
  };

  const handleOpenVideo = (video: HealthVideo) => {
    setSelectedVideo(video);
    setVideos((prev) =>
      prev.map((v) => (v.id === video.id ? { ...v, viewsCount: v.viewsCount + 1 } : v))
    );
  };

  const totalSavedCount = savedPostIds.length + savedVideoIds.length;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-emerald-400 selection:text-neutral-950 flex flex-col font-sans">
      
      {/* 1. Global Navbar */}
      <Navbar
        activeSection={activeSection}
        onNavigateSection={navigateToSection}
        onOpenLeftMenu={() => setIsLeftMenuOpen(true)}
        onOpenCreatePost={() => setIsCreatePostModalOpen(true)}
        onOpenUploadVideo={() => {
          setEditingVideo(null);
          setIsUploadVideoModalOpen(true);
        }}
        onOpenContactSign={() => setIsContactSignModalOpen(true)}
        savedTotalCount={totalSavedCount}
      />

      {/* 2. Slide-out Left Navigation Drawer */}
      <LeftMenuDrawer
        isOpen={isLeftMenuOpen}
        onClose={() => setIsLeftMenuOpen(false)}
        activeSection={activeSection}
        onNavigateSection={navigateToSection}
        onOpenCreatePost={() => setIsCreatePostModalOpen(true)}
        onOpenUploadVideo={() => {
          setEditingVideo(null);
          setIsUploadVideoModalOpen(true);
        }}
        onOpenContactSign={() => setIsContactSignModalOpen(true)}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setActiveBlogTab('all');
        }}
        activeCategory={activeCategory}
        savedTotalCount={totalSavedCount}
        recentPosts={posts.filter((p) => p.status === 'published')}
        onOpenPost={handleOpenPost}
        profile={profile}
      />

      {/* 3. Main Views Router */}
      <main className="flex-1 pb-20 sm:pb-24">
        {/* Section 1: Home Overview */}
        {activeSection === 'home' && (
          <HomeSection
            posts={posts}
            videos={videos}
            savedPostIds={savedPostIds}
            savedVideoIds={savedVideoIds}
            onToggleSavePost={handleToggleSavePost}
            onToggleSaveVideo={handleToggleSaveVideo}
            onOpenPost={handleOpenPost}
            onOpenVideo={handleOpenVideo}
            onNavigateToSection={navigateToSection}
            onSelectCategory={(cat) => {
              setActiveCategory(cat);
              setActiveBlogTab('all');
            }}
            onOpenCreatePost={() => setIsCreatePostModalOpen(true)}
            onOpenUploadVideo={() => {
              setEditingVideo(null);
              setIsUploadVideoModalOpen(true);
            }}
            onOpenContactSign={() => setIsContactSignModalOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {/* Section 2: Video Display Section (Requested as 2nd section) */}
        {activeSection === 'video' && (
          <div className="pt-20">
            <VideoSection
              videos={videos}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              savedVideoIds={savedVideoIds}
              onToggleSaveVideo={handleToggleSaveVideo}
              onOpenVideo={handleOpenVideo}
              onOpenUploadModal={() => {
                setEditingVideo(null);
                setIsUploadVideoModalOpen(true);
              }}
              onEditVideo={handleOpenEditVideo}
              onDeleteVideo={handleDeleteVideo}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
        )}

        {/* Section 3: Blog Display Section (Requested as 3rd section) */}
        {activeSection === 'blog' && (
          <div className="pt-20">
            <BlogSection
              posts={posts}
              onOpenPost={handleOpenPost}
              onOpenCreateModal={() => {
                setEditingPost(null);
                setIsCreatePostModalOpen(true);
              }}
              onEditPost={handleOpenEditPost}
              onDeletePost={handleDeletePost}
              savedPostIds={savedPostIds}
              onToggleSave={handleToggleSavePost}
              onClap={handleClapPost}
            />
          </div>
        )}

        {/* Section 4: Favorite Section */}
        {activeSection === 'favorites' && (
          <div className="pt-20">
            <FavoritesSection
              posts={posts}
              videos={videos}
              savedPostIds={savedPostIds}
              savedVideoIds={savedVideoIds}
              onToggleSavePost={handleToggleSavePost}
              onToggleSaveVideo={handleToggleSaveVideo}
              onOpenPost={handleOpenPost}
              onOpenVideo={handleOpenVideo}
              onEditPost={handleOpenEditPost}
              onDeletePost={handleDeletePost}
              onEditVideo={handleOpenEditVideo}
              onDeleteVideo={handleDeleteVideo}
              onNavigateToSection={navigateToSection}
            />
          </div>
        )}

        {/* Section 5: Profile Section */}
        {activeSection === 'profile' && (
          <div className="pt-20">
            <ProfileSection
              profile={profile}
              onUpdateProfile={setProfile}
              posts={posts}
              videos={videos}
              savedArticlesCount={savedPostIds.length}
              savedVideosCount={savedVideoIds.length}
              onOpenCreatePost={() => setIsCreatePostModalOpen(true)}
              onOpenUploadVideo={() => {
                setEditingVideo(null);
                setIsUploadVideoModalOpen(true);
              }}
              onOpenPost={handleOpenPost}
              onOpenVideo={handleOpenVideo}
              onDeletePost={handleDeletePost}
              onDeleteVideo={handleDeleteVideo}
            />
          </div>
        )}
      </main>

      {/* 4. Global Footer */}
      <Footer
        onNavigateSection={navigateToSection}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setActiveBlogTab('all');
        }}
        onOpenCreatePost={() => setIsCreatePostModalOpen(true)}
        onOpenUploadVideo={() => {
          setEditingVideo(null);
          setIsUploadVideoModalOpen(true);
        }}
        onOpenContactSign={() => setIsContactSignModalOpen(true)}
      />

      {/* 5. YouTube-Style Sticky Bottom Bar */}
      <YouTubeBottomNav
        activeSection={activeSection}
        onNavigateSection={navigateToSection}
        onOpenUploadVideo={() => {
          setEditingVideo(null);
          setIsUploadVideoModalOpen(true);
        }}
        onOpenContactSign={() => setIsContactSignModalOpen(true)}
        savedTotalCount={totalSavedCount}
        profile={profile}
      />

      {/* 6. Blog Detail Reader Modal */}
      <BlogDetailModal
        post={selectedPost}
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        isSaved={selectedPost ? savedPostIds.includes(selectedPost.id) : false}
        onToggleSave={handleToggleSavePost}
        onClap={handleClapPost}
        onAddComment={handleAddCommentPost}
        onOpenOtherPost={handleOpenPost}
        onEditPost={handleOpenEditPost}
        onDeletePost={handleDeletePost}
        allPosts={posts.filter((p) => p.status === 'published')}
      />

      {/* 8. Video Detail Player Modal */}
      <VideoDetailModal
        video={selectedVideo}
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        isSaved={selectedVideo ? savedVideoIds.includes(selectedVideo.id) : false}
        isFavorite={selectedVideo ? favoriteVideoIds.includes(selectedVideo.id) : false}
        onToggleSave={handleToggleSaveVideo}
        onToggleFavorite={handleToggleFavoriteVideo}
        onLike={handleLikeVideo}
        onAddComment={handleAddCommentVideo}
        onOpenOtherVideo={handleOpenVideo}
        onDeleteVideo={handleDeleteVideo}
        allVideos={videos.filter((v) => v.status === 'published')}
      />

      {/* 9. Write Blog Story Modal */}
      <CreateBlogPostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => {
          setIsCreatePostModalOpen(false);
          setEditingPost(null);
        }}
        onCreatePost={handleCreatePost}
        onUpdatePost={handleUpdatePost}
        initialPost={editingPost}
      />

      {/* 10. Video Upload & Re-Edit Modal */}
      <UploadVideoModal
        isOpen={isUploadVideoModalOpen}
        onClose={() => {
          setIsUploadVideoModalOpen(false);
          setEditingVideo(null);
        }}
        onUploadVideo={handleUploadVideo}
        onUpdateVideo={handleUpdateVideo}
        initialVideo={editingVideo}
      />

      {/* 11. Contact Sign & Medical Inquiries Modal */}
      <ContactSignModal
        isOpen={isContactSignModalOpen}
        onClose={() => setIsContactSignModalOpen(false)}
      />
    </div>
  );
}
