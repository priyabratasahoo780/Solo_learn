import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Heart, MessageCircle, Share2, Award, Sparkles, Image as ImageIcon, Search, Trophy, Globe, Star, TrendingUp, ArrowRight, Briefcase, ShieldCheck, User, Zap } from 'lucide-react';
import api from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showComments, setShowComments] = useState({}); // { postId: boolean }
  const [commentText, setCommentText] = useState({}); // { postId: string }
  const [isCommenting, setIsCommenting] = useState({}); // { postId: boolean }

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const { data } = await api.get('/posts');
      setPosts(data.data);
    } catch (err) {
      toast.error('Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setIsSubmitting(true);
    try {
      const { data } = await api.post('/posts', { content: newPost });
      setPosts([data.data, ...posts]);
      setNewPost('');
      toast.success('Post shared!');
    } catch (err) {
      toast.error('Failed to share post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLikedByMe = (likes) => {
    if (!likes || !user?._id) return false;
    return likes.some(id => (id._id || id).toString() === user._id.toString());
  };

  const handleLike = async (postId) => {
    try {
      const { data } = await api.put(`/posts/${postId}/like`);
      setPosts(posts.map(post => 
        post._id === postId 
          ? { ...post, likes: data.isLiked 
              ? [...post.likes, { _id: user._id }] // Store as object for consistency
              : post.likes.filter(id => (id._id || id).toString() !== user._id.toString()) 
            }
          : post
      ));
    } catch (err) {
      toast.error('Failed to like post');
    }
  };

  const handleComment = async (postId) => {
    const text = commentText[postId];
    if (!text?.trim()) return;

    setIsCommenting({ ...isCommenting, [postId]: true });
    try {
      const { data } = await api.post(`/posts/${postId}/comment`, { text });
      setPosts(posts.map(post => 
        post._id === postId 
          ? { ...post, comments: [data.data, ...post.comments] }
          : post
      ));
      setCommentText({ ...commentText, [postId]: '' });
      toast.success('Comment added!');
    } catch (err) {
      toast.error('Failed to add comment');
    } finally {
      setIsCommenting({ ...isCommenting, [postId]: false });
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-vh-100 pt-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  const PostSkeleton = () => (
    <div className="bg-white dark:bg-[#0f172a]/80 p-6 rounded-[32px] border border-gray-100 dark:border-white/10 animate-pulse mb-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800" />
        <div className="flex-1">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
          <div className="h-3 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />
      </div>
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-8 min-h-screen">
       {/* Ambient Glow Background for Feed */}
       <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-full h-[600px] bg-indigo-600/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
       
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative">
        {/* Left Sidebar - Profile Experience */}
        <div className="hidden lg:block lg:col-span-3 sticky top-24 self-start space-y-8">
          <div className="glass-panel p-8 rounded-[40px] overflow-hidden relative group border border-white/5 shadow-2xl transition-all duration-700 hover:shadow-indigo-500/20 hover:-translate-y-1">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent opacity-30 group-hover:opacity-50 transition-all duration-700" />
            <div className="relative pt-12 flex flex-col items-center">
              <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-tr from-indigo-600 to-purple-700 p-1 shadow-2xl transform group-hover:rotate-6 group-hover:scale-105 transition-all duration-500">
                <div className="w-full h-full rounded-[1.8rem] bg-[#0a0b14] flex items-center justify-center text-white text-4xl font-black border border-white/10">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </div>
              <h3 className="mt-8 font-black text-2xl dark:text-white tracking-tight italic uppercase">{user?.name}</h3>
              <div className="flex items-center gap-2 mt-2">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" />
                 <span className="text-[10px] font-black text-indigo-400 opacity-80 uppercase tracking-widest">Master Engineer</span>
              </div>
              
              <div className="mt-10 w-full grid grid-cols-2 gap-6 border-t border-white/5 pt-10">
                <div className="text-center group/stat cursor-default">
                  <div className="text-3xl font-black dark:text-white group-hover/stat:text-indigo-400 transition-colors drop-shadow-md">{user?.points || 1250}</div>
                  <div className="text-[9px] text-gray-600 uppercase tracking-[0.3em] font-black mt-1">XP Power</div>
                </div>
                <div className="text-center group/stat cursor-default">
                  <div className="text-3xl font-black dark:text-white group-hover/stat:text-purple-400 transition-colors drop-shadow-md">{user?.streak || 14}</div>
                  <div className="text-[9px] text-gray-600 uppercase tracking-[0.3em] font-black mt-1">Consistency</div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-[40px] border border-white/5 group shadow-xl">
            <h4 className="font-black text-sm mb-6 dark:text-white flex items-center gap-3 italic uppercase tracking-[0.1em]">
              <TrendingUp className="w-5 h-5 text-indigo-500 animate-bounce" />
              Intelligence Center
            </h4>
            <div className="space-y-4">
              {[
                { tag: '#ReactHooks', count: '12k+' },
                { tag: '#JavaScript2024', count: '8k' },
                { tag: '#AI_Interview', count: '5k' }
              ].map(item => (
                <div key={item.tag} className="flex justify-between items-center group/tag cursor-pointer">
                  <span className="text-sm font-bold text-gray-500 group-hover/tag:text-indigo-400 transition-colors">{item.tag}</span>
                  <span className="text-[10px] font-black text-gray-700">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="col-span-1 lg:col-span-6 space-y-6 sm:space-y-8">
          {/* Mobile Profile Card - Optimized for Impressive View */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:hidden glass-panel p-6 rounded-[32px] border border-white/10 flex items-center gap-6 shadow-2xl shadow-indigo-500/10"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-xl">
              <div className="w-full h-full rounded-[1.4rem] bg-[#0a0b14] flex items-center justify-center text-white text-2xl font-black italic">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-xl text-white italic tracking-tight uppercase truncate">{user?.name}</h3>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className="text-[9px] font-black text-indigo-400 bg-indigo-400/10 px-4 py-1.5 rounded-xl border border-indigo-400/20 uppercase tracking-[0.2em]">
                   {user?.points || 1250} XP
                </span>
                <span className="text-[9px] font-black text-amber-500 bg-amber-500/10 px-4 py-1.5 rounded-xl border border-amber-500/20 uppercase tracking-[0.2em]">
                   {user?.streak || 14} Day Flash
                </span>
              </div>
            </div>
          </motion.div>

          {/* Share Box - Elite UI Expansion */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 sm:p-10 rounded-[40px] border border-white/5 shadow-3xl shadow-indigo-600/5 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full -z-10" />
            <form onSubmit={handleSubmit}>
              <div className="flex gap-6">
                <div className="hidden sm:flex w-16 h-16 rounded-[1.5rem] bg-gradient-to-tr from-pink-500/20 to-rose-500/20 shrink-0 items-center justify-center text-white font-black border border-white/5 shadow-inner">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder="Document your engineering breakthrough..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-3xl p-6 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all resize-none h-36 text-lg font-medium placeholder-gray-600 shadow-inner"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-between items-center pl-0 sm:pl-20">
                <div className="flex items-center gap-3 text-gray-400">
                  <button type="button" className="p-3 hover:bg-white/5 hover:text-indigo-400 rounded-2xl transition-all border border-transparent hover:border-white/5 group/btn">
                    <ImageIcon className="w-6 h-6 group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <button type="button" className="p-3 hover:bg-white/5 hover:text-yellow-400 rounded-2xl transition-all border border-transparent hover:border-white/5 group/btn">
                    <Award className="w-6 h-6 group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!newPost.trim() || isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 transition-all disabled:opacity-50 shadow-2xl shadow-indigo-600/30 text-xs"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Transmitting...' : 'Share Progress'}
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Posts List - Spring Cascading entry */}
          <div className="space-y-10">
            <AnimatePresence mode="popLayout">
              {loading ? (
                <>
                  <PostSkeleton />
                  <PostSkeleton />
                  <PostSkeleton />
                </>
              ) : posts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', damping: 20, stiffness: 100, delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="glass-panel p-8 rounded-[40px] border border-white/5 shadow-2xl relative group/post transition-all"
                >
                   {/* Hover Bloom Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/5 to-purple-600/5 opacity-0 group-hover/post:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[40px]" />
                  
                  <div className="flex justify-between items-start relative z-10">
                    <div className="flex gap-5">
                      <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-600/10 flex items-center justify-center border border-white/10 shadow-inner group-hover/post:rotate-3 transition-transform">
                        <span className="text-2xl font-black italic text-white">{post.user?.name ? post.user.name.charAt(0).toUpperCase() : '?'}</span>
                      </div>
                      <div>
                        <h4 className="font-black text-xl text-white italic tracking-tight uppercase flex items-center gap-3">
                          {post.user?.name || 'Anonymous Coder'}
                          {post.type === 'achievement' && (
                            <span className="flex items-center gap-1.5 text-[9px] px-3 py-1 bg-yellow-500/10 text-yellow-500 font-black border border-yellow-500/20 uppercase tracking-[0.2em] rounded-lg">
                              <Star className="w-3 h-3 fill-current" />
                              Evolution
                            </span>
                          )}
                        </h4>
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-1">
                          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 text-gray-400 text-lg font-medium leading-relaxed tracking-wide relative z-10">
                    {post.content}
                  </div>

                  {post.metadata?.quizTitle && (
                    <div className="mt-8 p-8 bg-white/5 rounded-[2.5rem] border border-white/10 group-hover/post:border-yellow-500/20 transition-colors relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-6 opacity-10"><Trophy className="w-12 h-12" /></div>
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-yellow-500/20 to-amber-600/20 flex items-center justify-center border border-yellow-500/20 shadow-lg shadow-yellow-500/10 animate-pulse">
                          <Trophy className="w-8 h-8 text-yellow-500" />
                        </div>
                        <div>
                          <p className="text-[10px] text-yellow-500 font-black uppercase tracking-[0.3em] mb-1">Elite Achievement Unlocked</p>
                          <h5 className="font-black text-white text-xl tracking-tight uppercase italic">{post.metadata.quizTitle}</h5>
                          <p className="text-sm font-bold text-gray-500 mt-1">Accuracy Magnitude: <span className="text-white">{post.metadata.score}%</span></p>
                        </div>
                      </div>
                    </div>
                  )}

                  {post.type === 'interview_scorecard' && (
                    <div className="mt-8 p-8 rounded-[3rem] bg-indigo-600/5 border border-indigo-500/20 relative overflow-hidden shadow-inner group/card hover:bg-indigo-600/10 transition-colors">
                       <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600/10 blur-[80px] rounded-full" />
                      <div className="flex justify-between items-start mb-8 relative z-10">
                         <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl">
                               <Briefcase className="w-7 h-7 text-indigo-400" />
                            </div>
                            <div>
                               <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.3em] mb-1">Corporate Validation</p>
                               <h5 className="text-2xl text-white font-black italic tracking-tighter uppercase">{post.metadata?.company} AI MOCK</h5>
                            </div>
                         </div>
                         <div className={`px-6 py-2 rounded-2xl text-sm font-black italic tracking-widest border-2 ${
                            post.metadata?.verdict === 'HIRE' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                         }`}>
                            {post.metadata?.verdict}
                         </div>
                      </div>

                      <div className="space-y-6 relative z-10">
                         {[
                           { name: 'Technical Depth', val: post.metadata?.technical || 0, color: 'from-blue-500 to-indigo-600' },
                           { name: 'Communcation Art', val: post.metadata?.communication || 0, color: 'from-purple-500 to-indigo-600' },
                           { name: 'Cultural Synergy', val: post.metadata?.cultureFit || 0, color: 'from-emerald-500 to-teal-600' }
                         ].map((skill, i) => (
                            <div key={i}>
                               <div className="flex justify-between text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-3">
                                  <span>{skill.name}</span>
                                  <span className="text-white">{skill.val}%</span>
                               </div>
                               <div className="h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${skill.val}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: 'circOut', delay: i * 0.2 }}
                                    className={`h-full bg-gradient-to-r ${skill.color} shadow-lg shadow-indigo-500/20`}
                                  />
                               </div>
                            </div>
                         ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-8 relative z-10">
                    <motion.button 
                      whileTap={{ scale: 0.8 }}
                      onClick={() => handleLike(post._id)}
                      className={`flex items-center gap-3 text-sm font-black transition-all group/like ${
                        isLikedByMe(post.likes) 
                          ? 'text-pink-500' 
                          : 'text-gray-600 hover:text-pink-500'
                      }`}
                    >
                      <div className={`p-2 rounded-xl border border-transparent group-hover/like:bg-pink-500/10 group-hover/like:border-pink-500/20 transition-all ${isLikedByMe(post.likes) ? 'bg-pink-500/10 border-pink-500/20' : ''}`}>
                         <Heart className={`w-5 h-5 ${isLikedByMe(post.likes) ? 'fill-current' : ''}`} />
                      </div>
                      <span className="tracking-widest">{post.likes.length} LIKES</span>
                    </motion.button>
                    
                    <button 
                      onClick={() => setShowComments({ ...showComments, [post._id]: !showComments[post._id] })}
                      className="flex items-center gap-3 text-sm font-black text-gray-600 hover:text-indigo-400 group/comm transition-all"
                    >
                      <div className="p-2 rounded-xl border border-transparent group-hover/comm:bg-indigo-500/10 group-hover/comm:border-indigo-500/20 transition-all">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <span className="tracking-widest">{post.comments.length} CHATS</span>
                    </button>
                    
                    <button className="flex items-center gap-3 text-sm font-black text-gray-600 hover:text-indigo-400 group/share transition-all">
                      <div className="p-2 rounded-xl border border-transparent group-hover/share:bg-indigo-500/10 group-hover/share:border-indigo-500/20 transition-all">
                         <Share2 className="w-5 h-5" />
                      </div>
                      <span className="tracking-widest uppercase opacity-0 group-hover/share:opacity-100 transition-opacity">Broad_cast</span>
                    </button>
                  </div>

                  {/* Comments Section - Redesigned */}
                  <AnimatePresence>
                    {showComments[post._id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-8 pt-8 border-t border-white/5 space-y-6">
                          {/* Comment Form */}
                          <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 shrink-0 flex items-center justify-center text-white text-xs font-black shadow-lg">
                              {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 relative">
                              <input
                                type="text"
                                placeholder="Engineers log..."
                                value={commentText[post._id] || ''}
                                onChange={(e) => setCommentText({ ...commentText, [post._id]: e.target.value })}
                                onKeyDown={(e) => e.key === 'Enter' && handleComment(post._id)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 pr-14 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 shadow-inner"
                              />
                              <button 
                                onClick={() => handleComment(post._id)}
                                disabled={isCommenting[post._id] || !commentText[post._id]?.trim()}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-indigo-400 disabled:opacity-30 hover:scale-110 transition-all"
                              >
                                <Send className="w-5 h-5" />
                              </button>
                            </div>
                          </div>

                          {/* Comments List */}
                          <div className="space-y-4 max-h-80 overflow-y-auto pr-4 scrollbar-hide">
                            {post.comments.map((comment, i) => (
                              <div key={i} className="flex gap-4 group/comment">
                                <div className="w-10 h-10 rounded-xl bg-white/5 shrink-0 flex items-center justify-center border border-white/10 group-hover/comment:border-indigo-500/20 transition-colors shadow-xl">
                                  <span className="text-xs font-black text-gray-400">{comment.user?.name?.charAt(0).toUpperCase()}</span>
                                </div>
                                <div className="flex-1 bg-white/5 p-4 rounded-3xl rounded-tl-none border border-white/5 group-hover/comment:bg-white/10 transition-all duration-300">
                                  <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-xs font-black text-indigo-400 uppercase tracking-widest italic">{comment.user?.name}</span>
                                    <span className="text-[10px] text-gray-700 font-bold uppercase">
                                      {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : 'just now'}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-400 font-medium">{comment.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {posts.length === 0 && (
              <div className="text-center py-20 glass-panel rounded-[2rem] border-2 border-dashed border-white/5 bg-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 group-hover:opacity-100 opacity-0 transition-opacity duration-700" />
                <div className="relative z-10">
                  <Globe className="w-16 h-16 text-indigo-500/20 mx-auto mb-6 animate-pulse" />
                  <h3 className="text-xl font-black text-white italic mb-2 tracking-tight">The Feed is Silent...</h3>
                  <p className="text-gray-500 max-w-sm mx-auto text-sm font-bold uppercase tracking-widest leading-relaxed">
                    Be the first to break the silence. Share an achievement or post a status update to get the community talking.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Intel Snapshots (NEW for Elite UI) */}
        <div className="hidden xl:block lg:col-span-3 sticky top-24 self-start space-y-8">
           <div className="glass-panel p-8 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-600 to-transparent animate-shimmer" />
              <h4 className="font-black text-sm mb-8 text-white flex items-center gap-3 italic uppercase tracking-wider">
                 <ShieldCheck className="w-6 h-6 text-emerald-500" />
                 Global Intel
              </h4>
              <div className="space-y-6">
                 {[
                   { label: 'Active Engineers', val: '1,280', icon: User },
                   { label: 'System Uptime', val: '99.9%', icon: Zap },
                   { label: 'Global Ranking', val: '#12', icon: Trophy }
                 ].map((stat) => (
                    <div key={stat.label} className="flex items-center gap-4 group/st transition-all hover:translate-x-1">
                       <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover/st:text-indigo-400">
                          <stat.icon className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{stat.label}</p>
                          <p className="text-lg font-black text-white italic">{stat.val}</p>
                       </div>
                    </div>
                 ))}
              </div>
              <button className="w-full mt-10 py-4 bg-white/5 hover:bg-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl border border-white/10 transition-all duration-300">
                 View Community Stats
              </button>
           </div>

           <div className="p-8 rounded-[40px] bg-gradient-to-br from-indigo-600 to-purple-800 relative shadow-2xl overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 blur-3xl rounded-full" />
              <h4 className="font-black text-white italic uppercase tracking-wider text-xl mb-4">SoloLearn Pro</h4>
              <p className="text-indigo-200 text-sm font-bold uppercase tracking-widest leading-loose opacity-80 mb-6">Unleash the full potential of AI engineering.</p>
              <button className="px-6 py-3 bg-white text-[#0a0b14] rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl transform active:scale-95 transition-all">Upgrade Now</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
