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
    <div className="sketch-card p-12 bg-white animate-pulse border-dashed h-64 mb-8" />
  );

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 pb-24 relative">
       {/* Institutional Ambient Grid */}
       <div className="fixed inset-0 sketch-grid opacity-[0.03] -z-10 pointer-events-none" />
       
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
        {/* Left Sidebar - Identity Clearance */}
        <div className="hidden lg:block lg:col-span-3 sticky top-24 self-start space-y-8">
          <div className="sketch-card p-10 bg-white shadow-[8px_8px_0px_0px_#cbd5e1] relative group overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-slate-50 border-b-[2px] border-dashed border-slate-200" />
            <div className="relative flex flex-col items-center">
              <div className="icon-circle-sketch h-24 w-24 bg-white border-oxford-blue shadow-[4px_4px_0px_0px_#FF5722] mb-8">
                <span className="text-3xl font-black italic text-oxford-blue">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 className="font-black text-2xl text-oxford-blue italic tracking-tighter uppercase leading-none">{user?.name}</h3>
              <div className="flex items-center gap-2 mt-3">
                 <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_#FF5722]" />
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Student Engineer</span>
              </div>
              
              <div className="mt-10 w-full grid grid-cols-2 gap-6 border-t-[2px] border-dashed border-slate-100 pt-10">
                <div className="text-center">
                  <div className="text-3xl font-black text-oxford-blue italic leading-none">{user?.points || 1250}</div>
                  <div className="text-[9px] text-orange-500 uppercase tracking-[0.2em] font-black mt-2">XP Rank</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-oxford-blue italic leading-none">{user?.streak || 14}</div>
                  <div className="text-[9px] text-orange-500 uppercase tracking-[0.2em] font-black mt-2">Day Streak</div>
                </div>
              </div>
            </div>
          </div>

          <div className="sketch-card p-8 bg-oxford-blue text-white shadow-[8px_8px_0px_0px_#FF5722]">
            <h4 className="font-black text-sm mb-6 flex items-center gap-3 italic uppercase tracking-[0.1em]">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              Intelligence Hub
            </h4>
            <div className="space-y-4">
              {[
                { tag: '#MNC_Hacks', count: '12k+' },
                { tag: '#SystemDesign', count: '8k' },
                { tag: '#AITutor_Intel', count: '5k' }
              ].map(item => (
                <div key={item.tag} className="flex justify-between items-center group cursor-pointer hover:translate-x-1 transition-transform">
                  <span className="text-xs font-bold text-white/60 group-hover:text-orange-500 transition-colors">{item.tag}</span>
                  <span className="text-[9px] font-black text-white/40">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Intelligence Stream */}
        <div className="col-span-1 lg:col-span-6 space-y-12">
          {/* Share Box - Strategic Communication */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="sketch-card p-10 bg-white shadow-[10px_10px_0px_0px_#cbd5e1] relative group"
          >
            <div className="absolute top-8 right-10 flex items-center gap-3">
              <div className="icon-circle-sketch h-10 w-10 bg-slate-50 border-slate-200">
                <Sparkles className="w-5 h-5 text-oxford-blue" />
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="flex gap-6">
                <div className="hidden sm:flex icon-circle-sketch h-16 w-16 bg-white border-oxford-blue shadow-[4px_4px_0px_0px_#cbd5e1] shrink-0">
                  <span className="text-xl font-black italic text-oxford-blue">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder="Document an academic breakthrough or technical milestone..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="w-full bg-slate-50 border-[3px] border-oxford-blue rounded-3xl p-6 text-oxford-blue font-bold focus:outline-none focus:ring-8 focus:ring-oxford-blue/5 transition-all resize-none h-40 text-lg placeholder:text-slate-200 shadow-inner"
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-between items-center pl-0 sm:pl-20">
                <div className="flex items-center gap-4">
                  <button type="button" className="icon-circle-sketch h-11 w-11 bg-white border-slate-200 text-slate-400 hover:border-oxford-blue hover:text-oxford-blue transition-all">
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <button type="button" className="icon-circle-sketch h-11 w-11 bg-white border-slate-200 text-slate-400 hover:border-orange-500 hover:text-orange-500 transition-all">
                    <Award className="w-5 h-5" />
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!newPost.trim() || isSubmitting}
                  className="btn-sketch px-10 py-4 text-xs font-black uppercase tracking-[0.2em]"
                >
                  {isSubmitting ? 'TRANSMITTING...' : 'BROADCAST INTEL'}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Posts List - Cascading Modules */}
          <div className="space-y-12">
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
                  className="sketch-card p-10 bg-white shadow-[10px_10px_0px_0px_#cbd5e1] hover:shadow-[12px_12px_0px_0px_#FF5722] transition-all group"
                >
                  <div className="flex justify-between items-start mb-10">
                    <div className="flex gap-5">
                      <div className="icon-circle-sketch h-14 w-14 bg-slate-50 border-oxford-blue shadow-[3px_3px_0px_0px_#cbd5e1] group-hover:rotate-6 transition-transform">
                        <span className="text-xl font-black italic text-oxford-blue">{post.user?.name?.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <h4 className="font-black text-xl text-oxford-blue italic tracking-tighter uppercase flex items-center gap-3 leading-none">
                          {post.user?.name}
                          {post.type === 'achievement' && (
                            <div className="badge-sketch bg-orange-500 text-white shadow-[3px_3px_0px_0px_#002D72]">
                               ELITE EVOLUTION
                            </div>
                          )}
                        </h4>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-2">
                          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-oxford-blue text-lg font-bold leading-relaxed italic border-l-[3px] border-orange-500 pl-6 mb-10">
                    "{post.content}"
                  </div>

                  {post.metadata?.quizTitle && (
                    <div className="sketch-card bg-orange-50 border-orange-500 p-8 mb-10 shadow-[6px_6px_0px_0px_#002D72] relative overflow-hidden group/meta">
                       <div className="absolute inset-0 sketch-grid opacity-10 pointer-events-none" />
                       <div className="flex items-center gap-6 relative z-10">
                        <div className="icon-circle-sketch h-14 w-14 bg-white border-orange-500 text-orange-500 shadow-[3px_3px_0px_0px_#002D72]">
                          <Trophy className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="text-[9px] text-orange-600 font-black uppercase tracking-[0.3em] mb-1">Academy Validation</p>
                          <h5 className="font-black text-oxford-blue text-xl tracking-tighter uppercase italic">{post.metadata.quizTitle}</h5>
                          <p className="text-xs font-bold text-slate-500 mt-2">Magnitude: <span className="text-orange-600 font-black tracking-widest">{post.metadata.score}% ACCURACY</span></p>
                        </div>
                      </div>
                    </div>
                  )}

                  {post.type === 'interview_scorecard' && (
                    <div className="sketch-card p-10 bg-slate-50 border-oxford-blue shadow-[8px_8px_0px_0px_#cbd5e1] mb-10">
                       <div className="flex justify-between items-start mb-8">
                          <div className="flex items-center gap-5">
                             <div className="icon-circle-sketch h-14 w-14 bg-white border-oxford-blue shadow-[3px_3px_0px_0px_#FF5722]">
                                <Briefcase className="w-7 h-7 text-oxford-blue" />
                             </div>
                             <div>
                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em] mb-1">Corporate Record</p>
                                <h5 className="text-2xl text-oxford-blue font-black italic tracking-tighter uppercase">{post.metadata?.company} MOCK INSIGHT</h5>
                             </div>
                          </div>
                          <div className={`badge-sketch px-6 py-2 shadow-[3px_3px_0px_0px_#002D72] ${
                             post.metadata?.verdict === 'HIRE' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                          }`}>
                             {post.metadata?.verdict}
                          </div>
                       </div>

                       <div className="space-y-5">
                          {[
                            { name: 'Technical Depth', val: post.metadata?.technical || 0 },
                            { name: 'Communcation Art', val: post.metadata?.communication || 0 },
                            { name: 'Cultural Synergy', val: post.metadata?.cultureFit || 0 }
                          ].map((skill, i) => (
                             <div key={i}>
                                <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                                   <span>{skill.name}</span>
                                   <span className="text-oxford-blue font-black">{skill.val}%</span>
                                </div>
                                <div className="h-2.5 bg-white border-[2px] border-oxford-blue rounded-full overflow-hidden">
                                   <motion.div 
                                     initial={{ width: 0 }}
                                     whileInView={{ width: `${skill.val}%` }}
                                     viewport={{ once: true }}
                                     transition={{ duration: 1.5, ease: 'circOut', delay: i * 0.2 }}
                                     className="h-full bg-orange-500"
                                   />
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                  )}

                  <div className="pt-8 border-t-[2px] border-dashed border-slate-100 flex items-center gap-10">
                    <button 
                      onClick={() => handleLike(post._id)}
                      className={`flex items-center gap-3 text-[10px] font-black transition-all group/like ${
                        isLikedByMe(post.likes) ? 'text-orange-600' : 'text-slate-400 hover:text-oxford-blue'
                      }`}
                    >
                      <Heart className={`w-5 h-5 transition-transform group-hover/like:scale-125 ${isLikedByMe(post.likes) ? 'fill-current' : ''}`} />
                      <span className="tracking-[0.2em]">{post.likes.length} ENDORSEMENTS</span>
                    </button>
                    
                    <button 
                      onClick={() => setShowComments({ ...showComments, [post._id]: !showComments[post._id] })}
                      className="flex items-center gap-3 text-[10px] font-black text-slate-400 hover:text-oxford-blue transition-all"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="tracking-[0.2em]">{post.comments.length} DIALOGUES</span>
                    </button>
                    
                    <button className="flex items-center gap-3 text-[10px] font-black text-slate-400 hover:text-oxford-blue transition-all">
                      <Share2 className="w-5 h-5" />
                      <span className="tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity">Broad_cast</span>
                    </button>
                  </div>

                  {/* Comments Section */}
                  <AnimatePresence>
                    {showComments[post._id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-10 pt-10 border-t-[2px] border-dashed border-slate-100 space-y-8">
                          <div className="flex gap-4">
                            <div className="icon-circle-sketch h-10 w-10 bg-slate-50 border-slate-200 shrink-0">
                               <span className="text-xs font-black italic text-oxford-blue">{user?.name?.charAt(0).toUpperCase()}</span>
                            </div>
                            <div className="flex-1 relative">
                              <input
                                type="text"
                                placeholder="Add to the technical record..."
                                value={commentText[post._id] || ''}
                                onChange={(e) => setCommentText({ ...commentText, [post._id]: e.target.value })}
                                onKeyDown={(e) => e.key === 'Enter' && handleComment(post._id)}
                                className="w-full bg-slate-50 border-[2px] border-oxford-blue rounded-2xl py-3 px-6 pr-14 text-sm text-oxford-blue font-bold focus:outline-none focus:ring-4 focus:ring-oxford-blue/10 shadow-inner"
                              />
                              <button 
                                onClick={() => handleComment(post._id)}
                                disabled={isCommenting[post._id] || !commentText[post._id]?.trim()}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 disabled:opacity-30 hover:scale-110 transition-all"
                              >
                                <Send className="w-5 h-5" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 scrollbar-hide">
                            {post.comments.map((comment, i) => (
                              <div key={i} className="flex gap-4 animate-slide-in">
                                <div className="icon-circle-sketch h-10 w-10 bg-white border-slate-100 shrink-0 shadow-[2px_2px_0px_0px_#cbd5e1]">
                                   <span className="text-[10px] font-black italic text-oxford-blue">{comment.user?.name?.charAt(0).toUpperCase()}</span>
                                </div>
                                <div className="flex-1 bg-slate-50 p-6 rounded-2xl border-[2px] border-slate-100">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-black text-oxford-blue uppercase tracking-widest">{comment.user?.name}</span>
                                    <span className="text-[8px] text-slate-300 font-extrabold uppercase">
                                      {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : 'just now'}
                                    </span>
                                  </div>
                                  <p className="text-sm text-slate-600 font-bold leading-relaxed">{comment.text}</p>
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
            
            {!loading && posts.length === 0 && (
              <div className="sketch-card p-24 text-center bg-white border-dashed shadow-[12px_12px_0px_0px_#cbd5e1]">
                <Globe className="w-16 h-16 text-slate-200 mx-auto mb-8 animate-pulse" />
                <h3 className="text-3xl font-black text-oxford-blue italic tracking-tighter uppercase leading-none mb-3">Silent Transmission</h3>
                <p className="text-slate-400 font-bold text-sm uppercase tracking-widest max-w-sm mx-auto">
                  The academic feed is currently clear. Initialize a broadcast to reach the engineering collective.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Institutional Intelligence */}
        <div className="hidden xl:block lg:col-span-3 sticky top-24 self-start space-y-8">
           <div className="sketch-card p-10 bg-white shadow-[8px_8px_0px_0px_#cbd5e1] border-oxford-blue relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03]"><ShieldCheck className="w-24 h-24" /></div>
              <h4 className="font-black text-sm mb-10 text-oxford-blue flex items-center gap-3 italic uppercase tracking-[0.1em]">
                 <ShieldCheck className="w-6 h-6 text-emerald-500" />
                 Platform Health
              </h4>
              <div className="space-y-8">
                 {[
                   { label: 'Active Academics', val: '1,280', icon: User },
                   { label: 'Signal Integrity', val: '99.9%', icon: Zap },
                   { label: 'Academy Standing', val: '#12', icon: Trophy }
                 ].map((stat) => (
                    <div key={stat.label} className="flex items-center gap-5 group/st">
                       <div className="icon-circle-sketch h-11 w-11 bg-slate-50 border-slate-100 group-hover/st:border-oxford-blue transition-all">
                          <stat.icon className="w-5 h-5 text-oxford-blue" />
                       </div>
                       <div>
                          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                          <p className="text-xl font-black text-oxford-blue italic tracking-tighter leading-none">{stat.val}</p>
                       </div>
                    </div>
                 ))}
              </div>
              <button className="w-full mt-10 py-4 bg-oxford-blue text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-[4px_4px_0px_0px_#FF5722] hover:scale-105 transition-all">
                 SYNERGY ANALYTICS
              </button>
           </div>

           <div className="sketch-card p-10 bg-orange-500 text-white shadow-[8px_8px_0px_0px_#002D72] relative overflow-hidden group border-oxford-blue">
              <div className="absolute top-0 left-0 w-full h-[500px] sketch-grid opacity-10" />
              <h4 className="font-black text-white italic uppercase tracking-tighter text-3xl leading-none mb-5 relative z-10">Academy Pro</h4>
              <p className="text-white text-sm font-bold uppercase tracking-widest leading-relaxed opacity-80 mb-8 relative z-10">Ascend to Elite status. Unlock dedicated AI mentors and high-stakes architecture modules.</p>
              <button className="px-8 py-4 bg-white text-oxford-blue rounded-xl font-black text-[10px] uppercase tracking-widest shadow-[4px_4px_0px_0px_#002D72] hover:-translate-y-1 transition-all relative z-10">ASCEND NOW</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
